const express = require('express');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./leaderboard.controller');
const schemas = require('./leaderboard.validation');

const router = express.Router();

router.get('/', authenticate, validate(schemas.listLeaderboardSchema), controller.list);
router.post('/recalculate', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), controller.recalculate);

module.exports = router;
