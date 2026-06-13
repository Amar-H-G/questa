const { z } = require('zod');
const { objectIdSchema } = require('../../utils/object-id');

const optionSchema = z.object({
  label: z.string().min(1).max(300),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  prompt: z.string().min(3).max(2000),
  type: z.enum(['mcq', 'multi_select', 'true_false']),
  options: z.array(optionSchema).min(2).max(8),
  points: z.number().min(1).max(100).default(1),
  explanation: z.string().max(1000).optional(),
});

const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(140),
    description: z.string().max(800).optional(),
    durationMinutes: z.number().min(1).max(360).default(30),
    passingScore: z.number().min(0).max(100).default(60),
    questions: z.array(questionSchema).default([]),
  }),
});

const updateQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(140).optional(),
    description: z.string().max(800).optional(),
    durationMinutes: z.number().min(1).max(360).optional(),
    passingScore: z.number().min(0).max(100).optional(),
    questions: z.array(questionSchema).optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

const submitAttemptSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    answers: z.array(
      z.object({
        question: objectIdSchema,
        selectedOptions: z.array(objectIdSchema).default([]),
      })
    ),
  }),
});

module.exports = { createQuizSchema, updateQuizSchema, idParamSchema, submitAttemptSchema };
