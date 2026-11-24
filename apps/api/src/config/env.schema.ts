import { z } from 'zod';

const bool = z
  .enum(['true', 'false'])
  .default('true')
  .transform((v) => v === 'true');

const csv = z
  .string()
  .default('')
  .transform((v) =>
    v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    LOG_LEVEL: z
      .enum(['silent', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'])
      .default('info'),

    DATABASE_URL: z.string().url(),
    DB_POOL_MAX: z.coerce.number().int().min(1).max(50).default(5),
    DB_SSL: bool,
    DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),

    CLERK_SECRET_KEY: z.string().startsWith('sk_'),
    CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_'),

    CORS_ORIGINS: csv,
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(9000),
    BODY_LIMIT: z.string().default('100kb'),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
    RATE_LIMIT_WINDOW_S: z.coerce.number().int().positive().default(60),

    CACHE_DRIVER: z.enum(['memory', 'upstash', 'none']).default('memory'),
    CACHE_MEMORY_MAX_ENTRIES: z.coerce.number().int().positive().default(1000),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  })
  .refine(
    (e) => e.CACHE_DRIVER !== 'upstash' || (e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN),
    { message: 'CACHE_DRIVER=upstash requiere UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN' },
  );

export type Env = z.infer<typeof envSchema>;
