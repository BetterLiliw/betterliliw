import { Link } from 'react-router-dom';

import { ArrowLeft, LucideIcon, PlusCircle, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string; // New prop to customize the button text
  icon?: LucideIcon;
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  actionHref,
  actionLabel = 'Go Back', // Default value
  icon: Icon = SearchX,
}: EmptyStateProps) {
  // Adaptive Icon logic: Use Plus icon if it's a contribution, otherwise an Arrow
  const isContribution =
    actionLabel.toLowerCase().includes('suggest') ||
    actionLabel.toLowerCase().includes('add');

  // Auto-detect external links
  const isExternal = actionHref?.startsWith('http');

  return (
    <div className='animate-in fade-in zoom-in-95 flex flex-col items-center justify-center py-20 text-center duration-500'>
      {/* Icon Wrapper */}
      <div className='bg-tsinelas-bg-surface-raised mb-tsinelas-md rounded-full p-tsinelas-md ring-8 ring-tsinelas-bg-surface/50'>
        <Icon
          className='text-tsinelas-text-support h-12 w-12'
          aria-hidden='true'
        />
      </div>

      {/* Text Content */}
      <h3 className='text-tsinelas-text-strong tsinelas-heading-lg leading-tight'>
        {title}
      </h3>
      <p className='text-tsinelas-text-support mx-auto mt-tsinelas-xs max-w-sm tsinelas-body-sm-default leading-relaxed'>
        {message}
      </p>

      {/* Conditional Action Button */}
      {actionHref &&
        (isExternal ? (
          <a
            href={actionHref}
            target='_blank'
            rel='noopener noreferrer'
            className='border-tsinelas-border-weak bg-tsinelas-bg-surface text-tsinelas-text-support hover:border-tsinelas-border-weak hover:bg-tsinelas-bg-surface-raised mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all hover:shadow-md'
          >
            {isContribution ? (
              <PlusCircle className='text-tsinelas-text-brand h-4 w-4' />
            ) : (
              <ArrowLeft className='text-tsinelas-text-disabled h-4 w-4' />
            )}
            {actionLabel}
          </a>
        ) : (
          <Link
            to={actionHref}
            className='border-tsinelas-border-weak bg-tsinelas-bg-surface text-tsinelas-text-support hover:border-tsinelas-border-weak hover:bg-tsinelas-bg-surface-raised mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all hover:shadow-md'
          >
            {isContribution ? (
              <PlusCircle className='text-tsinelas-text-brand h-4 w-4' />
            ) : (
              <ArrowLeft className='text-tsinelas-text-disabled h-4 w-4' />
            )}
            {actionLabel}
          </Link>
        ))}
    </div>
  );
}
