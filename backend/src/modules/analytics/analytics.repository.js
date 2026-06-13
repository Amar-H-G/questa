const CodingSubmission = require('../../models/coding-submission.model');
const Quiz = require('../../models/quiz.model');
const QuizAttempt = require('../../models/quiz-attempt.model');
const User = require('../../models/user.model');

const countOverview = async () => {
  const [users, quizzes, attempts, submissions, evaluatedAttempts, acceptedSubmissions] = await Promise.all([
    User.countDocuments(),
    Quiz.countDocuments(),
    QuizAttempt.countDocuments(),
    CodingSubmission.countDocuments(),
    QuizAttempt.find({ status: 'evaluated' }).select('percentage createdAt').lean(),
    CodingSubmission.countDocuments({ status: 'accepted' }),
  ]);

  return { users, quizzes, attempts, submissions, evaluatedAttempts, acceptedSubmissions };
};

const getAttemptTrend = () =>
  QuizAttempt.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        attempts: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    { $limit: 14 },
  ]);

module.exports = { countOverview, getAttemptTrend };
