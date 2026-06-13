const asyncHandler = require('../../utils/async-handler');
const service = require('./admin.service');

const listUsers = asyncHandler(async (req, res) => {
  const data = await service.listUsers(req.query);
  res.json({ success: true, data });
});

const suspendUser = asyncHandler(async (req, res) => {
  const data = await service.suspendUser(req.params.id);
  res.json({ success: true, data });
});

const activateUser = asyncHandler(async (req, res) => {
  const data = await service.activateUser(req.params.id);
  res.json({ success: true, data });
});

const banUser = asyncHandler(async (req, res) => {
  const data = await service.banUser(req.params.id);
  res.json({ success: true, data });
});

const changeRole = asyncHandler(async (req, res) => {
  const data = await service.changeUserRole(req.params.id, req.body.role);
  res.json({ success: true, data });
});

module.exports = { listUsers, suspendUser, activateUser, banUser, changeRole };
