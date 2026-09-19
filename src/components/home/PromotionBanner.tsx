import { FC } from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

const PromotionBanner: FC = () => {
  const { t } = useTranslation('common');

  return (
    <section className='bg-tsinelas-bg-accent-yellow-weak text-tsinelas-text-inverse py-12'>
      <div className='container'>
        <div className='items-center justify-between md:flex'>
          <div>
            <h2 className='mb-2 tsinelas-heading-lg font-bold'>
              {t('promotion.philsysTitle')}
            </h2>
            <p className='text-tsinelas-text-inverse/90 mb-6 max-w-xl md:mb-0'>
              {t('promotion.philsysDescription')}
            </p>
          </div>
          <div>
            <Link to='https://philsys.gov.ph/registration-process'>
              <Button
                className='text-tsinelas-text-accent-yellow bg-tsinelas-bg-surface hover:bg-tsinelas-bg-hover cursor-pointer px-8 py-3 text-lg shadow-lg'
                size='lg'
              >
                {t('promotion.registerNow')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
