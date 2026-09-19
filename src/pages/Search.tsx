import { FC, useMemo } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import Fuse from 'fuse.js';
import { SearchXIcon, XIcon } from 'lucide-react';

import { ModuleHeader } from '@/components/layout/PageLayouts';
import { SEO } from '@/components/layout/SEO';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Label } from '@/components/ui/Label';
import SearchInput from '@/components/ui/SearchInput';

import mergedServicesData from '@/data/citizens-charter/merged-services.json';
import { config } from '@/lib/lguConfig';

interface MergedService {
  slug: string;
  service: string;
  plainLanguageName?: string;
  type: string;
  category: { name: string; slug: string };
  classification?: string;
  officeDivision?: string;
}

const services = mergedServicesData as MergedService[];

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'transaction', label: 'Transaction' },
  { value: 'information', label: 'Information' },
];

const typeVariant = (type: string) =>
  type === 'transaction' ? 'primary' : 'slate';

const Hit: FC<{ hit: MergedService }> = ({ hit }) => (
  <li>
    <Link
      to={`/services/${hit.slug}`}
      className='group block px-tsinelas-05 py-tsinelas-04 transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-layer-hover-01 tsinelas-focus'
    >
      <h3 className='tsinelas-heading-compact-02 text-tsinelas-link-primary group-hover:text-tsinelas-link-primary-hover group-hover:underline'>
        {hit.plainLanguageName || hit.service}
      </h3>
      {hit.plainLanguageName && hit.plainLanguageName !== hit.service && (
        <p className='tsinelas-body-01 mt-tsinelas-01 text-tsinelas-text-secondary'>
          {hit.service}
        </p>
      )}
      <div className='mt-tsinelas-03 flex flex-wrap items-center gap-x-tsinelas-04 gap-y-tsinelas-02'>
        <Badge variant={typeVariant(hit.type)} size='sm'>
          {hit.type}
        </Badge>
        <span className='tsinelas-label-01 text-tsinelas-text-secondary'>
          {hit.category.name}
        </span>
        {hit.officeDivision && (
          <span className='tsinelas-label-01 text-tsinelas-text-helper'>
            {hit.officeDivision}
          </span>
        )}
        {hit.classification && (
          <span className='tsinelas-label-01 text-tsinelas-text-helper'>
            {hit.classification}
          </span>
        )}
      </div>
    </Link>
  </li>
);

const FilterChip: FC<{ label: string; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <span className='inline-flex h-tsinelas-container-01 items-center gap-tsinelas-02 rounded-full bg-tsinelas-tag-background-navy pr-tsinelas-02 pl-tsinelas-03 text-tsinelas-tag-color-navy tsinelas-label-01'>
    {label}
    <button
      type='button'
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className='flex size-tsinelas-icon-02 items-center justify-center rounded-full transition-colors duration-tsinelas-fast-01 hover:bg-tsinelas-tag-hover-navy tsinelas-focus'
    >
      <XIcon aria-hidden='true' className='size-tsinelas-04' />
    </button>
  </span>
);

const SearchPage: FC = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const typeFilter = params.get('type') ?? '';
  const categoryFilter = params.get('category') ?? '';

  const update = (key: string, value: string) =>
    setParams(
      prev => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const clearAll = () => setParams({}, { replace: true });

  const fuse = useMemo(
    () =>
      new Fuse(services, {
        keys: [
          'service',
          'plainLanguageName',
          'category.name',
          'officeDivision',
        ],
        threshold: 0.3,
      }),
    []
  );

  const results = useMemo(() => {
    let list = query ? fuse.search(query).map(r => r.item) : services;
    if (typeFilter) list = list.filter(s => s.type === typeFilter);
    if (categoryFilter)
      list = list.filter(s => s.category.name === categoryFilter);
    return list;
  }, [query, typeFilter, categoryFilter, fuse]);

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All categories' },
      ...Array.from(new Set(services.map(s => s.category.name)))
        .sort((a, b) => a.localeCompare(b))
        .map(name => ({ value: name, label: name })),
    ],
    []
  );

  const hasFilters = Boolean(typeFilter || categoryFilter);
  const hasAnything = Boolean(query) || hasFilters;

  return (
    <div className='container py-tsinelas-layout-02 md:py-tsinelas-layout-03'>
      <SEO
        title='Search'
        description={`Search ${config.lgu.name} government services, requirements and offices in one place.`}
        keywords={[
          'search',
          `${config.lgu.name} services`,
          'Citizen',
          'Charter',
        ]}
      />

      <ModuleHeader
        title='Search'
        description={`Find a ${config.lgu.name} government service, its requirements and the office that handles it.`}
      >
        <SearchInput
          size='lg'
          value={query}
          onChangeValue={value => update('q', value)}
          placeholder='Search services, offices, requirements…'
          aria-label='Search services'
          clearable
          autoFocus
          className='w-full md:w-96'
        />
      </ModuleHeader>

      <div className='grid grid-cols-1 gap-tsinelas-layout-03 lg:grid-cols-4'>
        {/* Filters */}
        <aside className='lg:col-span-1'>
          <div className='space-y-tsinelas-05 border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 p-tsinelas-05 lg:sticky lg:top-24'>
            <div className='flex items-center justify-between'>
              <h2 className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
                Filters
              </h2>
              {hasFilters && (
                <Button variant='ghost' size='sm' onClick={clearAll}>
                  Clear
                </Button>
              )}
            </div>
            <div className='tsinelas-layer-02'>
              <Label htmlFor='search-type'>Type</Label>
              <Dropdown
                id='search-type'
                value={typeFilter}
                onChange={value => update('type', value)}
                options={TYPE_OPTIONS}
              />
            </div>
            <div className='tsinelas-layer-02'>
              <Label htmlFor='search-category'>Category</Label>
              <Dropdown
                id='search-category'
                value={categoryFilter}
                onChange={value => update('category', value)}
                options={categoryOptions}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className='lg:col-span-3'>
          <div className='flex min-h-tsinelas-container-03 flex-wrap items-center gap-x-tsinelas-04 gap-y-tsinelas-02 border-b border-tsinelas-border-subtle-00 pb-tsinelas-03'>
            <p
              aria-live='polite'
              className='tsinelas-label-01 text-tsinelas-text-secondary tsinelas-tabular'
            >
              {results.length.toLocaleString()}{' '}
              {results.length === 1 ? 'result' : 'results'}
              {query && (
                <>
                  {' '}
                  for{' '}
                  <span className='font-semibold text-tsinelas-text-primary'>
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              )}
            </p>
            {typeFilter && (
              <FilterChip
                label={
                  TYPE_OPTIONS.find(o => o.value === typeFilter)?.label ??
                  typeFilter
                }
                onRemove={() => update('type', '')}
              />
            )}
            {categoryFilter && (
              <FilterChip
                label={categoryFilter}
                onRemove={() => update('category', '')}
              />
            )}
          </div>

          {results.length === 0 ? (
            <div className='flex flex-col items-center py-tsinelas-layout-05 text-center'>
              <SearchXIcon
                aria-hidden='true'
                className='mb-tsinelas-04 size-tsinelas-07 text-tsinelas-icon-secondary'
              />
              <h2 className='tsinelas-heading-md text-tsinelas-text-primary'>
                No results
              </h2>
              <p className='tsinelas-body-01 mt-tsinelas-02 max-w-sm text-tsinelas-text-secondary'>
                {query
                  ? `Nothing matched “${query}”. Try a different word, or the office that handles it.`
                  : 'Nothing matches these filters.'}
              </p>
              <div className='mt-tsinelas-05 flex flex-wrap justify-center gap-tsinelas-03'>
                {hasAnything && (
                  <Button variant='tertiary' size='sm' onClick={clearAll}>
                    Clear search
                  </Button>
                )}
                <Link
                  to={`/services/request${query ? `?name=${encodeURIComponent(query)}` : ''}`}
                >
                  <Button variant='ghost' size='sm'>
                    Suggest a missing service
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <ul className='divide-y divide-tsinelas-border-subtle-00'>
              {results.map(hit => (
                <Hit key={hit.slug} hit={hit} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
