const getPagination = require('../../utils/pagination');
const repository = require('./admin.repository');

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([repository.listUsers({ skip, limit }), repository.countUsers()]);
  return { items, meta: { page, limit, total } };
};

const suspendUser = async (id) => {
  const user = await repository.updateUserStatus(id, 'suspended');
  if (!user) throw new Error('User not found');
  return user;
};

const activateUser = async (id) => {
  const user = await repository.updateUserStatus(id, 'active');
  if (!user) throw new Error('User not found');
  return user;
};

const banUser = async (id) => {
  const user = await repository.updateUserStatus(id, 'banned');
  if (!user) throw new Error('User not found');
  return user;
};

const AuditLog = require('../../models/audit-log.model');

const changeUserRole = async (id, role) => {
  const user = await repository.updateUserRole(id, role);
  if (!user) throw new Error('User not found');
  return user;
};

const getAuditLogs = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    AuditLog.find({}).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
    AuditLog.countDocuments(),
  ]);
  return { items, meta: { page, limit, total } };
};

module.exports = { listUsers, suspendUser, activateUser, banUser, changeUserRole, getAuditLogs };
