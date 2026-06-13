const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { ROLES } = require('../../constants/roles');
const ApiError = require('../../utils/api-error');
const { hashToken, randomToken, signAccessToken, signRefreshToken } = require('../../utils/tokens');
const repository = require('./auth.repository');

const persistRefreshToken = async (user, req) => {
  const tokenId = randomToken();
  const refreshToken = signRefreshToken(user, tokenId);
  const decoded = jwt.decode(refreshToken);

  await repository.createRefreshToken({
    user: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000),
    userAgent: req.get('user-agent'),
    ipAddress: req.ip,
  });

  return refreshToken;
};

const buildAuthResponse = async (user, req) => ({
  user: user.toJSON(),
  accessToken: signAccessToken(user),
  refreshToken: await persistRefreshToken(user, req),
});

const register = async (payload, req) => {
  const existing = await repository.findUserByEmailWithPassword(payload.email);
  if (existing) throw new ApiError(409, 'An account already exists for this email');

  const user = await repository.createUser({
    name: payload.name,
    email: payload.email,
    role: payload.role || ROLES.STUDENT,
    passwordHash: 'pending',
  });
  await user.setPassword(payload.password);
  await user.save();

  return buildAuthResponse(user, req);
};

const login = async ({ email, password }, req) => {
  const user = await repository.findUserByEmailWithPassword(email);
  if (!user || !(await user.verifyPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (user.status !== 'active') throw new ApiError(403, 'Account is not active');

  user.lastLoginAt = new Date();
  await user.save();

  return buildAuthResponse(user, req);
};

const refresh = async (refreshToken, req) => {
  const stored = await repository.findRefreshToken(hashToken(refreshToken));
  if (!stored || stored.expiresAt < new Date()) throw new ApiError(401, 'Refresh token is invalid');

  let payload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, 'Refresh token is invalid');
  }

  const user = await repository.findUserById(payload.sub);
  if (!user || user.status !== 'active') throw new ApiError(401, 'User is not authorized');

  await repository.revokeRefreshToken(hashToken(refreshToken));
  return buildAuthResponse(user, req);
};

const logout = (refreshToken) => repository.revokeRefreshToken(hashToken(refreshToken));

const requestPasswordReset = async (email) => {
  const user = await repository.findUserByEmailWithPassword(email);
  if (!user) return { delivered: true };

  return {
    delivered: true,
    message: 'Password reset delivery is ready for email provider integration',
  };
};

module.exports = { register, login, refresh, logout, requestPasswordReset };
