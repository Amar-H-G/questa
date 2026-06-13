const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 800 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    durationMinutes: { type: Number, min: 1, max: 360, default: 30 },
    questionTypes: [{ type: String, enum: ['mcq', 'multi_select', 'true_false'], default: 'mcq' }],
    passingScore: { type: Number, min: 0, max: 100, default: 60 },
    settings: {
      shuffleQuestions: { type: Boolean, default: true },
      showResultsImmediately: { type: Boolean, default: true },
      allowRetake: { type: Boolean, default: false },
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

quizSchema.index({ title: 'text', description: 'text' });
quizSchema.index({ owner: 1, status: 1, createdAt: -1 });

quizSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

quizSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
