const { z } = require('zod');

const createProblemSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(160),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    prompt: z.string().min(20),
    constraints: z.array(z.string()).default([]),
    supportedLanguages: z.array(z.enum(['javascript', 'python', 'cpp', 'java'])).min(1),
    testCases: z
      .array(
        z.object({
          input: z.string(),
          expectedOutput: z.string(),
          isHidden: z.boolean().default(false),
          weight: z.number().min(1).default(1),
        })
      )
      .default([]),
  }),
});

const submitSchema = z.object({
  params: z.object({ id: z.string().min(12) }),
  body: z.object({
    language: z.enum(['javascript', 'python', 'cpp', 'java']),
    sourceCode: z.string().min(10).max(50000),
  }),
});

module.exports = { createProblemSchema, submitSchema };
