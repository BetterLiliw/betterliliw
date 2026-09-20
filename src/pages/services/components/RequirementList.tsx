import { Link } from 'react-router-dom';

import { ArrowRightIcon } from 'lucide-react';

import type { Requirement } from '@/types/citizens-charter';

import { DocumentList, DocumentRow } from './DocumentRow';

interface RequirementListProps {
  requirements: Requirement[];
}

/** Citizens Charter requirements as a structured list. */
export function RequirementList({ requirements }: RequirementListProps) {
  if (requirements.length === 0) return null;

  return (
    <DocumentList>
      {requirements.map((req, idx) => (
        <DocumentRow
          key={idx}
          index={idx + 1}
          title={req.requirement}
          whereToSecure={req.where_to_secure}
          copies={req.copies}
        >
          {req.serviceSlug && (
            <Link
              to={`/services/${req.serviceSlug}`}
              className='tsinelas-label-01 mt-tsinelas-02 inline-flex items-center gap-tsinelas-02 text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus'
            >
              How to get this
              <ArrowRightIcon
                aria-hidden='true'
                className='size-tsinelas-icon-01'
              />
            </Link>
          )}
        </DocumentRow>
      ))}
    </DocumentList>
  );
}
