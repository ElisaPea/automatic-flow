import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from '../spinner/spinner';
import {
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from './button.variants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    type="button"
    disabled={disabled || loading}
    aria-busy={loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-ui font-medium transition',
      'disabled:cursor-not-allowed disabled:opacity-60',
      buttonVariants[variant],
      buttonSizes[size],
      className,
    )}
    {...rest}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);
