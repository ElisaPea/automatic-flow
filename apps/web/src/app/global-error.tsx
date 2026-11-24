'use client';

import { ErrorState } from '@af/ui';
import './globals.css';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto max-w-xl p-6">
          <ErrorState message="La aplicación ha encontrado un problema." onRetry={reset} />
        </main>
      </body>
    </html>
  );
}
