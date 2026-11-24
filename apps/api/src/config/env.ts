import { Token } from 'typedi';
import { envSchema, type Env } from './env.schema';

export type { Env } from './env.schema';

/** Token DI para inyectar la configuración validada. */
export const ENV = new Token<Env>('env');

export type EnvResult = { ok: true; env: Env } | { ok: false; issues: string[] };

const PLACEHOLDER = /<[^>]+>/;

/** Valores de plantilla sin rellenar (p.ej. sk_test_<CLERK_SECRET_KEY>). */
const findPlaceholders = (source: NodeJS.ProcessEnv): string[] =>
  Object.keys(envSchema.def.shape ?? {})
    .filter((key) => PLACEHOLDER.test(source[key] ?? ''))
    .map((key) => `${key}: contiene un valor de plantilla sin rellenar`);

export const loadEnv = (source: NodeJS.ProcessEnv = process.env): EnvResult => {
  const placeholders = findPlaceholders(source);
  const parsed = envSchema.safeParse(source);
  const issues = parsed.success
    ? []
    : parsed.error.issues.map((i) => `${i.path.join('.') || 'env'}: ${i.message}`);
  const all = [...placeholders, ...issues];
  if (parsed.success && all.length === 0) return { ok: true, env: parsed.data };
  return { ok: false, issues: all };
};
