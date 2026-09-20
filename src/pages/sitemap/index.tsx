import { FC } from 'react';

import { Link } from 'react-router-dom';

import { ArrowUpRightIcon } from 'lucide-react';

import { PageHeader } from '@/components/layout';
import { SEO } from '@/components/layout/SEO';

import barangaysData from '@/data/directory/barangays.json';
import departmentsData from '@/data/directory/departments.json';
import serviceCategories from '@/data/service_categories.json';
import { config } from '@/lib/lguConfig';
import { lguLabels } from '@/lib/lguLabels';
import { getMergedServices } from '@/lib/services';
import { toTitleCase } from '@/lib/stringUtils';
import { cn } from '@/lib/utils';

interface SitemapLink {
  label: string;
  href: string;
  /** Shown under the label, one line. */
  note?: string;
  children?: SitemapLink[];
}

interface SitemapSection {
  id: string;
  title: string;
  /** Count shown beside the title, e.g. the number of departments. */
  count?: number;
  links: SitemapLink[];
  /** Lay the links out in two columns and let the section span two grid
   * columns; for long flat lists like the departments. */
  wide?: boolean;
}

/* The tree mirrors src/App.tsx and scripts/generate-sitemap.js. Keep the
 * three in step when routes change. */
function buildSections(): SitemapSection[] {
  const sections: SitemapSection[] = [
    {
      id: 'portal',
      title: 'About the portal',
      links: [
        { label: 'Home', href: '/' },
        { label: `About ${config.portal.name}`, href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Join us', href: '/join-us' },
        { label: 'Contribute', href: '/contribute' },
        { label: 'Ideas', href: '/ideas' },
        { label: 'Discord community', href: '/discord' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Terms of service', href: '/terms-of-service' },
        { label: 'Search the portal', href: '/search' },
        { label: 'Weather', href: '/data/weather' },
        { label: 'Foreign exchange rates', href: '/data/forex' },
      ],
    },
    {
      id: 'services',
      title: 'Services',
      count: getMergedServices().length,
      links: [
        {
          label: 'All services',
          href: '/services',
          note: 'Requirements, fees and how to apply',
          children: serviceCategories.categories.map(category => ({
            label: category.name,
            href: `/services?category=${category.slug}`,
          })),
        },
        {
          label: 'Suggest a service or a correction',
          href: '/services/request',
        },
      ],
    },
    {
      id: 'government',
      title: 'Government',
      links: [
        {
          label: 'Elected officials',
          href: '/government/elected-officials',
          children: [
            {
              label: 'Council committees',
              href: '/government/elected-officials/committees',
            },
          ],
        },
        { label: 'Departments and offices', href: '/government/departments' },
        { label: 'Barangays', href: '/government/barangays' },
      ],
    },
  ];

  if (config.features.statistics) {
    sections.push({
      id: 'statistics',
      title: 'Statistics',
      links: [
        { label: 'Population', href: '/statistics/population' },
        {
          label: `${lguLabels.adjective} income`,
          href: '/statistics/municipal-income',
        },
        { label: 'Competitiveness', href: '/statistics/competitiveness' },
      ],
    });
  }

  if (config.features.openLGU) {
    sections.push({
      id: 'openlgu',
      title: 'OpenLGU',
      links: [
        {
          label: 'Legislation',
          href: '/openlgu',
          note: 'Ordinances, resolutions and executive orders',
          children: [
            { label: 'Ordinances', href: '/openlgu?type=ordinance' },
            { label: 'Resolutions', href: '/openlgu?type=resolution' },
            {
              label: 'Executive orders',
              href: '/openlgu?type=executive_order',
            },
          ],
        },
        { label: 'Officials', href: '/openlgu/officials' },
        { label: 'Council terms', href: '/openlgu/terms' },
      ],
    });
  }

  if (config.features.transparency) {
    sections.push({
      id: 'transparency',
      title: 'Transparency',
      links: [
        { label: 'Overview', href: '/transparency' },
        { label: 'Financial reports', href: '/transparency/financial' },
        { label: 'Procurement', href: '/transparency/procurement' },
        {
          label: 'Infrastructure projects',
          href: '/transparency/infrastructure',
        },
      ],
    });
  }

  sections.push(
    {
      id: 'departments',
      title: 'Departments and offices',
      count: departmentsData.length,
      wide: true,
      links: departmentsData.map(d => ({
        label: toTitleCase(d.office_name),
        href: `/government/departments/${d.slug}`,
      })),
    },
    {
      id: 'barangays',
      title: 'Barangays',
      count: barangaysData.length,
      links: barangaysData.map(b => ({
        label: toTitleCase(b.barangay_name),
        href: `/government/barangays/${b.slug}`,
      })),
    }
  );

  return sections;
}

const linkClasses =
  'inline-flex items-center gap-tsinelas-02 text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus';

function SitemapAnchor({ link }: { link: SitemapLink }) {
  if (link.href.startsWith('http')) {
    return (
      <a
        href={link.href}
        target='_blank'
        rel='noreferrer'
        className={linkClasses}
      >
        {link.label}
        <ArrowUpRightIcon
          aria-hidden='true'
          className='size-tsinelas-04 shrink-0 opacity-70'
        />
      </a>
    );
  }
  return (
    <Link to={link.href} className={linkClasses}>
      {link.label}
    </Link>
  );
}

function LinkList({
  links,
  columns = false,
}: {
  links: SitemapLink[];
  columns?: boolean;
}) {
  return (
    <ul
      className={cn(
        'tsinelas-body-01 space-y-tsinelas-02',
        columns && 'sm:columns-2 sm:gap-tsinelas-layout-03'
      )}
    >
      {links.map(link => (
        <li key={link.href} className='break-inside-avoid'>
          <SitemapAnchor link={link} />
          {link.note && (
            <p className='tsinelas-label-01 text-tsinelas-text-secondary'>
              {link.note}
            </p>
          )}
          {link.children && link.children.length > 0 && (
            <ul className='tsinelas-body-compact-01 mt-tsinelas-02 mb-tsinelas-03 space-y-tsinelas-01 border-l border-tsinelas-border-subtle-01 pl-tsinelas-04'>
              {link.children.map(child => (
                <li key={child.href}>
                  <SitemapAnchor link={child} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Sitemap — every public page as an index a person can scan, grouped the
 * way the navigation groups them. Feature-gated modules only appear when
 * the flag is on, and the directories are read from the same JSON the
 * pages render from.
 */
const SitemapPage: FC = () => {
  const sections = buildSections();

  return (
    <>
      <SEO
        title='Sitemap'
        description={`Every page on ${config.portal.name}: services, government offices, barangays, legislation, transparency reports and more.`}
        keywords={['sitemap', 'site map', 'index', config.lgu.name]}
      />

      <PageHeader
        variant='compact'
        title='Sitemap'
        description={`Every public page on ${config.portal.name}, grouped the way the menu groups them. The XML version for search engines is at /sitemap.xml.`}
      />

      <div className='container py-tsinelas-layout-04 md:py-tsinelas-layout-05'>
        <div className='grid gap-x-tsinelas-layout-04 gap-y-tsinelas-layout-04 md:grid-cols-2 xl:grid-cols-3'>
          {sections.map(section => (
            <section
              key={section.id}
              aria-labelledby={`sitemap-${section.id}`}
              className={cn(section.wide && 'md:col-span-2')}
            >
              <h2
                id={`sitemap-${section.id}`}
                className='tsinelas-heading-md flex items-baseline gap-tsinelas-03 border-b border-tsinelas-border-subtle-00 pb-tsinelas-03 text-tsinelas-text-primary'
              >
                {section.title}
                {section.count !== undefined && (
                  <span className='tsinelas-label-01 tsinelas-tabular text-tsinelas-text-helper'>
                    {section.count}
                  </span>
                )}
              </h2>
              <div className='mt-tsinelas-04'>
                <LinkList links={section.links} columns={section.wide} />
              </div>
            </section>
          ))}
        </div>

        <p className='tsinelas-body-01 mt-tsinelas-layout-05 border-t border-tsinelas-border-subtle-00 pt-tsinelas-05 text-tsinelas-text-secondary'>
          Looking for a specific office or service?{' '}
          <Link to='/search' className={linkClasses}>
            Search the portal
          </Link>{' '}
          or{' '}
          <Link to='/contact' className={linkClasses}>
            ask us
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default SitemapPage;
