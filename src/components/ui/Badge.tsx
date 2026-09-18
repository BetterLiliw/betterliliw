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
  /** Carbon tag sizes: md 24px (default), sm 18px. */
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'primary',
  className,
  dot = false,
  size = 'md',
  ...props
}: BadgeProps) {
  // Carbon tag pairs: a tinted fill with a deep text of the same hue, no
  // border. Every pair clears 4.5:1 (WCAG 2.1 AA).
  const variants = {
    primary: 'bg-tsinelas-tag-background-navy text-tsinelas-tag-color-navy',
    secondary: 'bg-tsinelas-tag-background-gold text-tsinelas-tag-color-gold',
    yellow: 'bg-tsinelas-tag-background-yellow text-tsinelas-tag-color-yellow',
    success: 'bg-tsinelas-tag-background-green text-tsinelas-tag-color-green',
    warning: 'bg-tsinelas-tag-background-gold text-tsinelas-tag-color-gold',
    error: 'bg-tsinelas-tag-background-red text-tsinelas-tag-color-red',
    slate: 'bg-tsinelas-tag-background-gray text-tsinelas-tag-color-gray',
    outline:
      'bg-transparent text-tsinelas-text-secondary shadow-[inset_0_0_0_1px_var(--color-tsinelas-border-subtle-01)]',
  };

  const dotColors = {
    primary: 'bg-tsinelas-tag-color-navy',
    secondary: 'bg-tsinelas-tag-color-gold',
    yellow: 'bg-tsinelas-tag-color-yellow',
    success: 'bg-tsinelas-tag-color-green',
    warning: 'bg-tsinelas-tag-color-gold',
    error: 'bg-tsinelas-tag-color-red',
    slate: 'bg-tsinelas-tag-color-gray',
    outline: 'bg-tsinelas-icon-secondary',
  };

  return (
    <span
      {...props}
      className={cn(
        // Carbon tag anatomy: 24px pill, label-01 text, 8px side padding.
        'inline-flex max-w-full items-center gap-tsinelas-02 rounded-full px-tsinelas-03 tsinelas-label-01 whitespace-nowrap',
        size === 'sm' ? 'h-[1.125rem]' : 'h-tsinelas-container-01',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'size-tsinelas-03 shrink-0 rounded-full',
            dotColors[variant]
          )}
          aria-hidden='true'
        />
      )}
      {children}
    </span>
  );
}
