const asyncHandler = require('../../utils/async-handler');
const service = require('./notification.service');

const list = asyncHandler(async (req, res) => {
  const data = await service.listNotifications(req.query, req.user);
  res.json({ success: true, data });
});

const markRead = asyncHandler(async (req, res) => {
  const data = await service.markRead(req.params.id, req.user);
  res.json({ success: true, data });
});

module.exports = { list, markRead };
