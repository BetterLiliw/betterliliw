import { ReactNode } from 'react';

import { Banner } from '@/components/ui/Banner';

import type {
  SupportingDocument,
  SupportingDocumentsDetail as SupportingDocumentsDetailType,
} from '@/types/citizens-charter';

import { DocumentList, DocumentRow } from './DocumentRow';

interface SupportingDocumentsDetailProps {
  detail: SupportingDocumentsDetailType;
}

function Group({
  title,
  instruction,
  children,
}: {
  title: string;
  instruction?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className='tsinelas-heading-md text-tsinelas-text-primary'>
        {title}
      </h3>
      {instruction && (
        <p className='tsinelas-body-01 mt-tsinelas-02 text-tsinelas-text-secondary'>
          {instruction}
        </p>
      )}
      <div className='mt-tsinelas-04'>{children}</div>
    </div>
  );
}

function Documents({ documents }: { documents: SupportingDocument[] }) {
  return (
    <DocumentList>
      {documents.map((doc, idx) => (
        <DocumentRow
          key={idx}
          index={idx + 1}
          title={doc.document}
          whereToSecure={doc.where_to_secure}
          copies={doc.copies}
          note={doc.note}
        />
      ))}
    </DocumentList>
  );
}

/**
 * SupportingDocumentsDetail — the finer-grained requirement groups from the
 * Citizens Charter (mandatory, accepted, additional, conditional), each a
 * structured list under a card-size heading. Everything is shown; nothing
 * is folded behind a disclosure, so the page prints whole.
 */
export function SupportingDocumentsDetail({
  detail,
}: SupportingDocumentsDetailProps) {
  const {
    instruction,
    mandatory_requirements: mandatory,
    primary_documents: primary,
    additional_documents: additional,
    conditional_requirements: conditional,
    note,
  } = detail;

  return (
    <div className='space-y-tsinelas-06'>
      {instruction && (
        <p className='tsinelas-body-02 text-tsinelas-text-primary'>
          {instruction}
        </p>
      )}

      {mandatory && mandatory.documents.length > 0 && (
        <Group title='Mandatory documents' instruction={mandatory.instruction}>
          <Documents documents={mandatory.documents} />
        </Group>
      )}

      {primary && primary.length > 0 && (
        <Group title='Accepted documents'>
          <Documents documents={primary} />
        </Group>
      )}

      {additional && additional.documents.length > 0 && (
        <Group
          title='Additional documents'
          instruction={additional.instruction}
        >
          <Documents documents={additional.documents} />
        </Group>
      )}

      {conditional && conditional.options.length > 0 && (
        <Group
          title='Depending on your situation'
          instruction={conditional.instruction}
        >
          <DocumentList>
            {conditional.options.map((option, idx) => (
              <DocumentRow
                key={idx}
                index={idx + 1}
                title={option.document}
                whereToSecure={option.where_to_secure}
                copies={option.copies}
                note={option.note}
              >
                <p className='tsinelas-label-01 mt-tsinelas-02 text-tsinelas-text-primary'>
                  <span className='font-semibold'>When: </span>
                  {option.condition}
                </p>
                {option.if_unavailable && option.if_unavailable.length > 0 && (
                  <div className='mt-tsinelas-02'>
                    <p className='tsinelas-label-01 text-tsinelas-text-secondary'>
                      If unavailable, any of:
                    </p>
                    <ul className='tsinelas-label-01 mt-tsinelas-01 list-disc space-y-tsinelas-01 pl-tsinelas-05 text-tsinelas-text-secondary'>
                      {option.if_unavailable.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </DocumentRow>
            ))}
          </DocumentList>
        </Group>
      )}

      {note && <Banner type='info' title='Note' description={note} />}
    </div>
  );
}
