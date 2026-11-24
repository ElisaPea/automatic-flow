export const buttonVariants = {
  primary: 'bg-brand text-brand-fg hover:opacity-90',
  secondary: 'bg-surface-muted text-fg hover:bg-border',
  ghost: 'bg-transparent text-fg hover:bg-surface-muted',
  danger: 'bg-danger text-white hover:opacity-90',
} as const;

export const buttonSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
