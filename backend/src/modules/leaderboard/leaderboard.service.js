const getPagination = require('../../utils/pagination');
const repository = require('./leaderboard.repository');

const listLeaderboard = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const scope = query.scope || 'global';
  const [items, total] = await Promise.all([repository.list({ scope, skip, limit }), repository.count(scope)]);

  return { items, meta: { page, limit, total, scope } };
};

module.exports = { listLeaderboard };
