import { useState } from 'react';

import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Label } from '@/components/ui/Label';

import { getAllOfficeDivisions } from '@/lib/services';
import { cn } from '@/lib/utils';

export type ServiceSource = 'citizens-charter' | 'community' | 'all';
export type ClassificationFilter = 'Simple' | 'Complex' | 'all';

interface FilterBarProps {
  selectedOfficeDivision: string;
  selectedSource: ServiceSource;
  selectedClassification: ClassificationFilter;
  onOfficeDivisionChange: (division: string) => void;
  onSourceChange: (source: ServiceSource) => void;
  onClassificationChange: (classification: ClassificationFilter) => void;
}

export default function FilterBar({
  selectedOfficeDivision,
  selectedSource,
  selectedClassification,
  onOfficeDivisionChange,
  onSourceChange,
  onClassificationChange,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount =
    (selectedOfficeDivision !== 'all' ? 1 : 0) +
    (selectedSource !== 'all' ? 1 : 0) +
    (selectedClassification !== 'all' ? 1 : 0);

  const officeOptions = [
    { value: 'all', label: 'All offices' },
    ...getAllOfficeDivisions().map(division => ({
      value: division,
      label: division,
    })),
  ];

  return (
    <div
      className='border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01'
      data-testid='filter-bar'
    >
      <button
        type='button'
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls='service-filters'
        className='flex h-tsinelas-container-03 w-full items-center justify-between px-tsinelas-05 text-left transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-layer-hover-01 tsinelas-focus'
        data-testid='filter-bar-toggle'
      >
        <span className='flex items-center gap-tsinelas-03'>
          <span className='tsinelas-heading-compact-01 text-tsinelas-text-primary'>
            Filters
          </span>
          {activeCount > 0 && (
            <span className='tsinelas-label-01 text-tsinelas-text-secondary'>
              {activeCount} active
            </span>
          )}
        </span>
        <ChevronDownIcon
          aria-hidden='true'
          className={cn(
            'size-tsinelas-icon-01 text-tsinelas-icon-secondary transition-transform duration-tsinelas-fast-01',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {isExpanded && (
        <div
          id='service-filters'
          className='tsinelas-layer-02 grid gap-tsinelas-05 border-t border-tsinelas-border-subtle-00 p-tsinelas-05 md:grid-cols-[auto_auto_1fr] md:items-end'
        >
          <fieldset>
            <legend className='mb-tsinelas-03 text-tsinelas-text-secondary tsinelas-label-01'>
              Source
            </legend>
            <div className='flex flex-wrap gap-tsinelas-02'>
              <FilterTag
                label='All'
                selected={selectedSource === 'all'}
                onClick={() => onSourceChange('all')}
                data-testid='filter-source-all'
              />
              <FilterTag
                label='Official'
                selected={selectedSource === 'citizens-charter'}
                onClick={() => onSourceChange('citizens-charter')}
                data-testid='filter-source-official'
              />
              <FilterTag
                label='Community'
                selected={selectedSource === 'community'}
                onClick={() => onSourceChange('community')}
                data-testid='filter-source-community'
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className='mb-tsinelas-03 text-tsinelas-text-secondary tsinelas-label-01'>
              Transaction
            </legend>
            <div className='flex flex-wrap gap-tsinelas-02'>
              <FilterTag
                label='All'
                selected={selectedClassification === 'all'}
                onClick={() => onClassificationChange('all')}
                data-testid='filter-classification-all'
              />
              <FilterTag
                label='Simple'
                selected={selectedClassification === 'Simple'}
                onClick={() => onClassificationChange('Simple')}
                data-testid='filter-classification-simple'
              />
              <FilterTag
                label='Complex'
                selected={selectedClassification === 'Complex'}
                onClick={() => onClassificationChange('Complex')}
                data-testid='filter-classification-complex'
              />
            </div>
          </fieldset>

          <div className='flex items-end gap-tsinelas-03'>
            <div className='min-w-0 flex-1'>
              <Label htmlFor='filter-office'>Office</Label>
              <Dropdown
                id='filter-office'
                value={selectedOfficeDivision}
                onChange={onOfficeDivisionChange}
                options={officeOptions}
                data-testid='filter-office-select'
              />
            </div>
            {activeCount > 0 && (
              <Button
                variant='ghost'
                onClick={() => {
                  onOfficeDivisionChange('all');
                  onSourceChange('all');
                  onClassificationChange('all');
                }}
                data-testid='filter-clear-all'
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Carbon selectable tag: a round tag that fills with the navy pair when
 * selected and shows a check. */
function FilterTag({
  label,
  selected,
  onClick,
  'data-testid': testId,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  'data-testid'?: string;
}) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={selected}
      onClick={onClick}
      data-testid={testId}
      className={cn(
        'inline-flex h-tsinelas-container-01 items-center gap-tsinelas-02 rounded-full px-tsinelas-03 transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive tsinelas-label-01 tsinelas-focus',
        selected
          ? 'bg-tsinelas-tag-background-navy text-tsinelas-tag-color-navy hover:bg-tsinelas-tag-hover-navy'
          : 'text-tsinelas-text-secondary shadow-[inset_0_0_0_1px_var(--color-tsinelas-border-subtle-01)] hover:bg-tsinelas-layer-hover-01'
      )}
    >
      {selected && (
        <CheckIcon aria-hidden='true' className='size-tsinelas-04 shrink-0' />
      )}
      {label}
    </button>
  );
}
