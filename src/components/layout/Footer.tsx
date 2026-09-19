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

import { footerNavigation } from '../../data/navigation';

export const Footer: FC = () => {
  const { t } = useTranslation('common');

  const getSocialIcon = (label: string) => {
    switch (label) {
      case 'Facebook':
        return <SiFacebook className='w-5 h-5' />;
      case 'Instagram':
        return <SiInstagram className='w-5 h-5' />;
      case 'YouTube':
        return <SiYoutube className='w-5 h-5' />;
      case 'Email':
        return <MailIcon className='w-5 h-5' />;
      case 'GitHub':
        return <SiGithub className='w-5 h-5' />;
      default:
        return null;
    }
  };

  return (
    <footer className='bg-tsinelas-bg-surface-bold selection:bg-primary-500 border-t-2 border-tsinelas-gold-600 text-tsinelas-text-inverse selection:text-tsinelas-text-inverse'>
      <div className='container px-4 pt-tsinelas-layout-05 pb-tsinelas-layout-04 mx-auto'>
        <div className='grid grid-cols-1 gap-x-tsinelas-layout-03 gap-y-tsinelas-layout-04 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
          {/* Brand Column */}
          <div className='col-span-2 space-y-tsinelas-layout-02 md:col-span-3 lg:col-span-2'>
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
            <p className='tsinelas-body-01 max-w-sm text-tsinelas-text-disabled'>
              An open-source initiative providing transparent access to
              municipal services, local legislation, and public data for the
              people of {config.lgu.name}.
            </p>
            <div className='flex gap-tsinelas-05'>
              {footerNavigation.socialLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className='transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive text-tsinelas-text-disabled hover:text-tsinelas-text-inverse'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {getSocialIcon(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {footerNavigation.mainSections.map(section => (
            <div key={section.title} className='col-span-1'>
              <h3 className='tsinelas-eyebrow mb-tsinelas-layout-02 text-tsinelas-text-disabled'>
                {section.title}
              </h3>
              <ul className='space-y-tsinelas-05'>
                {section.links.map(link => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target='_blank'
                        rel='noreferrer'
                        className='tsinelas-body-01 flex gap-1 items-center transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive text-tsinelas-link-inverse hover:text-tsinelas-link-inverse-hover'
                      >
                        {link.label}
                        <ArrowUpRightIcon className='w-3 h-3 shrink-0' />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className='tsinelas-body-01 transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive text-tsinelas-link-inverse hover:text-tsinelas-link-inverse-hover'
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. The Signature BetterGov "Cost Statement" */}
        <div className='flex justify-center mt-tsinelas-11'>
          <div className='inline-flex flex-col gap-tsinelas-02 items-center px-tsinelas-06 py-tsinelas-05 text-center rounded-full border border-tsinelas-gold-600/50 bg-tsinelas-brand-700/60 md:flex-row md:gap-tsinelas-05'>
            <p className='text-xs font-medium text-tsinelas-text-inverse-subtle md:text-sm'>
              Built by the community for the community.
            </p>
            <span className='hidden w-1 h-1 rounded-full bg-tsinelas-gold-600 md:block' />
            <p className='text-xs font-bold md:text-sm'>
              Cost to the People of {config.lgu.name} ={' '}
              <span className='text-tsinelas-support-success-inverse'>
                ₱0
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='flex flex-col gap-tsinelas-layout-02 justify-between items-center pt-tsinelas-layout-03 mt-tsinelas-layout-05 border-t border-tsinelas-brand-400/30 md:flex-row'>
          <p className='tsinelas-eyebrow text-tsinelas-text-disabled'>
            {t('footer.copyright')}
          </p>
          <div className='flex gap-tsinelas-layout-02'>
            <a
              href={config.portal.githubUrl}
              target='_blank'
              rel='noreferrer'
              className='tsinelas-eyebrow text-tsinelas-text-disabled hover:text-tsinelas-text-inverse'
            >
              GitHub
            </a>
            <Link
              to='/sitemap'
              className='tsinelas-eyebrow text-tsinelas-text-disabled hover:text-tsinelas-text-inverse'
            >
              Sitemap
            </Link>
            {/* <Link to='/accessibility' className='tsinelas-eyebrow text-tsinelas-text-disabled hover:text-tsinelas-text-inverse'>Accessibility</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
