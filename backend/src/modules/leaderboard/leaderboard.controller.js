const asyncHandler = require('../../utils/async-handler');
const service = require('./leaderboard.service');

const list = asyncHandler(async (req, res) => {
  const data = await service.listLeaderboard(req.validated.query);
  res.json({ success: true, data });
});

const recalculate = asyncHandler(async (req, res) => {
  const result = await service.recalculateGlobalStandings();
  res.json({ success: true, message: 'Standings recalculated successfully', data: result });
});

module.exports = { list, recalculate };
