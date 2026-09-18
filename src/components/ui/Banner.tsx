import { ReactNode } from 'react';

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button, ButtonSize, ButtonVariant } from './Button';

export type BannerType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface BannerCta {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export interface BannerProps {
  title?: ReactNode;
  description?: ReactNode;
  type?: BannerType;
  /** Show the status icon. Carbon always shows one for status kinds; pass
   * `false` for a plain callout. */
  icon?: boolean;
  cta?: BannerCta | BannerCta[];
  className?: string;
  onDismiss?: () => void;
  /** Kept from the previous API; maps onto the heading tokens. */
  titleSize?: 'sm' | 'md' | 'lg';
}

const kinds: Record<
  BannerType,
  {
    container: string;
    icon: string;
    Icon: typeof InfoIcon;
    role: 'status' | 'alert';
  }
> = {
  success: {
    container:
      'bg-tsinelas-notification-background-success border-l-tsinelas-support-success',
    icon: 'text-tsinelas-support-success',
    Icon: CheckCircle2Icon,
    role: 'status',
  },
  error: {
    container:
      'bg-tsinelas-notification-background-error border-l-tsinelas-support-error',
    icon: 'text-tsinelas-support-error',
    Icon: XCircleIcon,
    role: 'alert',
  },
  warning: {
    container:
      'bg-tsinelas-notification-background-warning border-l-tsinelas-support-warning',
    icon: 'text-tsinelas-support-warning',
    Icon: AlertTriangleIcon,
    role: 'alert',
  },
  info: {
    container:
      'bg-tsinelas-notification-background-info border-l-tsinelas-support-info',
    icon: 'text-tsinelas-support-info',
    Icon: InfoIcon,
    role: 'status',
  },
  default: {
    container:
      'bg-tsinelas-notification-background-default border-l-tsinelas-border-strong-01',
    icon: 'text-tsinelas-icon-secondary',
    Icon: InfoIcon,
    role: 'status',
  },
};

const titleSizes = {
  sm: 'tsinelas-heading-compact-01',
  md: 'tsinelas-heading-compact-02',
  lg: 'tsinelas-heading-03',
};

/**
 * Banner — Carbon's inline notification: a low-contrast fill, a 3px status
 * edge on the left, a 20px status icon, title + subtitle, optional actions
 * and a ghost close control. Status kinds announce via `role`.
 */
export const Banner = ({
  title,
  description,
  type = 'default',
  icon = true,
  cta,
  className,
  onDismiss,
  titleSize = 'md',
}: BannerProps) => {
  const kind = kinds[type];
  const ctas = cta ? (Array.isArray(cta) ? cta : [cta]) : [];

  return (
    <div
      role={kind.role}
      className={cn(
        'relative flex min-h-tsinelas-container-04 w-full items-start gap-tsinelas-05 border border-tsinelas-border-subtle-00 border-l-[3px] py-tsinelas-04 pl-tsinelas-04',
        onDismiss ? 'pr-tsinelas-09' : 'pr-tsinelas-05',
        kind.container,
        className
      )}
    >
      {icon && (
        <kind.Icon
          className={cn('mt-[1px] size-tsinelas-icon-02 shrink-0', kind.icon)}
          aria-hidden='true'
        />
      )}

      <div className='flex min-w-0 flex-1 flex-col gap-tsinelas-02 md:flex-row md:flex-wrap md:items-center md:gap-x-tsinelas-06'>
        <div className='min-w-0 flex-1'>
          {title && (
            <p
              className={cn(
                'text-tsinelas-text-primary',
                titleSizes[titleSize],
                description ? 'mb-tsinelas-01' : ''
              )}
            >
              {title}
            </p>
          )}
          {description && (
            <p className='text-tsinelas-text-primary tsinelas-body-compact-01'>
              {description}
            </p>
          )}
        </div>

        {ctas.length > 0 && (
          <div className='flex shrink-0 flex-wrap gap-tsinelas-03'>
            {ctas.map((action, index) =>
              action.href ? (
                <a
                  key={index}
                  href={action.href}
                  className='inline-flex min-h-tsinelas-container-02 items-center px-tsinelas-04 text-tsinelas-link-primary tsinelas-body-compact-01 tsinelas-focus hover:bg-tsinelas-background-hover hover:text-tsinelas-link-primary-hover'
                >
                  {action.label}
                </a>
              ) : (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant ?? 'ghost'}
                  size={action.size ?? 'sm'}
                >
                  {action.label}
                </Button>
              )
            )}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type='button'
          onClick={onDismiss}
          aria-label='Dismiss notification'
          className='absolute top-0 right-0 flex size-tsinelas-container-04 items-center justify-center text-tsinelas-icon-primary tsinelas-focus hover:bg-tsinelas-background-hover active:bg-tsinelas-background-active'
        >
          <XIcon className='size-tsinelas-icon-01' aria-hidden='true' />
        </button>
      )}
    </div>
  );
};

export default Banner;
