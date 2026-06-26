const badgeVariants = {
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30',
  violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/30',
  gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm',
};

export const Badge = ({ children, variant = 'default', className = '', dot, pulse }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-all ${badgeVariants[variant]} ${pulse ? 'animate-pulse-glow' : ''} ${className}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />}
    {children}
  </span>
);

export const StatusBadge = ({ status }) => {
  const config = {
    easy: { label: 'Easy', variant: 'emerald' },
    medium: { label: 'Medium', variant: 'amber' },
    hard: { label: 'Hard', variant: 'red' },
    vegetarian: { label: 'Vegetarian', variant: 'emerald' },
    vegan: { label: 'Vegan', variant: 'emerald' },
    'gluten-free': { label: 'Gluten Free', variant: 'amber' },
    'dairy-free': { label: 'Dairy Free', variant: 'blue' },
    keto: { label: 'Keto', variant: 'violet' },
    expiring: { label: 'Expiring Soon', variant: 'amber', pulse: true },
    expired: { label: 'Expired', variant: 'red' },
    fresh: { label: 'Fresh', variant: 'emerald' },
  };
  const c = config[status?.toLowerCase()] || { label: status, variant: 'default' };
  return <Badge variant={c.variant} pulse={c.pulse}>{c.label}</Badge>;
};

export const PremiumBadge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white shadow-lg ${className}`}>
    {children}
  </span>
);
