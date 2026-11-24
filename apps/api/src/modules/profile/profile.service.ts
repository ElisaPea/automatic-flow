import type { Profile, UpdateProfileInput } from '@af/schemas';
import { Inject, Service } from 'typedi';
import { CACHE, cacheAside, type CacheProvider } from '../../core/cache';
import { toProfile } from './profile.mapper';
import { ProfileRepository } from './profile.repository';

const TTL_SECONDS = 60;
const cacheKey = (clerkUserId: string) => `profile:${clerkUserId}`;

/** Lógica de negocio + caché. No conoce Express ni SQL. */
@Service()
export class ProfileService {
  constructor(
    private readonly repo: ProfileRepository,
    @Inject(CACHE) private readonly cache: CacheProvider,
  ) {}

  getMe(clerkUserId: string): Promise<Profile> {
    return cacheAside(this.cache, cacheKey(clerkUserId), TTL_SECONDS, async () => {
      const existing = await this.repo.findByClerkId(clerkUserId);
      return toProfile(existing ?? (await this.repo.ensure(clerkUserId)));
    });
  }

  async update(clerkUserId: string, input: UpdateProfileInput): Promise<Profile> {
    const profile = toProfile(await this.repo.upsertDisplayName(clerkUserId, input.displayName));
    await this.cache.set(cacheKey(clerkUserId), profile, TTL_SECONDS);
    return profile;
  }
}
