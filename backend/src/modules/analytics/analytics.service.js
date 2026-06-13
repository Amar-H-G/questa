const repository = require('./analytics.repository');

const round = (value) => Math.round(value * 10) / 10;

const QuizAttempt = require('../../models/quiz-attempt.model');

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

const exportAttemptsCsv = async (filters) => {
  const query = {};
  if (filters.quizId) query.quiz = filters.quizId;
  if (filters.cheated !== undefined) query.cheated = filters.cheated === 'true';
  if (filters.scoreMin !== undefined) query.score = { $gte: Number(filters.scoreMin) };

  const attempts = await QuizAttempt.find(query)
    .populate('user', 'name email')
    .populate('quiz', 'title')
    .sort('-createdAt');

  let csvContent = 'Candidate Name,Candidate Email,Quiz,Score,Percentage,Warnings,Cheated,Suspicious Flags,Date\n';
  for (const att of attempts) {
    const name = (att.user?.name || 'Anonymous').replace(/"/g, '""');
    const email = (att.user?.email || 'N/A').replace(/"/g, '""');
    const quizTitle = (att.quiz?.title || 'Unknown Quiz').replace(/"/g, '""');
    const flags = (att.suspiciousActivityFlags || []).join('; ').replace(/"/g, '""');
    csvContent += `"${name}","${email}","${quizTitle}",${att.score},${att.percentage},${att.warningsCount || 0},${att.cheated || false},"${flags}","${att.createdAt.toISOString()}"\n`;
  }
  return csvContent;
};

module.exports = { getOverview, exportAttemptsCsv };
