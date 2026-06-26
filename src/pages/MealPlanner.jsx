import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { format, startOfWeek, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Plus, X, ChefHat, ChevronLeft, ChevronRight, Utensils, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import api from '../services/api';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MealPlanner = () => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [weekStart]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const startDate = format(weekStart, 'yyyy-MM-dd');
      const [mealPlanRes, recipesRes] = await Promise.all([
        api.get(`/meal-plans/weekly?start_date=${startDate}`),
        api.get('/recipes')
      ]);
      const meals = mealPlanRes.data.data.mealPlans || [];
      const recipesList = recipesRes.data.data.recipes || [];
      setRecipes(recipesList);
      const organized = {};
      meals.forEach(meal => {
        const key = format(new Date(meal.meal_date), 'yyyy-MM-dd');
        if (!organized[key]) organized[key] = {};
        organized[key][meal.meal_type] = meal;
      });
      setMealPlan(organized);
    } catch (error) { console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const getDayMeals = (dayIndex) => {
    const date = format(addDays(weekStart, dayIndex), 'yyyy-MM-dd');
    return mealPlan[date] || {};
  };

  const handleAddMeal = (date, mealType) => { setSelectedSlot({ date, mealType }); setShowAddModal(true); };

  const handleRemoveMeal = async (mealId) => {
    if (!confirm('Remove this meal?')) return;
    try { await api.delete(`/meal-plans/${mealId}`); await fetchData(); toast.success('Meal removed'); } catch (error) { toast.error('Failed to remove'); }
  };

  const handleSaveMeal = async (recipeId) => {
    try {
      await api.post('/meal-plans', { recipe_id: recipeId, meal_date: selectedSlot.date, meal_type: selectedSlot.mealType });
      await fetchData(); setShowAddModal(false); toast.success('Meal added!');
    } catch (error) { toast.error('Failed to add meal'); }
  };

  const mealsPlanned = Object.values(mealPlan).reduce((acc, day) => acc + Object.keys(day).length, 0);
  const recipesUsed = new Set(Object.values(mealPlan).flatMap(day => Object.values(day).map(m => m.recipe_id))).size;

  const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meal Planner</h1>
                <p className="text-slate-500 dark:text-slate-400">Plan your weekly meals</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft className="w-5 h-5" /></Button>
              <Button variant="primary" onClick={() => setWeekStart(startOfWeek(new Date()))}>This Week</Button>
              <Button variant="secondary" onClick={() => setWeekStart(addDays(weekStart, 7))}><ChevronRight className="w-5 h-5" /></Button>
            </div>
          </div>

          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-sm text-slate-500">Week of</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-slate-500">Meals Planned</p>
                <p className="text-2xl font-bold text-emerald-600">{mealsPlanned}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-slate-500">Recipes Used</p>
                <p className="text-2xl font-bold text-teal-600">{recipesUsed}</p>
              </Card>
              <Card className="p-4 flex items-center">
                <Link to="/generate" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate new recipe</Link>
              </Card>
            </div>
          </FadeIn>

          {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl h-96 animate-pulse shadow-sm border border-slate-200 dark:border-slate-700" />
          ) : (
            <FadeIn delay={100}>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 w-24">Meal</th>
                        {DAYS_OF_WEEK.map((day, idx) => {
                          const isToday = format(addDays(weekStart, idx), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                          return (
                            <th key={day} className={`p-4 text-center ${isToday ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                              <div className={`font-bold ${isToday ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>{day}</div>
                              <div className={`text-sm ${isToday ? 'text-emerald-500' : 'text-slate-500'}`}>{format(addDays(weekStart, idx), 'MMM d')}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {MEAL_TYPES.map(mealType => (
                        <tr key={mealType} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                          <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 capitalize bg-slate-50 dark:bg-slate-800/50">
                            {mealIcons[mealType]} {mealType}
                          </td>
                          {DAYS_OF_WEEK.map((_, dayIdx) => {
                            const date = format(addDays(weekStart, dayIdx), 'yyyy-MM-dd');
                            const dayMeals = getDayMeals(dayIdx);
                            const meal = dayMeals[mealType];
                            const isToday = date === format(new Date(), 'yyyy-MM-dd');

                            return (
                              <td key={dayIdx} className={`p-2 ${isToday ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                                {meal ? (
                                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative group bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2.5 hover:shadow-md transition-all">
                                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300 line-clamp-2">{meal.recipe_name}</p>
                                    <button onClick={() => handleRemoveMeal(meal.id)}
                                      className="absolute top-1 right-1 p-1 bg-white dark:bg-slate-700 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-all">
                                      <X className="w-3 h-3 text-red-500" />
                                    </button>
                                  </motion.div>
                                ) : (
                                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAddMeal(date, mealType)}
                                    className="w-full h-16 flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <Plus className="w-5 h-5" />
                                  </motion.button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </FadeIn>
          )}
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Meal" size="lg">
          <p className="text-sm text-slate-500 mb-4 capitalize">{selectedSlot?.mealType} - {selectedSlot?.date}</p>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {recipes.map(recipe => (
                <motion.button key={recipe.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => handleSaveMeal(recipe.id)}
                  className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                  <p className="font-semibold text-slate-900 dark:text-white">{recipe.name}</p>
                  <p className="text-sm text-slate-500">{recipe.cuisine_type} • {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No recipes yet</p>
              <Link to="/generate" onClick={() => setShowAddModal(false)}>
                <Button variant="primary">Generate Recipe</Button>
              </Link>
            </div>
          )}
        </Modal>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default MealPlanner;
