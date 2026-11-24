import { Heading } from '@af/ui';
import { Suspense } from 'react';
import { ProfileSection } from '@/features/profile/components/profile-section';
import { ProfileSkeleton } from '@/features/profile/components/profile-skeleton';

export default function DashboardPage() {
  return (
    <>
      <Heading level={1}>Dashboard</Heading>
      {/* Streaming: la cabecera se pinta al instante y el perfil llega cuando esté listo. */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileSection />
      </Suspense>
    </>
  );
}
