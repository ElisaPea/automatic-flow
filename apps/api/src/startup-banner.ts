const box = (lines: string[]): string => {
  const width = Math.max(...lines.map((l) => l.length)) + 2;
  const border = '─'.repeat(width);
  const body = lines.map((l) => `│ ${l.padEnd(width - 1)}│`).join('\n');
  return `\n┌${border}┐\n${body}\n└${border}┘\n\n`;
};

/** Banner visible al arrancar (stdout directo para que destaque sobre los logs JSON). */
export const printStartupBanner = (name: string, port: number): void => {
  const url = `http://localhost:${port}`;
  process.stdout.write(
    box([`${name} lista`, `Puerto: ${port}`, `URL:    ${url}`, `Health: ${url}/health`]),
  );
};

/** Aviso cuando arranca sin configuración válida (todas las rutas responden 503). */
export const printConfigErrorBanner = (port: number, issues: string[]): void => {
  process.stderr.write(
    box([
      `✖ API en puerto ${port} SIN configuración válida → responde 503`,
      '',
      ...issues.map((i) => `• ${i}`),
      '',
      'Edita apps/api/.env.local y reinicia (pnpm dev:api)',
    ]),
  );
};
