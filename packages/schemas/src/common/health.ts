import { z } from 'zod';

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  uptime: z.number(),
  checks: z.record(z.string(), z.enum(['up', 'down'])).optional(),
});
export type Health = z.infer<typeof healthSchema>;
