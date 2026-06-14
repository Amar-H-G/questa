const { z } = require('zod');
const { objectIdSchema } = require('../../utils/object-id');

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

const listProblemsSchema = z.object({
  query: z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

const submitSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    language: z.enum(['javascript', 'python', 'cpp', 'java']),
    sourceCode: z.string().min(10).max(50000),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

const playgroundRunSchema = z.object({
  body: z.object({
    language: z.enum(['javascript', 'python', 'cpp', 'java']),
    sourceCode: z.string().min(1).max(50000),
    stdin: z.string().max(10000).optional().default(''),
  }),
});

module.exports = { createProblemSchema, listProblemsSchema, submitSchema, idParamSchema, playgroundRunSchema };
