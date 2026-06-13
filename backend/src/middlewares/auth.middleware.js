const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user.model');
const ApiError = require('../utils/api-error');

const authenticate = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');

    if (!user || user.status !== 'active') {
      return next(new ApiError(401, 'User is not authorized'));
    }

    req.user = user;
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (roles.length && !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to access this resource'));
  }
  return next();
};

module.exports = { authenticate, authorize };
