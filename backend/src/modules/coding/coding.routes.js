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
router.get('/problems/:id/attempt', validate(schemas.idParamSchema), controller.getProblemAttempt);

// Teacher/Admin-only routes
router.post('/problems', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.createProblemSchema), controller.createProblem);
router.put('/problems/:id', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.updateProblemSchema), controller.updateProblem);
router.delete('/problems/:id', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.idParamSchema), controller.deleteProblem);
router.post('/problems/:id/publish', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.idParamSchema), controller.publishProblem);
router.post('/problems/:id/unpublish', authorize(ROLES.ADMIN, ROLES.TEACHER), validate(schemas.idParamSchema), controller.unpublishProblem);

// Code submission and execution routes
router.post('/problems/:id/submissions', validate(schemas.submitSchema), controller.submit);
router.get('/submissions/:id', validate(schemas.idParamSchema), controller.getSubmission);
router.post('/playground/run', validate(schemas.playgroundRunSchema), controller.runPlayground);

module.exports = router;
