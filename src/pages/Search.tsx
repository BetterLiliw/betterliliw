import { FC, useMemo, useState } from 'react';

import Fuse from 'fuse.js';

import { Input } from '@bettergov/kapwa/input';
import { SearchIcon } from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import mergedServicesData from '@/data/citizens-charter/merged-services.json';
import { Badge, EmptyState } from '@/components/ui';

interface MergedService {
  slug: string;
  service: string;
  plainLanguageName?: string;
  type: string;
  category: { name: string; slug: string };
  classification?: string;
}

interface HitProps {
  hit: MergedService;
}

const Hit: FC<HitProps> = ({ hit }) => {
  return (
    <article className='hit-item border-tsinelas-border-weak hover:bg-tsinelas-bg-surface-raised hover:border-tsinelas-border-brand border-b p-4 transition-all'>
      <a href={`/services/${hit.slug}`} className='block'>
        <h2 className='text-tsinelas-text-info text-lg font-semibold hover:underline'>
          {hit.plainLanguageName || hit.service}
        </h2>
        <div className='text-tsinelas-text-support mt-1 flex items-center gap-2 text-xs'>
          {hit.category && <span>{hit.category.name}</span>}
          <Badge
            variant='primary'
            className='bg-tsinelas-bg-info-weak text-tsinelas-text-info'
          >
            {hit.type}
          </Badge>
          {hit.classification && (
            <span className='text-tsinelas-text-disabled'>
              {hit.classification}
            </span>
          )}
        </div>
      </a>
    </article>
  );
};

const SearchPage: FC = () => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const fuse = useMemo(() => {
    return new Fuse(mergedServicesData as MergedService[], {
      keys: ['service', 'plainLanguageName', 'category.name', 'officeDivision'],
      threshold: 0.3,
    });
  }, []);

  const filteredResults = useMemo(() => {
    let results: MergedService[] = query
      ? fuse.search(query).map(r => r.item)
      : (mergedServicesData as MergedService[]);

    if (typeFilter) results = results.filter(s => s.type === typeFilter);
    if (categoryFilter)
      results = results.filter(s => s.category.name === categoryFilter);

    return results;
  }, [query, typeFilter, categoryFilter, fuse]);

  const categories = Array.from(
    new Set((mergedServicesData as MergedService[]).map(s => s.category.name))
  );

  const activeFiltersCount = (typeFilter ? 1 : 0) + (categoryFilter ? 1 : 0);

  return (
    <div className='container mx-auto px-4 py-8 md:py-12'>
      <SEO
        title='Search'
        description='Search Liliw government services, requirements and offices in one place.'
        keywords={['search', 'Liliw services', 'Citizen', 'Charter']}
      />

      <h1 className='tsinelas-heading-xl text-tsinelas-text-strong font-extrabold'>
        Search
      </h1>

      <div className='mb-6'>
        <div className='relative'>
          <SearchIcon className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tsinelas-text-disabled' />
          <Input
            type='text'
            placeholder='Search for government services, offices, and resources...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            className='pl-12'
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className='mb-6 flex flex-wrap items-center gap-2'>
          <span className='text-tsinelas-text-disabled text-sm'>
            Active filters:
          </span>
          {typeFilter && (
            <Badge variant='primary' className='flex items-center gap-1'>
              Type: {typeFilter}
              <button
                onClick={() => setTypeFilter('')}
                className='hover:text-tsinelas-text-inverse ml-1'
                aria-label='Remove type filter'
              >
                ×
              </button>
            </Badge>
          )}
          {categoryFilter && (
            <Badge variant='secondary' className='flex items-center gap-1'>
              Category: {categoryFilter}
              <button
                onClick={() => setCategoryFilter('')}
                className='hover:text-tsinelas-text-inverse ml-1'
                aria-label='Remove category filter'
              >
                ×
              </button>
            </Badge>
          )}
          {(typeFilter || categoryFilter) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setCategoryFilter('');
              }}
              className='text-tsinelas-text-brand hover:text-tsinelas-text-link-hover text-sm font-medium'
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
        <div className='lg:col-span-1'>
          <div className='bg-tsinelas-bg-surface border-tsinelas-border-weak sticky top-24 rounded-lg border p-4 shadow-sm'>
            <h3 className='mb-4 tsinelas-heading-md text-tsinelas-text-strong'>
              Filter By
            </h3>

            <div className='mb-6'>
              <h4 className='mb-3 tsinelas-label-sm text-tsinelas-text-disabled'>
                Type
              </h4>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className='border-tsinelas-border-weak bg-tsinelas-bg-surface text-tsinelas-text-strong w-full rounded-lg border p-2 text-sm focus:border-tsinelas-border-focus focus:outline-none focus:ring-2 focus:ring-tsinelas-border-focus/20'
              >
                <option value=''>All</option>
                <option value='transaction'>Transaction</option>
                <option value='information'>Information</option>
              </select>
            </div>

            <div>
              <h4 className='mb-3 tsinelas-label-sm text-tsinelas-text-disabled'>
                Category
              </h4>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className='border-tsinelas-border-weak bg-tsinelas-bg-surface text-tsinelas-text-strong w-full rounded-lg border p-2 text-sm focus:border-tsinelas-border-focus focus:outline-none focus:ring-2 focus:ring-tsinelas-border-focus/20'
              >
                <option value=''>All</option>
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='lg:col-span-3'>
          <div className='bg-tsinelas-bg-surface overflow-hidden rounded-lg shadow-sm'>
            {filteredResults.length === 0 ? (
              <EmptyState
                title='No results found'
                message={
                  query
                    ? `We couldn't find matches for "${query}"`
                    : 'Try adjusting your filters'
                }
                icon={SearchIcon}
                actionLabel={
                  query || typeFilter || categoryFilter
                    ? 'Clear all filters'
                    : undefined
                }
                onAction={
                  query || typeFilter || categoryFilter
                    ? () => {
                        setQuery('');
                        setTypeFilter('');
                        setCategoryFilter('');
                      }
                    : undefined
                }
              />
            ) : (
              <>
                <div className='border-tsinelas-border-weak border-b p-4'>
                  <p className='text-tsinelas-text-disabled text-sm'>
                    {filteredResults.length} result
                    {filteredResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                {filteredResults.map(hit => (
                  <Hit key={hit.slug} hit={hit} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
