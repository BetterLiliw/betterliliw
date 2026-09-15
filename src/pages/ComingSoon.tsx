import { useRef, type RefObject } from 'react';

import { BookOpenTextIcon } from '@/components/icons/book-open-text';
import { ChartColumnIcon } from '@/components/icons/chart-column';
import { FileTextIcon } from '@/components/icons/file-text';
import { GithubIcon } from '@/components/icons/github';
import { MailIcon } from '@/components/icons/mail';
import { UsersIcon } from '@/components/icons/users';
import { SEO } from '@/components/layout/SEO';
import { config } from '@/lib/lguConfig';

/** Imperative handle shared by every AnimateIcons component. */
interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UpcomingModule {
  icon: typeof FileTextIcon;
  title: string;
  description: string;
  enabled: boolean;
}

/**
 * Lets a parent element (card, button) drive its icon's micro-animation so
 * the hover target is the whole control rather than the 16–18px glyph.
 * Focus is wired too so keyboard users get the same feedback.
 */
function useIconHover(): {
  iconRef: RefObject<AnimatedIconHandle>;
  hoverProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
} {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const start = () => iconRef.current?.startAnimation();
  const stop = () => iconRef.current?.stopAnimation();
  return {
    iconRef,
    hoverProps: {
      onMouseEnter: start,
      onMouseLeave: stop,
      onFocus: start,
      onBlur: stop,
    },
  };
}

function ModuleItem({
  icon: Icon,
  title,
  description,
}: Omit<UpcomingModule, 'enabled'>) {
  const { iconRef, hoverProps } = useIconHover();

  return (
    <li className='flex gap-3' {...hoverProps}>
      <span className='bg-kapwa-bg-brand-weak text-kapwa-text-brand mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'>
        <Icon ref={iconRef} size={18} aria-hidden />
      </span>
      <div>
        <h2 className='text-kapwa-text-strong font-semibold'>{title}</h2>
        <p className='text-kapwa-text-support mt-1 text-sm leading-relaxed'>
          {description}
        </p>
      </div>
    </li>
  );
}

/**
 * Public holding page shown while the portal is gated by VITE_COMING_SOON.
 * Renders standalone — no navbar, ticker or footer — so it is the whole site
 * for as long as the gate is on. See `@/lib/comingSoon`.
 */
export default function ComingSoon() {
  const { portal, lgu, features } = config;
  const year = new Date().getFullYear();
  const github = useIconHover();
  const mail = useIconHover();

  const modules: UpcomingModule[] = [
    {
      icon: FileTextIcon,
      title: 'Municipal services',
      description:
        'Step-by-step requirements, fees and processing times drawn from the Citizen’s Charter.',
      enabled: true,
    },
    {
      icon: UsersIcon,
      title: 'Government directory',
      description:
        'Elected officials, municipal departments and all barangays in one searchable place.',
      enabled: true,
    },
    {
      icon: BookOpenTextIcon,
      title: 'Legislation tracker',
      description:
        'Ordinances, resolutions and session records, kept openly and linked to the officials behind them.',
      enabled: features.openLGU,
    },
    {
      icon: ChartColumnIcon,
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
              .map(({ icon, title, description }) => (
                <ModuleItem
                  key={title}
                  icon={icon}
                  title={title}
                  description={description}
                />
              ))}
          </ul>

          <div className='border-kapwa-border-weak mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:gap-4'>
            {portal.githubUrl && (
              <a
                href={portal.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-kapwa-bg-brand-default hover:bg-kapwa-bg-brand-hover text-kapwa-text-inverse focus-visible:outline-kapwa-border-focus inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
                {...github.hoverProps}
              >
                <GithubIcon ref={github.iconRef} size={16} aria-hidden />
                Follow the build on GitHub
              </a>
            )}
            {portal.contactEmail && (
              <a
                href={`mailto:${portal.contactEmail}`}
                className='border-kapwa-border-strong text-kapwa-text-strong hover:bg-kapwa-bg-brand-weak focus-visible:outline-kapwa-border-focus inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
                {...mail.hoverProps}
              >
                <MailIcon ref={mail.iconRef} size={16} aria-hidden />
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
