import { ReactNode } from 'react';

import { Link, useParams } from 'react-router-dom';

import { format, isValid } from 'date-fns';
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PencilLineIcon,
  PhoneIcon,
  SearchXIcon,
  ShieldCheckIcon,
} from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/navigation/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

import departmentsData from '@/data/directory/departments.json';
import executiveData from '@/data/directory/executive.json';
import legislativeData from '@/data/directory/legislative.json';
import { config } from '@/lib/lguConfig';
import { getServiceBySlug } from '@/lib/services';
import { toTitleCase } from '@/lib/stringUtils';
import { cn } from '@/lib/utils';
import type { QuickInfo, Service } from '@/types/servicesTypes';

import { FeeSchedule } from './components/FeeSchedule';
import { ProcessTimeline } from './components/ProcessTimeline';
import { RequirementList } from './components/RequirementList';
import { SupportingDocumentsDetail } from './components/SupportingDocumentsDetail';

const QUICK_INFO_LABELS: Record<keyof QuickInfo, string> = {
  processingTime: 'Processing time',
  fee: 'Fee',
  whoCanApply: 'Who can apply',
  appointmentType: 'Appointment',
  validity: 'Valid for',
  documents: 'Documents',
};

const FEE_SCHEDULE_ID = 'fee-schedule';

interface Fact {
  label: string;
  value: ReactNode;
  detail?: string;
}

/* ------------------------------------------------------------------------ */
/* Page-local layout pieces                                                 */
/* ------------------------------------------------------------------------ */

/** A titled region of the page, separated from the last by a hairline. */
function Section({
  id,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        'border-t border-tsinelas-border-subtle-00 pt-tsinelas-06',
        className
      )}
    >
      <h2
        id={headingId}
        className='tsinelas-heading-lg text-tsinelas-text-primary'
      >
        {title}
      </h2>
      {lede && (
        <p className='tsinelas-body-01 mt-tsinelas-02 max-w-2xl text-tsinelas-text-secondary'>
          {lede}
        </p>
      )}
      <div className='mt-tsinelas-05'>{children}</div>
    </section>
  );
}

/** Sidebar block: a small heading over its content. */
function AsideBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className='border-t border-tsinelas-border-subtle-00 pt-tsinelas-05'
    >
      <h2 className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
        {title}
      </h2>
      <div className='mt-tsinelas-03'>{children}</div>
    </section>
  );
}

/**
 * The at-a-glance strip: a definition list laid out as a hairline grid.
 * Each cell draws its own right and bottom rule and the list the top and
 * left, so a ragged last row still reads as rows, not as a hole. Columns
 * are auto-fit so four facts sit in one row on a wide screen.
 */
function FactGrid({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className='grid border-t border-l border-tsinelas-border-subtle-00 sm:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]'>
      {facts.map(fact => (
        <div
          key={fact.label}
          className='border-r border-b border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 px-tsinelas-05 py-tsinelas-04'
        >
          <dt className='tsinelas-label-01 text-tsinelas-text-secondary'>
            {fact.label}
          </dt>
          <dd className='tsinelas-heading-compact-02 mt-tsinelas-01 text-tsinelas-text-primary'>
            {fact.value}
          </dd>
          {fact.detail && (
            <dd className='tsinelas-label-01 mt-tsinelas-01 text-tsinelas-text-helper'>
              {fact.detail}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------------ */
/* Data shaping                                                             */
/* ------------------------------------------------------------------------ */

/** The charter records "None"/"" for free services and a bare number now
 * and then; make those read as a resident would say them. */
function formatFee(amount: string): string {
  const trimmed = amount.trim();
  if (!trimmed || /^(none|free|n\/a)$/i.test(trimmed)) return 'Free';
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `₱${trimmed}`;
  return trimmed;
}

/** Some charter strings arrive with a stray leading comma or dash. */
function tidy(value: string): string {
  return value.replace(/^[\s,;:–-]+/, '').trim();
}

function buildFacts(service: Service): Fact[] {
  const facts: Fact[] = [];
  const isOfficial = service.source === 'citizens-charter';

  if (isOfficial) {
    if (service.processingTime) {
      facts.push({
        label: 'Processing time',
        value: tidy(service.processingTime),
        detail: 'At the counter',
      });
    }
    if (service.turnaroundTime) {
      facts.push({
        label: 'Total turnaround',
        value: tidy(service.turnaroundTime),
        detail: 'Including review and release',
      });
    }
    if (service.fees?.amount) {
      const isSchedule = /schedule/i.test(service.fees.amount);
      facts.push({
        label: 'Fee',
        value:
          isSchedule && service.feeSchedule?.length ? (
            <a
              href={`#${FEE_SCHEDULE_ID}`}
              className='text-tsinelas-link-primary hover:underline tsinelas-focus'
            >
              See the fee schedule
            </a>
          ) : (
            formatFee(service.fees.amount)
          ),
        detail: service.fees.description || undefined,
      });
    }
    if (service.whoMayAvail) {
      facts.push({ label: 'Who can apply', value: service.whoMayAvail });
    }
  } else if (service.quickInfo) {
    for (const [key, value] of Object.entries(service.quickInfo) as [
      keyof QuickInfo,
      string,
    ][]) {
      if (value) facts.push({ label: QUICK_INFO_LABELS[key], value });
    }
  }

  return facts;
}

function findOffices(service: Service) {
  const slugs = Array.isArray(service.officeSlug)
    ? service.officeSlug
    : [service.officeSlug].filter(Boolean);

  return [
    ...departmentsData
      .filter(d => slugs.includes(d.slug))
      .map(d => ({
        slug: d.slug,
        name: toTitleCase(d.office_name),
        href: `/government/departments/${d.slug}`,
        address: d.address,
        phone: d.trunkline?.[0],
      })),
    ...executiveData
      .filter(e => slugs.includes(e.slug))
      .map(e => ({
        slug: e.slug,
        name: toTitleCase(e.role),
        href: `/government/executive/${e.slug}`,
        address: e.address,
        phone: Array.isArray(e.phone) ? e.phone[0] : e.phone,
      })),
    ...legislativeData
      .filter(l => slugs.includes(l.slug))
      .map(l => ({
        slug: l.slug,
        name: toTitleCase(l.chamber),
        href: `/government/legislative/${l.slug}`,
        address: l.address,
        phone: l.trunkline?.[0],
      })),
  ];
}

/* ------------------------------------------------------------------------ */
/* Page                                                                     */
/* ------------------------------------------------------------------------ */

export default function ServiceDetail() {
  const { service: serviceSlug } = useParams<{ service: string }>();
  const service = serviceSlug
    ? getServiceBySlug(decodeURIComponent(serviceSlug))
    : undefined;

  if (!service) {
    return (
      <>
        <SEO title='Service not found' noIndex />
        <EmptyState
          icon={SearchXIcon}
          title='Service not found'
          message='The address may be out of date, or the service may have been renamed. Browse the directory to find it.'
          actionHref='/services'
          actionLabel='Browse all services'
        />
      </>
    );
  }

  const isOfficial = service.source === 'citizens-charter';
  const isTransaction = service.type === 'transaction';
  const needsVerification = service.needsVerification === true;
  const displayName = service.plainLanguageName || service.service;
  const hasDistinctOfficialName =
    Boolean(service.plainLanguageName) &&
    service.plainLanguageName !== service.service;

  const updatedAt = service.updatedAt ? new Date(service.updatedAt) : null;
  const verifiedOn = updatedAt && isValid(updatedAt) ? updatedAt : null;

  const offices = findOffices(service);
  const facts = buildFacts(service);
  const actionUrl = service.website || service.url;
  const actionLabel = service.website
    ? 'Apply online'
    : isTransaction
      ? 'Open the online portal'
      : 'View the full document';

  const detailedRequirements = isOfficial
    ? (service.detailedRequirements ?? [])
    : [];
  const plainRequirements = isOfficial ? [] : (service.requirements ?? []);
  const supportingDetail =
    isOfficial && service.supportingDocumentsDetail
      ? service.supportingDocumentsDetail
      : null;
  const relatedServices = (service.relatedServices ?? [])
    .map(slug => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));

  // --- SEO ---
  const categoryHref = `/services?category=${service.category.slug}`;
  const seoDescription =
    service.description ||
    `${displayName} — a ${
      service.classification ? `${service.classification.toLowerCase()} ` : ''
    }government service from ${config.lgu.fullName}${
      offices[0] ? `, handled by the ${offices[0].name}` : ''
    }. See requirements, fees and how to apply.`;

  const seoBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: service.category.name, url: categoryHref },
    { name: displayName, url: `/services/${service.slug}` },
  ];

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: displayName,
    description: seoDescription,
    serviceType: service.category.name,
    provider: {
      '@type': 'GovernmentOrganization',
      name: config.lgu.fullName,
      url: config.portal.baseUrl,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${config.lgu.name}, ${config.lgu.province}`,
    },
    ...(service.whoMayAvail
      ? {
          audience: {
            '@type': 'Audience',
            audienceType: service.whoMayAvail,
          },
        }
      : {}),
  };

  const faqJsonLd =
    service.faqs && service.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  return (
    <article className='animate-in fade-in duration-500'>
      <SEO
        title={displayName}
        description={seoDescription}
        breadcrumbs={seoBreadcrumbs}
        jsonLd={faqJsonLd ? [serviceJsonLd, faqJsonLd] : serviceJsonLd}
      />

      <Breadcrumb className='py-0'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbHome href='/' />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/services'>Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={categoryHref}>
              {service.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{displayName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <header className='mt-tsinelas-05 border-b border-tsinelas-border-subtle-00 pb-tsinelas-06'>
        <p className='tsinelas-eyebrow text-tsinelas-text-secondary'>
          {isOfficial ? (
            <>
              {service.serviceNumber && (
                <>
                  <span className='tsinelas-tabular'>
                    Service no. {service.serviceNumber}
                  </span>
                  {offices[0] && <span aria-hidden='true'> · </span>}
                </>
              )}
              {offices[0]?.name}
            </>
          ) : (
            'Community contribution'
          )}
        </p>
        <h1 className='tsinelas-heading-xl mt-tsinelas-02 text-tsinelas-text-primary'>
          {displayName}
        </h1>
        {hasDistinctOfficialName && (
          <p className='tsinelas-body-01 mt-tsinelas-02 text-tsinelas-text-secondary'>
            Listed in the Citizens Charter as &ldquo;{service.service}&rdquo;.
          </p>
        )}
        {service.description && (
          <p className='tsinelas-body-02 mt-tsinelas-03 max-w-2xl text-tsinelas-text-secondary'>
            {service.description}
          </p>
        )}

        <div className='mt-tsinelas-04 flex flex-wrap items-center gap-tsinelas-02'>
          <Badge variant={isOfficial ? 'success' : 'secondary'} dot>
            {isOfficial ? 'Official' : 'Community'}
          </Badge>
          {service.classification && (
            <Badge variant='outline'>
              {service.classification} transaction
            </Badge>
          )}
          {service.typeOfTransaction && (
            <Badge variant='slate'>
              {service.typeOfTransaction === 'G2B'
                ? 'For businesses'
                : service.typeOfTransaction === 'G2G'
                  ? 'For government'
                  : 'For citizens'}
            </Badge>
          )}
          {actionUrl ? (
            <Badge variant='primary'>Online</Badge>
          ) : isTransaction ? (
            <Badge variant='slate'>Walk-in</Badge>
          ) : null}
          {needsVerification && (
            <Badge variant='warning' dot>
              Pending verification
            </Badge>
          )}
        </div>

        {actionUrl && (
          <div className='mt-tsinelas-05'>
            <a
              href={actionUrl}
              target='_blank'
              rel='noreferrer'
              className='inline-flex'
            >
              <Button
                size='lg'
                rightIcon={
                  <ExternalLinkIcon className='size-tsinelas-icon-01' />
                }
              >
                {actionLabel}
              </Button>
            </a>
          </div>
        )}
      </header>

      {facts.length > 0 && (
        <div className='mt-tsinelas-06'>
          <h2 className='sr-only'>At a glance</h2>
          <FactGrid facts={facts} />
        </div>
      )}

      {needsVerification && (
        <div className='mt-tsinelas-06'>
          <Banner
            type='warning'
            title='Details still being verified'
            description='This entry comes from the Citizens Charter, but its requirements, steps and fees have not been checked against the document yet.'
          />
        </div>
      )}

      <div className='mt-tsinelas-layout-03 xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-tsinelas-layout-04'>
        {/* Main column */}
        <div className='min-w-0 space-y-tsinelas-layout-03'>
          {detailedRequirements.length > 0 && (
            <Section
              id='requirements'
              title='What to bring'
              lede='Bring these to the office, or have them ready to upload.'
            >
              <RequirementList requirements={detailedRequirements} />
            </Section>
          )}

          {plainRequirements.length > 0 && (
            <Section id='requirements' title='What to bring'>
              <ul className='tsinelas-body-02 list-disc space-y-tsinelas-02 pl-tsinelas-06 text-tsinelas-text-primary'>
                {plainRequirements.map((item, idx) => (
                  <li key={idx} data-testid='requirement-card'>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {supportingDetail && (
            <Section id='supporting-documents' title='Supporting documents'>
              <SupportingDocumentsDetail detail={supportingDetail} />
            </Section>
          )}

          {isOfficial &&
            service.clientSteps &&
            service.clientSteps.length > 0 && (
              <Section id='how-to-apply' title='How to apply'>
                <ProcessTimeline steps={service.clientSteps} />
              </Section>
            )}

          {!isOfficial && service.steps && service.steps.length > 0 && (
            <Section
              id='how-to-apply'
              title={isTransaction ? 'How to apply' : 'What to know'}
            >
              <ol
                data-testid='process-timeline'
                className='space-y-tsinelas-04'
              >
                {service.steps.map((step, idx) => (
                  <li key={idx} className='flex gap-tsinelas-05'>
                    <span
                      aria-hidden='true'
                      className='tsinelas-heading-compact-01 tsinelas-tabular flex size-tsinelas-07 shrink-0 items-center justify-center border border-tsinelas-border-interactive text-tsinelas-interactive'
                    >
                      {idx + 1}
                    </span>
                    <p className='tsinelas-body-02 pt-tsinelas-02 text-tsinelas-text-primary'>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {service.feeSchedule && service.feeSchedule.length > 0 && (
            <Section
              id={FEE_SCHEDULE_ID}
              title='Fee schedule'
              lede='Amounts as published in the Citizens Charter.'
            >
              <FeeSchedule items={service.feeSchedule} />
            </Section>
          )}

          {service.faqs && service.faqs.length > 0 && (
            <Section id='faqs' title='Common questions'>
              <dl className='divide-y divide-tsinelas-border-subtle-00 border-y border-tsinelas-border-subtle-00'>
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className='py-tsinelas-04'>
                    <dt className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
                      {faq.question}
                    </dt>
                    <dd className='tsinelas-body-01 mt-tsinelas-02 text-tsinelas-text-secondary'>
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {relatedServices.length > 0 && (
            <Section id='related' title='Related services'>
              <ul className='divide-y divide-tsinelas-border-subtle-00 border-y border-tsinelas-border-subtle-00'>
                {relatedServices.map(related => (
                  <li key={related.slug}>
                    <Link
                      to={`/services/${related.slug}`}
                      className='group flex items-center justify-between gap-tsinelas-04 py-tsinelas-04 transition-colors duration-tsinelas-fast-01 hover:bg-tsinelas-layer-hover-01 tsinelas-focus'
                    >
                      <span>
                        <span className='tsinelas-heading-compact-01 block text-tsinelas-text-primary group-hover:text-tsinelas-link-primary'>
                          {related.plainLanguageName || related.service}
                        </span>
                        <span className='tsinelas-label-01 mt-tsinelas-01 block text-tsinelas-text-secondary'>
                          {related.category.name}
                        </span>
                      </span>
                      <ArrowRightIcon
                        aria-hidden='true'
                        className='size-tsinelas-icon-01 shrink-0 text-tsinelas-icon-secondary'
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {service.sources && service.sources.length > 0 && (
            <Section id='sources' title='Sources'>
              <ul className='tsinelas-body-01 list-disc space-y-tsinelas-02 pl-tsinelas-06 text-tsinelas-text-secondary'>
                {service.sources.map((source, idx) => (
                  <li key={idx}>
                    {source.url ? (
                      <a
                        href={source.url}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-tsinelas-02 text-tsinelas-link-primary hover:underline tsinelas-focus'
                      >
                        {source.name}
                        <ExternalLinkIcon
                          aria-hidden='true'
                          className='size-tsinelas-icon-01'
                        />
                      </a>
                    ) : (
                      source.name
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Aside */}
        <aside className='mt-tsinelas-layout-03 space-y-tsinelas-06 xl:mt-0'>
          {offices.length > 0 && (
            <AsideBlock
              title={
                offices.length > 1
                  ? 'Responsible offices'
                  : 'Responsible office'
              }
            >
              <ul className='space-y-tsinelas-05'>
                {offices.map(office => (
                  <li key={office.slug}>
                    <Link
                      to={office.href}
                      className='tsinelas-heading-compact-01 inline-flex items-center gap-tsinelas-02 text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus'
                    >
                      {office.name}
                      <ArrowRightIcon
                        aria-hidden='true'
                        className='size-tsinelas-icon-01'
                      />
                    </Link>
                    {(office.address || office.phone) && (
                      <address className='tsinelas-label-01 mt-tsinelas-02 space-y-tsinelas-01 text-tsinelas-text-secondary not-italic'>
                        {office.address && (
                          <p className='flex items-start gap-tsinelas-02'>
                            <MapPinIcon
                              aria-hidden='true'
                              className='mt-[1px] size-tsinelas-04 shrink-0 text-tsinelas-icon-secondary'
                            />
                            {office.address}
                          </p>
                        )}
                        {office.phone && (
                          <p className='flex items-start gap-tsinelas-02'>
                            <PhoneIcon
                              aria-hidden='true'
                              className='mt-[1px] size-tsinelas-04 shrink-0 text-tsinelas-icon-secondary'
                            />
                            <span className='tsinelas-tabular'>
                              {office.phone}
                            </span>
                          </p>
                        )}
                      </address>
                    )}
                  </li>
                ))}
              </ul>
            </AsideBlock>
          )}

          <AsideBlock title='About this information'>
            <p className='tsinelas-label-01 flex items-start gap-tsinelas-02 text-tsinelas-text-secondary'>
              {isOfficial || verifiedOn ? (
                <ShieldCheckIcon
                  aria-hidden='true'
                  className='mt-[1px] size-tsinelas-04 shrink-0 text-tsinelas-support-success'
                />
              ) : (
                <span
                  aria-hidden='true'
                  className='mt-[6px] size-tsinelas-02 shrink-0 rounded-full bg-tsinelas-icon-disabled'
                />
              )}
              <span>
                {isOfficial
                  ? `From the ${config.lgu.name} Citizens Charter.`
                  : verifiedOn
                    ? `Contributed by the community and last checked ${format(verifiedOn, 'MMMM yyyy')}.`
                    : 'Contributed by the community and not yet verified against an official source.'}
              </span>
            </p>
          </AsideBlock>

          <div className='bg-tsinelas-layer-01 p-tsinelas-05'>
            <h2 className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
              Spotted something wrong?
            </h2>
            <p className='tsinelas-body-01 mt-tsinelas-02 text-tsinelas-text-secondary'>
              Fees and requirements change. Tell us and we will check it against
              the office.
            </p>
            <div className='mt-tsinelas-04'>
              <Link
                to={`/services/request?type=update&service=${encodeURIComponent(service.slug)}`}
                className='inline-flex'
              >
                <Button
                  variant='tertiary'
                  size='sm'
                  rightIcon={
                    <PencilLineIcon className='size-tsinelas-icon-01' />
                  }
                >
                  Suggest an edit
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
