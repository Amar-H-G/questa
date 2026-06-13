const asyncHandler = require('../../utils/async-handler');
const service = require('./admin.service');

const listUsers = asyncHandler(async (req, res) => {
  const data = await service.listUsers(req.query);
  res.json({ success: true, data });
});

module.exports = { listUsers };
