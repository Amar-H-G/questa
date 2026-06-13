const Leaderboard = require('../../models/leaderboard.model');

const list = ({ scope, skip, limit }) =>
  Leaderboard.find({ scope }).populate('user', 'name email profile').sort('rank').skip(skip).limit(limit);

const count = (scope) => Leaderboard.countDocuments({ scope });

const deleteScope = (scope, entityId) =>
  Leaderboard.deleteMany({ scope, ...(entityId && { entityId }) });

const bulkWriteStandings = (standings) => Leaderboard.insertMany(standings);

module.exports = { list, count, deleteScope, bulkWriteStandings };
