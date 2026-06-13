const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    language: { type: String, enum: ['javascript', 'python', 'cpp', 'java'], required: true },
    sourceCode: { type: String, required: true },
    status: {
      type: String,
      enum: ['queued', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'],
      default: 'queued',
      index: true,
    },
    score: { type: Number, default: 0 },
    judgeProvider: { type: String, default: 'judge0' },
    executionResults: [
      {
        testCase: mongoose.Schema.Types.ObjectId,
        status: String,
        stdout: String,
        stderr: String,
        runtimeMs: Number,
        memoryKb: Number,
      },
    ],
  },
  { timestamps: true }
);

codingSubmissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
