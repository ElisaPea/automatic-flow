// Mantener sincronizado con packages/ui/src/styles.css
export const colors = {
  brand: '#4f46e5',
  brandFg: '#ffffff',
  surface: '#ffffff',
  surfaceMuted: '#f4f4f5',
  fg: '#18181b',
  fgMuted: '#71717a',
  border: '#e4e4e7',
  danger: '#dc2626',
  dangerBg: '#fef2f2',
  success: '#16a34a',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const;
export const radius = 10;

export type Spacing = keyof typeof spacing;
