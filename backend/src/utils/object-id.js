const mongoose = require('mongoose');
const { z } = require('zod');

const objectIdSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: 'Invalid object id',
});

module.exports = { objectIdSchema };
