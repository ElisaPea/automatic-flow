import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const sizes = { 1: 'text-3xl', 2: 'text-2xl', 3: 'text-xl' } as const;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: keyof typeof sizes;
}

export const Heading = ({ level = 2, className, ...rest }: HeadingProps) => {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn('font-semibold tracking-tight text-fg', sizes[level], className)}
      {...rest}
    />
  );
};
