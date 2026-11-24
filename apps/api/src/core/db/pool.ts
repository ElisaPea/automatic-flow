import { Pool } from 'pg';
import type { Env } from '../../config/env';
import { logger } from '../logger/logger';

// En serverless el módulo se reutiliza entre invocaciones "calientes":
// guardamos el pool en globalThis para no abrir conexiones nuevas en cada request.
const globalForPool = globalThis as unknown as { __afPool?: Pool };

export const getPool = (env: Env): Pool => {
  if (globalForPool.__afPool) return globalForPool.__afPool;
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: env.DB_STATEMENT_TIMEOUT_MS,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
    allowExitOnIdle: true,
  });
  // Un error en un cliente inactivo no debe tumbar el proceso.
  pool.on('error', (err) => logger.error({ err }, 'pg pool idle client error'));
  globalForPool.__afPool = pool;
  return pool;
};

export const closePool = async (): Promise<void> => {
  await globalForPool.__afPool?.end();
  globalForPool.__afPool = undefined;
};
