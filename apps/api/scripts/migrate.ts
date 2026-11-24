/* Aplica en orden los .sql de supabase/migrations que aún no se hayan aplicado. */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Client } from 'pg';

const MIGRATIONS_DIR = join(__dirname, '../../../supabase/migrations');

const pending = async (client: Client): Promise<string[]> => {
  await client.query(
    'create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())',
  );
  const { rows } = await client.query<{ name: string }>('select name from _migrations');
  const applied = new Set(rows.map((r) => r.name));
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort();
  return files.filter((f) => !applied.has(f));
};

const apply = async (client: Client, file: string): Promise<void> => {
  const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf8');
  await client.query('begin');
  try {
    await client.query(sql);
    await client.query('insert into _migrations (name) values ($1)', [file]);
    await client.query('commit');
    process.stdout.write(`✔ ${file}\n`);
  } catch (err) {
    await client.query('rollback');
    throw err;
  }
};

const main = async () => {
  const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('Define DATABASE_URL (o DATABASE_MIGRATION_URL)');
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const files = await pending(client);
    if (files.length === 0) process.stdout.write('Sin migraciones pendientes\n');
    for (const file of files) await apply(client, file);
  } finally {
    await client.end();
  }
};

main().catch((err: unknown) => {
  process.stderr.write(`Migración fallida: ${String(err)}\n`);
  process.exit(1);
});
