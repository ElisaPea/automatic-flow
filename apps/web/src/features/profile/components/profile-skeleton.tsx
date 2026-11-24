import { Card, Skeleton, Stack } from '@af/ui';

export const ProfileSkeleton = () => (
  <Card>
    <Stack gap="sm">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-10 w-full" />
    </Stack>
  </Card>
);
