const repository = require('./analytics.repository');

const round = (value) => Math.round(value * 10) / 10;

const getOverview = async () => {
  const [overview, trend] = await Promise.all([repository.countOverview(), repository.getAttemptTrend()]);
  const averageScore = overview.evaluatedAttempts.length
    ? round(overview.evaluatedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / overview.evaluatedAttempts.length)
    : 0;

  return {
    users: overview.users,
    quizzes: overview.quizzes,
    attempts: overview.attempts,
    submissions: overview.submissions,
    completionRate: overview.attempts ? round((overview.evaluatedAttempts.length / overview.attempts) * 100) : 0,
    averageScore,
    acceptanceRate: overview.submissions ? round((overview.acceptedSubmissions / overview.submissions) * 100) : 0,
    trend: trend.map((item) => ({
      label: `${item._id.month}/${item._id.day}`,
      attempts: item.attempts,
      averageScore: round(item.averageScore || 0),
    })),
  };
};

module.exports = { getOverview };
