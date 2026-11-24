import { cn } from '../../lib/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Cargando"
    className={cn(
      'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
      size === 'sm' ? 'size-4' : 'size-6',
      className,
    )}
  />
);
