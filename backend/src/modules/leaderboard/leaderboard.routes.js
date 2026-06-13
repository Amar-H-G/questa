const express = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./leaderboard.controller');
const schemas = require('./leaderboard.validation');

const router = express.Router();

router.get('/', authenticate, validate(schemas.listLeaderboardSchema), controller.list);

module.exports = router;
