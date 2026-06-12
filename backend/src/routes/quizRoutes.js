const express = require('express');
const router = express.Router();
const { createQuiz, getMyQuizzes } = require('../controllers/quizController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createQuiz);
router.get('/my-quizzes', protect, getMyQuizzes);

module.exports = router;
