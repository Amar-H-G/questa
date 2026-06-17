const { z } = require('zod');
const { objectIdSchema } = require('../../utils/object-id');

const createProblemSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(160),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    description: z.string().optional().default(''),
    prompt: z.string().min(20), // acts as Problem Statement
    constraints: z.array(z.string()).default([]),
    inputFormat: z.string().optional().default(''),
    outputFormat: z.string().optional().default(''),
    tags: z.array(z.string()).default([]),
    timeLimit: z.number().min(100).max(10000).default(2000), // milliseconds
    memoryLimit: z.number().min(1024).max(1048576).default(51200), // KB
    supportedLanguages: z.array(z.enum(['javascript', 'python', 'cpp', 'java', 'c'])).min(1),
    testCases: z
      .array(
        z.object({
          input: z.string(),
          expectedOutput: z.string(),
          isHidden: z.boolean().default(false),
          weight: z.number().min(1).default(1),
          explanation: z.string().optional().default(''),
        })
      )
      .default([]),
  }),
});

const updateProblemSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    title: z.string().min(3).max(160),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    description: z.string().optional().default(''),
    prompt: z.string().min(20),
    constraints: z.array(z.string()).default([]),
    inputFormat: z.string().optional().default(''),
    outputFormat: z.string().optional().default(''),
    tags: z.array(z.string()).default([]),
    timeLimit: z.number().min(100).max(10000).default(2000),
    memoryLimit: z.number().min(1024).max(1048576).default(51200),
    supportedLanguages: z.array(z.enum(['javascript', 'python', 'cpp', 'java', 'c'])).min(1),
    testCases: z
      .array(
        z.object({
          input: z.string(),
          expectedOutput: z.string(),
          isHidden: z.boolean().default(false),
          weight: z.number().min(1).default(1),
          explanation: z.string().optional().default(''),
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
    role: z.string().optional(), // allow custom filter from teacher dashboard
  }),
});

const submitSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    language: z.enum(['javascript', 'python', 'cpp', 'java', 'c']),
    sourceCode: z.string().min(10).max(50000),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

const playgroundRunSchema = z.object({
  body: z.object({
    language: z.enum(['javascript', 'python', 'cpp', 'java', 'c']),
    sourceCode: z.string().min(1).max(50000),
    stdin: z.string().max(10000).optional().default(''),
  }),
});

module.exports = {
  createProblemSchema,
  updateProblemSchema,
  listProblemsSchema,
  submitSchema,
  idParamSchema,
  playgroundRunSchema,
};
