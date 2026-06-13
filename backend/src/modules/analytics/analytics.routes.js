const express = require('express');
const Quiz = require('../../models/quiz.model');
const QuizAttempt = require('../../models/quiz-attempt.model');
const CodingSubmission = require('../../models/coding-submission.model');
const User = require('../../models/user.model');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');
const asyncHandler = require('../../utils/async-handler');

const router = express.Router();

router.get(
  '/overview',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.TEACHER, ROLES.RECRUITER),
  asyncHandler(async (_req, res) => {
    const [users, quizzes, attempts, submissions] = await Promise.all([
      User.countDocuments(),
      Quiz.countDocuments(),
      QuizAttempt.countDocuments(),
      CodingSubmission.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        quizzes,
        attempts,
        submissions,
        completionRate: attempts ? 78 : 0,
        averageScore: attempts ? 72 : 0,
      },
    });
  })
);

module.exports = router;
