const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    weight: { type: Number, default: 1 },
  },
  { _id: true }
);

const codingProblemSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium', index: true },
    prompt: { type: String, required: true },
    constraints: [String],
    supportedLanguages: [{ type: String, enum: ['javascript', 'python', 'cpp', 'java'] }],
    testCases: [testCaseSchema],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
  },
  { timestamps: true }
);

codingProblemSchema.index({ title: 'text', prompt: 'text' });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
