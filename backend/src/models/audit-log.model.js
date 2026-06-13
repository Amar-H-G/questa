const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ resource: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
