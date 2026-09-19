import { FC, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { Building2Icon, HomeIcon, UsersIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardGrid } from '@/components/ui/Card';

import barangaysData from '@/data/directory/barangays.json';
import departmentsData from '@/data/directory/departments.json';

const GovernmentSection: FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const barangayCount = useMemo(
    () => (Array.isArray(barangaysData) ? barangaysData.length : 0),
    []
  );
  const departmentCount = useMemo(
    () => (Array.isArray(departmentsData) ? departmentsData.length : 0),
    []
  );

  const branches = [
    {
      id: 'executive',
      title: t('government.electedofficialsTitle'),
      description: t(
        'government.electedofficialsDescription',
        'Meet your Mayor, Vice Mayor, and Councilors.'
      ),
      icon: <UsersIcon className='text-tsinelas-text-brand h-10 w-10' />,
      link: '/government/elected-officials',
    },
    {
      id: 'legislative',
      title: t('government.departmentsTitle'),
      description: t(
        'government.departmentsDescription',
        'Services and offices under the Executive branch.'
      ),
      icon: <Building2Icon className='text-tsinelas-text-brand h-10 w-10' />,
      link: '/government/departments',
    },
    {
      id: 'barangays',
      title: t('government.barangaysTitle'),
      description: t('government.barangaysDescription'),
      icon: <HomeIcon className='text-tsinelas-text-brand h-10 w-10' />,
      link: '/government/barangays',
    },
  ];

  return (
    <section className='bg-tsinelas-bg-surface py-tsinelas-layout-03 md:py-tsinelas-layout-04'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='tsinelas-heading-lg mb-tsinelas-03 text-tsinelas-text-primary'>
            {t('government.title')}
          </h2>
          <p className='text-tsinelas-text-support mx-auto max-w-2xl'>
            {t('government.description')}
          </p>
        </div>

        {/* Quick stats using documented Badge component */}
        <div className='flex flex-wrap justify-center gap-4 mb-8'>
          <Badge variant='primary' className='px-4 py-2 text-sm'>
            {barangayCount} Barangays
          </Badge>
          <Badge variant='secondary' className='px-4 py-2 text-sm'>
            {departmentCount} Departments
          </Badge>
          <Badge variant='slate' className='px-4 py-2 text-sm'>
            Elected Officials
          </Badge>
        </div>

        {/* Using documented CardGrid pattern */}
        <CardGrid columns={3}>
          {branches.map(branch => (
            <Card key={branch.id} hover className='text-center'>
              <CardContent className='p-6'>
                <div className='mb-4 flex justify-center'>{branch.icon}</div>
                <h3 className='text-tsinelas-text-strong mb-2 text-xl font-semibold'>
                  {branch.title}
                </h3>
                <p className='text-tsinelas-text-support mb-4'>
                  {branch.description}
                </p>
                <Button
                  onClick={() => navigate(branch.link)}
                  variant='link'
                  size='sm'
                  rightIcon={
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <line x1='5' y1='12' x2='19' y2='12'></line>
                      <polyline points='12 5 19 12 12 19'></polyline>
                    </svg>
                  }
                >
                  {t('government.learnMore')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardGrid>

        {/* Banner CTA - using documented Banner component */}
        <Banner
          className='p-tsinelas-lg mt-12'
          type='default'
          title={t('government.directoryTitle')}
          description={t('government.directoryDescription')}
          cta={{
            label: t('government.viewDirectory'),
            onClick: () => navigate('/government/'),
            variant: 'primary',
            size: 'lg',
          }}
        />
      </div>
    </section>
  );
};

export default GovernmentSection;
