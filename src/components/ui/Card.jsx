import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, onClick, glow, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -4, boxShadow: '0 25px 50px -8px rgba(0,0,0,0.1)' } : {}}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    onClick={onClick}
    className={`relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:border-emerald-200/50 dark:hover:border-emerald-700/30 transition-all duration-300 ${glow ? 'animate-border-glow' : ''} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-slate-100 dark:border-slate-700 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const GlassCard = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: '0 25px 50px -8px rgba(0,0,0,0.15)' }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-slate-700/30 shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
    {children}
  </motion.div>
);

export const PremiumCard = ({ children, className = '', gradient = 'from-emerald-500 to-teal-500' }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
  >
    <div className="bg-white dark:bg-slate-900 rounded-2xl h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      {children}
    </div>
  </motion.div>
);
