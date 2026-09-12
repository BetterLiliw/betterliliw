import { useParams } from 'react-router-dom';

import { Briefcase, GraduationCapIcon, UsersIcon } from 'lucide-react';

import { BarangayHeader } from '@/components/government/BarangayHeader';
import {
  OfficialCard,
  PunongBarangayCard,
} from '@/components/government/OfficialCard';
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

import { config } from '@/lib/lguConfig';
import { lguLabels } from '@/lib/lguLabels';
import { toTitleCase } from '@/lib/stringUtils';

import barangaysData from '@/data/directory/barangays.json';

export default function BarangayDetail() {
  const { barangay: slug } = useParams();
  const barangay = barangaysData.find(b => b.slug === slug);

  if (!barangay)
    return <div className='p-20 text-center'>Barangay not found</div>;

  const punongBarangay = barangay.officials?.find(o =>
    o.role.includes('Punong Barangay')
  );
  const kagawads = barangay.officials?.filter(o =>
    o.role.includes('SB Member')
  );
  const skOfficials = barangay.officials?.filter(o => o.role.includes('SK'));
  const secretary = barangay.officials?.find(o => o.role.includes('Secretary'));
  const treasurer = barangay.officials?.find(o => o.role.includes('Treasurer'));

  // --- SEO ---
  const barangayName = toTitleCase(
    barangay.barangay_name.replace('BARANGAY ', '')
  );
  const seoTitle = `Barangay ${barangayName}`;
  const seoDescription = `Barangay officials, contact details and address for Barangay ${barangayName}, ${lguLabels.fullName}.`;
  const barangayJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: seoTitle,
    ...(barangay.website ? { url: barangay.website } : {}),
    ...(barangay.trunkline
      ? {
          telephone: Array.isArray(barangay.trunkline)
            ? barangay.trunkline[0]
            : barangay.trunkline,
        }
      : {}),
    ...(barangay.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: barangay.address,
            addressLocality: lguLabels.name,
            addressRegion: lguLabels.province,
            addressCountry: 'PH',
          },
        }
      : {}),
    parentOrganization: {
      '@type': 'GovernmentOrganization',
      name: lguLabels.fullName,
      url: config.portal.baseUrl,
    },
  };

  return (
    <div className='animate-in fade-in space-y-6 pb-20 duration-500'>
      <SEO
        title={seoTitle}
        description={seoDescription}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Barangays', url: '/government/barangays' },
          { name: seoTitle, url: `/government/barangays/${slug}` },
        ]}
        jsonLd={barangayJsonLd}
      />

      {/* Skip Link for Accessibility */}
      <a
        href='#main-content'
        className='focus:bg-kapwa-bg-surface focus:text-kapwa-text-strong focus:ring-kapwa-border-focus sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:ring-2'
      >
        Skip to main content
      </a>

      {/* --- BREADCRUMBS --- */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbHome href='/' />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/government/barangays'>
              Barangays
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{barangayName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* --- COMPACT IDENTITY HEADER --- */}
      <BarangayHeader barangay={barangay} />

      {/* --- OFFICIALS SECTION (Unified) --- */}
      <main id='main-content' className='space-y-6'>
        {/* Section Header */}
        <div className='border-kapwa-border-weak flex items-center gap-2 border-b pb-3'>
          <UsersIcon
            aria-hidden='true'
            className='text-kapwa-text-disabled h-4 w-4'
          />
          <h2
            id='officials-heading'
            className='kapwa-heading-md text-kapwa-text-strong'
          >
            Barangay Officials
          </h2>
        </div>

        {/* Punong Barangay */}
        {punongBarangay && (
          <div className='space-y-2' role='group' aria-label='Chief Executive'>
            <p className='sr-only'>Chief Executive</p>
            <p className='text-kapwa-text-disabled pl-1 text-[10px] font-bold tracking-widest uppercase'>
              Chief Executive
            </p>
            <PunongBarangayCard official={punongBarangay} />
          </div>
        )}

        {/* Sangguniang Barangay */}
        <div
          className='space-y-2'
          role='group'
          aria-label='Sangguniang Barangay'
        >
          <p className='sr-only'>Sangguniang Barangay</p>
          <p className='text-kapwa-text-disabled pl-1 text-[10px] font-bold tracking-widest uppercase'>
            Sangguniang Barangay
          </p>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {kagawads?.map(kagawad => (
              <OfficialCard
                key={kagawad.name}
                official={kagawad}
                role='Barangay Kagawad'
                icon={UsersIcon}
              />
            ))}
          </div>
        </div>

        {/* Sangguniang Kabataan */}
        {skOfficials && skOfficials.length > 0 && (
          <div
            className='space-y-2'
            role='group'
            aria-label='Sangguniang Kabataan'
          >
            <p className='sr-only'>Sangguniang Kabataan</p>
            <p className='text-kapwa-text-disabled pl-1 text-[10px] font-bold tracking-widest uppercase'>
              Sangguniang Kabataan
            </p>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
              {skOfficials.map(sk => (
                <OfficialCard
                  key={sk.name}
                  official={sk}
                  role={sk.role.replace('SK ', '')}
                  icon={GraduationCapIcon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Barangay Administration */}
        <div
          className='space-y-2'
          role='group'
          aria-label='Barangay Administration'
        >
          <p className='sr-only'>Barangay Administration</p>
          <p className='text-kapwa-text-disabled pl-1 text-[10px] font-bold tracking-widest uppercase'>
            Barangay Administration
          </p>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            {secretary && (
              <OfficialCard
                official={secretary}
                role='Barangay Secretary'
                icon={Briefcase}
              />
            )}
            {treasurer && (
              <OfficialCard
                official={treasurer}
                role='Barangay Treasurer'
                icon={Briefcase}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
