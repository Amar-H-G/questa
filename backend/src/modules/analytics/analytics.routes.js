const express = require('express');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const controller = require('./analytics.controller');

const router = express.Router();

// Personal stats route accessible to any authenticated user (including students)
router.get('/my-stats', authenticate, controller.myStats);

router.get('/debug/:email', async (req, res) => {
  try {
    const User = require('../../models/user.model');
    const user = await User.findOne({ name: req.params.email });
    if (!user) return res.json({ error: 'User not found' });
    const data = await require('./analytics.service').getUserStats(user);
    res.json({ success: true, data });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get('/debug-all', async (req, res) => {
  try {
    const QuizAttempt = require('../../models/quiz-attempt.model');
    const CodingSubmission = require('../../models/coding-submission.model');
    const User = require('../../models/user.model');
    
    const attempts = await QuizAttempt.countDocuments();
    const submissions = await CodingSubmission.countDocuments();
    const accepted = await CodingSubmission.countDocuments({ status: 'accepted' });
    const users = await User.countDocuments();
    
    res.json({ success: true, users, attempts, submissions, accepted });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Admin, Teacher, Recruiter restricted routes
router.use(authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER, ROLES.RECRUITER));
router.get('/overview', controller.overview);
router.get('/export', controller.exportCsv);
router.get('/export-pdf', controller.exportPdf);

module.exports = router;
