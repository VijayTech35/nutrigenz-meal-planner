import { motion } from 'framer-motion';

export const Avatar = ({ src, name, size = 'md', className = '', status }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
  const color = colors[name?.length % colors.length] || 'bg-emerald-500';

  return (
    <div className="relative inline-flex">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md ${className}`} />
      ) : (
        <div className={`${sizes[size]} rounded-full ${color} flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-700 shadow-md ${className}`}>
          {initials}
        </div>
      )}
      {status && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-slate-800 rounded-full ${status === 'online' ? 'bg-emerald-500' : status === 'away' ? 'bg-amber-500' : 'bg-slate-400'}`} />
      )}
    </div>
  );
};

export const AvatarGroup = ({ users, max = 4 }) => (
  <div className="flex -space-x-2">
    {users.slice(0, max).map((user, i) => (
      <Avatar key={i} name={user.name} src={user.avatar} size="sm" className="ring-2 ring-white dark:ring-slate-800" />
    ))}
    {users.length > max && (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 ring-2 ring-white dark:ring-slate-800">
        +{users.length - max}
      </div>
    )}
  </div>
);
