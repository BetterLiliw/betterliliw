import { forwardRef } from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  /** Carbon field heights: sm 32, md 40 (default), lg 48. */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const heights = {
  sm: 'h-tsinelas-container-02',
  md: 'h-tsinelas-container-03',
  lg: 'h-tsinelas-container-04',
};

/**
 * Dropdown — Carbon's single-select dropdown on Tsinelas. The trigger is
 * the Input recipe (filled field, bottom rule, chevron in the icon slot) and
 * the menu is the shared Carbon menu (layer-01, hairline border, overlay
 * shadow, 40px rows, check on the selected row). Built on Radix so it gets
 * arrow keys, type-ahead, Escape and click-outside for free, and renders
 * the same on every browser — never reach for a native <select>.
 *
 * For multi-select or a filterable list use SelectPicker.
 */
export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      id,
      value,
      onChange,
      options,
      placeholder = 'Choose an option',
      size = 'md',
      invalid = false,
      disabled = false,
      className,
      ...aria
    },
    ref
  ) => {
    const selected = options.find(o => o.value === value);

    return (
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...aria}
          className={cn(
            'group flex w-full items-center justify-between gap-tsinelas-03 border-0 border-b border-tsinelas-border-strong bg-tsinelas-field px-tsinelas-05 text-left tsinelas-body-compact-01 tsinelas-focus',
            'transition-[background-color,outline-color] duration-tsinelas-fast-01 ease-tsinelas-standard-productive',
            'hover:bg-tsinelas-field-hover data-[state=open]:bg-tsinelas-field-hover',
            'disabled:cursor-not-allowed disabled:border-transparent disabled:text-tsinelas-text-disabled disabled:hover:bg-tsinelas-field',
            selected
              ? 'text-tsinelas-text-primary'
              : 'text-tsinelas-text-placeholder',
            invalid && 'outline-2 outline-tsinelas-support-error',
            heights[size],
            className
          )}
        >
          <span className='truncate'>{selected?.label ?? placeholder}</span>
          <ChevronDownIcon
            aria-hidden='true'
            className='size-tsinelas-icon-01 shrink-0 text-tsinelas-icon-secondary transition-transform duration-tsinelas-fast-01 group-data-[state=open]:rotate-180'
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align='start'
            sideOffset={0}
            className='z-50 max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto border border-tsinelas-border-subtle-00 bg-tsinelas-layer-01 py-tsinelas-02 shadow-lg animate-in fade-in duration-150'
          >
            <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
              {options.map(option => (
                <DropdownMenu.RadioItem
                  key={option.value}
                  value={option.value}
                  className='flex min-h-tsinelas-container-03 cursor-pointer items-center justify-between gap-tsinelas-03 px-tsinelas-05 text-tsinelas-text-primary tsinelas-body-compact-01 outline-none transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive data-[highlighted]:bg-tsinelas-layer-hover-01 data-[state=checked]:font-semibold'
                >
                  <span className='truncate'>{option.label}</span>
                  <DropdownMenu.ItemIndicator>
                    <CheckIcon
                      aria-hidden='true'
                      className='size-tsinelas-icon-01 text-tsinelas-icon-interactive'
                    />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
);
Dropdown.displayName = 'Dropdown';

export default Dropdown;
