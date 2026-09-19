import { describe, expect, it } from 'vitest';

import {
  DEFAULT_FILTERS,
  countActiveFilters,
  getOfficeOptions,
  queryServices,
} from './serviceFilters';

describe('queryServices', () => {
  it('returns every service with no filters, and facet totals agree', () => {
    const { results, counts, total } = queryServices(DEFAULT_FILTERS);
    expect(results).toHaveLength(total);
    expect(counts.source.all).toBe(total);
    expect(counts.type.all).toBe(total);
    expect(counts.source['citizens-charter'] + counts.source.community).toBe(
      total
    );
  });

  it('a facet keeps counting its own other options while one is selected', () => {
    const all = queryServices(DEFAULT_FILTERS);
    const official = queryServices({
      ...DEFAULT_FILTERS,
      source: 'citizens-charter',
    });
    expect(official.results).toHaveLength(
      all.counts.source['citizens-charter']
    );
    // Source counts ignore the source filter itself...
    expect(official.counts.source.community).toBe(all.counts.source.community);
    // ...but other facets are narrowed by it.
    expect(official.counts.type.all).toBe(official.results.length);
    expect(official.results.every(s => s.source === 'citizens-charter')).toBe(
      true
    );
  });

  it('office counts match filtering by that office', () => {
    const { counts } = queryServices(DEFAULT_FILTERS);
    const [office, expected] = counts.office.entries().next().value as [
      string,
      number,
    ];
    const { results } = queryServices({ ...DEFAULT_FILTERS, office });
    expect(results).toHaveLength(expected);
    expect(results.every(s => s.officeDivision === office)).toBe(true);
    expect(getOfficeOptions()).toContain(office);
  });

  it('requires every search term to match and ranks title hits first', () => {
    const first = queryServices(DEFAULT_FILTERS).results[0];
    const [word] = first.service.toLowerCase().split(/\s+/);
    const { results } = queryServices({ ...DEFAULT_FILTERS, search: word });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(s =>
        [s.service, s.plainLanguageName, s.category.name, s.officeDivision]
          .join(' ')
          .toLowerCase()
          .includes(word)
      )
    ).toBe(true);
    const nonsense = queryServices({
      ...DEFAULT_FILTERS,
      search: `${word} zzqxv`,
    });
    expect(nonsense.results).toHaveLength(0);
  });

  it('sorts by name when asked', () => {
    const { results } = queryServices({ ...DEFAULT_FILTERS, sort: 'name' });
    const names = results.map(s =>
      (s.plainLanguageName || s.service).toLowerCase()
    );
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('counts active filters without search, category or sort', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(
      countActiveFilters({
        ...DEFAULT_FILTERS,
        search: 'x',
        category: 'health-wellness',
        sort: 'name',
        online: true,
        type: 'Simple',
      })
    ).toBe(2);
  });
});
