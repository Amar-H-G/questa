const getPagination = require('../../utils/pagination');
const repository = require('./admin.repository');

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([repository.listUsers({ skip, limit }), repository.countUsers()]);
  return { items, meta: { page, limit, total } };
};

module.exports = { listUsers };
