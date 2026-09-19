import { ReactNode } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { LucideIcon } from 'lucide-react';

// 1. The Outer Wrapper
export function SidebarContainer({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <aside className='w-full shrink-0 md:w-64'>
      <div className='border-tsinelas-border-weak bg-tsinelas-bg-surface sticky top-32 overflow-hidden rounded-lg border shadow-sm'>
        {title && (
          <div className='border-tsinelas-border-weak bg-tsinelas-bg-surface-raised/50 border-b px-4 py-3'>
            <h2 className='text-tsinelas-text-strong text-[11px] font-semibold tracking-widest uppercase'>
              {title}
            </h2>
          </div>
        )}
        <nav className='scrollbar-thin max-h-[calc(100vh-200px)] overflow-y-auto p-2'>
          {children}
        </nav>
      </div>
    </aside>
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
    <div className='mb-4 last:mb-0'>
      <h3 className='text-tsinelas-text-disabled px-3 py-2 tsinelas-eyebrow'>
        {title}
      </h3>
      <ul className='space-y-1'>{children}</ul>
    </div>
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
}

export function SidebarItem({
  label,
  tooltip,
  icon: Icon,
  path,
  onClick,
  isActive,
  description,
}: SidebarItemProps) {
  const location = useLocation();
  const active = isActive ?? (path ? location.pathname === path : false);

  const baseStyles = `
    w-full flex items-start gap-3 px-3 py-2 rounded-md text-sm transition-all group
    border-l-2 
    ${
      active
        ? 'bg-tsinelas-bg-surface text-tsinelas-text-brand-bold font-semibold border-tsinelas-border-brand'
        : 'text-tsinelas-text-support hover:bg-tsinelas-bg-surface-raised hover:text-tsinelas-text-strong border-transparent'
    }
  `;

  const content = (
    <>
      {Icon && (
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-tsinelas-text-brand' : 'group-hover:text-tsinelas-text-on-disabled text-tsinelas-text-disabled'}`}
        />
      )}
      <div className='flex flex-col overflow-hidden text-left'>
        <span className='truncate'>{label}</span>
        {description && (
          <span
            className={`text-[11px] leading-tight ${active ? 'text-tsinelas-text-brand/70' : 'text-tsinelas-text-disabled'}`}
          >
            {description}
          </span>
        )}
      </div>
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
