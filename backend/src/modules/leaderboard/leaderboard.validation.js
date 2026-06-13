const { z } = require('zod');

const listLeaderboardSchema = z.object({
  query: z.object({
    scope: z.enum(['global', 'quiz', 'coding']).default('global'),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

module.exports = { listLeaderboardSchema };
