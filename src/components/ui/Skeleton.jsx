export const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <Shimmer className="h-48" />
    <div className="p-5 space-y-3">
      <Shimmer className="h-5 w-3/4" />
      <Shimmer className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <Shimmer className="w-12 h-12 rounded-xl mb-3" />
        <Shimmer className="h-7 w-1/2 mb-2" />
        <Shimmer className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);

export const SkeletonList = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-1/2" />
          <Shimmer className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDetail = () => (
  <div className="space-y-6">
    <Shimmer className="h-64 md:h-80 rounded-3xl" />
    <div className="space-y-3">
      <Shimmer className="h-8 w-1/3" />
      <Shimmer className="h-5 w-1/2" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Shimmer className="h-64 rounded-2xl" />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <Shimmer className="h-48 rounded-2xl" />
        <Shimmer className="h-32 rounded-2xl" />
      </div>
    </div>
  </div>
);
