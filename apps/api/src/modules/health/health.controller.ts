import type { Health } from '@af/schemas';
import type { Response } from 'express';
import { Get, JsonController, Res, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { DatabaseService } from '../../core/db/database.service';
import { noStore } from '../../middlewares/cache-control.middleware';

@Service()
@JsonController('/health')
@UseBefore(noStore)
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  /** Liveness: no toca dependencias, siempre rápido. */
  @Get('/')
  live(): Health {
    return { status: 'ok', uptime: process.uptime() };
  }

  /** Readiness: comprueba dependencias. 503 si alguna falla (nunca 500). */
  @Get('/ready')
  async ready(@Res() res: Response): Promise<Health> {
    const dbUp = await this.db.ping();
    if (!dbUp) res.status(503);
    return {
      status: dbUp ? 'ok' : 'degraded',
      uptime: process.uptime(),
      checks: { database: dbUp ? 'up' : 'down' },
    };
  }
}
