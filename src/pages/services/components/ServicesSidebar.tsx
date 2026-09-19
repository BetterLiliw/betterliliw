import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  SidebarContainer,
  SidebarItem,
} from '@/components/navigation/SidebarNavigation';
import { Button } from '@/components/ui/Button';

import { scrollToTop } from '@/lib/scrollUtils';
import { getCategoryIconBySlug } from '@/lib/serviceIcons';

import serviceCategories from '@/data/service_categories.json';
import { config } from '@/lib/lguConfig';

interface ServicesSidebarProps {
  selectedCategorySlug: string;
  handleCategoryChange: (slug: string) => void;
}

export default function ServicesSidebar({
  selectedCategorySlug,
  handleCategoryChange,
}: ServicesSidebarProps) {
  return (
    <div className='space-y-tsinelas-05'>
      <SidebarContainer title='Categories'>
        <SidebarItem
          label='All services'
          icon={FileText}
          isActive={selectedCategorySlug === 'all'}
          onClick={() => {
            scrollToTop();
            handleCategoryChange('all');
          }}
        />
        {serviceCategories.categories.map(category => (
          <SidebarItem
            key={category.slug}
            label={category.name}
            icon={getCategoryIconBySlug(category.slug)}
            isActive={selectedCategorySlug === category.slug}
            onClick={() => {
              scrollToTop();
              handleCategoryChange(category.slug);
            }}
          />
        ))}
      </SidebarContainer>

      {/* The one accent CTA on the page. */}
      <div className='space-y-tsinelas-04 border border-tsinelas-border-subtle-00 bg-tsinelas-notification-background-warning p-tsinelas-05'>
        <h3 className='tsinelas-heading-compact-01 text-tsinelas-text-primary'>
          Missing a service?
        </h3>
        <p className='tsinelas-body-01 text-tsinelas-text-secondary'>
          {config.portal.name} is maintained by the community. Suggest a service
          that is missing or out of date — no account needed.
        </p>
        <Link to='/services/request' className='block'>
          <Button variant='accent' fullWidth>
            Suggest a service
          </Button>
        </Link>
      </div>
    </div>
  );
}
