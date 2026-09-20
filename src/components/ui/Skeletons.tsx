import { Loading } from './Loading';

export function CardSkeleton() {
  return (
    <div className='border-tsinelas-border-weak bg-tsinelas-bg-surface animate-pulse rounded-xl border p-6'>
      <div className='mb-6 flex items-start justify-between'>
        <div className='bg-tsinelas-bg-active h-12 w-12 rounded-lg' />
        <div className='bg-tsinelas-bg-active h-4 w-4 rounded-full' />
      </div>
      <div className='bg-tsinelas-bg-active mb-2 h-5 w-3/4 rounded' />
      <div className='bg-tsinelas-bg-hover h-3 w-1/2 rounded' />
    </div>
  );
}

export function DirectoryGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

interface PageLoadingStateProps {
  message?: string;
}

/** Section-size branded loader; kept as an alias of `Loading` for callers. */
export function PageLoadingState({
  message = 'Loading',
}: PageLoadingStateProps) {
  return <Loading message={message} />;
}
