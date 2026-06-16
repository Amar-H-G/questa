const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, default: false, select: false },
  },
  { _id: true }
);

optionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    prompt: { type: String, required: true, trim: true },
    type: { type: String, enum: ['mcq', 'multi_select', 'true_false'], required: true },
    options: [optionSchema],
    points: { type: Number, min: 1, default: 1 },
    order: { type: Number, required: true, min: 0 },
    explanation: String,
  },
  { timestamps: true }
);

questionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

questionSchema.index({ quiz: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);
