import { Stack } from '@af/ui';
import { UserButton } from '@clerk/nextjs';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="font-semibold">Automatic Flow</span>
        <UserButton />
      </header>
      <main className="mx-auto max-w-3xl p-6">
        <Stack gap="lg">{children}</Stack>
      </main>
    </div>
  );
}
