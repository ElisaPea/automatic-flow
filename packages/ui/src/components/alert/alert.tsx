import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

const tones = {
  danger: 'bg-danger-bg text-danger border-danger/30',
  success: 'bg-success-bg text-success border-success/30',
  info: 'bg-surface-muted text-fg border-border',
} as const;

export interface AlertProps {
  tone?: keyof typeof tones;
  children: ReactNode;
}

export const Alert = ({ tone = 'info', children }: AlertProps) => (
  <div
    role={tone === 'danger' ? 'alert' : 'status'}
    className={cn('rounded-ui border p-3 text-sm', tones[tone])}
  >
    {children}
  </div>
);
