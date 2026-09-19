import { getMergedServices, normalizeCategorySlug } from '@/lib/services';

import type { Service } from '@/types/servicesTypes';

export const SOURCE_VALUES = ['all', 'citizens-charter', 'community'] as const;
export const CLASSIFICATION_VALUES = ['all', 'Simple', 'Complex'] as const;
export const SORT_VALUES = ['relevance', 'name', 'updated'] as const;

export type SourceFilter = (typeof SOURCE_VALUES)[number];
export type ClassificationFilter = (typeof CLASSIFICATION_VALUES)[number];
export type SortOrder = (typeof SORT_VALUES)[number];

export interface ServiceFilterState {
  category: string;
  search: string;
  office: string;
  source: SourceFilter;
  type: ClassificationFilter;
  online: boolean;
  sort: SortOrder;
}

export const DEFAULT_FILTERS: ServiceFilterState = {
  category: 'all',
  search: '',
  office: 'all',
  source: 'all',
  type: 'all',
  online: false,
  sort: 'relevance',
};

export interface FacetCounts {
  source: Record<SourceFilter, number>;
  type: Record<ClassificationFilter, number>;
  office: Map<string, number>;
  online: number;
}

interface IndexedService {
  service: Service;
  categorySlug: string;
  /** Lower-cased searchable text, built once. */
  haystack: string;
  name: string;
  updatedAt: number;
  online: boolean;
}

let index: IndexedService[] | undefined;

/** Builds the search index once per session; the dataset is static JSON. */
export function getServiceIndex(): IndexedService[] {
  if (!index) {
    index = getMergedServices().map(service => ({
      service,
      categorySlug: service.category.slug,
      haystack: [
        service.service,
        service.plainLanguageName,
        service.category.name,
        service.officeDivision,
        service.description,
        service.serviceNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
      name: (service.plainLanguageName || service.service).toLowerCase(),
      updatedAt: service.updatedAt ? Date.parse(service.updatedAt) || 0 : 0,
      online: Boolean(service.url),
    }));
  }
  return index;
}

export function getOfficeOptions(): string[] {
  return Array.from(
    new Set(
      getServiceIndex()
        .map(({ service }) => service.officeDivision)
        .filter((office): office is string => Boolean(office))
    )
  ).sort((a, b) => a.localeCompare(b));
}

/** Every whitespace-separated term must appear somewhere in the record. */
function tokenize(search: string): string[] {
  return search.toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesSearch(item: IndexedService, terms: string[]): boolean {
  for (const term of terms) {
    if (!item.haystack.includes(term)) return false;
  }
  return true;
}

/** Ranks a search hit: title starts with the query, then title contains it. */
function relevance(item: IndexedService, search: string): number {
  if (!search) return 0;
  if (item.name.startsWith(search)) return 0;
  if (item.name.includes(search)) return 1;
  return 2;
}

/**
 * Applies the filters and returns results plus facet counts in a single
 * pass. A facet's counts ignore its own dimension (choosing "Official"
 * still shows how many "Community" services the other filters allow),
 * which is what lets the UI grey out options that would return nothing.
 */
export function queryServices(state: ServiceFilterState): {
  results: Service[];
  counts: FacetCounts;
  total: number;
} {
  const items = getServiceIndex();
  const category =
    state.category !== 'all' ? normalizeCategorySlug(state.category) : null;
  const terms = tokenize(state.search);
  const search = state.search.trim().toLowerCase();

  const counts: FacetCounts = {
    source: { all: 0, 'citizens-charter': 0, community: 0 },
    type: { all: 0, Simple: 0, Complex: 0 },
    office: new Map(),
    online: 0,
  };
  const hits: { item: IndexedService; rank: number }[] = [];

  for (const item of items) {
    const { service } = item;
    if (category && item.categorySlug !== category) continue;
    if (terms.length > 0 && !matchesSearch(item, terms)) continue;

    const passSource =
      state.source === 'all' || service.source === state.source;
    const passType =
      state.type === 'all' || service.classification === state.type;
    const passOffice =
      state.office === 'all' || service.officeDivision === state.office;
    const passOnline = !state.online || item.online;

    if (passType && passOffice && passOnline) {
      counts.source.all += 1;
      if (
        service.source === 'citizens-charter' ||
        service.source === 'community'
      ) {
        counts.source[service.source] += 1;
      }
    }
    if (passSource && passOffice && passOnline) {
      counts.type.all += 1;
      if (
        service.classification === 'Simple' ||
        service.classification === 'Complex'
      ) {
        counts.type[service.classification] += 1;
      }
    }
    if (passSource && passType && passOnline && service.officeDivision) {
      counts.office.set(
        service.officeDivision,
        (counts.office.get(service.officeDivision) ?? 0) + 1
      );
    }
    if (passSource && passType && passOffice && item.online) {
      counts.online += 1;
    }

    if (passSource && passType && passOffice && passOnline) {
      hits.push({ item, rank: relevance(item, search) });
    }
  }

  if (state.sort === 'name') {
    hits.sort((a, b) => a.item.name.localeCompare(b.item.name));
  } else if (state.sort === 'updated') {
    hits.sort((a, b) => b.item.updatedAt - a.item.updatedAt);
  } else if (search) {
    hits.sort((a, b) => a.rank - b.rank);
  }

  return {
    results: hits.map(h => h.item.service),
    counts,
    total: items.length,
  };
}

/** Number of non-default filters, excluding search, category and sort. */
export function countActiveFilters(state: ServiceFilterState): number {
  return (
    (state.office !== 'all' ? 1 : 0) +
    (state.source !== 'all' ? 1 : 0) +
    (state.type !== 'all' ? 1 : 0) +
    (state.online ? 1 : 0)
  );
}
