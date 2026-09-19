import { Outlet, useLocation } from 'react-router-dom';

import {
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import { PageHeader } from '@/components/layout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import SearchInput from '@/components/ui/SearchInput';

import {
  CLASSIFICATION_VALUES,
  DEFAULT_FILTERS,
  SORT_VALUES,
  SOURCE_VALUES,
  type ServiceFilterState,
} from '@/lib/serviceFilters';

import ServicesSidebar from './components/ServicesSidebar';

export type { ClassificationFilter, SourceFilter } from '@/lib/serviceFilters';

export interface ServicesOutletContext {
  filters: ServiceFilterState;
  setFilters: (patch: Partial<ServiceFilterState>) => void;
  resetFilters: () => void;
}

/* Every filter lives in the URL, so a filtered view is linkable, survives a
 * trip to a detail page and back, and the browser's history works. Keys
 * keep the names other pages link with (`category`, `search`). */
const filterParsers = {
  category: parseAsString.withDefault(DEFAULT_FILTERS.category),
  search: parseAsString.withDefault(DEFAULT_FILTERS.search),
  office: parseAsString.withDefault(DEFAULT_FILTERS.office),
  source: parseAsStringLiteral(SOURCE_VALUES).withDefault(
    DEFAULT_FILTERS.source
  ),
  type: parseAsStringLiteral(CLASSIFICATION_VALUES).withDefault(
    DEFAULT_FILTERS.type
  ),
  online: parseAsBoolean.withDefault(DEFAULT_FILTERS.online),
  sort: parseAsStringLiteral(SORT_VALUES).withDefault(DEFAULT_FILTERS.sort),
};

export default function ServicesLayout() {
  const location = useLocation();
  const isIndexPage =
    location.pathname === '/services' || location.pathname === '/services/';

  const [filters, setQuery] = useQueryStates(filterParsers, {
    history: 'replace',
    // Typing updates state at once; the URL is written at most every 200ms.
    throttleMs: 200,
    clearOnDefault: true,
  });

  const setFilters = (patch: Partial<ServiceFilterState>) => setQuery(patch);
  const resetFilters = () =>
    setQuery({
      office: null,
      source: null,
      type: null,
      online: null,
    });

  return (
    <SidebarLayout
      collapsible={true}
      defaultCollapsed={!isIndexPage}
      sidebarLabel='Browse by category'
      headerNode={
        isIndexPage ? (
          <PageHeader
            variant='hero'
            title='Government services'
            description='Requirements, fees and steps for municipal services, from the Citizens Charter and community contributions. Pick a category or search.'
            actions={
              <SearchInput
                placeholder='Search services, e.g. business permit'
                value={filters.search}
                onChangeValue={search => setFilters({ search })}
                size='lg'
                clearable
                aria-label='Search services'
              />
            }
          />
        ) : (
          <PageHeader
            variant='compact'
            title='Service directory'
            description='Requirements, fees and how to apply.'
            autoBreadcrumbs={true}
          />
        )
      }
      sidebar={
        <ServicesSidebar
          selectedCategorySlug={filters.category}
          handleCategoryChange={category => setFilters({ category })}
        />
      }
    >
      <Outlet
        context={
          { filters, setFilters, resetFilters } satisfies ServicesOutletContext
        }
      />
    </SidebarLayout>
  );
}
