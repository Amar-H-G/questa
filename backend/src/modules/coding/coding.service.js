const slugify = require('slugify');
const CodingProblem = require('../../models/coding-problem.model');
const CodingSubmission = require('../../models/coding-submission.model');
const ApiError = require('../../utils/api-error');
const getPagination = require('../../utils/pagination');

const createProblem = (payload, user) =>
  CodingProblem.create({
    ...payload,
    author: user.id,
    slug: `${slugify(payload.title, { lower: true, strict: true })}-${Date.now().toString(36)}`,
  });

const listProblems = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = query.difficulty ? { difficulty: query.difficulty, status: 'published' } : { status: 'published' };
  const [items, total] = await Promise.all([
    CodingProblem.find(filter).select('-testCases.expectedOutput').skip(skip).limit(limit).sort('-createdAt'),
    CodingProblem.countDocuments(filter),
  ]);
  return { items, meta: { page, limit, total } };
};

const submit = async (problemId, payload, user) => {
  const problem = await CodingProblem.findById(problemId);
  if (!problem || problem.status !== 'published') throw new ApiError(404, 'Coding problem not found');
  if (!problem.supportedLanguages.includes(payload.language)) {
    throw new ApiError(422, 'Language is not supported for this problem');
  }

  return CodingSubmission.create({
    problem: problem.id,
    user: user.id,
    language: payload.language,
    sourceCode: payload.sourceCode,
    status: 'queued',
    judgeProvider: 'judge0',
  });
};

module.exports = { createProblem, listProblems, submit };
