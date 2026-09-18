import { InputHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Carbon field heights: sm 32, md 40 (default), lg 48. */
  size?: 'sm' | 'md' | 'lg';
  /** Draws the 2px error ring; pair with `aria-invalid` and a message. */
  invalid?: boolean;
}

const heights = {
  sm: 'h-tsinelas-container-02',
  md: 'h-tsinelas-container-03',
  lg: 'h-tsinelas-container-04',
};

/**
 * Input — Carbon text field: a filled box with a single bottom rule, no
 * radius, 16px side padding and a 2px inset focus ring. Lives on the
 * contextual `field` token so it re-tints inside `.tsinelas-layer-02`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', size = 'md', invalid = false, ...props },
    ref
  ) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || props['aria-invalid']}
      className={cn(
        'block w-full border-0 border-b border-tsinelas-border-strong bg-tsinelas-field px-tsinelas-05 text-tsinelas-text-primary tsinelas-body-compact-01 tsinelas-focus',
        'transition-[background-color,outline-color] duration-tsinelas-fast-01 ease-tsinelas-standard-productive',
        'placeholder:text-tsinelas-text-placeholder',
        'hover:bg-tsinelas-field-hover',
        'disabled:cursor-not-allowed disabled:border-transparent disabled:text-tsinelas-text-disabled disabled:hover:bg-tsinelas-field',
        'file:mr-tsinelas-03 file:border-0 file:bg-transparent file:text-tsinelas-text-primary',
        invalid && 'outline-2 outline-tsinelas-support-error',
        heights[size],
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export default Input;
