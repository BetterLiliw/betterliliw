import { ReactNode, createContext, useContext, useId, useState } from 'react';

import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Carbon accordion row heights: md 40px (default), lg 48px. */
export type AccordionSize = 'md' | 'lg';

interface AccordionProps {
  children: ReactNode;
  size?: AccordionSize;
  className?: string;
}

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

const SizeContext = createContext<AccordionSize>('md');

const rowHeights: Record<AccordionSize, string> = {
  md: 'min-h-tsinelas-container-03',
  lg: 'min-h-tsinelas-container-04',
};

/**
 * Accordion — Carbon anatomy on Tsinelas: a hairline above the list and
 * under each item, a full-width heading button with the chevron pinned to
 * the right, a layer-hover fill on hover, and the panel indented to the
 * title. Items open and close independently; a single-open group is not
 * what a reader wants from a list of questions.
 */
export function Accordion({
  children,
  size = 'md',
  className,
}: AccordionProps) {
  return (
    <SizeContext.Provider value={size}>
      <div
        className={cn('border-t border-tsinelas-border-subtle-00', className)}
      >
        {children}
      </div>
    </SizeContext.Provider>
  );
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  className,
}: AccordionItemProps) {
  const size = useContext(SizeContext);
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className={cn('border-b border-tsinelas-border-subtle-00', className)}>
      <h3 className='m-0'>
        <button
          id={buttonId}
          type='button'
          disabled={disabled}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(value => !value)}
          className={cn(
            'flex w-full items-start justify-between gap-tsinelas-04 px-tsinelas-05 py-tsinelas-03 text-left tsinelas-focus',
            'tsinelas-heading-compact-01 text-tsinelas-text-primary',
            'transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive',
            'hover:bg-tsinelas-layer-hover-01 active:bg-tsinelas-layer-active-01',
            'disabled:cursor-not-allowed disabled:text-tsinelas-text-disabled disabled:hover:bg-transparent',
            rowHeights[size]
          )}
        >
          <span className='min-w-0 flex-1 py-[2px]'>{title}</span>
          <ChevronDownIcon
            aria-hidden='true'
            className={cn(
              'mt-[2px] size-tsinelas-icon-01 shrink-0 text-tsinelas-icon-primary',
              'transition-transform duration-tsinelas-fast-02 ease-tsinelas-standard-productive motion-reduce:transition-none',
              open && 'rotate-180'
            )}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role='region'
        aria-labelledby={buttonId}
        hidden={!open}
        className='tsinelas-body-01 px-tsinelas-05 pt-tsinelas-02 pb-tsinelas-05 text-tsinelas-text-secondary md:pr-[25%]'
      >
        {children}
      </div>
    </div>
  );
}
