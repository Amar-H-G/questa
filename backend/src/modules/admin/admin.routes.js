const express = require('express');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const controller = require('./admin.controller');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));
router.get('/users', controller.listUsers);
router.post('/users/:id/suspend', controller.suspendUser);
router.post('/users/:id/activate', controller.activateUser);
router.post('/users/:id/ban', controller.banUser);
router.post('/users/:id/role', controller.changeRole);

module.exports = router;
