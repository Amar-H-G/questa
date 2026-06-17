const mongoose = require('mongoose');

const codingAttemptSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    submission: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingSubmission', required: true, index: true },
    score: { type: Number, default: 0 },
    status: { type: String, required: true }, // 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compilation_error'
  },
  { timestamps: true }
);

// Unique index to prevent duplicate attempts per student per problem
codingAttemptSchema.index({ student: 1, problem: 1 }, { unique: true });
codingAttemptSchema.index({ createdAt: 1 });

codingAttemptSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

codingAttemptSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('CodingAttempt', codingAttemptSchema);
