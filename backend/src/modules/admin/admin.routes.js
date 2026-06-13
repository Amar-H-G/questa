const express = require('express');
const User = require('../../models/user.model');
const { ROLES } = require('../../constants/roles');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const asyncHandler = require('../../utils/async-handler');
const getPagination = require('../../utils/pagination');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const [items, total] = await Promise.all([
      User.find().sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    res.json({ success: true, data: { items, meta: { page, limit, total } } });
  })
);

module.exports = router;
