import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Wand2, UtensilsCrossed, Calendar, ShoppingCart } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/generate', icon: Wand2, label: 'Generate' },
    { to: '/recipes', icon: UtensilsCrossed, label: 'Recipes' },
    { to: '/meal-plan', icon: Calendar, label: 'Plan' },
    { to: '/shopping-list', icon: ShoppingCart, label: 'Shop' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-2xl lg:hidden z-50">
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
          return (
            <Link key={item.to} to={item.to} className="relative flex flex-col items-center gap-0.5 px-3 py-2 min-w-[64px]">
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.85 }}>
                <item.icon className={`w-6 h-6 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
              </motion.div>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
