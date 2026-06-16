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

  const crypto = require('crypto');
  const { sendVerificationEmail } = require('../../utils/email');
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await repository.createUser({
    name: payload.name,
    email: payload.email,
    role: payload.role || ROLES.STUDENT,
    passwordHash: 'pending',
    verificationToken,
    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });
  await user.setPassword(payload.password);
  await user.save();

  const appEmitter = require('../../utils/events');
  appEmitter.emit('user.registered', { user });

  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (err) {
    console.error('Failed to send verification email during registration:', err);
  }

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
  console.log(`[Forgot Password] Request received for email: ${email}`);
  const user = await repository.findUserByEmailWithPassword(email);
  if (!user) {
    console.log(`[Forgot Password] Email "${email}" not found in database! (Returning success to prevent enumeration)`);
    return { success: true, message: 'If that email exists, we sent a password reset link.' };
  }

  console.log(`[Forgot Password] User found: ${user.name}. Generating reset token...`);
  const crypto = require('crypto');
  const { sendPasswordResetEmail } = require('../../utils/email');

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();
  console.log(`[Forgot Password] Reset token saved to database.`);

  try {
    console.log(`[Forgot Password] Sending reset email to ${user.email}...`);
    await sendPasswordResetEmail(user.email, user.name, token);
    console.log(`[Forgot Password] Reset email sent successfully.`);
  } catch (error) {
    console.error(`[Forgot Password] Failed to send email:`, error);
    throw error;
  }

  return { success: true, message: 'Password reset email sent.' };
};

const resetPassword = async (token, newPassword) => {
  const user = await repository.findUserByResetToken(token);
  if (!user || !user.resetPasswordTokenExpiresAt || user.resetPasswordTokenExpiresAt < new Date()) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  await user.setPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiresAt = undefined;
  await user.save();

  await repository.revokeAllUserRefreshTokens(user.id);

  return { success: true, message: 'Password has been reset successfully.' };
};

const verifyEmail = async (token) => {
  const user = await repository.findUserByVerificationToken(token);
  if (!user || !user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
    throw new ApiError(400, 'Email verification token is invalid or has expired');
  }

  user.emailVerifiedAt = new Date();
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return { success: true, message: 'Email verified successfully.' };
};

const resendVerification = async (email) => {
  const user = await repository.findUserByEmailWithPassword(email);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.emailVerifiedAt) {
    throw new ApiError(400, 'Email is already verified');
  }

  const crypto = require('crypto');
  const { sendVerificationEmail } = require('../../utils/email');

  const token = crypto.randomBytes(32).toString('hex');
  user.verificationToken = token;
  user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  await sendVerificationEmail(user.email, user.name, token);

  return { success: true, message: 'Verification email resent.' };
};

const updateProfile = async (user, body) => {
  const fs = require('fs');
  const path = require('path');

  const saveBase64Image = (base64Str, prefix) => {
    if (!base64Str || typeof base64Str !== 'string') return base64Str;

    // Match base64 data URL
    const matches = base64Str.match(/^data:image\/([A-Za-z0-9-+]+);base64,(.+)$/);
    if (!matches) {
      return base64Str;
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${prefix}-${user.id || 'user'}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
  };

  if (body.avatar !== undefined) {
    body.avatar = saveBase64Image(body.avatar, 'avatar');
  }
  if (body.coverBanner !== undefined) {
    body.coverBanner = saveBase64Image(body.coverBanner, 'banner');
  }

  if (body.name !== undefined) user.name = body.name;
  if (body.email !== undefined) user.email = body.email;

  if (!user.profile) {
    user.profile = {};
  }

  const profileFields = [
    'headline', 'company', 'location', 'skills', 'avatar',
    'coverBanner', 'bannerType', 'bio', 'phone', 'github',
    'linkedin', 'portfolio', 'preferredLang',
    'emailNotifications', 'weeklyReport', 'anonymousStanding'
  ];

  profileFields.forEach((field) => {
    if (body[field] !== undefined) {
      user.profile[field] = body[field];
    }
  });

  await user.save();
  return { user: user.toJSON() };
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
  updateProfile,
};
