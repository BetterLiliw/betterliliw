import { FC } from 'react';

import { Link } from 'react-router-dom';

import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { ArrowUpRightIcon, MailIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { config } from '@/lib/lguConfig';
import { cn } from '@/lib/utils';

import { footerNavigation } from '../../data/navigation';

/* Focus ring for interactive elements on the footer's dark surface — the
 * default `tsinelas-focus` utility rings in navy, which disappears against
 * this navy background, so these use the dedicated inverse focus token. */
const footerFocusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsinelas-focus-inverse';

const footerLinkClasses = cn(
  'tsinelas-body-01 text-tsinelas-text-inverse-subtle transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:text-tsinelas-text-inverse',
  footerFocusRing
);

const footerLegalLinkClasses = cn(
  'tsinelas-eyebrow text-tsinelas-text-disabled transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:text-tsinelas-text-inverse',
  footerFocusRing
);

/* Marks a link that leaves betterliliw.org, so it reads as an outbound
 * link before the click rather than a surprise. */
const ExternalLinkIndicator: FC = () => (
  <ArrowUpRightIcon
    aria-hidden='true'
    className='w-3 h-3 shrink-0 opacity-70'
  />
);

export const Footer: FC = () => {
  const { t } = useTranslation('common');

  const getSocialIcon = (label: string) => {
    switch (label) {
      case 'Facebook':
        return <SiFacebook className='w-4 h-4' />;
      case 'Instagram':
        return <SiInstagram className='w-4 h-4' />;
      case 'YouTube':
        return <SiYoutube className='w-4 h-4' />;
      case 'Email':
        return <MailIcon className='w-4 h-4' />;
      case 'GitHub':
        return <SiGithub className='w-4 h-4' />;
      default:
        return null;
    }
  };

  return (
    <footer className='bg-tsinelas-bg-surface-bold selection:bg-primary-500 border-t border-tsinelas-gold-600 text-tsinelas-text-inverse selection:text-tsinelas-text-inverse'>
      <div className='container px-4 pt-tsinelas-layout-05 pb-tsinelas-layout-04 mx-auto'>
        <div className='grid grid-cols-1 gap-x-tsinelas-layout-04 gap-y-tsinelas-layout-04 lg:grid-cols-12'>
          {/* Brand Column */}
          <div className='space-y-tsinelas-layout-02 lg:col-span-4 lg:border-r lg:border-tsinelas-brand-400/20 lg:pr-tsinelas-layout-04'>
            <div className='flex items-center'>
              <img
                src={config.portal.logoWhitePath}
                alt={config.portal.name}
                className='mr-tsinelas-05 w-12 h-12'
              />
              <div>
                <div className='tsinelas-display text-xl font-bold tracking-tsinelas-tight'>
                  {config.portal.footerBrandName}
                </div>
                <div className='tsinelas-eyebrow text-tsinelas-text-disabled'>
                  Community Civic Portal
                </div>
              </div>
            </div>
            <p className='tsinelas-body-01 max-w-sm text-tsinelas-text-inverse-subtle'>
              An open-source initiative providing transparent access to
              municipal services, local legislation, and public data for the
              people of {config.lgu.name}.
            </p>
            <div className='flex gap-tsinelas-03'>
              {footerNavigation.socialLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  aria-label={link.label}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center border border-tsinelas-brand-400/25 text-tsinelas-text-inverse-subtle transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:border-tsinelas-brand-300/40 hover:bg-tsinelas-brand-700/50 hover:text-tsinelas-text-inverse',
                    footerFocusRing
                  )}
                >
                  {getSocialIcon(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Directory */}
          <div className='grid grid-cols-2 gap-x-tsinelas-layout-03 gap-y-tsinelas-layout-04 sm:grid-cols-4 lg:col-span-8 lg:pl-tsinelas-layout-04'>
            {footerNavigation.mainSections.map(section => (
              <div key={section.title}>
                <h3 className='tsinelas-eyebrow mb-tsinelas-layout-02 text-tsinelas-text-disabled'>
                  {section.title}
                </h3>
                <ul className='space-y-tsinelas-04'>
                  {section.links.map(link => (
                    <li key={link.label}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target='_blank'
                          rel='noreferrer'
                          className={cn(
                            footerLinkClasses,
                            'inline-flex items-center gap-1'
                          )}
                        >
                          {link.label}
                          <ExternalLinkIndicator />
                        </a>
                      ) : (
                        <Link to={link.href} className={footerLinkClasses}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* The Signature BetterGov "Cost Statement" — a flat disclosure
            line, not a badge, to read as an official transparency figure
            rather than a marketing callout. */}
        <div className='flex flex-col gap-tsinelas-02 justify-between items-center px-tsinelas-06 py-tsinelas-05 mt-tsinelas-layout-05 text-center border border-tsinelas-brand-400/20 bg-tsinelas-brand-700/40 sm:flex-row sm:text-left'>
          <p className='tsinelas-body-01 text-tsinelas-text-inverse-subtle'>
            Built by the community for the community.
          </p>
          <p className='tsinelas-body-01 font-semibold'>
            Cost to the People of {config.lgu.name} ={' '}
            <span className='text-tsinelas-support-success-inverse'>₱0</span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className='flex flex-col gap-tsinelas-layout-02 justify-between items-center pt-tsinelas-layout-03 mt-tsinelas-layout-03 border-t border-tsinelas-brand-400/20 sm:flex-row'>
          <p className='tsinelas-eyebrow text-tsinelas-text-disabled'>
            {t('footer.copyright')}
          </p>
          <div className='flex gap-tsinelas-layout-02'>
            <a
              href={config.portal.githubUrl}
              target='_blank'
              rel='noreferrer'
              className={cn(
                footerLegalLinkClasses,
                'inline-flex items-center gap-1'
              )}
            >
              GitHub
              <ExternalLinkIndicator />
            </a>
            <Link to='/sitemap' className={footerLegalLinkClasses}>
              Sitemap
            </Link>
            {/* <Link to='/accessibility' className={footerLegalLinkClasses}>Accessibility</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
