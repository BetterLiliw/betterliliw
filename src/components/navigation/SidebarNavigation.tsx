import { ReactNode } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

// 1. The Outer Wrapper
export function SidebarContainer({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className='overflow-hidden border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01'>
      {title && (
        <div className='flex h-tsinelas-container-03 items-center border-b border-tsinelas-border-subtle-00 px-tsinelas-05'>
          <h2 className='tsinelas-eyebrow text-tsinelas-text-secondary'>
            {title}
          </h2>
        </div>
      )}
      <nav className='scrollbar-thin max-h-[calc(100vh-12rem)] overflow-y-auto py-tsinelas-02'>
        <ul>{children}</ul>
      </nav>
    </div>
  );
}

// 2. The Group Heading
export function SidebarGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <li className='mb-tsinelas-03 last:mb-0'>
      <h3 className='tsinelas-eyebrow px-tsinelas-05 py-tsinelas-03 text-tsinelas-text-helper'>
        {title}
      </h3>
      <ul>{children}</ul>
    </li>
  );
}

// 3. The Item Component
interface SidebarItemProps {
  label: string; // The "Clean" name (e.g., "Agriculture")
  tooltip?: string; // The "Full" name (e.g., "DEPARTMENT OF AGRICULTURE")
  icon?: LucideIcon;
  path?: string;
  onClick?: () => void;
  isActive?: boolean;
  description?: string;
  /** Trailing count or short tag, right-aligned in the row. */
  count?: number | string;
}

export function SidebarItem({
  label,
  tooltip,
  icon: Icon,
  path,
  onClick,
  isActive,
  description,
  count,
}: SidebarItemProps) {
  const location = useLocation();
  const active = isActive ?? (path ? location.pathname === path : false);

  // Carbon side-nav row: 32px, a 3px left rule that lights up when active,
  // the layer-hover step on hover, no radius.
  const baseStyles = cn(
    'group flex w-full items-start gap-tsinelas-03 border-l-[3px] py-tsinelas-02 pr-tsinelas-04 pl-[calc(var(--spacing-tsinelas-05)-3px)] text-left transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive tsinelas-body-compact-01 tsinelas-focus',
    active
      ? 'border-tsinelas-border-interactive bg-tsinelas-layer-selected-01 font-semibold text-tsinelas-text-primary'
      : 'border-transparent text-tsinelas-text-secondary hover:bg-tsinelas-layer-hover-01 hover:text-tsinelas-text-primary'
  );

  const content = (
    <>
      {Icon && (
        <Icon
          className={cn(
            'mt-tsinelas-01 size-tsinelas-icon-01 shrink-0',
            active
              ? 'text-tsinelas-icon-interactive'
              : 'text-tsinelas-icon-secondary'
          )}
        />
      )}
      <div className='flex min-w-0 flex-1 flex-col text-left'>
        <span className='truncate'>{label}</span>
        {description && (
          <span className='tsinelas-helper-text-01 text-tsinelas-text-helper'>
            {description}
          </span>
        )}
      </div>
      {count !== undefined && (
        <span className='tsinelas-label-01 shrink-0 text-tsinelas-text-helper tsinelas-tabular'>
          {count}
        </span>
      )}
    </>
  );

  // Use tooltip if provided, otherwise fallback to label
  const hoverTitle = tooltip || label;

  if (path) {
    return (
      <li>
        <Link
          to={path}
          title={hoverTitle}
          className={baseStyles}
          state={{ scrollToContent: true }}
          aria-current={active ? 'page' : undefined}
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type='button'
        onClick={onClick}
        title={hoverTitle}
        className={baseStyles}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </button>
    </li>
  );
}
