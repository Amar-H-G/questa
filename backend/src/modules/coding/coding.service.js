const slugify = require('slugify');
const ApiError = require('../../utils/api-error');
const getPagination = require('../../utils/pagination');
const executionService = require('./execution.service');
const repository = require('./coding.repository');

const createProblem = (payload, user) =>
  repository.createProblem({
    ...payload,
    author: user.id,
    slug: `${slugify(payload.title, { lower: true, strict: true })}-${Date.now().toString(36)}`,
  });

const listProblems = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = query.difficulty ? { difficulty: query.difficulty, status: 'published' } : { status: 'published' };
  const [items, total] = await Promise.all([
    repository.listProblems({ filter, skip, limit }),
    repository.countProblems(filter),
  ]);
  return { items, meta: { page, limit, total } };
};

const submit = async (problemId, payload, user) => {
  const problem = await repository.findProblemById(problemId);
  if (!problem || problem.status !== 'published') throw new ApiError(404, 'Coding problem not found');
  if (!problem.supportedLanguages.includes(payload.language)) {
    throw new ApiError(422, 'Language is not supported for this problem');
  }

  const submission = await repository.createSubmission({
    problem: problem.id,
    user: user.id,
    language: payload.language,
    sourceCode: payload.sourceCode,
    status: 'queued',
    judgeProvider: 'judge0',
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

  // If user is candidate (student/recruiter), hide hidden test cases
  if (user.role === 'student' || user.role === 'recruiter') {
    problemObj.testCases = problemObj.testCases.filter((tc) => !tc.isHidden);
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

module.exports = { createProblem, listProblems, submit, getProblem, getSubmission };
