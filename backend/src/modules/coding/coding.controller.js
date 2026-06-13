const asyncHandler = require('../../utils/async-handler');
const service = require('./coding.service');

const createProblem = asyncHandler(async (req, res) => {
  const problem = await service.createProblem(req.validated.body, req.user);
  res.status(201).json({ success: true, data: problem });
});

const listProblems = asyncHandler(async (req, res) => {
  const result = await service.listProblems(req.query);
  res.json({ success: true, data: result });
});

const submit = asyncHandler(async (req, res) => {
  const submission = await service.submit(req.params.id, req.validated.body, req.user);
  res.status(202).json({ success: true, data: submission });
});

module.exports = { createProblem, listProblems, submit };
