import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar, CircularProgress } from '../components/ui/Progress';
import { useNutrition } from '../context/NutritionContext';
import { Flame, Target, Edit2, Save, X, TrendingUp, Calendar, Sparkles, ChefHat, ShoppingCart, Activity, Apple, Droplets } from 'lucide-react';

const NutritionTracker = () => {
  const { goals, getTodayTotals, getWeekTotals, updateGoals, clearTodayLog } = useNutrition();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState(goals);

  const today = getTodayTotals();
  const week = getWeekTotals();

  const getProgressColor = (current, goal) => {
    const pct = (current / goal) * 100;
    if (pct < 50) return 'from-red-500 to-orange-500';
    if (pct < 80) return 'from-yellow-500 to-amber-500';
    return 'from-emerald-500 to-teal-500';
  };

  const handleSaveGoals = () => { updateGoals(editedGoals); setIsEditing(false); };

  const macros = [
    { key: 'calories', name: 'Calories', value: today.calories, goal: goals.calories, unit: 'kcal', icon: <Flame className="w-6 h-6" />, gradient: 'from-orange-500 to-red-500', bgGradient: 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30' },
    { key: 'protein', name: 'Protein', value: today.protein, goal: goals.protein, unit: 'g', icon: <Target className="w-6 h-6" />, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30' },
    { key: 'carbs', name: 'Carbs', value: today.carbs, goal: goals.carbs, unit: 'g', icon: <Apple className="w-6 h-6" />, gradient: 'from-amber-500 to-yellow-500', bgGradient: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30' },
    { key: 'fats', name: 'Fats', value: today.fats, goal: goals.fats, unit: 'g', icon: <Activity className="w-6 h-6" />, gradient: 'from-violet-500 to-purple-500', bgGradient: 'from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Nutrition Tracker</h1>
                <p className="text-slate-500 dark:text-slate-400">Track your daily intake</p>
              </div>
            </div>
            <Button variant="ghost" onClick={clearTodayLog} className="text-red-500 hover:text-red-600">
              <X className="w-4 h-4" /> Clear Today
            </Button>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" staggerDelay={0.08}>
            {macros.map((macro) => {
              const pct = Math.min((macro.value / macro.goal) * 100, 100);
              return (
                <StaggerItem key={macro.name}>
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${macro.bgGradient} flex items-center justify-center`}>
                        <span className={`bg-gradient-to-r ${macro.gradient} bg-clip-text text-transparent`}>{macro.icon}</span>
                      </div>
                      <Badge variant={pct >= 100 ? 'emerald' : pct >= 50 ? 'amber' : 'default'}>{Math.round(pct)}%</Badge>
                    </div>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(macro.value)}</span>
                      <span className="text-sm text-slate-500"> / {macro.goal} {macro.unit}</span>
                    </div>
                    <ProgressBar value={macro.value} max={macro.goal} color={macro.gradient} />
                    <p className="text-xs text-slate-500 mt-2 font-medium">{macro.name}</p>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <FadeIn delay={200}>
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Goals</h2>
                {!isEditing ? (
                  <Button variant="ghost" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4" /> Edit Goals</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSaveGoals}><Save className="w-4 h-4" /> Save</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /> Cancel</Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {macros.map(macro => (
                  <div key={macro.name}>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{macro.name} ({macro.unit})</label>
                    <input type="number" value={isEditing ? editedGoals[macro.key] : macro.goal}
                      onChange={(e) => setEditedGoals({ ...editedGoals, [macro.key]: parseInt(e.target.value) || 0 })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50" />
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={300}>
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Overview</h2>
              </div>
              <div className="flex items-end gap-2 h-48">
                {week.map((day, idx) => {
                  const maxCal = Math.max(...week.map(w => w.calories), goals.calories);
                  const height = maxCal > 0 ? (day.calories / maxCal) * 100 : 0;
                  const isToday = idx === week.length - 1;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <span className="text-xs text-slate-500 mb-1 font-medium">{Math.round(day.calories)}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 4)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className={`w-full rounded-t-xl ${isToday ? 'bg-gradient-to-t from-emerald-500 to-teal-500' : 'bg-gradient-to-t from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-emerald-600'}`}
                      />
                      <span className={`text-xs mt-2 font-medium ${isToday ? 'text-emerald-600' : 'text-slate-500'}`}>{day.dayName}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/recipes" className="group">
                <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Log a Recipe</h3>
                  <p className="text-sm text-slate-500">Add nutrition from your recipes</p>
                </motion.div>
              </Link>
              <Link to="/meal-plan" className="group">
                <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Plan Meals</h3>
                  <p className="text-sm text-slate-500">Create a balanced meal plan</p>
                </motion.div>
              </Link>
              <Link to="/shopping-list" className="group">
                <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Shopping List</h3>
                  <p className="text-sm text-slate-500">Get ingredients for your plan</p>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default NutritionTracker;
