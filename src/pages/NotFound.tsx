import { FormEvent, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {
  ArrowRightIcon,
  BuildingIcon,
  FileTextIcon,
  LandmarkIcon,
  LucideIcon,
} from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import { Button } from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';

import { config } from '@/lib/lguConfig';

const DESTINATIONS: {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    to: '/services',
    label: 'Services',
    description: 'Requirements, fees and steps for municipal services.',
    icon: FileTextIcon,
  },
  {
    to: '/government/elected-officials',
    label: 'Government',
    description: 'Officials, departments and the barangay directory.',
    icon: LandmarkIcon,
  },
  {
    to: '/government/barangays',
    label: 'Barangays',
    description: `Contact details for every barangay in ${config.lgu.name}.`,
    icon: BuildingIcon,
  },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const search = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div className='min-h-[70vh] bg-tsinelas-background'>
      <SEO
        title='Page not found'
        description='The page you were looking for is not here.'
        keywords={['404', 'not found']}
        noIndex
      />

      <div className='container py-tsinelas-layout-05 md:py-tsinelas-layout-06'>
        <div className='max-w-2xl border-l-[3px] border-tsinelas-border-interactive pl-tsinelas-06'>
          <p className='tsinelas-eyebrow text-tsinelas-text-secondary'>
            Error 404
          </p>
          <h1 className='tsinelas-heading-xl mt-tsinelas-03 text-tsinelas-text-primary'>
            Page not found
          </h1>
          <p className='tsinelas-body-02 mt-tsinelas-04 text-tsinelas-text-secondary'>
            The address may be out of date, or the page may have moved. Try a
            search, or start from one of the sections below.
          </p>

          <form
            onSubmit={search}
            role='search'
            className='mt-tsinelas-06 flex flex-col gap-tsinelas-03 sm:flex-row'
          >
            <SearchInput
              value={query}
              onChangeValue={setQuery}
              placeholder='Search services, offices, officials…'
              aria-label='Search the portal'
              size='lg'
              className='flex-1'
            />
            <Button type='submit' size='lg'>
              Search
            </Button>
          </form>

          <div className='mt-tsinelas-05 flex flex-wrap gap-tsinelas-03'>
            <Link to='/'>
              <Button
                variant='tertiary'
                rightIcon={<ArrowRightIcon className='size-tsinelas-icon-01' />}
              >
                Go to the homepage
              </Button>
            </Link>
            <Button variant='ghost' onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </div>

        <section
          aria-labelledby='nf-destinations'
          className='mt-tsinelas-layout-05 border-t border-tsinelas-border-subtle-00 pt-tsinelas-06'
        >
          <h2
            id='nf-destinations'
            className='tsinelas-heading-compact-02 text-tsinelas-text-primary'
          >
            Popular sections
          </h2>
          <ul className='mt-tsinelas-05 grid gap-tsinelas-05 sm:grid-cols-3'>
            {DESTINATIONS.map(({ to, label, description, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className='group flex h-full flex-col gap-tsinelas-04 border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 p-tsinelas-05 tsinelas-tile-clickable tsinelas-focus'
                >
                  <Icon
                    aria-hidden='true'
                    className='size-tsinelas-icon-02 text-tsinelas-icon-interactive'
                  />
                  <div className='flex-1'>
                    <h3 className='tsinelas-heading-compact-02 text-tsinelas-text-primary group-hover:text-tsinelas-link-primary'>
                      {label}
                    </h3>
                    <p className='tsinelas-body-01 mt-tsinelas-02 text-tsinelas-text-secondary'>
                      {description}
                    </p>
                  </div>
                  <ArrowRightIcon
                    aria-hidden='true'
                    className='size-tsinelas-icon-01 text-tsinelas-icon-secondary group-hover:text-tsinelas-link-primary'
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
