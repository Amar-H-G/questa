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

const changeUserRole = async (id, role) => {
  const user = await repository.updateUserRole(id, role);
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { listUsers, suspendUser, activateUser, banUser, changeUserRole };
