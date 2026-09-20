import { FC, ReactNode } from 'react';

import { Link } from 'react-router-dom';

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/layout';
import { SEO } from '@/components/layout/SEO';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';

import departmentsData from '@/data/directory/departments.json';
import executiveData from '@/data/directory/executive.json';
import { config } from '@/lib/lguConfig';
import { toTitleCase } from '@/lib/stringUtils';

/* ------------------------------------------------------------------------ */
/* Data                                                                     */
/* ------------------------------------------------------------------------ */

interface Office {
  name: string;
  /** What a resident would call for. */
  purpose: string;
  href: string;
  address?: string | null;
  phones: string[];
  email?: string | null;
}

/** The offices a resident most often needs to reach, in this order. Five
 * plus the Mayor's office fill two rows of three. */
const KEY_OFFICE_SLUGS: [slug: string, purpose: string][] = [
  ['operation-center', 'Trunkline for every office in the Municipal Hall'],
  ['municipal-mdrrmo-office', 'Disasters, floods and evacuation'],
  ['municipal-police-station', 'Police assistance'],
  ['bureau-fire-protection', 'Fire and rescue'],
  ['municipal-health-office', 'Health services and the rural health unit'],
];

function keyOffices(): Office[] {
  const offices: Office[] = [];

  const mayor = executiveData.find(e => e.slug === 'office-of-the-mayor');
  if (mayor) {
    offices.push({
      name: mayor.office,
      purpose: 'Concerns for the municipal government',
      href: '/government/elected-officials',
      address: mayor.address,
      phones: [mayor.phone].filter((p): p is string => Boolean(p)),
      email: mayor.email,
    });
  }

  for (const [slug, purpose] of KEY_OFFICE_SLUGS) {
    const dept = departmentsData.find(d => d.slug === slug);
    if (!dept) continue;
    offices.push({
      name: toTitleCase(dept.office_name),
      purpose,
      href: `/government/departments/${dept.slug}`,
      address: dept.address,
      phones: dept.trunkline ?? [],
      email: dept.email,
    });
  }

  return offices;
}

/** "530-2981 ext 1000" → "tel:5302981;ext=1000" (RFC 3966). */
function telHref(phone: string): string {
  const [base, ext] = phone.split(/\s*ext\.?\s*/i);
  const digits = base.replace(/[^\d+]/g, '');
  return ext ? `tel:${digits};ext=${ext.replace(/\D/g, '')}` : `tel:${digits}`;
}

interface Channel {
  name: string;
  description: string;
  href: string;
  cta: string;
}

function portalChannels(): Channel[] {
  const channels: Channel[] = [
    {
      name: 'Email',
      description:
        'Questions, corrections and partnership requests. A volunteer replies, usually within a few days.',
      href: `mailto:${config.portal.contactEmail}`,
      cta: config.portal.contactEmail,
    },
    {
      name: 'Facebook',
      description: 'Announcements and the quickest way to send a message.',
      href: config.portal.facebookUrl,
      cta: 'facebook.com/betterliliw',
    },
    {
      name: 'GitHub',
      description:
        'Report a bug, propose a feature or fix it yourself — the portal is open source.',
      href: `${config.portal.githubUrl}/issues`,
      cta: 'Open an issue',
    },
  ];

  if (config.portal.discordUrl) {
    channels.push({
      name: 'Discord',
      description: 'Where the volunteers talk while they build.',
      href: config.portal.discordUrl,
      cta: 'Join the server',
    });
  }

  return channels;
}

const inlineLink =
  'text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus';

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: `Is ${config.portal.name} the official website of the ${config.lgu.fullName}?`,
    answer: `No. ${config.portal.name} is an independent, volunteer-run portal. It gathers public information about the municipality in one place, but it is not operated by the local government and cannot act on its behalf.`,
  },
  {
    question: 'I need something from the municipality. Who do I contact?',
    answer: (
      <>
        Call or visit the office responsible; the numbers above are the ones
        residents need most, and every office is listed under{' '}
        <Link to='/government/departments' className={inlineLink}>
          Departments and offices
        </Link>
        . For requirements and fees, check{' '}
        <Link to='/services' className={inlineLink}>
          Services
        </Link>{' '}
        first.
      </>
    ),
  },
  {
    question: 'Something on the site is wrong or out of date.',
    answer: (
      <>
        Use{' '}
        <Link to='/services/request?type=update' className={inlineLink}>
          Suggest a correction
        </Link>{' '}
        or email us. Tell us the page and what should change; a volunteer checks
        it against the office and updates the data.
      </>
    ),
  },
  {
    question: 'Where does the information come from?',
    answer:
      'From public sources: the Citizens Charter, ordinances and resolutions, published reports, office notices, and contributions from residents. Each service page says which.',
  },
  {
    question: 'Can I reuse the content?',
    answer: (
      <>
        Yes. Everything on the portal is in the public domain unless a page says
        otherwise, and the code is open source. See the{' '}
        <Link to='/terms-of-service' className={inlineLink}>
          Terms of service
        </Link>
        .
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Page-local layout pieces                                                 */
/* ------------------------------------------------------------------------ */

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className='border-t border-tsinelas-border-subtle-00 pt-tsinelas-06'
    >
      <h2
        id={`${id}-heading`}
        className='tsinelas-heading-lg text-tsinelas-text-primary'
      >
        {title}
      </h2>
      {lede && (
        <p className='tsinelas-body-02 mt-tsinelas-02 max-w-2xl text-tsinelas-text-secondary'>
          {lede}
        </p>
      )}
      <div className='mt-tsinelas-05'>{children}</div>
    </section>
  );
}

/** Hairline grid: each cell draws its right and bottom rule, the grid the
 * top and left, so a ragged last row still reads as rows. */
function HairlineGrid({ children }: { children: ReactNode }) {
  return (
    <div className='grid border-t border-l border-tsinelas-border-subtle-00 sm:grid-cols-2 xl:grid-cols-3'>
      {children}
    </div>
  );
}

const cellClasses =
  'flex flex-col border-r border-b border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 p-tsinelas-05';

/* ------------------------------------------------------------------------ */
/* Page                                                                     */
/* ------------------------------------------------------------------------ */

const ContactUs: FC = () => {
  const offices = keyOffices();
  const channels = portalChannels();
  const hotlinesHref = `https://hotlines.bettergov.ph/?city=${encodeURIComponent(config.lgu.name)}&province=${encodeURIComponent(config.lgu.province)}`;

  return (
    <>
      <SEO
        title='Contact'
        description={`How to reach the ${config.lgu.fullName} offices residents need most, and the volunteers who run ${config.portal.name}.`}
        keywords={['contact', 'municipal hall', 'hotline', 'volunteer']}
      />

      <PageHeader
        variant='compact'
        title='Contact'
        description={`Reach the municipal government, or the volunteers who run ${config.portal.name}.`}
      />

      <div className='container space-y-tsinelas-layout-04 py-tsinelas-layout-04 md:py-tsinelas-layout-05'>
        <Section
          id='government'
          title={`${config.lgu.fullName}`}
          lede={
            <>
              {config.portal.name} is not the municipal government. For permits,
              certificates, assistance and complaints, contact the office
              directly. In an emergency, dial 911.
            </>
          }
        >
          <HairlineGrid>
            {offices.map(office => (
              <div key={office.href + office.name} className={cellClasses}>
                <h3 className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
                  {office.name}
                </h3>
                <p className='tsinelas-label-01 mt-tsinelas-01 text-tsinelas-text-secondary'>
                  {office.purpose}
                </p>
                <address className='tsinelas-body-01 mt-tsinelas-04 flex-1 space-y-tsinelas-02 text-tsinelas-text-primary not-italic'>
                  {office.phones.map(phone => (
                    <p key={phone} className='flex items-start gap-tsinelas-03'>
                      <PhoneIcon
                        aria-hidden='true'
                        className='mt-[3px] size-tsinelas-04 shrink-0 text-tsinelas-icon-secondary'
                      />
                      <a
                        href={telHref(phone)}
                        className='tsinelas-tabular text-tsinelas-link-primary hover:underline tsinelas-focus'
                      >
                        {phone}
                      </a>
                    </p>
                  ))}
                  {office.email && (
                    <p className='flex items-start gap-tsinelas-03'>
                      <MailIcon
                        aria-hidden='true'
                        className='mt-[3px] size-tsinelas-04 shrink-0 text-tsinelas-icon-secondary'
                      />
                      <a
                        href={`mailto:${office.email}`}
                        className='break-all text-tsinelas-link-primary hover:underline tsinelas-focus'
                      >
                        {office.email}
                      </a>
                    </p>
                  )}
                  {office.address && (
                    <p className='flex items-start gap-tsinelas-03 text-tsinelas-text-secondary'>
                      <MapPinIcon
                        aria-hidden='true'
                        className='mt-[3px] size-tsinelas-04 shrink-0 text-tsinelas-icon-secondary'
                      />
                      {office.address}
                    </p>
                  )}
                </address>
                <Link
                  to={office.href}
                  className='tsinelas-label-01 mt-tsinelas-04 inline-flex items-center gap-tsinelas-02 self-start text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus'
                >
                  Office page
                  <ArrowRightIcon
                    aria-hidden='true'
                    className='size-tsinelas-icon-01'
                  />
                </Link>
              </div>
            ))}
          </HairlineGrid>

          <div className='mt-tsinelas-05 flex flex-wrap gap-tsinelas-03'>
            <Link to='/government/departments'>
              <Button
                variant='tertiary'
                rightIcon={<ArrowRightIcon className='size-tsinelas-icon-01' />}
              >
                All departments and offices
              </Button>
            </Link>
            <Link to='/government/barangays'>
              <Button
                variant='ghost'
                rightIcon={<ArrowRightIcon className='size-tsinelas-icon-01' />}
              >
                Barangay halls
              </Button>
            </Link>
            <a href={hotlinesHref} target='_blank' rel='noreferrer'>
              <Button
                variant='ghost'
                rightIcon={
                  <ArrowUpRightIcon className='size-tsinelas-icon-01' />
                }
              >
                Emergency hotlines
              </Button>
            </a>
          </div>
        </Section>

        <Section
          id='portal'
          title={`The ${config.portal.name} team`}
          lede='Volunteers from Liliw who build and maintain this portal. Write to us about the site, the data, or working together.'
        >
          <HairlineGrid>
            {channels.map(channel => (
              <div key={channel.name} className={cellClasses}>
                <h3 className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
                  {channel.name}
                </h3>
                <p className='tsinelas-body-01 mt-tsinelas-02 flex-1 text-tsinelas-text-secondary'>
                  {channel.description}
                </p>
                <a
                  href={channel.href}
                  target={
                    channel.href.startsWith('http') ? '_blank' : undefined
                  }
                  rel={
                    channel.href.startsWith('http') ? 'noreferrer' : undefined
                  }
                  className='tsinelas-body-compact-01 mt-tsinelas-04 inline-flex items-center gap-tsinelas-02 self-start break-all text-tsinelas-link-primary hover:text-tsinelas-link-primary-hover hover:underline tsinelas-focus'
                >
                  {channel.cta}
                  {channel.href.startsWith('http') ? (
                    <ArrowUpRightIcon
                      aria-hidden='true'
                      className='size-tsinelas-icon-01 shrink-0'
                    />
                  ) : (
                    <ArrowRightIcon
                      aria-hidden='true'
                      className='size-tsinelas-icon-01 shrink-0'
                    />
                  )}
                </a>
              </div>
            ))}
          </HairlineGrid>

          <div className='mt-tsinelas-06 bg-tsinelas-layer-01 p-tsinelas-05 md:flex md:items-center md:justify-between md:gap-tsinelas-layout-03'>
            <div>
              <h3 className='tsinelas-heading-compact-02 text-tsinelas-text-primary'>
                Help build the portal
              </h3>
              <p className='tsinelas-body-01 mt-tsinelas-01 max-w-2xl text-tsinelas-text-secondary'>
                Writers, designers, developers and people who simply know Liliw
                well — every page here was made by a volunteer.
              </p>
            </div>
            <div className='mt-tsinelas-04 flex shrink-0 flex-wrap gap-tsinelas-03 md:mt-0'>
              <Link to='/join-us'>
                <Button
                  rightIcon={
                    <ArrowRightIcon className='size-tsinelas-icon-01' />
                  }
                >
                  Join us
                </Button>
              </Link>
              <Link to='/services/request?type=update'>
                <Button variant='ghost'>Suggest a correction</Button>
              </Link>
            </div>
          </div>
        </Section>

        <Section id='faq' title='Common questions'>
          <Accordion size='lg'>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                title={faq.question}
                defaultOpen={index === 0}
              >
                <p>{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </div>
    </>
  );
};

export default ContactUs;
