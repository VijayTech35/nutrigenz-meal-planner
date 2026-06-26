export const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
        <div className="p-5">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mb-4"></div>
            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex-1"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-12"></div>
            </div>
        </div>
    </div>
);

export const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
            </div>
        ))}
    </div>
);

export const SkeletonList = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="flex-1">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonDetail = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4 mb-6"></div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mb-6"></div>
            <div className="flex gap-2 mb-6">
                <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <div className="flex-1 h-5 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonForm = () => (
    <div className="animate-pulse">
        <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-2xl mx-auto mb-6"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mx-auto mb-2"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mx-auto mb-8"></div>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="space-y-5">
                <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4 mb-2"></div>
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
                </div>
                <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4 mb-2"></div>
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
                </div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full mt-8"></div>
            </div>
        </div>
    </div>
);
