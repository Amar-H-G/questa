const getPagination = require('../../utils/pagination');
const repository = require('./leaderboard.repository');
const User = require('../../models/user.model');
const QuizAttempt = require('../../models/quiz-attempt.model');
const CodingSubmission = require('../../models/coding-submission.model');
const appEmitter = require('../../utils/events');

const listLeaderboard = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const scope = query.scope || 'global';
  const [items, total] = await Promise.all([repository.list({ scope, skip, limit }), repository.count(scope)]);

  return { items, meta: { page, limit, total, scope } };
};

const recalculateGlobalStandings = async () => {
  const students = await User.find({ role: 'student', status: 'active' });
  const standings = [];

  for (const student of students) {
    const quizAttempts = await QuizAttempt.find({ user: student.id, status: 'evaluated' });
    const quizScore = quizAttempts.reduce((sum, att) => sum + (att.score || 0), 0);

    const codingSubmissions = await CodingSubmission.find({ user: student.id, status: 'accepted' });
    const codingScore = codingSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);

    const totalScore = quizScore + codingScore;
    standings.push({
      user: student._id,
      score: totalScore,
    });
  }

  standings.sort((a, b) => b.score - a.score);

  const mapped = standings.map((item, idx) => ({
    scope: 'global',
    user: item.user,
    score: item.score,
    rank: idx + 1,
    metadata: { signal: 'consolidated' }
  }));

  await repository.deleteScope('global');
  
  if (mapped.length) {
    await repository.bulkWriteStandings(mapped);
  }

  appEmitter.emit('leaderboard.updated');

  return { count: mapped.length };
};

// Event listeners for reactive standings recalculation
appEmitter.on('quiz.completed', async () => {
  try {
    await recalculateGlobalStandings();
  } catch (err) {
    console.error('Failed to recalculate standings on quiz.completed event:', err);
  }
});

appEmitter.on('submission.accepted', async () => {
  try {
    await recalculateGlobalStandings();
  } catch (err) {
    console.error('Failed to recalculate standings on submission.accepted event:', err);
  }
});

module.exports = { listLeaderboard, recalculateGlobalStandings };
