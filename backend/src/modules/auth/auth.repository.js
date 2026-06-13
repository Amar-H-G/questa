const RefreshToken = require('../../models/token.model');
const User = require('../../models/user.model');

const findUserByEmailWithPassword = (email) => User.findOne({ email }).select('+passwordHash');
const findUserById = (id) => User.findById(id);
const createUser = (payload) => User.create(payload);
const createRefreshToken = (payload) => RefreshToken.create(payload);
const findRefreshToken = (tokenHash) => RefreshToken.findOne({ tokenHash, revokedAt: { $exists: false } });
const revokeRefreshToken = (tokenHash) =>
  RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() }, { new: true });

const findUserByVerificationToken = (token) =>
  User.findOne({ verificationToken: token }).select('+verificationToken +verificationTokenExpiresAt');

const findUserByResetToken = (token) =>
  User.findOne({ resetPasswordToken: token }).select('+resetPasswordToken +resetPasswordTokenExpiresAt');

const revokeAllUserRefreshTokens = (userId) =>
  RefreshToken.updateMany({ user: userId, revokedAt: { $exists: false } }, { revokedAt: new Date() });

module.exports = {
  findUserByEmailWithPassword,
  findUserById,
  createUser,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  findUserByVerificationToken,
  findUserByResetToken,
  revokeAllUserRefreshTokens,
};
