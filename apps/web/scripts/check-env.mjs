// Valida el entorno ANTES de arrancar Next: un error claro en consola
// en lugar de un "Internal Server Error" sin contexto en el navegador.
import { existsSync } from 'node:fs';

const ENV_FILE = '.env.local';
const REQUIRED = {
  NEXT_PUBLIC_API_URL: 'URL de la API (p.ej. http://localhost:4000)',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'Clerk → API Keys → Publishable key (pk_...)',
  CLERK_SECRET_KEY: 'Clerk → API Keys → Secret key (sk_...)',
};

const isPlaceholder = (v) => v.includes('<') || v.includes('>');

/** Devuelve la lista de problemas (vacía si todo está bien). */
export const checkEnv = () => {
  if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);
  else if (!process.env.CI)
    return [`Falta apps/web/${ENV_FILE} → cp .env.development.example ${ENV_FILE}`];
  return Object.entries(REQUIRED)
    .filter(([key]) => !process.env[key] || isPlaceholder(process.env[key]))
    .map(([key, hint]) => `${key} sin valor real → ${hint}`);
};

export const printEnvProblems = (problems) => {
  const lines = [
    '✖ La WEB no puede arrancar: configuración incompleta',
    '',
    ...problems.map((p) => `• ${p}`),
  ];
  lines.push('', `Edita apps/web/${ENV_FILE} y vuelve a lanzar pnpm dev:web`);
  process.stderr.write(`\n${lines.join('\n')}\n\n`);
};
