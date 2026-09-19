import { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types/components';

/**
 * 1. PageHero: Used in Layout files (centered, large)
 * Matches the "Portal" header style of BetterGov.ph
 */

export function PageHero({
  title,
  description,
  children,
  breadcrumb,
  metadata,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  metadata?: ReactNode;
}) {
  return (
    <header className='animate-in fade-in flex flex-col justify-center py-tsinelas-layout-03 text-center duration-700 md:py-tsinelas-layout-04'>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className='mb-tsinelas-04' aria-label='Breadcrumb'>
          <ol className='tsinelas-body-01 flex items-center justify-center gap-tsinelas-03'>
            {breadcrumb.map((crumb, index) => (
              <li key={crumb.href} className='flex items-center gap-2'>
                {index > 0 && (
                  <span className='text-tsinelas-text-weak' aria-hidden='true'>
                    /
                  </span>
                )}
                <a
                  href={crumb.href}
                  className={`${
                    index === breadcrumb.length - 1
                      ? 'text-tsinelas-text-strong font-medium'
                      : 'text-tsinelas-text-weak hover:text-tsinelas-text-link'
                  }`}
                  aria-current={
                    index === breadcrumb.length - 1 ? 'page' : undefined
                  }
                >
                  {crumb.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className='tsinelas-heading-xl mb-tsinelas-03 text-tsinelas-text-primary'>
        {title}
      </h1>
      {description && (
        <p className='tsinelas-body-02 mx-auto max-w-2xl text-tsinelas-text-secondary'>
          {description}
        </p>
      )}
      {metadata && (
        <div className='mt-tsinelas-04 flex items-center justify-center gap-tsinelas-03'>
          {metadata}
        </div>
      )}
      {children && <div className='mt-tsinelas-06'>{children}</div>}
    </header>
  );
}

/**
 * 2. ModuleHeader: Used in Index/List pages (left-aligned, compact)
 * Standardizes the title and search bar layout.
 */
export function ModuleHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className='mb-tsinelas-06 border-b border-tsinelas-border-subtle-00 pb-tsinelas-05'>
      <div className='flex flex-col justify-between gap-tsinelas-04 md:flex-row md:items-end'>
        <div className='max-w-2xl'>
          <h2 className='tsinelas-heading-lg text-tsinelas-text-primary'>
            {title}
          </h2>
          {description && (
            <p className='tsinelas-body-01 mt-tsinelas-02 text-tsinelas-text-secondary'>
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className='w-full shrink-0 md:w-auto'>{children}</div>
        )}
      </div>
    </div>
  );
}

/**
 * 3. DetailSection: Standard container for content blocks
 * Uses the BetterGov style: slate-50 header with uppercase label.
 */

type IconComponent = ComponentType<{ className?: string }>;

export function DetailSection({
  title,
  icon: Icon,
  children,
  className,
  variant = 'default',
}: {
  title: ReactNode;
  icon?: IconComponent;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted' | 'compact';
}) {
  const variants = {
    default: 'bg-tsinelas-layer-01 border border-tsinelas-border-subtle-00',
    highlighted:
      'bg-tsinelas-bg-surface-brand/30 border border-tsinelas-border-interactive',
    compact: 'bg-tsinelas-layer-01 border border-tsinelas-border-subtle-00',
  };

  const headerVariants = {
    default: 'bg-tsinelas-bg-surface-raised/50 border-tsinelas-border-weak',
    highlighted: 'bg-tsinelas-bg-surface-brand/50 border-tsinelas-border-brand',
    compact: 'bg-tsinelas-bg-surface-raised/30 border-tsinelas-border-weak',
  };

  return (
    <section
      data-variant={variant}
      className={cn(variants[variant], 'overflow-hidden', className)}
    >
      <div
        className={cn(
          headerVariants[variant],
          'flex min-h-tsinelas-container-03 items-center gap-tsinelas-03 border-b px-tsinelas-05 py-tsinelas-03'
        )}
      >
        {Icon && (
          <Icon className='size-tsinelas-icon-01 text-tsinelas-icon-interactive' />
        )}
        <div className='tsinelas-eyebrow flex flex-1 items-center justify-between text-tsinelas-text-secondary'>
          {title}
        </div>
      </div>
      <div className='p-tsinelas-05 md:p-tsinelas-06'>{children}</div>
    </section>
  );
}
