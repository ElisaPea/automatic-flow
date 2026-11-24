import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

// Clases literales: Tailwind no detecta clases construidas dinámicamente.
const gaps = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-10' } as const;
const aligns = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: keyof typeof gaps;
  align?: keyof typeof aligns;
}

export const Stack = ({
  direction = 'column',
  gap = 'md',
  align,
  className,
  ...rest
}: StackProps) => (
  <div
    className={cn(
      'flex',
      direction === 'row' ? 'flex-row' : 'flex-col',
      gaps[gap],
      align && aligns[align],
      className,
    )}
    {...rest}
  />
);
