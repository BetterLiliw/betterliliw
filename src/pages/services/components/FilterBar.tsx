import { useMemo } from 'react';

import { CheckIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Dropdown } from '@/components/ui/Dropdown';
import { Label } from '@/components/ui/Label';

import {
  countActiveFilters,
  getOfficeOptions,
  type ClassificationFilter,
  type FacetCounts,
  type ServiceFilterState,
  type SortOrder,
  type SourceFilter,
} from '@/lib/serviceFilters';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: ServiceFilterState;
  counts: FacetCounts;
  onChange: (patch: Partial<ServiceFilterState>) => void;
  onReset: () => void;
}

const SOURCE_OPTIONS: { value: SourceFilter; label: string; id: string }[] = [
  { value: 'all', label: 'All', id: 'all' },
  { value: 'citizens-charter', label: 'Official', id: 'official' },
  { value: 'community', label: 'Community', id: 'community' },
];

const TYPE_OPTIONS: {
  value: ClassificationFilter;
  label: string;
  id: string;
}[] = [
  { value: 'all', label: 'All', id: 'all' },
  { value: 'Simple', label: 'Simple', id: 'simple' },
  { value: 'Complex', label: 'Complex', id: 'complex' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name, A to Z' },
  { value: 'updated', label: 'Recently updated' },
];

/**
 * FilterBar — Carbon filter toolbar. Every option shows how many services
 * it would leave given the other filters, and options that would leave
 * none are disabled instead of hidden so the layout never jumps.
 */
export default function FilterBar({
  filters,
  counts,
  onChange,
  onReset,
}: FilterBarProps) {
  const active = countActiveFilters(filters);

  const officeOptions = useMemo(
    () => [
      { value: 'all', label: 'All offices' },
      ...getOfficeOptions().map(office => ({
        value: office,
        label: `${office} (${counts.office.get(office) ?? 0})`,
      })),
    ],
    [counts.office]
  );

  return (
    <section
      aria-label='Filter services'
      className='border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01'
      data-testid='filter-bar'
    >
      <div className='tsinelas-layer-02 grid gap-tsinelas-05 p-tsinelas-05 md:grid-cols-[1fr_auto] md:items-end'>
        <div className='grid gap-tsinelas-05 sm:grid-cols-2'>
          <div>
            <Label htmlFor='filter-office'>Office</Label>
            <Dropdown
              id='filter-office'
              value={filters.office}
              onChange={office => onChange({ office })}
              options={officeOptions}
              data-testid='filter-office-select'
            />
          </div>
          <div>
            <Label htmlFor='filter-sort'>Sort by</Label>
            <Dropdown
              id='filter-sort'
              value={filters.sort}
              onChange={sort => onChange({ sort: sort as SortOrder })}
              options={SORT_OPTIONS}
              data-testid='filter-sort-select'
            />
          </div>
        </div>
        <Checkbox
          label='Online services only'
          hint={counts.online}
          checked={filters.online}
          onChange={e => onChange({ online: e.target.checked })}
          disabled={!filters.online && counts.online === 0}
          data-testid='filter-online'
          className='md:mb-tsinelas-03'
        />
      </div>

      <div className='flex flex-wrap items-center gap-x-tsinelas-07 gap-y-tsinelas-04 border-t border-tsinelas-border-subtle-00 px-tsinelas-05 py-tsinelas-04'>
        <TagGroup
          legend='Source'
          options={SOURCE_OPTIONS}
          value={filters.source}
          counts={counts.source}
          onChange={source => onChange({ source })}
          testIdPrefix='filter-source'
        />
        <TagGroup
          legend='Transaction'
          options={TYPE_OPTIONS}
          value={filters.type}
          counts={counts.type}
          onChange={type => onChange({ type })}
          testIdPrefix='filter-classification'
        />
        {active > 0 && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onReset}
            className='ml-auto'
            data-testid='filter-clear-all'
          >
            Clear {active} {active === 1 ? 'filter' : 'filters'}
          </Button>
        )}
      </div>
    </section>
  );
}

function TagGroup<T extends string>({
  legend,
  options,
  value,
  counts,
  onChange,
  testIdPrefix,
}: {
  legend: string;
  options: { value: T; label: string; id: string }[];
  value: T;
  counts: Record<T, number>;
  onChange: (value: T) => void;
  testIdPrefix: string;
}) {
  return (
    <fieldset className='flex flex-wrap items-center gap-x-tsinelas-04 gap-y-tsinelas-02'>
      <legend className='float-left mr-tsinelas-02 text-tsinelas-text-secondary tsinelas-label-01'>
        {legend}
      </legend>
      {options.map(option => {
        const selected = option.value === value;
        const count = counts[option.value];
        const empty = count === 0 && !selected;
        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={selected}
            disabled={empty}
            onClick={() => onChange(option.value)}
            data-testid={`${testIdPrefix}-${option.id}`}
            className={cn(
              'inline-flex h-tsinelas-container-01 items-center gap-tsinelas-02 rounded-full pr-tsinelas-03 pl-tsinelas-03 transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive tsinelas-label-01 tsinelas-focus',
              'disabled:cursor-not-allowed disabled:opacity-50',
              selected
                ? 'bg-tsinelas-tag-background-navy text-tsinelas-tag-color-navy hover:bg-tsinelas-tag-hover-navy'
                : 'text-tsinelas-text-secondary shadow-[inset_0_0_0_1px_var(--color-tsinelas-border-subtle-01)] hover:bg-tsinelas-layer-hover-01 disabled:hover:bg-transparent'
            )}
          >
            {selected && (
              <CheckIcon
                aria-hidden='true'
                className='size-tsinelas-04 shrink-0'
              />
            )}
            {option.label}
            <span
              className={cn(
                'tsinelas-tabular',
                selected ? 'opacity-80' : 'text-tsinelas-text-helper'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}
