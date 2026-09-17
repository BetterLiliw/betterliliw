import { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

// Unified Variants aligned with Municipal Branding
type BadgeVariant =
  | 'primary' // Municipal Blue (Executive / Ordinances)
  | 'secondary' // Brand Orange (Resolutions / Contrast)
  | 'yellow' // Yellow (Executive Orders)
  | 'success' // Emerald (Active / Verified)
  | 'warning' // Amber (Pending / Notice)
  | 'error' // Rose (Closed / Cancelled)
  | 'slate' // Neutral (Admin / Metadata)
  | 'outline'; // Border only

interface BadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'className'
> {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean; // Accessibility: Adds a visual shape indicator alongside color
}

export function Badge({
  children,
  variant = 'primary',
  className,
  dot = false,
  ...props
}: BadgeProps) {
  // High-contrast color mapping using Tsinelas semantic tokens (WCAG 2.1 Level AA Compliant)
  const variants = {
    primary:
      'bg-tsinelas-bg-brand-weak text-tsinelas-text-brand border-tsinelas-border-brand',
    secondary:
      'bg-tsinelas-bg-accent-orange-weak text-tsinelas-text-accent-orange border-tsinelas-border-warning',
    yellow: 'bg-tsinelas-yellow-50 text-tsinelas-yellow-700 border-tsinelas-yellow-600',
    success:
      'bg-tsinelas-bg-success-weak text-tsinelas-text-success border-tsinelas-border-success',
    warning:
      'bg-tsinelas-bg-warning-weak text-tsinelas-text-warning border-tsinelas-border-warning',
    error:
      'bg-tsinelas-bg-danger-weak text-tsinelas-text-danger border-tsinelas-border-danger',
    slate:
      'bg-tsinelas-bg-surface-raised text-tsinelas-text-support border-tsinelas-border-weak',
    outline: 'bg-transparent text-tsinelas-text-support border-tsinelas-border-weak',
  };

  const dotColors = {
    primary: 'bg-tsinelas-bg-brand-default',
    secondary: 'bg-tsinelas-bg-accent-orange-default',
    yellow: 'bg-tsinelas-yellow-600',
    success: 'bg-tsinelas-bg-success-default',
    warning: 'bg-tsinelas-bg-warning-default',
    error: 'bg-tsinelas-bg-danger-default',
    slate: 'bg-tsinelas-bg-surface-raised',
    outline: 'bg-tsinelas-bg-surface-raised',
  };

  return (
    <span
      {...props}
      className={cn(
        // text-[10px] with font-bold ensures legibility while remaining compact
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase transition-all',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 shrink-0 rounded-full',
            dotColors[variant]
          )}
          aria-hidden='true'
        />
      )}
      {children}
    </span>
  );
}
