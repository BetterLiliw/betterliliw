import { ReactNode } from 'react';

import { Badge } from '@/components/ui/Badge';

interface DocumentRowProps {
  /** 1-based position in its list. */
  index: number;
  title: string;
  whereToSecure?: string;
  /** Number of copies as the charter records it, e.g. "3". */
  copies?: string;
  note?: string;
  /** Anything else under the note: a link, a condition, alternatives. */
  children?: ReactNode;
}

/** "3" → "3 copies"; anything already worded is left alone. */
function formatCopies(copies: string) {
  const n = Number(copies);
  if (!Number.isFinite(n)) return copies;
  return n === 1 ? '1 copy' : `${n} copies`;
}

/**
 * DocumentRow — one requirement in a structured list: a tabular index, the
 * document name, where to get it, and the copy count as a tag. Rows are
 * separated by the list's hairlines, not by boxes.
 */
export function DocumentRow({
  index,
  title,
  whereToSecure,
  copies,
  note,
  children,
}: DocumentRowProps) {
  return (
    <li
      data-testid='requirement-card'
      className='flex gap-tsinelas-04 py-tsinelas-04'
    >
      <span
        aria-hidden='true'
        className='tsinelas-label-01 tsinelas-tabular w-tsinelas-05 shrink-0 pt-[1px] text-tsinelas-text-helper'
      >
        {index}
      </span>
      <div className='min-w-0 flex-1 sm:flex sm:items-start sm:justify-between sm:gap-tsinelas-05'>
        <div className='min-w-0'>
          <p className='tsinelas-heading-compact-01 text-tsinelas-text-primary'>
            {title}
          </p>
          {whereToSecure && (
            <p className='tsinelas-label-01 mt-tsinelas-01 text-tsinelas-text-secondary'>
              Where to secure: {whereToSecure}
            </p>
          )}
          {note && (
            <p className='tsinelas-label-01 mt-tsinelas-01 text-tsinelas-text-helper'>
              {note}
            </p>
          )}
          {children}
        </div>
        {copies && (
          <Badge
            variant='slate'
            size='sm'
            className='mt-tsinelas-02 shrink-0 sm:mt-0'
          >
            {formatCopies(copies)}
          </Badge>
        )}
      </div>
    </li>
  );
}

/** The list that holds DocumentRows: hairlines above, between and below. */
export function DocumentList({ children }: { children: ReactNode }) {
  return (
    <ol className='divide-y divide-tsinelas-border-subtle-00 border-y border-tsinelas-border-subtle-00'>
      {children}
    </ol>
  );
}
