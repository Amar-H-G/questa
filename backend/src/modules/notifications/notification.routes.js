const express = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./notification.controller');
const schemas = require('./notification.validation');

const router = express.Router();

router.use(authenticate);
router.get('/', controller.list);
router.patch('/:id/read', validate(schemas.markReadSchema), controller.markRead);

module.exports = router;
