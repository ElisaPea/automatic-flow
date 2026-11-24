import { z } from 'zod';

export const profileSchema = z.object({
  id: z.uuid(),
  clerkUserId: z.string(),
  displayName: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Profile = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
