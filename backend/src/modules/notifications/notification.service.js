const ApiError = require('../../utils/api-error');
const getPagination = require('../../utils/pagination');
const repository = require('./notification.repository');

const listNotifications = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const [items, total, unread] = await Promise.all([
    repository.listForUser({ userId: user.id, skip, limit }),
    repository.countForUser(user.id),
    repository.unreadCount(user.id),
  ]);

  return { items, meta: { page, limit, total, unread } };
};

const markRead = async (id, user) => {
  const notification = await repository.markRead(id, user.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
};

module.exports = { listNotifications, markRead };
