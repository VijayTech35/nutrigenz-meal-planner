import { motion } from 'framer-motion';

export const ProgressBar = ({ value = 0, max = 100, color = 'from-emerald-500 to-teal-500', className = '', showLabel, size = 'md', glow }) => {
  const pct = Math.min((value / max) * 100, 100);
  const heights = { sm: 'h-1.5', md: 'h-3', lg: 'h-4' };
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>{Math.round(pct)}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className={`${heights[size]} bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ${glow ? 'shadow-lg shadow-emerald-500/20' : ''} ${className}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`h-full rounded-full bg-gradient-to-r ${color} ${glow ? 'animate-pulse-glow' : ''}`}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({ value = 0, max = 100, size = 120, strokeWidth = 8, color = '#10b981', label, children, glow }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className={`relative inline-flex items-center justify-center ${glow ? 'drop-shadow-lg' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-slate-700" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ filter: glow ? 'drop-shadow(0 0 6px rgba(16,185,129,0.3))' : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || <span className="text-xl font-bold text-slate-900 dark:text-white">{Math.round(pct * 100)}%</span>}
      </div>
    </div>
  );
};
