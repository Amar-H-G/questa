const { z } = require('zod');
const { ROLES } = require('../../constants/roles');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
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

const passwordResetRequestSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

module.exports = { registerSchema, loginSchema, refreshSchema, passwordResetRequestSchema };
