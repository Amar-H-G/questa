const ApiError = require('../../utils/api-error');
const getPagination = require('../../utils/pagination');
const repository = require('./notification.repository');

const listNotifications = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const [items, total, unread] = await Promise.all([
    repository.listForUser({ userId: user.id, skip, limit }),
    repository.countForUser(user.id),
    repository.unreadCount(user.id),
  ]);

  return { items, meta: { page, limit, total, unread } };
};

const markRead = async (id, user) => {
  const notification = await repository.markRead(id, user.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
};

const User = require('../../models/user.model');
const appEmitter = require('../../utils/events');

const createNotification = async (payload) => {
  return repository.create(payload);
};

// Event listeners
appEmitter.on('user.registered', async (data) => {
  try {
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await repository.create({
        user: admin._id,
        type: 'user.registered',
        title: 'New Candidate Registration',
        body: `${data.user.name} (${data.user.email}) has signed up.`,
      });
    }
  } catch (err) {
    console.error('Error handling user.registered event:', err);
  }
});

appEmitter.on('quiz.created', async (data) => {
  try {
    await repository.create({
      user: data.user.id,
      type: 'quiz.created',
      title: 'Quiz Studio Update',
      body: `Your assessment "${data.quiz.title}" has been successfully drafted.`,
    });
  } catch (err) {
    console.error('Error handling quiz.created event:', err);
  }
});

appEmitter.on('quiz.completed', async (data) => {
  try {
    await repository.create({
      user: data.user.id,
      type: 'quiz.completed',
      title: 'Assessment Attempt Submitted',
      body: `You completed "${data.quiz.title}" with a score of ${data.attempt.score} points (${data.attempt.percentage}%).`,
    });
    await repository.create({
      user: data.quiz.owner,
      type: 'quiz.completed',
      title: 'Assessment Submission Alert',
      body: `Candidate ${data.user.name} scored ${data.attempt.percentage}% on your quiz "${data.quiz.title}".`,
    });
  } catch (err) {
    console.error('Error handling quiz.completed event:', err);
  }
});

appEmitter.on('submission.created', async (data) => {
  try {
    await repository.create({
      user: data.user.id,
      type: 'submission.created',
      title: 'Compilation Queued',
      body: `Your code submission for "${data.problem.title}" is in the Judge0 queue.`,
    });
  } catch (err) {
    console.error('Error handling submission.created event:', err);
  }
});

appEmitter.on('submission.accepted', async (data) => {
  try {
    await repository.create({
      user: data.user.id,
      type: 'submission.accepted',
      title: 'Submission Evaluated',
      body: `Your solution for "${data.problem.title}" was evaluated with status: ${data.submission.status.toUpperCase()}. Score: ${data.submission.score}%.`,
    });
  } catch (err) {
    console.error('Error handling submission.accepted event:', err);
  }
});

appEmitter.on('leaderboard.updated', async () => {
  try {
    const students = await User.find({ role: 'student' });
    for (const student of students) {
      await repository.create({
        user: student._id,
        type: 'leaderboard.updated',
        title: 'Standings Recalculated',
        body: 'The global developer standings have been updated. Check the leaderboard!',
      });
    }
  } catch (err) {
    console.error('Error handling leaderboard.updated event:', err);
  }
});

module.exports = { listNotifications, markRead, createNotification };
