import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 animate-gradient',
  secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600',
  outline: 'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600',
  ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700',
  danger: 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white hover:from-red-600 hover:via-rose-600 hover:to-pink-600 shadow-lg hover:shadow-red-500/20 animate-gradient',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export const Button = ({ children, variant = 'primary', size = 'md', className = '', icon, loading, disabled, ...props }) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.02, boxShadow: '0 10px 30px -5px rgba(16,185,129,0.3)' }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden ${variants[variant]} ${sizes[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ) : icon ? (
      <span className="w-5 h-5">{icon}</span>
    ) : null}
    {children}
  </motion.button>
);

export const IconButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    className={`p-2.5 rounded-xl transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);
