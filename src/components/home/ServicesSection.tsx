import { FC, useMemo } from 'react';

import { Link } from 'react-router-dom';

import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardGrid } from '@/components/ui/Card';
import { getCategoryIcon } from '@/lib/serviceIcons';

import serviceCategories from '../../data/service_categories.json';

interface Category {
  name: string;
  slug: string;
  description: string;
}

interface ServiceCategory extends Category {
  services?: unknown[];
}

const ServicesSection: FC = () => {
  const { t } = useTranslation('common');

  // Cast JSON data to new Interface
  const categories = serviceCategories.categories as Category[];

  // Calculate service count per category
  const categoriesWithCount = useMemo(() => {
    return categories.map((cat: ServiceCategory) => ({
      ...cat,
      serviceCount: cat.services?.length || 0,
    }));
  }, [categories]);

  // Show 8 categories for even 4x2 grid
  const displayedCategories = categoriesWithCount.slice(0, 8);

  return (
    <section className='bg-tsinelas-bg-surface py-12'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='text-tsinelas-text-strong mb-4 tsinelas-heading-lg font-bold'>
            {t('services.governmentServices')}
          </h2>
          <p className='text-tsinelas-text-support mx-auto max-w-2xl'>
            {t('services.description')}
          </p>
        </div>

        {/* Using documented CardGrid pattern */}
        <CardGrid columns={4}>
          {displayedCategories.map(category => {
            const Icon = getCategoryIcon(category.name);
            return (
              <Link
                key={category.slug}
                to={`/services?category=${category.slug}`}
                className='group h-full'
              >
                <Card hover className='h-full'>
                  <CardContent className='flex h-full flex-col p-6'>
                    <div className='mb-4 flex items-start'>
                      <div className='bg-tsinelas-bg-surface text-tsinelas-text-brand group-hover:bg-tsinelas-bg-brand-default group-hover:text-tsinelas-text-inverse rounded-lg p-3 transition-colors'>
                        <Icon className='h-6 w-6' />
                      </div>
                    </div>

                    <h3 className='group-hover:text-tsinelas-text-brand text-tsinelas-text-strong mb-2 text-lg font-bold'>
                      {category.name}
                    </h3>

                    <p className='text-tsinelas-text-support mb-6 line-clamp-3 flex-1 text-sm'>
                      {category.description}
                    </p>

                    <div className='text-tsinelas-text-link group-hover:text-tsinelas-text-link-hover flex items-center text-sm font-medium group-hover:underline'>
                      {t('services.viewAllCategory')}
                      <LucideIcons.ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </CardGrid>

        <div className='mt-10 text-center'>
          <Link
            to='/services?category=all'
            className='bg-tsinelas-bg-brand-default hover:bg-tsinelas-bg-brand-hover focus:ring-tsinelas-border-brand text-tsinelas-text-inverse inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden'
          >
            {t('services.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
