const express = require('express');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { ROLES } = require('../../constants/roles');
const controller = require('./quiz.controller');
const schemas = require('./quiz.validation');

const router = express.Router();

router.use(authenticate);
router.get('/', controller.listQuizzes);
router.post('/', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.createQuizSchema), controller.createQuiz);
router.patch('/:id', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.updateQuizSchema), controller.updateQuiz);
router.post('/:id/publish', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.idParamSchema), controller.publishQuiz);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.idParamSchema), controller.removeQuiz);
router.post('/:id/attempts', validate(schemas.submitAttemptSchema), controller.submitAttempt);

module.exports = router;
