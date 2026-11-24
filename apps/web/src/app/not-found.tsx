import { Button, EmptyState } from '@af/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <EmptyState
        title="Página no encontrada"
        description="La página que buscas no existe o se ha movido."
        action={
          <Link href="/">
            <Button variant="secondary">Volver al inicio</Button>
          </Link>
        }
      />
    </main>
  );
}
