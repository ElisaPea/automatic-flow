import { Spinner } from '@af/ui-native';
import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <Spinner />;
  if (!isSignedIn) return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
