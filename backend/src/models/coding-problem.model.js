const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    weight: { type: Number, default: 1 },
    explanation: { type: String, default: '' },
  },
  { _id: true }
);

const codingProblemSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    prompt: { type: String, required: true }, // acts as Problem Statement
    constraints: [String],
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    tags: [String],
    timeLimit: { type: Number, default: 2000 }, // in milliseconds
    memoryLimit: { type: Number, default: 51200 }, // in KB
    supportedLanguages: [{ type: String, enum: ['javascript', 'python', 'cpp', 'java', 'c'] }],
    testCases: [testCaseSchema],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
  },
  { timestamps: true }
);

codingProblemSchema.index({ title: 'text', prompt: 'text', tags: 'text' });

codingProblemSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

codingProblemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
