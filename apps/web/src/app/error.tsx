'use client';

import { ErrorState } from '@af/ui';
import { useEffect } from 'react';

/** Error boundary de segmento: la app nunca muestra una pantalla en blanco. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="mx-auto max-w-xl p-6">
      <ErrorState message="No hemos podido cargar esta sección." onRetry={reset} />
    </main>
  );
}
