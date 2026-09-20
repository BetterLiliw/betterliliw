import { ClockIcon, ExternalLinkIcon } from 'lucide-react';

import type { ClientStep } from '@/types/citizens-charter';

interface ProcessTimelineProps {
  steps: ClientStep[];
}

/**
 * ProcessTimeline — the client steps from the Citizens Charter as a
 * vertical progress indicator: a square numbered marker on a hairline
 * rail, lettered sub-steps, roman-numbered details.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <ol data-testid='process-timeline'>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <li
            key={step.step ?? idx}
            className='relative flex gap-tsinelas-05 pb-tsinelas-06 last:pb-0'
          >
            {!isLast && (
              <span
                aria-hidden='true'
                className='absolute top-tsinelas-07 bottom-0 left-tsinelas-05 w-px bg-tsinelas-border-subtle-01'
              />
            )}
            <span
              aria-hidden='true'
              className='tsinelas-heading-compact-01 tsinelas-tabular flex size-tsinelas-07 shrink-0 items-center justify-center border border-tsinelas-border-interactive bg-tsinelas-background text-tsinelas-interactive'
            >
              {idx + 1}
            </span>

            <div className='min-w-0 flex-1 pt-tsinelas-02'>
              <p className='tsinelas-body-02 text-tsinelas-text-primary'>
                <span className='sr-only'>Step {idx + 1}: </span>
                {step.action}
              </p>

              {step.url && (
                <a
                  href={step.url}
                  target='_blank'
                  rel='noreferrer'
                  className='tsinelas-body-compact-01 mt-tsinelas-02 inline-flex items-center gap-tsinelas-02 text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus'
                >
                  Open the online portal
                  <ExternalLinkIcon
                    aria-hidden='true'
                    className='size-tsinelas-icon-01'
                  />
                </a>
              )}

              {step.sub_steps && step.sub_steps.length > 0 && (
                <ol className='mt-tsinelas-04 space-y-tsinelas-03 border-l border-tsinelas-border-subtle-01 pl-tsinelas-05'>
                  {step.sub_steps.map(sub => (
                    <li key={sub.letter} className='flex gap-tsinelas-03'>
                      <span className='tsinelas-label-01 w-tsinelas-05 shrink-0 pt-[3px] font-semibold text-tsinelas-text-secondary'>
                        {sub.letter}.
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p className='tsinelas-body-01 text-tsinelas-text-primary'>
                          {sub.action}
                        </p>
                        {sub.details && sub.details.length > 0 && (
                          <ol className='tsinelas-body-01 mt-tsinelas-02 list-[lower-roman] space-y-tsinelas-01 pl-tsinelas-06 text-tsinelas-text-secondary'>
                            {sub.details.map((detail, i) => (
                              <li key={i} className='pl-tsinelas-01'>
                                {detail}
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {step.processing_time && (
                <p className='tsinelas-label-01 mt-tsinelas-03 flex items-center gap-tsinelas-02 text-tsinelas-text-helper'>
                  <ClockIcon
                    aria-hidden='true'
                    className='size-tsinelas-04 shrink-0'
                  />
                  {step.processing_time}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
