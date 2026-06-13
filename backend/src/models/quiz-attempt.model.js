const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOptions: [{ type: mongoose.Schema.Types.ObjectId }],
    isCorrect: Boolean,
    pointsAwarded: { type: Number, default: 0 },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [answerSchema],
    status: { type: String, enum: ['in_progress', 'submitted', 'evaluated', 'suspended'], default: 'in_progress' },
    score: { type: Number, min: 0, default: 0 },
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
    warningsCount: { type: Number, default: 0 },
    antiCheatLogs: [String],
    cheated: { type: Boolean, default: false },
    suspiciousActivityFlags: [String],
  },
  { timestamps: true }
);

quizAttemptSchema.index({ quiz: 1, user: 1, createdAt: -1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
