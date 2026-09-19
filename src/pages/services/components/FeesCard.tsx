import { Banknote, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { ServiceFee } from '@/types/servicesTypes';

interface FeesCardProps {
  fees: ServiceFee | ServiceFee[];
}

/**
 * Parse fee amount string to extract numeric value in pesos
 * Handles formats like "₱3,000.00", "₱200.00 - ₱500.00", "Free", "Variable"
 */
function parseFeeAmount(amount: string): number {
  if (!amount || amount === 'Free' || amount === 'Variable') {
    return 0;
  }
  // Remove peso sign, commas, and extract numbers
  const cleaned = amount.replace(/[₱,]/g, '').replace(/[^\d.-]/g, ' ');
  // Handle range format like "₱200.00 - ₱500.00" - take the max
  const numbers = cleaned
    .split(' ')
    .filter(n => n)
    .map(n => parseFloat(n))
    .filter(n => !isNaN(n));
  return Math.max(...numbers, 0);
}

/**
 * Format number back to peso string
 */
function formatPeso(amount: number): string {
  if (amount === 0) return '₱0.00';
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function FeesCard({ fees }: FeesCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const feeArray = Array.isArray(fees) ? fees : [fees];

  // Separate required and optional fees
  const requiredFees = feeArray.filter(f => f.required !== false);
  const optionalFees = feeArray.filter(f => f.required === false);

  // Calculate min (sum of required) and max (sum of all)
  const minFee = requiredFees.reduce(
    (sum, f) => sum + parseFeeAmount(f.amount),
    0
  );
  const maxFee = feeArray.reduce((sum, f) => sum + parseFeeAmount(f.amount), 0);

  // Determine display text
  let feeDisplay: string;
  if (minFee === maxFee) {
    feeDisplay = formatPeso(minFee);
  } else if (maxFee === 0) {
    feeDisplay = 'Variable';
  } else {
    feeDisplay = `${formatPeso(minFee)} - ${formatPeso(maxFee)}`;
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='border-tsinelas-border-weak hover:border-tsinelas-border-brand bg-tsinelas-bg-surface flex w-full items-start gap-3 rounded-2xl border p-4 shadow-xs transition-all'
        aria-expanded={isExpanded}
      >
        <div className='text-tsinelas-text-brand bg-tsinelas-bg-surface-raised shrink-0 rounded-lg p-2'>
          <Banknote className='h-4 w-4' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='text-left'>
            <p className='text-tsinelas-text-disabled mb-1 tsinelas-eyebrow'>
              Fees
            </p>
            <p className='text-tsinelas-text-strong text-xs font-bold'>
              {feeDisplay}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className='text-tsinelas-text-support h-4 w-4 shrink-0' />
          ) : (
            <ChevronDown className='text-tsinelas-text-support h-4 w-4 shrink-0' />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className='border-tsinelas-border-weak bg-tsinelas-bg-surface-raised/50 mt-2 rounded-xl border p-4'>
          {/* Required Fees */}
          {requiredFees.length > 0 && (
            <div className='mb-4'>
              <h4 className='text-tsinelas-text-strong mb-2 text-xs font-semibold uppercase tracking-wider'>
                Required Fees
              </h4>
              <div className='space-y-2'>
                {requiredFees.map((fee, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between rounded-lg border border-tsinelas-border-weak bg-tsinelas-bg-surface p-3'
                  >
                    <div className='flex-1'>
                      <p className='text-tsinelas-text-strong text-xs font-medium'>
                        {fee.description}
                      </p>
                    </div>
                    <p className='text-tsinelas-text-brand ml-3 text-xs font-bold'>
                      {fee.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Fees */}
          {optionalFees.length > 0 && (
            <div>
              <h4 className='text-tsinelas-text-support mb-2 text-xs font-semibold uppercase tracking-wider'>
                Additional Fees (if applicable)
              </h4>
              <div className='space-y-2'>
                {optionalFees.map((fee, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between rounded-lg border border-dashed border-tsinelas-border-weak bg-tsinelas-bg-surface p-3'
                  >
                    <div className='flex-1'>
                      <p className='text-tsinelas-text-support text-xs font-medium'>
                        {fee.description}
                      </p>
                    </div>
                    <p className='text-tsinelas-text-disabled ml-3 text-xs font-bold'>
                      {fee.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fee Summary */}
          {(requiredFees.length > 0 && optionalFees.length > 0) ||
          (requiredFees.length > 1 && minFee !== maxFee) ? (
            <div className='border-tsinelas-border-brand bg-tsinelas-bg-brand-weak/20 mt-4 flex items-center justify-between rounded-lg border p-3'>
              <span className='text-tsinelas-text-support text-xs font-medium'>
                Total Range
              </span>
              <span className='text-tsinelas-text-brand text-xs font-bold'>
                {feeDisplay}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
