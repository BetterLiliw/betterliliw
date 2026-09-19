import { FC, useEffect, useRef, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  CheckIcon,
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';

import { config } from '@/lib/lguConfig';
import { cn } from '@/lib/utils';

import { mainNavigation } from '../../data/navigation';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../i18n/languages';
import { LanguageType } from '../../types';

/* The utility bar is navy, so its focus ring uses the inverse token — the
 * default navy ring would vanish against it. */
const utilityLinkClasses =
  'tsinelas-label-01 inline-flex items-center whitespace-nowrap text-tsinelas-text-inverse-subtle outline-none transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:text-tsinelas-text-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsinelas-focus-inverse';

const iconLinkClasses =
  'flex size-tsinelas-container-03 shrink-0 items-center justify-center text-tsinelas-icon-primary transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-background-hover tsinelas-focus';

const menuItemClasses =
  'tsinelas-body-compact-01 flex min-h-tsinelas-container-03 items-center px-tsinelas-05 text-tsinelas-text-primary transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-layer-hover-01 tsinelas-focus';

/* Mobile side-nav rows: 48px top-level rows and 40px child rows, each with
 * a 3px left rule that lights up in the interactive color when active. */
const mobileRowClasses =
  'tsinelas-heading-compact-02 flex min-h-tsinelas-container-04 items-center gap-tsinelas-03 border-l-[3px] px-tsinelas-05 text-left text-tsinelas-text-primary transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-background-hover tsinelas-focus';

const mobileSubRowClasses =
  'tsinelas-body-compact-01 flex min-h-tsinelas-container-03 items-center border-l-[3px] pr-tsinelas-05 pl-tsinelas-07 text-tsinelas-text-secondary transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-layer-hover-01 hover:text-tsinelas-text-primary tsinelas-focus';

export const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(
    null
  );
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation('common');
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setActiveMobileSubmenu(null);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMobileSubmenu(null);
    setHoveredDropdown(null);
  };

  // Close the mobile menu on navigation.
  useEffect(() => {
    setIsOpen(false);
    setActiveMobileSubmenu(null);
  }, [location.pathname]);

  // While the mobile menu is open: lock page scroll behind it, close on
  // Escape (returning focus to the toggle), and close if the viewport grows
  // to the desktop layout where the panel is hidden anyway.
  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      setActiveMobileSubmenu(null);
      menuButtonRef.current?.focus();
    };
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
        setActiveMobileSubmenu(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [isOpen]);

  const changeLanguage = (newLanguage: LanguageType) => {
    i18n.changeLanguage(newLanguage);
  };

  // i18n may report a regional tag like "en-US"; fall back to the base code.
  const currentLanguage =
    LANGUAGES[i18n.language as LanguageType] ??
    LANGUAGES[i18n.language.split('-')[0] as LanguageType] ??
    LANGUAGES[DEFAULT_LANGUAGE];

  const isActiveRoute = (href: string) => {
    const path = location.pathname.replace(/\/$/, '');
    const target = href.replace(/\/$/, '');
    return path === target || (target !== '' && path.startsWith(target + '/'));
  };

  return (
    <header className='sticky top-0 z-50'>
      {/* Utility bar */}
      <div className='bg-tsinelas-background-brand text-tsinelas-text-inverse'>
        <div className='container flex h-tsinelas-container-02 items-center justify-end gap-tsinelas-06 px-4 mx-auto'>
          <Link
            to='/join-us'
            className={cn(utilityLinkClasses, 'hidden md:inline-flex')}
          >
            Join us
          </Link>
          <Link
            to='/about'
            className={cn(utilityLinkClasses, 'hidden md:inline-flex')}
          >
            About
          </Link>
          <a
            href={config.lgu.officialWebsite}
            target='_blank'
            rel='noreferrer'
            className={utilityLinkClasses}
          >
            <span className='sm:hidden'>Gov.ph</span>
            <span className='hidden sm:inline'>Official Gov.ph</span>
          </a>
          <Link
            to={`https://hotlines.bettergov.ph/?city=${encodeURIComponent(config.lgu.name)}&province=${encodeURIComponent(config.lgu.province)}`}
            className={utilityLinkClasses}
          >
            Hotlines
          </Link>
          <div className='flex h-full items-center border-l border-tsinelas-brand-400/30 pl-tsinelas-05'>
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger
                aria-label='Select language'
                className={cn(
                  utilityLinkClasses,
                  'gap-tsinelas-02 cursor-pointer'
                )}
              >
                <GlobeIcon
                  aria-hidden='true'
                  className='size-tsinelas-icon-01'
                />
                <span className='hidden sm:inline'>
                  {currentLanguage.nativeName}
                </span>
                <span className='uppercase sm:hidden'>
                  {currentLanguage.code}
                </span>
                <ChevronDownIcon
                  aria-hidden='true'
                  className='size-tsinelas-icon-01'
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align='end'
                  sideOffset={0}
                  className='z-50 w-48 border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 py-tsinelas-02 shadow-lg animate-in fade-in duration-150'
                >
                  <DropdownMenu.RadioGroup
                    value={currentLanguage.code}
                    onValueChange={value =>
                      changeLanguage(value as LanguageType)
                    }
                  >
                    {Object.values(LANGUAGES).map(lang => (
                      <DropdownMenu.RadioItem
                        key={lang.code}
                        value={lang.code}
                        className={cn(
                          menuItemClasses,
                          'cursor-pointer justify-between gap-tsinelas-03 outline-none data-[highlighted]:bg-tsinelas-layer-hover-01 data-[state=checked]:font-semibold'
                        )}
                      >
                        {lang.nativeName}
                        <DropdownMenu.ItemIndicator>
                          <CheckIcon
                            aria-hidden='true'
                            className='size-tsinelas-icon-01 text-tsinelas-icon-interactive'
                          />
                        </DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <nav
        aria-label='Main'
        className='border-b border-tsinelas-border-subtle-00 bg-tsinelas-background'
      >
        <div className='container flex h-tsinelas-container-04 items-center justify-between px-4 mx-auto'>
          <Link
            to='/'
            onClick={closeMenu}
            className='flex min-w-0 items-center gap-tsinelas-04 tsinelas-focus'
          >
            <img
              src={config.portal.navbarLogoPath}
              alt={`${config.portal.name} Logo`}
              className='h-8 w-auto shrink-0'
            />
            <span className='tsinelas-label-01 hidden truncate border-l border-tsinelas-border-subtle-00 pl-tsinelas-04 text-tsinelas-text-secondary md:block'>
              Community portal for {config.lgu.fullName}
            </span>
          </Link>

          {/* Desktop menu */}
          <div className='hidden h-full items-stretch lg:flex'>
            {mainNavigation.map(item => {
              const active = isActiveRoute(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const dropdownOpen =
                hasChildren && hoveredDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className='relative flex items-stretch'
                  onMouseEnter={() =>
                    hasChildren && setHoveredDropdown(item.label)
                  }
                  onMouseLeave={() => setHoveredDropdown(null)}
                >
                  <Link
                    to={item.href}
                    aria-expanded={hasChildren ? dropdownOpen : undefined}
                    className={cn(
                      'tsinelas-body-compact-01 flex items-center gap-tsinelas-02 border-b-[3px] px-tsinelas-05 transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive tsinelas-focus',
                      active
                        ? 'border-tsinelas-border-interactive font-semibold text-tsinelas-text-primary'
                        : 'border-transparent text-tsinelas-text-secondary hover:bg-tsinelas-background-hover hover:text-tsinelas-text-primary'
                    )}
                  >
                    {t(`navbar.${item.label.toLowerCase()}`)}
                    {hasChildren && (
                      <ChevronDownIcon
                        aria-hidden='true'
                        className={cn(
                          'size-tsinelas-icon-01 transition-transform duration-tsinelas-fast-01',
                          dropdownOpen && 'rotate-180'
                        )}
                      />
                    )}
                  </Link>

                  {dropdownOpen && (
                    <div
                      role='menu'
                      className='absolute top-full left-0 w-64 border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 py-tsinelas-02 shadow-lg animate-in fade-in duration-150'
                    >
                      {item.children?.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          role='menuitem'
                          className={menuItemClasses}
                          onClick={closeMenu}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              to='/search'
              aria-label='Search'
              className={cn(iconLinkClasses, 'ml-tsinelas-03')}
            >
              <SearchIcon className='size-tsinelas-icon-02' />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className='flex items-center lg:hidden'>
            <Link to='/search' aria-label='Search' className={iconLinkClasses}>
              <SearchIcon className='size-tsinelas-icon-02' />
            </Link>
            <Button
              ref={menuButtonRef}
              onClick={toggleMenu}
              variant='ghost'
              iconOnly
              aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
              aria-expanded={isOpen}
              aria-controls='mobile-menu'
              className='text-tsinelas-icon-primary'
            >
              {isOpen ? (
                <XIcon className='size-tsinelas-icon-02' />
              ) : (
                <MenuIcon className='size-tsinelas-icon-02' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu panel — Carbon side-nav anatomy. Offset = utility
            bar (32px) + main bar (48px) + its 1px border. */}
        {isOpen && (
          <div
            id='mobile-menu'
            className='fixed inset-x-0 top-[calc(5rem+1px)] bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-tsinelas-background lg:hidden'
          >
            <ul className='border-b border-tsinelas-border-subtle-00'>
              {mainNavigation.map(item => {
                const label = t(`navbar.${item.label.toLowerCase()}`);
                const hasChildren = item.children && item.children.length > 0;
                const isSubOpen = activeMobileSubmenu === item.label;
                const active = isActiveRoute(item.href);

                return (
                  <li
                    key={item.label}
                    className='border-t border-tsinelas-border-subtle-00 first:border-t-0'
                  >
                    {hasChildren ? (
                      <button
                        type='button'
                        onClick={() =>
                          setActiveMobileSubmenu(isSubOpen ? null : item.label)
                        }
                        aria-expanded={isSubOpen}
                        className={cn(
                          mobileRowClasses,
                          'w-full justify-between',
                          active
                            ? 'border-tsinelas-border-interactive'
                            : 'border-transparent',
                          isSubOpen && 'bg-tsinelas-layer-01'
                        )}
                      >
                        {label}
                        <ChevronDownIcon
                          aria-hidden='true'
                          className={cn(
                            'size-tsinelas-icon-02 shrink-0 text-tsinelas-icon-secondary transition-transform duration-tsinelas-fast-01',
                            isSubOpen && 'rotate-180'
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={closeMenu}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          mobileRowClasses,
                          active
                            ? 'border-tsinelas-border-interactive'
                            : 'border-transparent'
                        )}
                      >
                        {label}
                      </Link>
                    )}

                    {hasChildren && isSubOpen && (
                      <ul className='border-t border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 py-tsinelas-02'>
                        {/* The parent page itself, since the row above only
                            toggles the group. */}
                        <li>
                          <Link
                            to={item.href}
                            onClick={closeMenu}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              mobileSubRowClasses,
                              active
                                ? 'border-tsinelas-border-interactive font-semibold text-tsinelas-text-primary'
                                : 'border-transparent'
                            )}
                          >
                            {label} overview
                          </Link>
                        </li>
                        {item.children?.map(child => {
                          const childActive = isActiveRoute(child.href);
                          return (
                            <li key={child.label}>
                              <Link
                                to={child.href}
                                onClick={closeMenu}
                                aria-current={childActive ? 'page' : undefined}
                                className={cn(
                                  mobileSubRowClasses,
                                  childActive
                                    ? 'border-tsinelas-border-interactive font-semibold text-tsinelas-text-primary'
                                    : 'border-transparent'
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Links the compact utility bar hides on small screens */}
            <div className='px-tsinelas-05 pt-tsinelas-06 pb-tsinelas-03'>
              <h2 className='tsinelas-eyebrow text-tsinelas-text-secondary'>
                More
              </h2>
            </div>
            <ul className='pb-tsinelas-07'>
              {[
                { label: 'Join us', href: '/join-us' },
                { label: `About ${config.portal.name}`, href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={closeMenu}
                    className={cn(
                      menuItemClasses,
                      'text-tsinelas-text-secondary hover:text-tsinelas-text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
