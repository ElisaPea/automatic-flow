// Arranca `next dev`, espera a que responda, muestra el puerto y abre Chrome.
// Variables: PORT (por defecto 3000), OPEN_BROWSER=false para no abrir el navegador.
import { spawn } from 'node:child_process';
import { checkEnv, printEnvProblems } from './check-env.mjs';

const problems = checkEnv();
if (problems.length > 0) {
  printEnvProblems(problems);
  process.exit(1);
}

const PORT = Number(process.env.PORT ?? 3000);
const URL = `http://localhost:${PORT}`;
const READY_TIMEOUT_MS = 60_000;
const POLL_MS = 500;
const isWin = process.platform === 'win32';

const next = spawn('next', ['dev', '--port', String(PORT)], { stdio: 'inherit', shell: isWin });
next.on('exit', (code) => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => next.kill(sig));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// La primera petición además precompila "/" → Chrome abre la página ya lista.
const waitUntilReady = async () => {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const ok = await fetch(URL, { signal: AbortSignal.timeout(30_000) }).then(
      () => true,
      () => false,
    );
    if (ok) return true;
    await sleep(POLL_MS);
  }
  return false;
};

const run = (cmd, args) =>
  new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'ignore', shell: isWin });
    p.on('error', () => resolve(false));
    p.on('exit', (code) => resolve(code === 0));
  });

// Chrome si está instalado; si no, el navegador por defecto.
const openChrome = async () => {
  if (process.platform === 'darwin')
    return (await run('open', ['-a', 'Google Chrome', URL])) || run('open', [URL]);
  if (isWin) return run('cmd', ['/c', 'start', 'chrome', URL]);
  return (await run('google-chrome', [URL])) || run('xdg-open', [URL]);
};

const banner = () => {
  const lines = ['WEB lista', `Puerto: ${PORT}`, `URL:    ${URL}`];
  const width = Math.max(...lines.map((l) => l.length)) + 2;
  const border = '─'.repeat(width);
  const body = lines.map((l) => `│ ${l.padEnd(width - 1)}│`).join('\n');
  process.stdout.write(`\n┌${border}┐\n${body}\n└${border}┘\n\n`);
};

const ready = await waitUntilReady();
if (!ready) {
  process.stderr.write(`⚠ La web no respondió en ${READY_TIMEOUT_MS / 1000}s en ${URL}\n`);
} else {
  banner();
  if (process.env.OPEN_BROWSER !== 'false' && !(await openChrome()))
    process.stderr.write(`⚠ No se pudo abrir el navegador. Abre ${URL} manualmente.\n`);
}
