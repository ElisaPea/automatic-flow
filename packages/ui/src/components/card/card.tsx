import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-ui border border-border bg-surface p-6', className)} {...rest} />
);
