import { forwardRef } from 'react';

export const Input = forwardRef(({ label, icon, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">{icon}</div>}
      <input
        ref={ref}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const Select = ({ label, icon, children, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">{icon}</div>}
      <select
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  </div>
);

export const Toggle = ({ checked, onChange, label }) => (
  <label className="relative inline-flex items-center cursor-pointer gap-3">
    <div className="relative">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
    </div>
    {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
  </label>
);
