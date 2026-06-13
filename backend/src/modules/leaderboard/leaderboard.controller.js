const asyncHandler = require('../../utils/async-handler');
const service = require('./leaderboard.service');

const list = asyncHandler(async (req, res) => {
  const data = await service.listLeaderboard(req.validated.query);
  res.json({ success: true, data });
});

module.exports = { list };
