const asyncHandler = require('../../utils/async-handler');
const service = require('./quiz.service');

const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await service.createQuiz(req.validated.body, req.user);
  res.status(201).json({ success: true, data: quiz });
});

const listQuizzes = asyncHandler(async (req, res) => {
  const result = await service.listQuizzes(req.query, req.user);
  res.json({ success: true, data: result });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await service.updateQuiz(req.params.id, req.validated.body, req.user);
  res.json({ success: true, data: quiz });
});

const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await service.publishQuiz(req.params.id, req.user);
  res.json({ success: true, data: quiz });
});

const removeQuiz = asyncHandler(async (req, res) => {
  await service.removeQuiz(req.params.id, req.user);
  res.status(204).send();
});

const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await service.submitAttempt(req.params.id, req.validated.body, req.user);
  res.status(201).json({ success: true, data: attempt });
});

const getQuiz = asyncHandler(async (req, res) => {
  const data = await service.getQuiz(req.params.id, req.user);
  res.json({ success: true, data });
});

const getQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await service.getQuizAttempts(req.params.id, req.user);
  res.json({ success: true, data: attempts });
});

module.exports = { createQuiz, listQuizzes, updateQuiz, publishQuiz, removeQuiz, submitAttempt, getQuiz, getQuizAttempts };
