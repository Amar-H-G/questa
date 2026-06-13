const express = require('express');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const controller = require('./analytics.controller');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER, ROLES.RECRUITER));
router.get('/overview', controller.overview);
router.get('/export', controller.exportCsv);
router.get('/export-pdf', controller.exportPdf);

module.exports = router;
