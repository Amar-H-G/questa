const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true }
);

activityLogSchema.index({ actor: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
