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

  const execution = await executionService.queueSubmission(submission);
  return { submission, execution };
};

module.exports = { createProblem, listProblems, submit };
