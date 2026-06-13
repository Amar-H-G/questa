const Notification = require('../../models/notification.model');

const listForUser = ({ userId, skip, limit }) =>
  Notification.find({ user: userId }).sort({ readAt: 1, createdAt: -1 }).skip(skip).limit(limit);

const countForUser = (userId) => Notification.countDocuments({ user: userId });

const unreadCount = (userId) => Notification.countDocuments({ user: userId, readAt: { $exists: false } });

const markRead = (id, userId) =>
  Notification.findOneAndUpdate({ _id: id, user: userId }, { readAt: new Date() }, { new: true });

const create = (payload) => Notification.create(payload);

module.exports = { listForUser, countForUser, unreadCount, markRead, create };
