const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

const signRefreshToken = (user, tokenId) =>
  jwt.sign({ sub: user.id, jti: tokenId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const randomToken = () => crypto.randomBytes(32).toString('hex');

module.exports = { signAccessToken, signRefreshToken, hashToken, randomToken };
