const Quiz = require('../../models/quiz.model');
const Question = require('../../models/question.model');
const QuizAttempt = require('../../models/quiz-attempt.model');

const createQuiz = (payload) => Quiz.create(payload);
const updateQuiz = (id, payload) => Quiz.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
const findQuizById = (id) => Quiz.findById(id);
const listQuizzes = ({ owner, skip, limit }) =>
  Quiz.find(owner ? { owner } : {}).sort('-createdAt').skip(skip).limit(limit);
const countQuizzes = (owner) => Quiz.countDocuments(owner ? { owner } : {});
const deleteQuiz = (id) => Quiz.findByIdAndDelete(id);
const insertQuestions = (questions) => Question.insertMany(questions);
const replaceQuestions = async (quizId, questions) => {
  await Question.deleteMany({ quiz: quizId });
  return questions.length ? Question.insertMany(questions) : [];
};
const findQuestionsWithAnswers = (quizId) => Question.find({ quiz: quizId }).select('+options.isCorrect').sort('order');
const findQuestionsForQuiz = (quizId) => Question.find({ quiz: quizId }).sort('order');
const createAttempt = (payload) => QuizAttempt.create(payload);

module.exports = {
  createQuiz,
  updateQuiz,
  findQuizById,
  listQuizzes,
  countQuizzes,
  deleteQuiz,
  insertQuestions,
  replaceQuestions,
  findQuestionsWithAnswers,
  findQuestionsForQuiz,
  createAttempt,
};
