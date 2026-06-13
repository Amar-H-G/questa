const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    subjectType: { type: String, enum: ['user', 'quiz', 'coding', 'recruiter'], required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    metric: { type: String, required: true, index: true },
    value: { type: Number, required: true },
    dimensions: mongoose.Schema.Types.Mixed,
    recordedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

analyticsSchema.index({ subjectType: 1, subjectId: 1, metric: 1, recordedAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
