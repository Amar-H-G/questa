const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    scope: { type: String, enum: ['global', 'quiz', 'coding'], required: true, index: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    score: { type: Number, required: true, index: true },
    rank: { type: Number, required: true, index: true },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

leaderboardSchema.index({ scope: 1, entityId: 1, rank: 1 });
leaderboardSchema.index({ scope: 1, entityId: 1, user: 1 }, { unique: true, sparse: true });

leaderboardSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

leaderboardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
