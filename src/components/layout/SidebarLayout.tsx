import { ReactNode, useEffect, useId, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ChevronDownIcon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import { cn } from '@/lib/utils';

import { ModuleHeader } from './PageLayouts';

export interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  // Option A: Standard Config
  header?: {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
  };
  // Option B: Custom Component (Overrides Option A)
  headerNode?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  /** Label of the disclosure that reveals the sidebar on phones. */
  sidebarLabel?: string;
  className?: string;
}

/**
 * SidebarLayout — module hub shell: header, a 256px side nav (Carbon's
 * side-nav width) that is sticky on desktop and a disclosure on phones,
 * and the content tile. The sidebar can collapse on desktop for detail
 * pages that need the width.
 */
export function SidebarLayout({
  children,
  sidebar,
  header,
  headerNode,
  collapsible = false,
  defaultCollapsed = false,
  sidebarLabel = 'Menu',
  className = '',
}: SidebarLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const location = useLocation();
  const sidebarId = useId();

  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed, location.pathname]);

  // Picking an item navigates (path or query), so fold the phone disclosure
  // away and show the result.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (location.state?.scrollToContent) {
      setTimeout(() => {
        const contentElement = document.getElementById('layout-content');
        if (contentElement) {
          // Clear the 80px sticky header plus a layout step.
          const y = contentElement.offsetTop - 96;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const collapsed = collapsible && isCollapsed;

  return (
    <div className={cn('min-h-screen bg-tsinelas-background', className)}>
      <div className='container py-tsinelas-layout-02 md:py-tsinelas-layout-03'>
        {headerNode ? (
          <div className='mb-tsinelas-06'>{headerNode}</div>
        ) : header ? (
          <div className='mb-tsinelas-06'>
            <ModuleHeader title={header.title} description={header.subtitle}>
              {header.actions}
            </ModuleHeader>
          </div>
        ) : null}

        {/* Phone: the sidebar behind a disclosure row */}
        <div className='mb-tsinelas-05 md:hidden'>
          <Button
            variant='tertiary'
            fullWidth
            onClick={() => setMobileOpen(open => !open)}
            aria-expanded={mobileOpen}
            aria-controls={sidebarId}
            rightIcon={
              <ChevronDownIcon
                className={cn(
                  'size-tsinelas-icon-01 transition-transform duration-tsinelas-fast-01',
                  mobileOpen && 'rotate-180'
                )}
              />
            }
          >
            {sidebarLabel}
          </Button>
        </div>

        <div className='relative flex flex-col md:flex-row md:items-start'>
          {/* Desktop: expand control, shown only while collapsed */}
          {collapsible && (
            <div
              className={cn(
                'absolute top-0 left-0 z-10 hidden md:block',
                collapsed ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <Button
                variant='tertiary'
                iconOnly
                onClick={() => setIsCollapsed(false)}
                aria-label='Show sidebar'
                aria-expanded={false}
              >
                <PanelLeftOpen className='size-tsinelas-icon-02' />
              </Button>
            </div>
          )}

          <aside
            id={sidebarId}
            className={cn(
              'shrink-0 overflow-hidden md:sticky md:top-24 md:self-start',
              'transition-[width,margin] duration-tsinelas-moderate-02 ease-tsinelas-standard-productive',
              mobileOpen ? 'block' : 'hidden md:block',
              collapsed
                ? 'md:mr-tsinelas-layout-04 md:w-0'
                : 'md:mr-tsinelas-layout-03 md:w-64'
            )}
            inert={collapsed || undefined}
          >
            <div className='w-full md:w-64'>
              {collapsible && (
                <div className='mb-tsinelas-03 hidden justify-end md:flex'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsCollapsed(true)}
                    aria-expanded={true}
                    rightIcon={
                      <PanelLeftClose className='size-tsinelas-icon-01' />
                    }
                  >
                    Hide
                  </Button>
                </div>
              )}
              {sidebar}
            </div>
          </aside>

          <main className='min-w-0 flex-1'>
            <div
              id='layout-content'
              className='min-h-[50vh] bg-tsinelas-background md:border md:border-tsinelas-border-subtle-00 md:p-tsinelas-06'
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
