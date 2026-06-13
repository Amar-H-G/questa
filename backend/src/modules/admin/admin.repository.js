const User = require('../../models/user.model');

const listUsers = ({ skip, limit }) => User.find().sort('-createdAt').skip(skip).limit(limit);
const countUsers = () => User.countDocuments();

module.exports = { listUsers, countUsers };
