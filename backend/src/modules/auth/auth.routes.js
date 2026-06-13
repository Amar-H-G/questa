const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const controller = require('./auth.controller');
const schemas = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(schemas.registerSchema), controller.register);
router.post('/login', validate(schemas.loginSchema), controller.login);
router.post('/refresh-token', validate(schemas.refreshSchema), controller.refresh);
router.post('/logout', validate(schemas.logoutSchema), controller.logout);
router.get('/me', authenticate, controller.me);
router.post('/password-reset', validate(schemas.passwordResetRequestSchema), controller.requestPasswordReset);
router.post('/verify-email', controller.verifyEmail);

module.exports = router;
