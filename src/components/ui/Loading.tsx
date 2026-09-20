import { cn } from '@/lib/utils';

interface LoadingProps {
  /** Caption under the mark; doubles as the accessible name of the region. */
  message?: string;
  /**
   * `page` fills a route-sized region (the Suspense fallback), `section`
   * sits inside a page that already has its header on screen.
   */
  size?: 'page' | 'section';
  className?: string;
}

/**
 * Loading — the branded indeterminate state: the looping logomark over a
 * 2px indeterminate bar in the interactive colour, with a 12px caption.
 *
 * The mark is the `logomark-loop` asset, which carries its own
 * reduced-motion fallback; the bar goes static under the same preference.
 * The block fades in after a short delay so fast route transitions never
 * flash a loader.
 */
export function Loading({
  message = 'Loading',
  size = 'section',
  className,
}: LoadingProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'animate-in fade-in fill-mode-both delay-150 duration-300 flex flex-col items-center justify-center text-center',
        size === 'page'
          ? 'min-h-[40vh] py-tsinelas-layout-06'
          : 'py-tsinelas-layout-05',
        className
      )}
    >
      <img
        src='/logos/betterliliw-logomark-loop.svg'
        alt=''
        width={1000}
        height={1000}
        decoding='async'
        className={size === 'page' ? 'size-tsinelas-10' : 'size-tsinelas-09'}
      />
      <div
        aria-hidden='true'
        className='mt-tsinelas-05 h-[2px] w-tsinelas-12 overflow-hidden bg-tsinelas-border-subtle-00'
      >
        <div className='h-full w-1/3 bg-tsinelas-interactive animate-tsinelas-indeterminate motion-reduce:w-full motion-reduce:animate-none' />
      </div>
      <p className='tsinelas-label-01 mt-tsinelas-04 text-tsinelas-text-secondary'>
        {message}
      </p>
    </div>
  );
}
