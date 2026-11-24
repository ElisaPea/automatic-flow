import { ErrorState, Spinner } from '@af/ui-native';
import { useMyProfile } from '../hooks/use-my-profile';
import { ProfileCard } from './profile-card';

/** Decide qué pintar según el estado: carga, error con reintento o contenido. */
export const ProfileSection = () => {
  const { state, refetch } = useMyProfile();
  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'error') return <ErrorState message={state.message} onRetry={refetch} />;
  return <ProfileCard profile={state.data} />;
};
