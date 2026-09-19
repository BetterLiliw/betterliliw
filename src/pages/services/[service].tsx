import { Link, useParams } from 'react-router-dom';

import { format, isValid } from 'date-fns';
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  BookOpen,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2Icon,
  ClipboardList,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  HeartHandshake,
  Info,
  LinkIcon,
  LucideIcon,
  Users,
} from 'lucide-react';

import { DetailSection, useBreadcrumbs } from '@/components/layout';
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
import { Card } from '@/components/ui/Card';
import { RequirementGrid } from './components/RequirementGrid';
import { ProcessTimeline } from './components/ProcessTimeline';
import { SupportingDocumentsDetail } from './components/SupportingDocumentsDetail';
import { FeesCard } from './components/FeesCard';

import { getServiceBySlug } from '@/lib/services';
import { config } from '@/lib/lguConfig';
import { toTitleCase } from '@/lib/stringUtils';

import departmentsData from '@/data/directory/departments.json';
import executiveData from '@/data/directory/executive.json';
import legislativeData from '@/data/directory/legislative.json';

import type { QuickInfo, Source } from '@/types/servicesTypes';

const QUICK_INFO_CONFIG: Record<
  keyof QuickInfo,
  { label: string; icon: LucideIcon }
> = {
  processingTime: { label: 'Processing Time', icon: Clock },
  fee: { label: 'Fee', icon: Banknote },
  whoCanApply: { label: 'Who Can Apply', icon: Users },
  appointmentType: { label: 'Appointment Type', icon: Calendar },
  validity: { label: 'Validity Period', icon: CalendarCheck },
  documents: { label: 'Documents Required', icon: FileText },
};

export default function ServiceDetail() {
  const { service: serviceSlug } = useParams<{ service: string }>();

  // Auto-generate breadcrumbs using the hook (must be called before early returns)
  const breadcrumbs = useBreadcrumbs();

  if (!serviceSlug) return null;

  const service = getServiceBySlug(decodeURIComponent(serviceSlug));
  if (!service)
    return (
      <div className='text-tsinelas-text-disabled p-20 text-center font-bold tracking-widest uppercase'>
        Service not found
      </div>
    );

  const officeSlugs = Array.isArray(service.officeSlug)
    ? service.officeSlug
    : [service.officeSlug].filter(Boolean);

  // Collect offices from all sources (departments, executive, legislative)
  const involvedOffices = [
    ...departmentsData
      .filter(d => officeSlugs.includes(d.slug))
      .map(d => ({
        slug: d.slug,
        name: d.office_name,
        type: 'department',
      })),
    ...executiveData
      .filter(e => officeSlugs.includes(e.slug))
      .map(e => ({
        slug: e.slug,
        name: e.role,
        type: 'executive',
      })),
    ...legislativeData
      .filter(l => officeSlugs.includes(l.slug))
      .map(l => ({
        slug: l.slug,
        name: l.chamber,
        type: 'legislative',
      })),
  ];
  const isTransaction = service.type === 'transaction';
  const updatedAtDate = service.updatedAt ? new Date(service.updatedAt) : null;
  const isVerified = updatedAtDate !== null && isValid(updatedAtDate);

  // Citizens Charter specific
  const isOfficialSource = service.source === 'citizens-charter';
  const needsVerification = service.needsVerification === true;

  const quickInfoArray = service.quickInfo
    ? (Object.entries(service.quickInfo) as [keyof QuickInfo, string][]).map(
        ([key, value]) => ({
          label: QUICK_INFO_CONFIG[key]?.label || key,
          icon: QUICK_INFO_CONFIG[key]?.icon || FileText,
          value,
        })
      )
    : [];

  // Build Citizens Charter specific info items
  const ccInfoItems: { label: string; value: string; icon: LucideIcon }[] = [];
  if (service.processingTime) {
    ccInfoItems.push({
      label: 'Processing Time',
      value: service.processingTime,
      icon: Clock,
    });
  }
  if (service.whoMayAvail) {
    ccInfoItems.push({
      label: 'Who Can Apply',
      value: service.whoMayAvail,
      icon: Users,
    });
  }
  if (service.classification) {
    ccInfoItems.push({
      label: 'Classification',
      value: service.classification,
      icon: FileText,
    });
  }

  // --- SEO ---
  const displayName = service.plainLanguageName || service.service;
  const seoDescription =
    service.description ||
    `${displayName} — a ${service.classification ? `${service.classification.toLowerCase()} ` : ''}government service from ${config.lgu.fullName}${
      service.officeDivision
        ? `, handled by ${toTitleCase(service.officeDivision)}`
        : ''
    }. See requirements, fees and how to apply.`;

  const seoBreadcrumbs = breadcrumbs.map((crumb, index) => ({
    name: index === breadcrumbs.length - 1 ? displayName : crumb.label,
    url: crumb.href,
  }));

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
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className='animate-in fade-in mx-auto max-w-7xl space-y-6 duration-500'>
      <SEO
        title={displayName}
        description={seoDescription}
        breadcrumbs={seoBreadcrumbs}
        jsonLd={faqJsonLd ? [serviceJsonLd, faqJsonLd] : serviceJsonLd}
      />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={crumb.href} className='flex items-center gap-2'>
                {index === 0 ? (
                  <BreadcrumbItem>
                    <BreadcrumbHome href={crumb.href} />
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>
                          {service.plainLanguageName || service.service}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* HEADER */}
      <header
        className={`border-tsinelas-border-weak bg-tsinelas-bg-surface overflow-hidden rounded-3xl border p-8 shadow-sm md:p-10 ${
          isOfficialSource ? 'border-l-4 border-l-tsinelas-border-success' : ''
        }`}
      >
        <div className='max-w-3xl'>
          <div className='mb-6 flex flex-wrap items-center gap-2'>
            <Badge variant='primary'>{service.category.name}</Badge>
            <Badge variant={isTransaction ? 'success' : 'secondary'} dot>
              {isTransaction ? 'Transactional' : 'Resource'}
            </Badge>
            <Badge variant={isOfficialSource ? 'success' : 'secondary'} dot>
              {isOfficialSource ? 'Official (CC)' : 'Community'}
            </Badge>
            {service.serviceNumber && (
              <Badge variant='outline'>
                Service No. {service.serviceNumber}
              </Badge>
            )}
            {needsVerification && (
              <Badge variant='warning' dot>
                Pending Verification
              </Badge>
            )}
          </div>

          <h1 className='text-tsinelas-text-strong tsinelas-heading-xl font-extrabold'>
            {service.plainLanguageName || service.service}
          </h1>

          {service.description && (
            <p className='text-tsinelas-text-support mb-8 max-w-2xl text-base leading-relaxed'>
              &quot;{service.description}&quot;
            </p>
          )}

          {/* Who May Avail (Citizens Charter) */}
          {service.whoMayAvail && !needsVerification && (
            <div className='border-tsinelas-border-weak bg-tsinelas-bg-surface-raised mb-8 rounded-xl border p-4'>
              <p className='text-tsinelas-text-support text-sm font-medium'>
                <span className='text-tsinelas-text-brand font-semibold'>
                  Who may avail:{' '}
                </span>
                {service.whoMayAvail}
              </p>
            </div>
          )}

          {/* SINGLE PRIMARY ACTION */}
          {service.website && (
            <a
              href={service.website}
              target='_blank'
              rel='noreferrer'
              className='bg-tsinelas-bg-brand-default hover:bg-tsinelas-bg-brand-weak text-tsinelas-text-inverse inline-flex min-h-[48px] items-center gap-3 rounded-xl px-6 py-3 font-semibold shadow-sm transition-all'
            >
              Access Online Portal
              <ExternalLink className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </a>
          )}
          {service.url && !service.website && (
            <a
              href={service.url}
              target='_blank'
              rel='noreferrer'
              className='bg-tsinelas-bg-brand-default hover:bg-tsinelas-bg-brand-weak text-tsinelas-text-inverse inline-flex min-h-[48px] items-center gap-3 rounded-xl px-6 py-3 font-semibold shadow-sm transition-all'
            >
              {isTransaction ? 'Access Online Portal' : 'View Full Document'}
              <ExternalLink className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </a>
          )}
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className='flex flex-col gap-8 xl:flex-row'>
        <div className='min-w-0 flex-1 space-y-8'>
          {/* Citizens Charter Info Grid (processing time, fees, etc.) */}
          {isOfficialSource && ccInfoItems.length > 0 && (
            <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
              {ccInfoItems.map((info, idx) => (
                <div
                  key={idx}
                  className='border-tsinelas-border-weak bg-tsinelas-bg-surface flex items-start gap-3 rounded-2xl border p-4 shadow-xs'
                >
                  <div className='text-tsinelas-text-brand bg-tsinelas-bg-surface-raised shrink-0 rounded-lg p-2'>
                    <info.icon className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-tsinelas-text-disabled mb-1 tsinelas-eyebrow'>
                      {info.label}
                    </p>
                    <p className='text-tsinelas-text-strong text-xs font-bold'>
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fees Card (Citizens Charter) */}
          {isOfficialSource && service.fees && <FeesCard fees={service.fees} />}

          {/* Pending Verification Notice */}
          {needsVerification && (
            <div className='border-tsinelas-border-warning bg-tsinelas-bg-warning-weak/30 flex items-start gap-3 rounded-2xl border p-4'>
              <Info className='text-tsinelas-text-warning h-5 w-5 shrink-0' />
              <div>
                <p className='text-tsinelas-text-strong mb-1 text-sm font-bold'>
                  Detailed Information Pending Verification
                </p>
                <p className='text-tsinelas-text-support text-xs leading-relaxed'>
                  This service data is from the Citizens Charter document.
                  Detailed requirements, steps, and fee information will be
                  added as we verify and extract data from the official
                  document.
                </p>
              </div>
            </div>
          )}

          {/* Requirements (Citizens Charter) */}
          {isOfficialSource &&
            service.detailedRequirements &&
            service.detailedRequirements.length > 0 && (
              <RequirementGrid requirements={service.detailedRequirements} />
            )}

          {/* Supporting Documents Detail (Citizens Charter - optional) */}
          {isOfficialSource &&
            service.supportingDocumentsDetail &&
            Object.keys(service.supportingDocumentsDetail).length > 0 && (
              <div className='space-y-4'>
                <SupportingDocumentsDetail
                  detail={service.supportingDocumentsDetail}
                />
              </div>
            )}

          {/* Process Timeline (Citizens Charter) */}
          {isOfficialSource &&
            service.clientSteps &&
            service.clientSteps.length > 0 && (
              <ProcessTimeline steps={service.clientSteps} />
            )}

          {/* Regular Steps (community services) */}
          {!isOfficialSource && service.steps && service.steps.length > 0 && (
            <DetailSection
              title={isTransaction ? 'Process Steps' : 'Information Details'}
              icon={ClipboardList}
            >
              <div className='space-y-6'>
                {service.steps.map((step, idx) => (
                  <div key={idx} className='group flex gap-4'>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                        isTransaction
                          ? 'bg-tsinelas-bg-surface text-tsinelas-text-brand border-tsinelas-border-brand'
                          : 'text-tsinelas-text-accent-orange bg-tsinelas-bg-accent-orange-weak border-tsinelas-border-weak'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <p className='text-tsinelas-text-support pt-1 text-sm leading-relaxed md:text-base'>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Quick Info Grid (community services) */}
          {!isOfficialSource && isTransaction && quickInfoArray.length > 0 && (
            <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
              {quickInfoArray.map((info, idx) => (
                <div
                  key={idx}
                  className='border-tsinelas-border-weak bg-tsinelas-bg-surface flex items-start gap-3 rounded-2xl border p-4 shadow-xs'
                >
                  <div className='text-tsinelas-text-brand bg-tsinelas-bg-surface-raised shrink-0 rounded-lg p-2'>
                    <info.icon className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-tsinelas-text-disabled mb-1 tsinelas-eyebrow'>
                      {info.label}
                    </p>
                    <p className='text-tsinelas-text-strong text-xs font-bold'>
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sources and References */}
          {service.sources && service.sources.length > 0 && (
            <DetailSection title='Sources & References' icon={BookOpen}>
              <ul className='grid grid-cols-1 gap-3' role='list'>
                {service.sources.map((source: Source, idx: number) => (
                  <li
                    key={idx}
                    className='hover:border-tsinelas-border-brand group border-tsinelas-border-weak bg-tsinelas-bg-surface-raised/50 flex items-start gap-3 rounded-xl border p-4 transition-all'
                  >
                    <div className='group-hover:text-tsinelas-text-brand bg-tsinelas-bg-surface text-tsinelas-text-disabled rounded-lg p-2 shadow-sm'>
                      <LinkIcon className='h-3.5 w-3.5' />
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-tsinelas-text-disabled mb-1 tsinelas-eyebrow'>
                        Reference
                      </p>
                      {source.url ? (
                        <a
                          href={source.url}
                          target='_blank'
                          rel='noreferrer'
                          className='text-tsinelas-text-brand inline-flex items-center gap-1.5 text-sm font-bold hover:underline'
                        >
                          {source.name} <ExternalLink className='h-3 w-3' />
                        </a>
                      ) : (
                        <span className='text-tsinelas-text-support text-sm font-bold'>
                          {source.name}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}
        </div>

        {/* --- SIDEBAR --- */}
        <aside className='w-full space-y-6 xl:w-80'>
          {/* Data Integrity Card */}
          <div
            className={`flex flex-col gap-3 rounded-2xl border p-5 transition-colors ${
              isOfficialSource
                ? 'border-tsinelas-border-success bg-tsinelas-bg-success-weak/30'
                : isVerified
                  ? 'border-tsinelas-border-success bg-tsinelas-bg-success-weak/30'
                  : 'border-tsinelas-border-weak bg-tsinelas-bg-surface'
            }`}
          >
            <div className='flex items-center justify-between'>
              <p className='text-tsinelas-text-disabled tsinelas-eyebrow'>
                Data Integrity
              </p>
              {isOfficialSource || isVerified ? (
                <CheckCircle2Icon className='h-4 w-4 text-tsinelas-text-success' />
              ) : (
                <AlertCircle className='text-tsinelas-text-support h-4 w-4' />
              )}
            </div>
            <div className='flex items-center gap-3'>
              <Clock
                className={`h-5 w-5 ${
                  isOfficialSource || isVerified
                    ? 'text-tsinelas-text-success'
                    : 'text-tsinelas-text-support'
                }`}
              />
              <div>
                <p
                  className={`text-sm font-bold ${
                    isOfficialSource || isVerified
                      ? 'text-tsinelas-text-strong'
                      : 'text-tsinelas-text-strong'
                  }`}
                >
                  {isOfficialSource
                    ? 'Official Data'
                    : isVerified
                      ? 'Verified Information'
                      : 'Unverified Data'}
                </p>
                <p className='text-tsinelas-text-disabled text-[11px] font-medium'>
                  {isOfficialSource
                    ? 'From Citizens Charter document'
                    : isVerified
                      ? `Last Audit: ${format(updatedAtDate!, 'MMMM yyyy')}`
                      : 'Awaiting official verification'}
                </p>
              </div>
            </div>
          </div>

          {/* Involved Offices */}
          {involvedOffices.length > 0 && (
            <DetailSection title='Responsible Offices' icon={Building2}>
              <div className='space-y-6'>
                {involvedOffices.map((off, idx) => {
                  const officePath =
                    off.type === 'executive'
                      ? `/government/executive/${off.slug}`
                      : off.type === 'legislative'
                        ? `/government/legislative/${off.slug}`
                        : `/government/departments/${off.slug}`;

                  return (
                    <div
                      key={off.slug}
                      className={
                        idx > 0
                          ? 'border-t border-tsinelas-border-weak pt-5'
                          : ''
                      }
                    >
                      <Link to={officePath} className='group block'>
                        <h3 className='group-hover:text-tsinelas-text-brand text-tsinelas-text-strong leading-tight font-bold transition-colors'>
                          {toTitleCase(off.name)}
                        </h3>
                        <span className='text-tsinelas-text-brand mt-2 flex items-center gap-1 tsinelas-eyebrow'>
                          View Profile{' '}
                          <ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-1' />
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </DetailSection>
          )}

          {/* SUGGEST AN EDIT - NEW PLACEMENT & STYLE */}
          <Card hover={false} className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-tsinelas-bg-accent-orange-weak text-tsinelas-text-accent-orange rounded-lg p-2'>
                <HeartHandshake className='h-5 w-5' />
              </div>
              <h4 className='text-tsinelas-text-strong text-sm leading-tight font-bold'>
                Help improve this data
              </h4>
            </div>
            <p className='text-tsinelas-text-disabled text-xs leading-relaxed'>
              Find an error or outdated info? Our community helps keep this
              portal accurate.
            </p>
            <Link
              to={`/services/request?type=update&service=${encodeURIComponent(service.slug)}`}
              className='group border-tsinelas-border-weak text-tsinelas-text-support hover:border-tsinelas-border-weak hover:bg-tsinelas-bg-surface-raised flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold transition-all'
            >
              <Edit3 className='group-hover:text-tsinelas-text-accent-orange text-tsinelas-text-disabled h-3.5 w-3.5 transition-colors' />
              Suggest an Edit
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
