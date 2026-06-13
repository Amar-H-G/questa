const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT, index: true },
    status: { type: String, enum: ['active', 'invited', 'suspended'], default: 'active', index: true },
    emailVerifiedAt: { type: Date },
    profile: {
      headline: String,
      company: String,
      location: String,
      skills: [{ type: String, trim: true }],
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ name: 'text', email: 'text' });

userSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
    delete ret.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);
