const { z } = require('zod');
const { objectIdSchema } = require('../../utils/object-id');

const markReadSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

module.exports = { markReadSchema };
