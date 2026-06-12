const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private
const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, publicId } = req.body;

  if (!title || !publicId) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const quiz = await Quiz.create({
    user: req.user.id,
    title,
    description,
    publicId,
    // Defaulting other fields
  });

  res.status(201).json(quiz);
});

// @desc    Get user quizzes
// @route   GET /api/quizzes/my-quizzes
// @access  Private
const getMyQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ user: req.user.id }).sort('-createdAt');
  res.json(quizzes);
});

module.exports = {
  createQuiz,
  getMyQuizzes,
};
