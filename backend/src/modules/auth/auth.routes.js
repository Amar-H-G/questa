const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const controller = require('./auth.controller');
const schemas = require('./auth.validation');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validate(schemas.registerSchema), controller.register);
router.post('/login', authLimiter, validate(schemas.loginSchema), controller.login);
router.post('/refresh-token', validate(schemas.refreshSchema), controller.refresh);
router.post('/logout', validate(schemas.logoutSchema), controller.logout);
router.get('/me', authenticate, controller.me);
router.put('/profile', authenticate, validate(schemas.updateProfileSchema), controller.updateProfile);
router.post('/password-reset', authLimiter, validate(schemas.passwordResetRequestSchema), controller.requestPasswordReset);
router.post('/verify-email', validate(schemas.verifyEmailSchema), controller.verifyEmail);
router.post('/reset-password', authLimiter, validate(schemas.resetPasswordSchema), controller.resetPassword);
router.post('/resend-verification', authLimiter, validate(schemas.resendVerificationSchema), controller.resendVerification);

module.exports = router;
