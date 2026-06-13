const User = require('../../models/user.model');

const listUsers = ({ skip, limit }) => User.find().sort('-createdAt').skip(skip).limit(limit);
const countUsers = () => User.countDocuments();
const updateUserStatus = (id, status) => User.findByIdAndUpdate(id, { status }, { new: true });
const updateUserRole = (id, role) => User.findByIdAndUpdate(id, { role }, { new: true });

module.exports = { listUsers, countUsers, updateUserStatus, updateUserRole };
