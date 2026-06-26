import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat, Search, Settings, LogOut, Sun, Moon, Menu, X,
  Bell, Sparkles, LayoutDashboard, Package, Wand2, UtensilsCrossed,
  Calendar, ShoppingCart, User, HelpCircle, Zap, Target
} from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import { Avatar } from './ui/Avatar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        navigate('/dashboard');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        navigate('/generate');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        navigate('/pantry');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        navigate('/meal-plan');
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setMobileMenuOpen(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/pantry', label: 'Pantry', icon: Package },
    { to: '/generate', label: 'Generate', icon: Wand2 },
    { to: '/recipes', label: 'Recipes', icon: UtensilsCrossed },
    { to: '/meal-plan', label: 'Meal Plan', icon: Calendar },
    { to: '/shopping-list', label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm' : 'bg-white dark:bg-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md"
              >
                <ChefHat className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">NutriGenZ</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 ml-8">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} label={link.label} icon={link.icon} />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded text-slate-400">⌘K</kbd>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>

              <Link to="/notifications" className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow" />
              </Link>

              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <Avatar name={user?.name} size="sm" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-sm text-slate-500 truncate">{user?.email || ''}</p>
                      </div>
                      <div className="p-2">
                        <UserMenuItem icon={User} label="Profile" to="/settings" />
                        <UserMenuItem icon={Target} label="Health Goals" to="/health-goals" />
                        <UserMenuItem icon={Sparkles} label="AI Assistant" to="/ai-assistant" />
                        <UserMenuItem icon={HelpCircle} label="Help & Support" to="/help" />
                        <UserMenuItem icon={Zap} label="Achievements" to="/achievements" />
                      </div>
                      <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-all">
                    <link.icon className="w-5 h-5 text-slate-400" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16" />
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

const NavLink = ({ to, label, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

  return (
    <Link to={to} className="group relative px-3 py-2">
      <motion.div
        whileHover={{ y: -1 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
        {label}
      </motion.div>
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

const UserMenuItem = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl transition-all duration-200 group">
    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
    {label}
  </Link>
);

export default Navbar;
