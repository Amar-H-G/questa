const slugify = require('slugify');
const ApiError = require('../../utils/api-error');
const getPagination = require('../../utils/pagination');
const executionService = require('./execution.service');
const repository = require('./coding.repository');
const CodingSubmission = require('../../models/coding-submission.model');
const CodingAttempt = require('../../models/coding-attempt.model');
const CodingProblem = require('../../models/coding-problem.model');

const createProblem = (payload, user) =>
  repository.createProblem({
    ...payload,
    author: user.id,
    slug: `${slugify(payload.title, { lower: true, strict: true })}-${Date.now().toString(36)}`,
  });

const updateProblem = async (id, payload, user) => {
  const problem = await repository.findProblemById(id);
  if (!problem) throw new ApiError(404, 'Coding problem not found');
  
  // Update fields
  Object.assign(problem, payload);
  await problem.save();
  return problem;
};

const deleteProblem = async (id, user) => {
  const problem = await repository.findProblemById(id);
  if (!problem) throw new ApiError(404, 'Coding problem not found');
  await CodingProblem.findByIdAndDelete(id);
  // Also clean up related submissions/attempts to maintain database integrity
  await CodingSubmission.deleteMany({ problem: id });
  await CodingAttempt.deleteMany({ problem: id });
  return { success: true };
};

const publishProblem = async (id, user) => {
  const problem = await repository.findProblemById(id);
  if (!problem) throw new ApiError(404, 'Coding problem not found');
  problem.status = 'published';
  await problem.save();
  return problem;
};

const unpublishProblem = async (id, user) => {
  const problem = await repository.findProblemById(id);
  if (!problem) throw new ApiError(404, 'Coding problem not found');
  problem.status = 'draft';
  await problem.save();
  return problem;
};

const getProblemAttempt = async (problemId, user) => {
  const attempt = await CodingAttempt.findOne({ student: user.id, problem: problemId }).populate('submission');
  return attempt;
};

const listProblems = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  
  // Teachers/admins can view drafts; students/recruiters only see published
  let filter = {};
  if (user && (user.role === 'teacher' || user.role === 'admin')) {
    if (query.role === 'student') {
      filter.status = 'published';
    }
  } else {
    filter.status = 'published';
  }

  if (query.difficulty) {
    filter.difficulty = query.difficulty;
  }

  const [items, total] = await Promise.all([
    repository.listProblems({ filter, skip, limit }),
    repository.countProblems(filter),
  ]);

  let itemsWithStatus = items;
  if (user) {
    const problemIds = items.map(item => item._id);

    if (user.role === 'teacher' || user.role === 'admin') {
      // Calculate statistics for every problem for teacher view
      const allAttempts = await CodingAttempt.find({ problem: { $in: problemIds } }).lean();
      itemsWithStatus = items.map(item => {
        const itemObj = item.toJSON();
        const problemAttempts = allAttempts.filter(a => a.problem.toString() === item.id);
        const totalAttempts = problemAttempts.length;
        const totalSolved = problemAttempts.filter(a => a.status === 'accepted').length;
        const totalFailed = totalAttempts - totalSolved;
        const passRate = totalAttempts ? Math.round((totalSolved / totalAttempts) * 100) : 0;
        const avgScore = totalAttempts ? Math.round(problemAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts) : 0;

        itemObj.analytics = {
          totalAttempts,
          totalSolved,
          totalFailed,
          passRate,
          averageScore: avgScore,
        };
        return itemObj;
      });
    } else {
      // Candidates status mapping (solved, attempted, unattempted)
      const [successfulSubmissions, attemptedSubmissions] = await Promise.all([
        CodingSubmission.find({
          user: user.id,
          problem: { $in: problemIds },
          status: 'accepted'
        }).select('problem').lean(),
        CodingSubmission.find({
          user: user.id,
          problem: { $in: problemIds }
        }).select('problem').lean()
      ]);

      const solvedProblemIds = new Set(successfulSubmissions.map(s => s.problem.toString()));
      const attemptedProblemIds = new Set(attemptedSubmissions.map(s => s.problem.toString()));

      itemsWithStatus = items.map(item => {
        const itemObj = item.toJSON();
        if (solvedProblemIds.has(item.id)) {
          itemObj.userStatus = 'solved';
        } else if (attemptedProblemIds.has(item.id)) {
          itemObj.userStatus = 'attempted';
        } else {
          itemObj.userStatus = 'unattempted';
        }
        return itemObj;
      });
    }
  }

  return { items: itemsWithStatus, meta: { page, limit, total } };
};

const submit = async (problemId, payload, user) => {
  const problem = await repository.findProblemById(problemId);
  if (!problem || problem.status !== 'published') throw new ApiError(404, 'Coding problem not found');
  if (!problem.supportedLanguages.includes(payload.language)) {
    throw new ApiError(422, 'Language is not supported for this problem');
  }

  // Authoritative attempt validation
  const existingAttempt = await CodingAttempt.findOne({ student: user.id, problem: problemId });
  if (existingAttempt) {
    throw new ApiError(403, 'You have already submitted this coding challenge');
  }

  const submission = await repository.createSubmission({
    problem: problem.id,
    user: user.id,
    language: payload.language,
    sourceCode: payload.sourceCode,
    status: 'queued',
    judgeProvider: 'judge0',
  });

  // Create CodingAttempt immediately to lock this problem for the student
  await CodingAttempt.create({
    problem: problem.id,
    student: user.id,
    submission: submission.id,
    score: 0,
    status: 'queued',
  });

  const appEmitter = require('../../utils/events');
  appEmitter.emit('submission.created', { submission, user, problem });

  const execution = await executionService.queueSubmission(submission, problem);
  return { submission, execution };
};

const getProblem = async (id, user) => {
  const problem = await repository.findProblemById(id);
  if (!problem) throw new ApiError(404, 'Coding problem not found');

  if (problem.status !== 'published' && user.role !== 'admin' && user.role !== 'teacher') {
    throw new ApiError(403, 'You do not have access to this problem');
  }

  const problemObj = problem.toJSON();

  // If user is candidate (student/recruiter), hide hidden test cases entirely
  if (user.role === 'student' || user.role === 'recruiter') {
    problemObj.testCases = problemObj.testCases.filter((tc) => !tc.isHidden);
  } else if (user.role === 'teacher' || user.role === 'admin') {
    // Populate Teacher Analytics
    const attempts = await CodingAttempt.find({ problem: id });
    const totalAttempts = attempts.length;
    const totalSolved = attempts.filter(a => a.status === 'accepted').length;
    const totalFailed = totalAttempts - totalSolved;
    const passRate = totalAttempts ? Math.round((totalSolved / totalAttempts) * 100) : 0;
    const avgScore = totalAttempts ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts) : 0;

    problemObj.analytics = {
      totalAttempts,
      totalSolved,
      totalFailed,
      passRate,
      averageScore: avgScore,
    };
  }

  return problemObj;
};

const getSubmission = async (id, user) => {
  const submission = await repository.findSubmissionById(id);
  if (!submission) throw new ApiError(404, 'Submission not found');

  if (submission.user.toString() !== user.id && user.role !== 'admin' && user.role !== 'teacher') {
    throw new ApiError(403, 'You do not have permission to view this submission');
  }

  return submission;
};

const runPlayground = async (payload) => {
  return executionService.runPlayground(payload);
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  publishProblem,
  unpublishProblem,
  getProblemAttempt,
  listProblems,
  submit,
  getProblem,
  getSubmission,
  runPlayground,
};
