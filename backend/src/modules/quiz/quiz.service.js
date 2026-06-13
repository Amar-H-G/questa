const slugify = require('slugify');
const ApiError = require('../../utils/api-error');
const getPagination = require('../../utils/pagination');
const repository = require('./quiz.repository');

const makeSlug = (title) => `${slugify(title, { lower: true, strict: true })}-${Date.now().toString(36)}`;

const mapQuestions = (quizId, questions = []) =>
  questions.map((question, index) => ({
    ...question,
    quiz: quizId,
    order: index,
  }));

const createQuiz = async (payload, user) => {
  const quiz = await repository.createQuiz({
    owner: user.id,
    title: payload.title,
    description: payload.description,
    slug: makeSlug(payload.title),
    durationMinutes: payload.durationMinutes,
    passingScore: payload.passingScore,
  });

  if (payload.questions?.length) {
    await repository.insertQuestions(mapQuestions(quiz.id, payload.questions));
  }

  return quiz;
};

const listQuizzes = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const owner = query.mine === 'true' ? user.id : undefined;
  const [items, total] = await Promise.all([
    repository.listQuizzes({ owner, skip, limit }),
    repository.countQuizzes(owner),
  ]);

  return { items, meta: { page, limit, total } };
};

const updateQuiz = async (id, payload, user) => {
  const quiz = await repository.findQuizById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (quiz.owner.toString() !== user.id && user.role !== 'admin') throw new ApiError(403, 'Cannot edit this quiz');

  const updated = await repository.updateQuiz(id, {
    title: payload.title,
    description: payload.description,
    durationMinutes: payload.durationMinutes,
    passingScore: payload.passingScore,
  });

  if (payload.questions) {
    await repository.replaceQuestions(id, mapQuestions(id, payload.questions));
  }

  return updated;
};

const publishQuiz = async (id, user) => {
  const quiz = await repository.findQuizById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (quiz.owner.toString() !== user.id && user.role !== 'admin') throw new ApiError(403, 'Cannot publish this quiz');

  return repository.updateQuiz(id, { status: 'published', publishedAt: new Date() });
};

const removeQuiz = async (id, user) => {
  const quiz = await repository.findQuizById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (quiz.owner.toString() !== user.id && user.role !== 'admin') throw new ApiError(403, 'Cannot delete this quiz');
  await repository.deleteQuiz(id);
};

const submitAttempt = async (quizId, answers, user) => {
  const quiz = await repository.findQuizById(quizId);
  if (!quiz || quiz.status !== 'published') throw new ApiError(404, 'Published quiz not found');

  const questions = await repository.findQuestionsWithAnswers(quizId);
  const answerMap = new Map(answers.map((answer) => [answer.question, answer.selectedOptions.map(String)]));
  let score = 0;
  let maxScore = 0;

  const evaluated = questions.map((question) => {
    maxScore += question.points;
    const selected = answerMap.get(question.id) || [];
    const correct = question.options.filter((option) => option.isCorrect).map((option) => option.id);
    const isCorrect =
      selected.length === correct.length && selected.every((optionId) => correct.includes(optionId));
    const pointsAwarded = isCorrect ? question.points : 0;
    score += pointsAwarded;
    return { question: question.id, selectedOptions: selected, isCorrect, pointsAwarded };
  });

  return repository.createAttempt({
    quiz: quizId,
    user: user.id,
    answers: evaluated,
    status: 'evaluated',
    score,
    percentage: maxScore ? Math.round((score / maxScore) * 100) : 0,
    submittedAt: new Date(),
  });
};

module.exports = { createQuiz, listQuizzes, updateQuiz, publishQuiz, removeQuiz, submitAttempt };
