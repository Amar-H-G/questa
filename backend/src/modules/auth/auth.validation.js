const { z } = require('zod');
const { ROLES } = require('../../constants/roles');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    role: z.enum(Object.values(ROLES)).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20),
  }),
});

const logoutSchema = refreshSchema;

const passwordResetRequestSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(10),
  }),
});

const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    email: z.string().email().optional(),
    headline: z.string().max(200).optional().nullable(),
    company: z.string().max(200).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    skills: z.array(z.string()).optional(),
    avatar: z.string().optional().nullable(),
    coverBanner: z.string().optional().nullable(),
    bannerType: z.enum(['color', 'image']).optional(),
    bio: z.string().max(1000).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    github: z.string().max(100).optional().nullable(),
    linkedin: z.string().max(100).optional().nullable(),
    portfolio: z.string().max(200).optional().nullable(),
    preferredLang: z.string().max(50).optional().nullable(),
    emailNotifications: z.boolean().optional(),
    weeklyReport: z.boolean().optional(),
    anonymousStanding: z.boolean().optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  passwordResetRequestSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
};
