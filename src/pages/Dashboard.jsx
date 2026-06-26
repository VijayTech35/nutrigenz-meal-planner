import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import { FadeIn, StaggerContainer, StaggerItem, PageTransition } from '../components/Animations';
import { Card, GlassCard } from '../components/ui/Card';
import { ProgressBar, CircularProgress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { getFoodImage } from '../utils/images';
import {
  ChefHat, UtensilsCrossed, Calendar, Clock, Flame, PlusCircle,
  AlertCircle, Sparkles, ShoppingBag, ArrowRight, ChevronRight,
  Leaf, TrendingUp, Target, Droplets, Brain, Trophy,
  Activity, Sun, Zap, Coffee, Apple, Moon as MoonIcon,
  Wheat, Heart, Smile, BarChart3, ListChecks, RefreshCw,
  Package
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();
  const { getTodayTotals, goals } = useNutrition();
  const [stats, setStats] = useState({ totalRecipes: 0, pantryItems: 0, mealsThisWeek: 0 });
  const [pantryAlerts, setPantryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const [streak, setStreak] = useState(0);

  const today = getTodayTotals();
  const userName = user?.name || 'Chef';
  const caloriePct = goals.calories > 0 ? Math.min((today.calories / goals.calories) * 100, 100) : 0;
  const proteinPct = goals.protein > 0 ? Math.min((today.protein / goals.protein) * 100, 100) : 0;
  const carbsPct = goals.carbs > 0 ? Math.min((today.carbs / goals.carbs) * 100, 100) : 0;
  const fatsPct = goals.fats > 0 ? Math.min((today.fats / goals.fats) * 100, 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivation = () => {
    const msgs = [
      { text: 'You\'re doing great! Keep that healthy streak going!', icon: Smile },
      { text: 'Every healthy choice counts. You\'ve got this!', icon: Heart },
      { text: 'Small steps lead to big results. Keep going!', icon: Trophy },
      { text: 'Your future self will thank you for today\'s choices.', icon: Sparkles },
      { text: 'Nutrition is the fuel for your amazing journey!', icon: Zap },
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  };
  const motivation = getMotivation();

  useEffect(() => {
    fetchDashboardData();
    setStreak(parseInt(localStorage.getItem('nutrigenz_streak') || '0'));
    setWaterIntake(parseInt(localStorage.getItem('nutrigenz_water') || '0'));
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [recipeStats, pantryStats, mealStats] = await Promise.all([
        api.get('/recipes/stats').catch(() => ({ data: { data: { stats: { total_recipes: 0 } } } })),
        api.get('/pantry/stats').catch(() => ({ data: { data: { stats: { total_items: 0 } } } })),
        api.get('/meal-plans/stats').catch(() => ({ data: { data: { stats: { this_week_count: 0 } } } }))
      ]);
      setStats({
        totalRecipes: recipeStats.data?.data?.stats?.total_recipes || 0,
        pantryItems: pantryStats.data?.data?.stats?.total_items || 0,
        mealsThisWeek: mealStats.data?.data?.stats?.this_week_count || 0,
      });
      setPantryAlerts([
        { id: 1, message: 'Milk running low', type: 'warning', icon: '🥛' },
        { id: 2, message: 'Spinach expires tomorrow', type: 'error', icon: '🥬' },
        { id: 3, message: 'Eggs almost finished', type: 'warning', icon: '🥚' },
      ]);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWaterAdd = () => {
    const newWater = Math.min(waterIntake + 250, 4000);
    setWaterIntake(newWater);
    localStorage.setItem('nutrigenz_water', newWater.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
              </div>
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-teal-50/20 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
        </div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8 relative">
          {/* Hero Greeting */}
          <FadeIn>
            <GlassCard className="relative overflow-hidden mb-8 p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-float-slow" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float-delayed" />
              <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-emerald-400/5 rounded-full blur-xl animate-pulse" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={userName} size="lg" />
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                        {getGreeting()}, {userName}!
                      </h1>
                      <p className="text-slate-500 dark:text-slate-400">{motivation.text}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="gradient" dot>Streak: {streak} days</Badge>
                    <Badge variant="blue" dot>Pro Member</Badge>
                    <Badge variant="emerald" dot>On Track</Badge>
                  </div>
                </div>
                <Link to="/generate" className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 shrink-0 animate-gradient">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Generate Recipe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </GlassCard>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.05}>
                <StaggerItem>
                  <Link to="/recipes">
                    <Card className="p-5 h-full">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-3">
                        <ChefHat className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalRecipes}</p>
                      <p className="text-sm text-slate-500">Recipes Created</p>
                    </Card>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link to="/pantry">
                    <Card className="p-5 h-full">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pantryItems}</p>
                      <p className="text-sm text-slate-500">Pantry Items</p>
                    </Card>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link to="/meal-plan">
                    <Card className="p-5 h-full">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.mealsThisWeek}</p>
                      <p className="text-sm text-slate-500">Meals Planned</p>
                    </Card>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link to="/nutrition">
                    <Card className="p-5 h-full">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-3">
                        <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{today.calories}</p>
                      <p className="text-sm text-slate-500">Calories Today</p>
                    </Card>
                  </Link>
                </StaggerItem>
              </StaggerContainer>

              {/* Nutrition Overview */}
              <FadeIn delay={200}>
                <Card className="overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Daily Nutrition
                      </h2>
                      <Link to="/nutrition" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                        Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex flex-col items-center">
                        <CircularProgress value={caloriePct} max={100} size={100} strokeWidth={8} color="#10b981">
                          <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{today.calories}</p>
                            <p className="text-[10px] text-slate-500">kcal</p>
                          </div>
                        </CircularProgress>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">Calories</p>
                      </div>
                      <div className="space-y-2">
                        <MacroRow label="Protein" value={today.protein} goal={goals.protein} unit="g" color="from-blue-500 to-cyan-500" pct={proteinPct} />
                        <MacroRow label="Carbs" value={today.carbs} goal={goals.carbs} unit="g" color="from-amber-500 to-yellow-500" pct={carbsPct} />
                        <MacroRow label="Fats" value={today.fats} goal={goals.fats} unit="g" color="from-violet-500 to-purple-500" pct={fatsPct} />
                      </div>
                      <div className="col-span-2">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 h-full">
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            Water Intake
                          </h4>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1 text-sm">
                                <span className="font-bold text-slate-900 dark:text-white">{waterIntake}ml</span>
                                <span className="text-slate-500">/ 2000ml</span>
                              </div>
                              <ProgressBar value={waterIntake} max={2000} size="md" />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleWaterAdd}
                              className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"
                            >
                              <PlusCircle className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeIn>

              {/* Quick Actions & Recent Recipes Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <FadeIn delay={300} className="lg:col-span-2">
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <QuickActionBtn icon={Sparkles} label="Generate" href="/generate" color="emerald" />
                      <QuickActionBtn icon={PlusCircle} label="Add Item" href="/pantry" color="teal" />
                      <QuickActionBtn icon={Calendar} label="Meal Plan" href="/meal-plan" color="amber" />
                      <QuickActionBtn icon={ShoppingBag} label="Shopping" href="/shopping-list" color="blue" />
                      <QuickActionBtn icon={Brain} label="AI Chat" href="/ai-assistant" color="violet" />
                      <QuickActionBtn icon={Target} label="Nutrition" href="/nutrition" color="rose" />
                    </div>
                  </Card>
                </FadeIn>

                <FadeIn delay={400} className="lg:col-span-3">
                  <Card>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Recipes</h3>
                        <Link to="/recipes" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                          View all <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    {recentlyViewed.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <ChefHat className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 mb-4">No recipes yet. Generate your first AI recipe!</p>
                        <Link to="/generate" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                          <Sparkles className="w-5 h-5" />
                          Generate Recipe
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                        {recentlyViewed.slice(0, 4).map((recipe) => (
                          <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="group">
                            <motion.div whileHover={{ y: -2 }} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
                              <div className="relative h-32 overflow-hidden">
                                <img
                                  src={recipe.image_url || getFoodImage(recipe.cuisine_type, recipe.id)}
                                  alt={recipe.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-slate-900 dark:text-white truncate">{recipe.name}</h4>
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                </FadeIn>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Pantry Alerts */}
              <FadeIn delay={150}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Pantry Alerts
                  </h3>
                  {pantryAlerts.length === 0 ? (
                    <p className="text-slate-500 text-sm">All items are stocked!</p>
                  ) : (
                    <div className="space-y-3">
                      {pantryAlerts.map((alert) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl"
                        >
                          <span className="text-xl">{alert.icon}</span>
                          <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{alert.message}</span>
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <Link to="/pantry" className="block text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    Manage Pantry →
                  </Link>
                </Card>
              </FadeIn>

              {/* AI Suggestions */}
              <FadeIn delay={250}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    AI Suggestions
                  </h3>
                  <div className="space-y-2">
                    <AISuggestion icon="🥬" text="Recipe with your spinach" href="/generate?ingredient=spinach" />
                    <AISuggestion icon="🍳" text="Healthy breakfast idea" href="/generate?meal=breakfast" />
                    <AISuggestion icon="⚡" text="Quick dinner under 30m" href="/generate?time=under30" />
                    <AISuggestion icon="🥑" text="Low-carb meal option" href="/generate?diet=keto" />
                  </div>
                </Card>
              </FadeIn>

              {/* Weekly Meal Preview */}
              <FadeIn delay={350}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    This Week
                  </h3>
                  <div className="space-y-2">
                    <MealDay day="Monday" meal="Chicken Pasta" />
                    <MealDay day="Tuesday" meal="Veg Stir Fry" />
                    <MealDay day="Wednesday" meal="Avocado Salad" />
                    <MealDay day="Thursday" meal="Grilled Salmon" />
                    <MealDay day="Friday" meal="Pizza Night" />
                  </div>
                  <Link to="/meal-plan" className="block text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    View Full Plan →
                  </Link>
                </Card>
              </FadeIn>

              {/* Gamification Card */}
              <FadeIn delay={450}>
                <Card className="p-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/30">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Achievements
                  </h3>
                  <div className="space-y-3">
                    <AchievementBadge icon={Zap} label="5-Day Streak" progress={streak} max={5} />
                    <AchievementBadge icon={ChefHat} label="10 Recipes" progress={stats.totalRecipes} max={10} />
                    <AchievementBadge icon={Apple} label="Healthy Eater" progress={caloriePct > 80 ? 100 : 0} max={100} />
                  </div>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>

        <MobileNav />
      </div>
    </PageTransition>
  );
};

const MacroRow = ({ label, value, goal, unit, color, pct }) => (
  <div>
    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
      <span>{label}</span>
      <span>{Math.round(value)}/{goal}{unit}</span>
    </div>
    <ProgressBar value={value} max={goal} color={color} size="sm" />
  </div>
);

const QuickActionBtn = ({ icon: Icon, label, href, color }) => {
  const colors = {
    emerald: 'from-emerald-500 to-emerald-600',
    teal: 'from-teal-500 to-teal-600',
    amber: 'from-amber-500 to-amber-600',
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    rose: 'from-rose-500 to-rose-600',
  };
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`p-3 bg-gradient-to-r ${colors[color]} rounded-xl text-white flex flex-col items-center gap-1.5 shadow-md`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-semibold">{label}</span>
      </motion.div>
    </Link>
  );
};

const AISuggestion = ({ icon, text, href }) => (
  <Link to={href} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
    <span className="text-lg">{icon}</span>
    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{text}</span>
    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
  </Link>
);

const MealDay = ({ day, meal }) => (
  <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day}</span>
    <span className="text-sm text-slate-500">{meal}</span>
  </div>
);

const AchievementBadge = ({ icon: Icon, label, progress, max }) => {
  const pct = Math.min((progress / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-slate-500">{progress}/{max}</span>
        </div>
        <ProgressBar value={progress} max={max} size="sm" />
      </div>
    </div>
  );
};

export default Dashboard;
