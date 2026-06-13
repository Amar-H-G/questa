const express = require('express');
const Leaderboard = require('../../models/leaderboard.model');
const { authenticate } = require('../../middlewares/auth.middleware');
const asyncHandler = require('../../utils/async-handler');
const getPagination = require('../../utils/pagination');

const router = express.Router();

router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const scope = req.query.scope || 'global';
    const [items, total] = await Promise.all([
      Leaderboard.find({ scope }).populate('user', 'name email profile').sort('rank').skip(skip).limit(limit),
      Leaderboard.countDocuments({ scope }),
    ]);
    res.json({ success: true, data: { items, meta: { page, limit, total } } });
  })
);

module.exports = router;
