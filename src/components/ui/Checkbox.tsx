import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label: ReactNode;
  /** Secondary text after the label, e.g. a count. */
  hint?: ReactNode;
}

/**
 * Checkbox — Carbon checkbox: a 16px box on the interactive color with the
 * label to its right on a 24px line; the whole row is the hit target.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hint, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex min-h-tsinelas-container-01 cursor-pointer items-center gap-tsinelas-03 text-tsinelas-text-primary tsinelas-body-compact-01',
          disabled && 'cursor-not-allowed text-tsinelas-text-disabled',
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type='checkbox'
          disabled={disabled}
          className='size-tsinelas-icon-01 shrink-0 cursor-pointer accent-tsinelas-interactive tsinelas-focus disabled:cursor-not-allowed'
          {...props}
        />
        <span>
          {label}
          {hint !== undefined && (
            <span className='ml-tsinelas-02 text-tsinelas-text-helper tsinelas-label-01'>
              {hint}
            </span>
          )}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
