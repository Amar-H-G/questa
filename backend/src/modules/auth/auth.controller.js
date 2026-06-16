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
  await service.logout(req.validated.body.refreshToken);
  res.status(204).send();
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const result = await service.requestPasswordReset(req.validated.body.email);
  res.json({ success: true, data: result });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await service.verifyEmail(req.validated.body.token);
  res.json({ success: true, data: result });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await service.resetPassword(req.validated.body.token, req.validated.body.password);
  res.json({ success: true, data: result });
});

const resendVerification = asyncHandler(async (req, res) => {
  const result = await service.resendVerification(req.validated.body.email);
  res.json({ success: true, data: result });
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await service.updateProfile(req.user, req.validated.body);
  res.json({ success: true, data: result });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  requestPasswordReset,
  verifyEmail,
  resetPassword,
  resendVerification,
  updateProfile,
};
