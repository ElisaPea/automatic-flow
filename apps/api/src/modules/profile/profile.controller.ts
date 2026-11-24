import { updateProfileSchema, type Profile, type UpdateProfileInput } from '@af/schemas';
import {
  Authorized,
  CurrentUser,
  Get,
  JsonController,
  Patch,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import type { AuthUser } from '../../core/auth/auth-user';
import { ZodBody } from '../../core/validation/zod-params';
import { noStore } from '../../middlewares/cache-control.middleware';
import { ProfileService } from './profile.service';

/** Controller fino: recibe datos ya validados y delega en el servicio. */
@Service()
@Authorized()
@JsonController('/v1/profile')
@UseBefore(noStore)
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('/me')
  me(@CurrentUser({ required: true }) user: AuthUser): Promise<Profile> {
    return this.service.getMe(user.userId);
  }

  @Patch('/me')
  update(
    @CurrentUser({ required: true }) user: AuthUser,
    @ZodBody(updateProfileSchema) input: UpdateProfileInput,
  ): Promise<Profile> {
    return this.service.update(user.userId, input);
  }
}
