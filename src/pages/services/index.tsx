import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useOutletContext } from 'react-router-dom';

import { SearchXIcon, XIcon } from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import { CardGrid } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

import serviceCategories from '@/data/service_categories.json';
import { lguLabels } from '@/lib/lguLabels';
import { queryServices } from '@/lib/serviceFilters';
import { cn } from '@/lib/utils';

import FilterBar from './components/FilterBar';
import ServiceCard from './components/ServiceCard';
import type { ServicesOutletContext } from './layout';

const ITEMS_PER_PAGE = 12;

export default function ServicesPage() {
  const { filters, setFilters, resetFilters } =
    useOutletContext<ServicesOutletContext>();

  // Keystrokes update the input immediately; the list catches up when the
  // browser is idle, so typing never waits on filtering.
  const deferredSearch = useDeferredValue(filters.search);
  const effective = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [filters, deferredSearch]
  );

  const { results, counts } = useMemo(
    () => queryServices(effective),
    [effective]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [effective]);

  const hasMore = results.length > currentPage * ITEMS_PER_PAGE;
  const handleLoadMore = useCallback(() => {
    if (hasMore) setCurrentPage(prev => prev + 1);
  }, [hasMore]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore]);

  // --- SEO ---
  const activeCategory =
    filters.category !== 'all'
      ? serviceCategories.categories.find(c => c.slug === filters.category)
      : null;
  const seoTitle = activeCategory
    ? `${activeCategory.name} Services`
    : 'Government Services';
  const seoDescription = activeCategory
    ? `${activeCategory.description} Find requirements, fees and how to apply in ${lguLabels.fullName}.`
    : `Browse all ${lguLabels.fullName} government services — requirements, fees, processing times and how to apply.`;
  const seoCanonical = activeCategory
    ? `/services?category=${activeCategory.slug}`
    : '/services';
  const seoBreadcrumbs = [
    { name: 'Home', url: '/' },
    ...(activeCategory
      ? [
          { name: 'Services', url: '/services' },
          { name: activeCategory.name, url: seoCanonical },
        ]
      : [{ name: 'Services', url: '/services' }]),
  ];

  const chips = [
    filters.office !== 'all' && {
      key: 'office',
      label: filters.office,
      clear: () => setFilters({ office: 'all' }),
    },
    filters.source !== 'all' && {
      key: 'source',
      label: filters.source === 'citizens-charter' ? 'Official' : 'Community',
      clear: () => setFilters({ source: 'all' }),
    },
    filters.type !== 'all' && {
      key: 'type',
      label: `${filters.type} transaction`,
      clear: () => setFilters({ type: 'all' }),
    },
    filters.online && {
      key: 'online',
      label: 'Online only',
      clear: () => setFilters({ online: false }),
    },
  ].filter((c): c is { key: string; label: string; clear: () => void } =>
    Boolean(c)
  );

  const isStale = deferredSearch !== filters.search;

  return (
    <div className='animate-in fade-in space-y-tsinelas-05 duration-500'>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        breadcrumbs={seoBreadcrumbs}
      />

      <FilterBar
        filters={filters}
        counts={counts}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {/* Result count and active filters */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-x-tsinelas-04 gap-y-tsinelas-02 transition-opacity duration-tsinelas-fast-02',
          isStale && 'opacity-60'
        )}
      >
        <p
          aria-live='polite'
          className='tsinelas-label-01 text-tsinelas-text-secondary tsinelas-tabular'
        >
          {results.length.toLocaleString()}{' '}
          {results.length === 1 ? 'service' : 'services'}
          {deferredSearch && (
            <>
              {' '}
              for{' '}
              <span className='font-semibold text-tsinelas-text-primary'>
                &ldquo;{deferredSearch}&rdquo;
              </span>
            </>
          )}
        </p>
        {chips.map(chip => (
          <span
            key={chip.key}
            className='inline-flex h-tsinelas-container-01 items-center gap-tsinelas-02 rounded-full bg-tsinelas-tag-background-navy pr-tsinelas-02 pl-tsinelas-03 text-tsinelas-tag-color-navy tsinelas-label-01'
          >
            {chip.label}
            <button
              type='button'
              onClick={chip.clear}
              aria-label={`Remove filter ${chip.label}`}
              className='flex size-tsinelas-icon-02 items-center justify-center rounded-full transition-colors duration-tsinelas-fast-01 hover:bg-tsinelas-tag-hover-navy tsinelas-focus'
            >
              <XIcon aria-hidden='true' className='size-tsinelas-04' />
            </button>
          </span>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title='No services found'
          message='Nothing matches these filters. Try a different word or clear the filters.'
          actionHref='/services/request'
          actionLabel='Suggest a service'
        />
      ) : (
        <CardGrid columns={results.length > 12 ? 3 : 2}>
          {results.slice(0, currentPage * ITEMS_PER_PAGE).map(service => (
            <ServiceCard key={service.slug} service={service} />
          ))}
          {hasMore && (
            <div
              ref={loadMoreRef}
              role='status'
              aria-label='Loading more services'
              className='col-span-full flex justify-center py-tsinelas-layout-03'
            >
              <div className='size-tsinelas-06 animate-spin rounded-full border-2 border-tsinelas-interactive border-t-transparent' />
            </div>
          )}
        </CardGrid>
      )}
    </div>
  );
}
