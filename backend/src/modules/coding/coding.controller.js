const asyncHandler = require('../../utils/async-handler');
const service = require('./coding.service');

const createProblem = asyncHandler(async (req, res) => {
  const problem = await service.createProblem(req.validated.body, req.user);
  res.status(201).json({ success: true, data: problem });
});

const listProblems = asyncHandler(async (req, res) => {
  const result = await service.listProblems(req.validated.query, req.user);
  res.json({ success: true, data: result });
});

const submit = asyncHandler(async (req, res) => {
  const submission = await service.submit(req.params.id, req.validated.body, req.user);
  res.status(202).json({ success: true, data: submission });
});

const getProblem = asyncHandler(async (req, res) => {
  const problem = await service.getProblem(req.params.id, req.user);
  res.json({ success: true, data: problem });
});

const getSubmission = asyncHandler(async (req, res) => {
  const submission = await service.getSubmission(req.params.id, req.user);
  res.json({ success: true, data: submission });
});

const runPlayground = asyncHandler(async (req, res) => {
  const result = await service.runPlayground(req.validated.body);
  res.json({ success: true, data: result });
});

module.exports = { createProblem, listProblems, submit, getProblem, getSubmission, runPlayground };
