import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Button kinds. `outline` is kept as an alias of Carbon's `tertiary` and
 * `link` as a text-only affordance; both came from the Kapwa API this
 * component replaced.
 */
export type ButtonVariant =
  | 'primary' // Deep Navy fill — the default action
  | 'secondary' // Lake Teal fill — the alternative action beside a primary
  | 'tertiary' // navy outline, fills on hover
  | 'outline' // alias of tertiary
  | 'danger' // destructive
  | 'accent' // Sunrise Gold with a navy label — one per screen
  | 'ghost' // no fill; toolbars, dense rows
  | 'link'; // inline text link styled as a button

/** Carbon heights: sm 32, md 40 (field height, the default), lg 48, xl 64. */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  /** Rendered before the label. Carbon places icons on the right; use
   * `rightIcon` unless the icon is part of the label's meaning. */
  leftIcon?: ReactNode;
  /** Rendered at the far right edge, 16px in, as Carbon does. */
  rightIcon?: ReactNode;
  /** Square icon-only button; `children` should then be an icon and
   * `aria-label` is required. */
  iconOnly?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-tsinelas-button-primary text-tsinelas-text-on-color hover:bg-tsinelas-button-primary-hover active:bg-tsinelas-button-primary-active tsinelas-focus-inset',
  secondary:
    'bg-tsinelas-button-secondary text-tsinelas-text-on-color hover:bg-tsinelas-button-secondary-hover active:bg-tsinelas-button-secondary-active tsinelas-focus-inset',
  tertiary:
    'bg-transparent text-tsinelas-button-tertiary shadow-[inset_0_0_0_1px_var(--color-tsinelas-button-tertiary)] hover:bg-tsinelas-button-tertiary-hover hover:text-tsinelas-text-on-color hover:shadow-none active:bg-tsinelas-button-tertiary-active',
  outline:
    'bg-transparent text-tsinelas-button-tertiary shadow-[inset_0_0_0_1px_var(--color-tsinelas-button-tertiary)] hover:bg-tsinelas-button-tertiary-hover hover:text-tsinelas-text-on-color hover:shadow-none active:bg-tsinelas-button-tertiary-active',
  danger:
    'bg-tsinelas-button-danger-primary text-tsinelas-text-on-color hover:bg-tsinelas-button-danger-hover active:bg-tsinelas-button-danger-active tsinelas-focus-inset',
  accent:
    'bg-tsinelas-button-accent text-tsinelas-text-on-accent hover:bg-tsinelas-button-accent-hover active:bg-tsinelas-button-accent-active active:text-tsinelas-text-on-color',
  ghost:
    'bg-transparent text-tsinelas-link-primary hover:bg-tsinelas-background-hover hover:text-tsinelas-link-primary-hover active:bg-tsinelas-background-active',
  link: 'bg-transparent text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline',
};

/* Carbon pads the right edge for the icon slot on filled and outlined
 * kinds; ghost and link are padded evenly. */
const sizes: Record<ButtonSize, { box: string; padded: string; even: string }> =
  {
    sm: {
      box: 'min-h-tsinelas-container-02 tsinelas-body-compact-01',
      padded: 'pl-tsinelas-04 pr-[3.75rem]',
      even: 'px-tsinelas-04',
    },
    md: {
      box: 'min-h-tsinelas-container-03 tsinelas-body-compact-01',
      padded: 'pl-tsinelas-04 pr-[3.75rem]',
      even: 'px-tsinelas-04',
    },
    lg: {
      box: 'min-h-tsinelas-container-04 tsinelas-body-compact-01',
      padded: 'pl-[0.9375rem] pr-[3.9375rem]',
      even: 'px-tsinelas-05',
    },
    xl: {
      box: 'min-h-tsinelas-container-05 tsinelas-body-compact-01 items-start pt-tsinelas-05',
      padded: 'pl-[0.9375rem] pr-[3.9375rem]',
      even: 'px-tsinelas-05',
    },
  };

const iconOnlySizes: Record<ButtonSize, string> = {
  sm: 'size-tsinelas-container-02',
  md: 'size-tsinelas-container-03',
  lg: 'size-tsinelas-container-04',
  xl: 'size-tsinelas-container-05',
};

/**
 * Button — Carbon anatomy on the Tsinelas palette.
 *
 * Sharp corners, label aligned left, the icon (if any) pinned to the right
 * edge, fixed heights from the container scale, and a 2px inset focus ring
 * that never shifts layout. Text is capped at 320px wide like Carbon unless
 * `fullWidth` is set.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const even = variant === 'ghost' || variant === 'link';
    const isLink = variant === 'link';

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'relative inline-flex items-center gap-tsinelas-03 text-left align-top tsinelas-focus',
          'transition-[background-color,color,box-shadow] duration-tsinelas-fast-01 ease-tsinelas-standard-productive',
          'disabled:cursor-not-allowed',
          isLink
            ? 'h-auto p-0 disabled:text-tsinelas-text-disabled'
            : cn(
                'disabled:bg-tsinelas-button-disabled disabled:text-tsinelas-text-on-color-disabled disabled:shadow-none',
                iconOnly
                  ? cn('justify-center', iconOnlySizes[size])
                  : cn(
                      'justify-between',
                      sizes[size].box,
                      even ? sizes[size].even : sizes[size].padded,
                      fullWidth ? 'w-full max-w-none' : 'max-w-xs'
                    )
              ),
          variants[variant],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <svg
            className='size-tsinelas-icon-01 shrink-0 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className='inline-flex shrink-0' aria-hidden='true'>
            {leftIcon}
          </span>
        )}
        {iconOnly ? (
          children
        ) : (
          <span className='min-w-0 flex-1'>{children}</span>
        )}
        {!isLoading && rightIcon && (
          <span
            className={cn(
              'inline-flex shrink-0',
              !even &&
                !iconOnly &&
                'absolute top-1/2 right-tsinelas-05 -translate-y-1/2'
            )}
            aria-hidden='true'
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
