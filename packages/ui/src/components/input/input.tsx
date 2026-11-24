import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = ({ invalid, className, ...rest }: InputProps) => (
  <input
    aria-invalid={invalid}
    className={cn(
      'h-10 w-full rounded-ui border bg-surface px-3 text-fg outline-none transition',
      'focus:ring-2 focus:ring-brand/40',
      invalid ? 'border-danger' : 'border-border',
      className,
    )}
    {...rest}
  />
);
