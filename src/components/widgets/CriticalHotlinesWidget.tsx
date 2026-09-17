import { FC } from 'react';

import { Link } from 'react-router-dom';

import { AlertCircleIcon, ChevronRightIcon, PhoneIcon } from 'lucide-react';

import hotlinesData from '../../data/philippines_hotlines.json';

interface Hotline {
  name: string;
  category: string;
  numbers: string[];
  description?: string;
}

interface CriticalHotlinesWidgetProps {
  maxItems?: number;
}

const CriticalHotlinesWidget: FC<CriticalHotlinesWidgetProps> = ({
  maxItems = 4,
}) => {
  const displayedHotlines = (hotlinesData.criticalHotlines as Hotline[]).slice(
    0,
    maxItems
  );

  return (
    <div className='overflow-hidden rounded-lg border shadow-md border-tsinelas-border-weak bg-tsinelas-bg-surface'>
      <div className='flex justify-between items-center px-4 py-3 bg-tsinelas-bg-danger-default'>
        <div className='flex items-center'>
          <AlertCircleIcon className='mr-2 w-5 h-5 text-tsinelas-text-inverse' />
          <h3 className='font-bold text-tsinelas-text-inverse'>
            Critical Emergency Hotlines
          </h3>
        </div>
        <Link
          to='https://hotlines.bettergov.ph/'
          className='flex items-center text-sm text-tsinelas-text-inverse hover:underline'
        >
          View all <ChevronRightIcon className='ml-1 w-4 h-4' />
        </Link>
      </div>

      <div className='p-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {displayedHotlines.map((hotline, index) => (
            <div key={index} className='flex flex-col'>
              <span className='font-medium text-tsinelas-text-strong'>
                {hotline.name}
              </span>
              <div className='mt-1 space-y-1'>
                {hotline.numbers.map((number, idx) => (
                  <a
                    key={idx}
                    href={`tel:${number.replace(/\D/g, '')}`}
                    className='flex items-center text-tsinelas-text-info hover:underline'
                  >
                    <PhoneIcon className='mr-1 w-3 h-3' />
                    <span className='text-sm'>{number}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='pt-3 mt-4 text-center border-t border-tsinelas-border-weak'>
          <Link
            to='/philippines/hotlines'
            className='inline-flex items-center text-sm font-medium text-tsinelas-text-info hover:text-blue-800'
          >
            See all emergency hotlines
            <ChevronRightIcon className='ml-1 w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CriticalHotlinesWidget;
