import {
  BarChart3Icon,
  BuildingIcon,
  GithubIcon,
  MailIcon,
  ScrollTextIcon,
  ScaleIcon,
} from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import { config } from '@/lib/lguConfig';

interface UpcomingModule {
  icon: typeof BuildingIcon;
  title: string;
  description: string;
  enabled: boolean;
}

/**
 * Public holding page shown while the portal is gated by VITE_COMING_SOON.
 * Renders standalone — no navbar, ticker or footer — so it is the whole site
 * for as long as the gate is on. See `@/lib/comingSoon`.
 */
export default function ComingSoon() {
  const { portal, lgu, features } = config;
  const year = new Date().getFullYear();

  const modules: UpcomingModule[] = [
    {
      icon: ScrollTextIcon,
      title: 'Municipal services',
      description:
        'Step-by-step requirements, fees and processing times drawn from the Citizen’s Charter.',
      enabled: true,
    },
    {
      icon: BuildingIcon,
      title: 'Government directory',
      description:
        'Elected officials, municipal departments and all barangays in one searchable place.',
      enabled: true,
    },
    {
      icon: ScaleIcon,
      title: 'Legislation tracker',
      description:
        'Ordinances, resolutions and session records, kept openly and linked to the officials behind them.',
      enabled: features.openLGU,
    },
    {
      icon: BarChart3Icon,
      title: 'Transparency & statistics',
      description:
        'Budgets, procurement and infrastructure projects presented in plain language.',
      enabled: features.transparency || features.statistics,
    },
  ];

  return (
    <div className='bg-kapwa-bg-surface min-h-screen'>
      <SEO
        title={`${portal.name} — Coming soon`}
        description={`${portal.description} Currently in development.`}
        keywords={[lgu.name, lgu.province, 'civic portal', 'coming soon']}
      />

      {/* Brand rule across the top */}
      <div className='bg-kapwa-bg-brand-default h-1.5 w-full' aria-hidden />

      <div className='mx-auto flex min-h-[calc(100vh-0.375rem)] max-w-3xl flex-col justify-center px-6 py-16 sm:px-8'>
        <main>
          <img
            src='/logos/betterliliw-wordmark-primary.svg'
            alt={`${portal.name} — ${lgu.fullName}`}
            width={2849}
            height={1095}
            className='mb-10 h-16 w-auto sm:h-20'
          />

          <span className='bg-kapwa-bg-brand-weak text-kapwa-text-brand ring-kapwa-border-brand/30 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 ring-inset'>
            <span
              className='bg-kapwa-bg-brand-default h-1.5 w-1.5 rounded-full'
              aria-hidden
            />
            In development
          </span>

          <h1 className='text-kapwa-text-strong mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl'>
            A better {lgu.name} is being built.
          </h1>

          <p className='text-kapwa-text-support mt-5 max-w-2xl text-lg leading-relaxed'>
            {portal.name} is a community-powered civic portal for the{' '}
            {lgu.fullName}, {lgu.province}. We are gathering and organising
            public information so that residents can find what they need without
            hunting through scattered pages and posts.
          </p>

          <p className='text-kapwa-text-support mt-4 max-w-2xl leading-relaxed'>
            The site is not open to the public yet. Here is what we are
            preparing.
          </p>

          <ul className='mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2'>
            {modules
              .filter(module => module.enabled)
              .map(({ icon: Icon, title, description }) => (
                <li key={title} className='flex gap-3'>
                  <span className='bg-kapwa-bg-brand-weak text-kapwa-text-brand mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'>
                    <Icon className='h-4.5 w-4.5' aria-hidden />
                  </span>
                  <div>
                    <h2 className='text-kapwa-text-strong font-semibold'>
                      {title}
                    </h2>
                    <p className='text-kapwa-text-support mt-1 text-sm leading-relaxed'>
                      {description}
                    </p>
                  </div>
                </li>
              ))}
          </ul>

          <div className='border-kapwa-border-weak mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:gap-4'>
            {portal.githubUrl && (
              <a
                href={portal.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-kapwa-bg-brand-default hover:bg-kapwa-bg-brand-hover text-kapwa-text-inverse focus-visible:outline-kapwa-border-focus inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
              >
                <GithubIcon className='h-4 w-4' aria-hidden />
                Follow the build on GitHub
              </a>
            )}
            {portal.contactEmail && (
              <a
                href={`mailto:${portal.contactEmail}`}
                className='border-kapwa-border-strong text-kapwa-text-strong hover:bg-kapwa-bg-brand-weak focus-visible:outline-kapwa-border-focus inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
              >
                <MailIcon className='h-4 w-4' aria-hidden />
                Contact the volunteers
              </a>
            )}
          </div>
        </main>

        <footer className='text-kapwa-text-support mt-12 space-y-2 text-xs leading-relaxed'>
          <p>
            {portal.name} is an independent, volunteer-run project. It is not an
            official website of the {lgu.fullName} and is not affiliated with or
            endorsed by any government agency. For official announcements,
            please refer to the municipality’s own channels.
          </p>
          <p>
            © {year} {portal.footerBrandName} · {portal.domain}
          </p>
        </footer>
      </div>
    </div>
  );
}
