import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Shimmer } from '../components/ui/Skeleton';
import { Bell, AlertCircle, Calendar, ShoppingBag, Sparkles, Trophy, X, Check, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';

const iconMap = { info: Bell, warning: AlertCircle, achievement: Trophy, meal: Calendar, shopping: ShoppingBag, ai: Sparkles };
const colorMap = { info: 'blue', warning: 'amber', achievement: 'purple', meal: 'emerald', shopping: 'violet', ai: 'indigo' };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try { await api.put('/notifications/read-all'); setNotifications(notifications.map(n => ({ ...n, is_read: true }))); } catch (e) {}
  };

  const clearAll = async () => {
    try { await api.delete('/notifications'); setNotifications([]); } catch (e) {}
  };

  const toggleRead = async (id) => {
    const note = notifications.find(n => n.id === id);
    if (!note.is_read) {
      try { await api.put(`/notifications/${id}/read`); setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n)); } catch (e) {}
    }
  };

  const removeNotification = async (id) => {
    try { await api.delete(`/notifications/${id}`); setNotifications(notifications.filter(n => n.id !== id)); } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <Shimmer key={i} className="h-20 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <p className="text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && <Button variant="ghost" onClick={markAllRead}><Check className="w-4 h-4" /> Mark all read</Button>}
              {notifications.length > 0 && <Button variant="ghost" onClick={clearAll} className="text-red-500"><Trash2 className="w-4 h-4" /> Clear all</Button>}
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {notifications.length > 0 ? notifications.map((note, idx) => {
                const Icon = iconMap[note.type] || Bell;
                const color = colorMap[note.type] || 'blue';
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => toggleRead(note.id)}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                      note.is_read ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700' : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${color}-100 dark:bg-${color}-900/30`}>
                      <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-semibold ${note.is_read ? 'text-slate-900 dark:text-white' : 'text-emerald-900 dark:text-emerald-300'}`}>{note.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{note.message}</p>
                        </div>
                        {!note.is_read && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{new Date(note.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeNotification(note.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              }) : (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All caught up!</h3>
                  <p className="text-slate-500">No new notifications</p>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default Notifications;
