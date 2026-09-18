import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { componentSections, designSystemSections } from './sections';

const pages = [
  {
    to: '/dev/design-system',
    label: 'Design system',
    sections: designSystemSections,
  },
  { to: '/dev/components', label: 'Components', sections: componentSections },
];

/**
 * Dev-only shell for the Tsinelas reference pages: a sticky side nav with
 * the two pages and their anchors, Carbon UI-shell style. Registered in
 * App.tsx only when `import.meta.env.DEV` is true.
 */
export default function DevShell() {
  const { pathname } = useLocation();

  return (
    <div className='tsinelas-grid flex flex-col gap-tsinelas-07 py-tsinelas-07 lg:flex-row'>
      <aside className='shrink-0 lg:sticky lg:top-tsinelas-07 lg:w-64 lg:self-start'>
        <div className='border-l-[3px] border-tsinelas-border-interactive pl-tsinelas-04'>
          <p className='text-tsinelas-text-secondary tsinelas-eyebrow'>
            Dev only
          </p>
          <p className='text-tsinelas-text-primary tsinelas-heading-03'>
            Tsinelas
          </p>
          <p className='text-tsinelas-text-helper tsinelas-helper-text-01'>
            Carbon on the BetterLiliw brand
          </p>
        </div>
        <nav className='mt-tsinelas-06' aria-label='Design system pages'>
          {pages.map(page => {
            const active = pathname === page.to;
            return (
              <div key={page.to} className='mb-tsinelas-05'>
                <NavLink
                  to={page.to}
                  className={cn(
                    'block border-l-[3px] py-tsinelas-02 pl-tsinelas-04 tsinelas-heading-compact-01 tsinelas-focus',
                    active
                      ? 'border-tsinelas-border-interactive bg-tsinelas-layer-selected-01 text-tsinelas-text-primary'
                      : 'border-transparent text-tsinelas-text-secondary hover:bg-tsinelas-background-hover hover:text-tsinelas-text-primary'
                  )}
                >
                  {page.label}
                </NavLink>
                {active && (
                  <ul className='mt-tsinelas-02'>
                    {page.sections.map(s => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className='block border-l-[3px] border-transparent py-tsinelas-01 pl-tsinelas-06 text-tsinelas-text-secondary tsinelas-body-compact-01 tsinelas-focus hover:bg-tsinelas-background-hover hover:text-tsinelas-text-primary'
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className='min-w-0 flex-1'>
        <Outlet />
      </div>
    </div>
  );
}
