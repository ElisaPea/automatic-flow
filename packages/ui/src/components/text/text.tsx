import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const tones = { default: 'text-fg', muted: 'text-fg-muted', danger: 'text-danger' } as const;

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: keyof typeof tones;
  size?: 'sm' | 'md';
}

export const Text = ({ tone = 'default', size = 'md', className, ...rest }: TextProps) => (
  <p className={cn(tones[tone], size === 'sm' ? 'text-sm' : 'text-base', className)} {...rest} />
);
