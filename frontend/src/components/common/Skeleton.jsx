const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-primary-100/70 rounded-xl ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-full" />
  </div>
);

export default Skeleton;
