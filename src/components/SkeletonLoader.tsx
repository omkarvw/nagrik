interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'search' | 'comparison' | 'map';
  className?: string;
}

export function SkeletonLoader({ variant = 'text', className = '' }: SkeletonLoaderProps) {
  switch (variant) {
    case 'search':
      return (
        <div className={`animate-pulse ${className}`}>
          <div className="bg-surface-container-high rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container rounded-lg"></div>
              <div className="flex-1 h-8 bg-surface-container rounded"></div>
              <div className="w-24 h-10 bg-surface-container rounded-xl"></div>
            </div>
          </div>
          {/* Suggestions skeleton */}
          <div className="mt-3 bg-white rounded-2xl border border-outline-variant p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-surface-container rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-container rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-surface-container rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'comparison':
      return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ${className}`}>
          {/* Left card */}
          <div className="bg-white rounded-xl border border-outline-variant p-4 md:p-8 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-6 w-24 bg-surface-container rounded-full"></div>
              <div className="w-8 h-8 bg-surface-container rounded"></div>
            </div>
            <div className="w-full h-32 md:h-48 bg-surface-container rounded-lg mb-4"></div>
            <div className="h-6 bg-surface-container rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-surface-container rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-container rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-surface-container rounded w-1/3"></div>
          </div>

          {/* Right card */}
          <div className="bg-surface-container-low rounded-xl border-2 border-primary-container/30 p-4 md:p-8 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-6 w-28 bg-surface-container rounded-full"></div>
              <div className="w-8 h-8 bg-surface-container rounded"></div>
            </div>
            <div className="w-full h-32 md:h-48 bg-surface-container rounded-lg mb-4"></div>
            <div className="h-6 bg-surface-container rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-surface-container rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-container rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-surface-container rounded w-1/3"></div>
          </div>
        </div>
      );

    case 'map':
      return (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
          {/* List skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-surface-container rounded w-1/2 animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-outline-variant animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-surface-container rounded w-1/2"></div>
                  <div className="h-4 bg-surface-container rounded w-16"></div>
                </div>
                <div className="h-3 bg-surface-container rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-container rounded w-1/3"></div>
              </div>
            ))}
          </div>

          {/* Map skeleton */}
          <div className="lg:col-span-2 bg-surface-container-high rounded-xl h-[300px] md:h-[400px] lg:h-[500px] animate-pulse">
            <div className="h-full w-full bg-surface-container rounded-xl"></div>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className={`bg-white rounded-xl p-6 border border-outline-variant animate-pulse ${className}`}>
          <div className="h-6 bg-surface-container rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-surface-container rounded w-full mb-2"></div>
          <div className="h-4 bg-surface-container rounded w-2/3"></div>
        </div>
      );

    default:
      return (
        <div className={`h-4 bg-surface-container rounded animate-pulse ${className}`}></div>
      );
  }
}
