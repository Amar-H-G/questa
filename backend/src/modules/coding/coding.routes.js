const express = require('express');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./coding.controller');
const schemas = require('./coding.validation');

const router = express.Router();

router.use(authenticate);
router.get('/problems', validate(schemas.listProblemsSchema), controller.listProblems);
router.get('/problems/:id', validate(schemas.idParamSchema), controller.getProblem);
router.post('/problems', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.createProblemSchema), controller.createProblem);
router.post('/problems/:id/submissions', validate(schemas.submitSchema), controller.submit);
router.get('/submissions/:id', validate(schemas.idParamSchema), controller.getSubmission);

module.exports = router;
