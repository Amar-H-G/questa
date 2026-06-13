const asyncHandler = require('../../utils/async-handler');
const service = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await service.register(req.validated.body, req);
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await service.login(req.validated.body, req);
  res.json({ success: true, data: result });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await service.refresh(req.validated.body.refreshToken, req);
  res.json({ success: true, data: result });
});

const logout = asyncHandler(async (req, res) => {
  await service.logout(req.body.refreshToken);
  res.status(204).send();
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const result = await service.requestPasswordReset(req.validated.body.email);
  res.json({ success: true, data: result });
});

const verifyEmail = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { message: 'Email verification endpoint ready for provider integration' } });
});

module.exports = { register, login, refresh, logout, me, requestPasswordReset, verifyEmail };
