import { Link } from 'react-router-dom';

import { format, isValid } from 'date-fns';
import {
  AlertCircle,
  ArrowRightIcon,
  BookOpenIcon,
  BriefcaseIcon,
  ClockIcon,
  DollarSignIcon,
  FileTextIcon,
  HammerIcon,
  HeartIcon,
  LeafIcon,
  LucideIcon,
  ShieldCheck,
  ShieldIcon,
  UsersIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

import type { Service } from '@/types/servicesTypes';

// Icons
const categoryIcons: Record<string, LucideIcon> = {
  'certificates-vital-records': FileTextIcon,
  'business-licensing': BriefcaseIcon,
  'business-trade-investment': BriefcaseIcon,
  'taxation-assessment': DollarSignIcon,
  'taxation-payments': DollarSignIcon,
  'infrastructure-engineering': HammerIcon,
  'infrastructure-public-works': HammerIcon,
  'social-services': UsersIcon,
  'social-services-assistance': UsersIcon,
  'health-wellness': HeartIcon,
  'agriculture-livelihood': LeafIcon,
  'agriculture-economic-development': LeafIcon,
  'environment-waste': LeafIcon,
  'environment-natural-resources': LeafIcon,
  'education-scholarship': BookOpenIcon,
  'public-safety': ShieldIcon,
  'public-safety-security': ShieldIcon,
  'other-municipal': FileTextIcon,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const CategoryIcon = categoryIcons[service.category.slug] || FileTextIcon;
  const hasValidDate =
    service.updatedAt && isValid(new Date(service.updatedAt));
  const isOfficialSource = service.source === 'citizens-charter';
  const needsVerification = service.needsVerification === true;
  const isTransaction = service.type === 'transaction';

  return (
    <Link
      to={`/services/${service.slug}`}
      className='group block [content-visibility:auto] [contain-intrinsic-size:auto_16rem] tsinelas-focus'
      data-testid='service-card'
      data-service-slug={service.slug}
      aria-label={`View details for ${service.plainLanguageName || service.service}`}
    >
      <Card hover className='flex h-full flex-col'>
        <CardContent className='flex h-full flex-col'>
          {/* Icon & Status Badges */}
          <div className='mb-tsinelas-04 flex items-start justify-between gap-tsinelas-03'>
            <div className='border border-tsinelas-border-subtle-01 bg-tsinelas-layer-02 p-tsinelas-03'>
              <CategoryIcon className='size-tsinelas-icon-02 text-tsinelas-icon-interactive' />
            </div>
            <div className='flex flex-wrap items-center justify-end gap-tsinelas-02'>
              {/* Source Badge */}
              <Badge
                variant={isOfficialSource ? 'success' : 'secondary'}
                size='sm'
              >
                {isOfficialSource ? 'Official' : 'Community'}
              </Badge>
              {/* Online/Walk-in Badge */}
              {service.url ? (
                <Badge variant='primary' size='sm'>
                  Online
                </Badge>
              ) : isTransaction ? (
                <Badge variant='slate' size='sm'>
                  Walk-in
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Service Number (for Citizens Charter services) */}
          {service.serviceNumber && (
            <p className='tsinelas-label-01 mb-tsinelas-02 text-tsinelas-text-helper tsinelas-tabular'>
              Service no. {service.serviceNumber}
            </p>
          )}

          {/* Title & Category Label */}
          <div className='flex-1'>
            <h3 className='tsinelas-heading-compact-02 mb-tsinelas-02 text-tsinelas-text-primary transition-colors duration-tsinelas-fast-01 group-hover:text-tsinelas-link-primary'>
              {service.plainLanguageName || service.service}
            </h3>
            <p className='tsinelas-label-01 text-tsinelas-text-secondary'>
              {service.category.name}
            </p>
            {/* Office Division (for Citizens Charter services) */}
            {service.officeDivision && (
              <p className='tsinelas-helper-text-01 mt-tsinelas-01 text-tsinelas-text-helper'>
                {service.officeDivision}
              </p>
            )}
          </div>

          {/* Footer Row */}
          <div className='mt-tsinelas-05 flex items-center justify-between gap-tsinelas-03 border-t border-tsinelas-border-subtle-01 pt-tsinelas-04'>
            {/* Verification / Data Status */}
            <div className='flex items-center gap-tsinelas-02 tsinelas-label-01'>
              {needsVerification ? (
                <>
                  <AlertCircle className='size-tsinelas-04 text-tsinelas-text-warning' />
                  <span className='text-tsinelas-text-warning'>
                    Pending verification
                  </span>
                </>
              ) : hasValidDate ? (
                <>
                  <ClockIcon className='size-tsinelas-04 text-tsinelas-icon-secondary' />
                  <span className='text-tsinelas-text-secondary'>
                    Updated {format(new Date(service.updatedAt!), 'MMM yyyy')}
                  </span>
                </>
              ) : isOfficialSource ? (
                <>
                  <ShieldCheck className='size-tsinelas-04 text-tsinelas-support-success' />
                  <span className='text-tsinelas-text-secondary'>
                    Citizens Charter
                  </span>
                </>
              ) : (
                <>
                  <span className='size-tsinelas-02 shrink-0 rounded-full bg-tsinelas-icon-disabled' />
                  <span className='text-tsinelas-text-helper'>Unverified</span>
                </>
              )}
            </div>

            {/* View Link */}
            <span className='flex items-center gap-tsinelas-02 text-tsinelas-link-primary tsinelas-label-01 group-hover:text-tsinelas-link-primary-hover'>
              View
              <ArrowRightIcon
                aria-hidden='true'
                className='size-tsinelas-icon-01'
              />
            </span>
          </div>

          {/* Classification Badge (for Citizens Charter services) */}
          {service.classification && (
            <div className='mt-tsinelas-03'>
              <Badge variant='outline' size='sm'>
                {service.classification} transaction
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
