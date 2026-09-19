import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useOutletContext } from 'react-router-dom';

import { SearchXIcon, XIcon } from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import { CardGrid } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { lguLabels } from '@/lib/lguLabels';
import { filterServices } from '@/lib/services';

import serviceCategories from '@/data/service_categories.json';

import ServiceCard from './components/ServiceCard';
import FilterBar from './components/FilterBar';
import type { ServicesOutletContext } from './layout';

const ITEMS_PER_PAGE = 12;

export default function ServicesPage() {
  const {
    searchQuery,
    selectedCategorySlug,
    selectedOfficeDivision,
    selectedSource,
    selectedClassification,
    setOfficeDivision,
    setSource,
    setClassification,
  } = useOutletContext<ServicesOutletContext>();

  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 1. Filtering logic with new filters
  const filteredServices = useMemo(() => {
    return filterServices({
      category: selectedCategorySlug,
      officeDivision: selectedOfficeDivision,
      source: selectedSource,
      classification:
        selectedClassification !== 'all' ? selectedClassification : undefined,
      search: searchQuery || undefined,
    });
  }, [
    searchQuery,
    selectedCategorySlug,
    selectedOfficeDivision,
    selectedSource,
    selectedClassification,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategorySlug,
    selectedOfficeDivision,
    selectedSource,
    selectedClassification,
  ]);

  // 2. Pagination & Infinite Scroll logic
  const handleLoadMore = useCallback(() => {
    if (filteredServices.length > currentPage * ITEMS_PER_PAGE) {
      setCurrentPage(prev => prev + 1);
    }
  }, [filteredServices.length, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: '200px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  // --- SEO ---
  const activeCategory =
    selectedCategorySlug !== 'all'
      ? serviceCategories.categories.find(c => c.slug === selectedCategorySlug)
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

  const seoTag = (
    <SEO
      title={seoTitle}
      description={seoDescription}
      canonical={seoCanonical}
      breadcrumbs={seoBreadcrumbs}
    />
  );

  // 3. EMPTY STATE
  if (filteredServices.length === 0) {
    return (
      <>
        {seoTag}
        <EmptyState
          icon={SearchXIcon}
          title='No services found'
          message='Nothing matches these filters. Try a different word or clear the filters.'
          actionHref='/services/request'
          actionLabel='Suggest a service'
        />
      </>
    );
  }

  const chips = [
    selectedOfficeDivision !== 'all' && {
      label: selectedOfficeDivision,
      clear: () => setOfficeDivision('all'),
    },
    selectedSource !== 'all' && {
      label: selectedSource === 'citizens-charter' ? 'Official' : 'Community',
      clear: () => setSource('all'),
    },
    selectedClassification !== 'all' && {
      label: `${selectedClassification} transaction`,
      clear: () => setClassification('all'),
    },
  ].filter((c): c is { label: string; clear: () => void } => Boolean(c));

  return (
    <div className='animate-in fade-in space-y-tsinelas-05 duration-500'>
      {seoTag}

      <FilterBar
        selectedOfficeDivision={selectedOfficeDivision}
        selectedSource={selectedSource}
        selectedClassification={selectedClassification}
        onOfficeDivisionChange={setOfficeDivision}
        onSourceChange={setSource}
        onClassificationChange={setClassification}
      />

      {/* Result count and active filters */}
      <div className='flex flex-wrap items-center gap-x-tsinelas-04 gap-y-tsinelas-02'>
        <p
          aria-live='polite'
          className='tsinelas-label-01 text-tsinelas-text-secondary tsinelas-tabular'
        >
          {filteredServices.length.toLocaleString()}{' '}
          {filteredServices.length === 1 ? 'service' : 'services'}
        </p>
        {chips.map(chip => (
          <span
            key={chip.label}
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

      {/* Services Grid - Using CardGrid for consistency */}
      <CardGrid columns={filteredServices.length > 12 ? 3 : 2}>
        {filteredServices
          .slice(0, currentPage * ITEMS_PER_PAGE)
          .map(service => (
            <ServiceCard key={service.slug} service={service} />
          ))}

        {/* Infinite Scroll Loader */}
        {filteredServices.length > currentPage * ITEMS_PER_PAGE && (
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
    </div>
  );
}
