const Leaderboard = require('../../models/leaderboard.model');

const list = ({ scope, skip, limit }) =>
  Leaderboard.find({ scope }).populate('user', 'name email profile').sort('rank').skip(skip).limit(limit);

const count = (scope) => Leaderboard.countDocuments({ scope });

module.exports = { list, count };
