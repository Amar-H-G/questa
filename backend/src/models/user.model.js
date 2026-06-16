const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT, index: true },
    status: { type: String, enum: ['active', 'invited', 'suspended', 'banned'], default: 'active', index: true },
    emailVerifiedAt: { type: Date },
    verificationToken: { type: String, select: false },
    verificationTokenExpiresAt: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordTokenExpiresAt: { type: Date, select: false },
    profile: {
      headline: { type: String, default: '' },
      company: { type: String, default: '' },
      location: { type: String, default: '' },
      skills: [{ type: String, trim: true }],
      avatar: { type: String, default: '' },
      coverBanner: { type: String, default: '' },
      bannerType: { type: String, enum: ['color', 'image'], default: 'color' },
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      preferredLang: { type: String, default: '' },
      emailNotifications: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true },
      anonymousStanding: { type: Boolean, default: false },
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
