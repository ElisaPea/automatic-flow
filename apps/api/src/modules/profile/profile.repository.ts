import { Service } from 'typedi';
import { DatabaseService } from '../../core/db/database.service';
import type { ProfileRow } from './profile.types';

const COLUMNS = 'id, clerk_user_id, display_name, created_at, updated_at';

/** Solo SQL. Sin lógica de negocio ni caché. */
@Service()
export class ProfileRepository {
  constructor(private readonly db: DatabaseService) {}

  findByClerkId(clerkUserId: string) {
    return this.db.one<ProfileRow>(`SELECT ${COLUMNS} FROM profiles WHERE clerk_user_id = $1`, [
      clerkUserId,
    ]);
  }

  /** Crea si no existe (idempotente, seguro ante peticiones concurrentes). */
  async ensure(clerkUserId: string): Promise<ProfileRow> {
    const row = await this.db.one<ProfileRow>(
      `INSERT INTO profiles (clerk_user_id) VALUES ($1)
       ON CONFLICT (clerk_user_id) DO UPDATE SET clerk_user_id = EXCLUDED.clerk_user_id
       RETURNING ${COLUMNS}`,
      [clerkUserId],
    );
    if (!row) throw new Error('ensure profile returned no row');
    return row;
  }

  async upsertDisplayName(clerkUserId: string, displayName: string): Promise<ProfileRow> {
    const row = await this.db.one<ProfileRow>(
      `INSERT INTO profiles (clerk_user_id, display_name) VALUES ($1, $2)
       ON CONFLICT (clerk_user_id)
       DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = now()
       RETURNING ${COLUMNS}`,
      [clerkUserId, displayName],
    );
    if (!row) throw new Error('upsert profile returned no row');
    return row;
  }
}
