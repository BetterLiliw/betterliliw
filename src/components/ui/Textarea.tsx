import { TextareaHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Draws the 2px error ring; pair with `aria-invalid` and a message. */
  invalid?: boolean;
}

/**
 * Textarea — Carbon text area: the Input recipe (filled box, bottom rule,
 * inset focus ring) with room for several lines and vertical resize only.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || props['aria-invalid']}
      className={cn(
        'block w-full resize-y border-0 border-b border-tsinelas-border-strong bg-tsinelas-field px-tsinelas-05 py-tsinelas-04 text-tsinelas-text-primary tsinelas-body-compact-01 tsinelas-focus',
        'transition-[background-color,outline-color] duration-tsinelas-fast-01 ease-tsinelas-standard-productive',
        'placeholder:text-tsinelas-text-placeholder',
        'hover:bg-tsinelas-field-hover',
        'disabled:cursor-not-allowed disabled:border-transparent disabled:text-tsinelas-text-disabled disabled:hover:bg-tsinelas-field',
        invalid && 'outline-2 outline-tsinelas-support-error',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export default Textarea;
