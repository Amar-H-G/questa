const asyncHandler = require('../../utils/async-handler');
const service = require('./admin.service');
const { logAction } = require('../../utils/audit-logger');

const listUsers = asyncHandler(async (req, res) => {
  const data = await service.listUsers(req.query);
  res.json({ success: true, data });
});

const suspendUser = asyncHandler(async (req, res) => {
  const data = await service.suspendUser(req.params.id);
  await logAction('user.suspend', req, { targetUserId: req.params.id });
  res.json({ success: true, data });
});

const activateUser = asyncHandler(async (req, res) => {
  const data = await service.activateUser(req.params.id);
  await logAction('user.activate', req, { targetUserId: req.params.id });
  res.json({ success: true, data });
});

const banUser = asyncHandler(async (req, res) => {
  const data = await service.banUser(req.params.id);
  await logAction('user.ban', req, { targetUserId: req.params.id });
  res.json({ success: true, data });
});

const changeRole = asyncHandler(async (req, res) => {
  const data = await service.changeUserRole(req.params.id, req.body.role);
  await logAction('user.change_role', req, { targetUserId: req.params.id, newRole: req.body.role });
  res.json({ success: true, data });
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const data = await service.getAuditLogs(req.query);
  res.json({ success: true, data });
});

module.exports = { listUsers, suspendUser, activateUser, banUser, changeRole, getAuditLogs };
