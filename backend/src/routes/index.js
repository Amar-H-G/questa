const express = require('express');
const adminRoutes = require('../modules/admin/admin.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const authRoutes = require('../modules/auth/auth.routes');
const codingRoutes = require('../modules/coding/coding.routes');
const leaderboardRoutes = require('../modules/leaderboard/leaderboard.routes');
const quizRoutes = require('../modules/quiz/quiz.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/coding', codingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
