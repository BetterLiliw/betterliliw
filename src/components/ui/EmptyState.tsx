import { Link } from 'react-router-dom';

import { ArrowLeft, LucideIcon, PlusCircle, SearchX } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: LucideIcon;
}

/**
 * EmptyState — a quiet, on-scale "nothing here" block: a secondary icon,
 * a card-size heading, one line of help and at most one tertiary action.
 */
export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  actionHref,
  actionLabel = 'Go back',
  icon: Icon = SearchX,
}: EmptyStateProps) {
  const isContribution = /suggest|add/i.test(actionLabel);
  const isExternal = actionHref?.startsWith('http');
  const ActionIcon = isContribution ? PlusCircle : ArrowLeft;

  const action = actionHref && (
    <Button
      variant='tertiary'
      size='sm'
      leftIcon={<ActionIcon className='size-tsinelas-icon-01' />}
    >
      {actionLabel}
    </Button>
  );

  return (
    <div className='animate-in fade-in flex flex-col items-center justify-center py-tsinelas-layout-05 text-center duration-500'>
      <Icon
        aria-hidden='true'
        className='mb-tsinelas-04 size-tsinelas-07 text-tsinelas-icon-secondary'
      />
      <h3 className='tsinelas-heading-md text-tsinelas-text-primary'>
        {title}
      </h3>
      <p className='tsinelas-body-01 mx-auto mt-tsinelas-02 max-w-sm text-tsinelas-text-secondary'>
        {message}
      </p>
      {action && (
        <div className='mt-tsinelas-05'>
          {isExternal ? (
            <a href={actionHref} target='_blank' rel='noopener noreferrer'>
              {action}
            </a>
          ) : (
            <Link to={actionHref!}>{action}</Link>
          )}
        </div>
      )}
    </div>
  );
}
