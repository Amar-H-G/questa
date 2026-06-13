const express = require('express');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const controller = require('./admin.controller');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));
router.get('/users', controller.listUsers);

module.exports = router;
