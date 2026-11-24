import type { PoolClient, QueryResultRow } from 'pg';
import { Inject, Service } from 'typedi';
import { ENV, type Env } from '../../config/env';
import { mapPgError } from '../errors/pg-error';
import { getPool } from './pool';

export type Queryable = Pick<PoolClient, 'query'>;

/** Acceso a Postgres. Todos los errores salen ya traducidos a AppError. */
@Service()
export class DatabaseService {
  constructor(@Inject(ENV) private readonly env: Env) {}

  async query<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
    try {
      const result = await getPool(this.env).query<T>(sql, params);
      return result.rows;
    } catch (err) {
      throw mapPgError(err) ?? err;
    }
  }

  async one<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async transaction<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
    const client = await getPool(this.env)
      .connect()
      .catch((err: unknown) => Promise.reject(mapPgError(err) ?? err));
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw mapPgError(err) ?? err;
    } finally {
      client.release();
    }
  }

  async ping(): Promise<boolean> {
    return this.query('SELECT 1').then(
      () => true,
      () => false,
    );
  }
}
