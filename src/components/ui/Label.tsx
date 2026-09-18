import { LabelHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Label — Carbon field label: `label-01` (12px) in secondary text, sitting
 * 8px above its control. Disabled state follows the field via `aria-disabled`.
 */
export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'mb-tsinelas-03 inline-block text-tsinelas-text-secondary tsinelas-label-01 aria-disabled:text-tsinelas-text-disabled',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export default Label;
