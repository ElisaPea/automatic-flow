import { Button, Heading, Stack, Text } from '@af/ui';
import { Show, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl items-center px-6">
      <Stack gap="lg">
        <Heading level={1}>Automatic Flow</Heading>
        <Text tone="muted">Monorepo web + mobile + API.</Text>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button>Iniciar sesión</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <Link href="/dashboard">
            <Button>Ir al dashboard</Button>
          </Link>
        </Show>
      </Stack>
    </main>
  );
}
