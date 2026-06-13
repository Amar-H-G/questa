const asyncHandler = require('../../utils/async-handler');
const service = require('./analytics.service');

const overview = asyncHandler(async (_req, res) => {
  const data = await service.getOverview();
  res.json({ success: true, data });
});

module.exports = { overview };
