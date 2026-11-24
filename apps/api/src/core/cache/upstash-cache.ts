import type { CacheProvider } from './cache.provider';

type Command = (string | number)[];

/**
 * Redis vía REST de Upstash usando fetch: sin conexiones TCP persistentes,
 * ideal para serverless y válido también en una instancia clásica.
 */
export class UpstashCache implements CacheProvider {
  readonly name = 'upstash';

  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const [raw] = await this.pipeline([['GET', key]]);
    return typeof raw === 'string' ? (JSON.parse(raw) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.pipeline([['SET', key, JSON.stringify(value), 'EX', ttlSeconds]]);
  }

  async del(key: string): Promise<void> {
    await this.pipeline([['DEL', key]]);
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    const [count] = await this.pipeline([
      ['INCR', key],
      ['EXPIRE', key, ttlSeconds, 'NX'],
    ]);
    return Number(count);
  }

  private async pipeline(commands: Command[]): Promise<unknown[]> {
    const res = await fetch(`${this.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
    const data = (await res.json()) as { result?: unknown; error?: string }[];
    return data.map((d) => d.result ?? null);
  }
}
