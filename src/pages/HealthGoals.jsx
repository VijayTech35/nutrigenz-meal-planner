import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Progress';
import { Shimmer } from '../components/ui/Skeleton';
import { Target, Dumbbell, Ruler, Weight, Zap, Calculator, Save, RotateCcw, Info, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const HealthGoals = () => {
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculated, setCalculated] = useState(null);
  const [form, setForm] = useState({
    goalType: 'maintain',
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    mealsPerDay: 3
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/health-goals');
      if (res.data.data.goals) {
        const g = res.data.data.goals;
        setGoals(g);
        setForm({
          goalType: g.goal_type || 'maintain',
          age: g.age || 30,
          gender: g.gender || 'male',
          weight: parseFloat(g.weight) || 70,
          height: parseFloat(g.height) || 175,
          activityLevel: g.activity_level || 'moderate',
          mealsPerDay: g.meals_per_day || 3
        });
      }
    } catch (error) {
      console.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const calculateLocal = (form) => {
    const { age, gender, weight, height, activityLevel, goalType } = form;
    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const goalAdj = { lose: -500, maintain: 0, gain: 500, build: 300 };
    const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.55));
    const targetCalories = Math.max(1200, tdee + (goalAdj[goalType] || 0));
    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      targetProtein: Math.round((targetCalories * 0.3) / 4),
      targetCarbs: Math.round((targetCalories * 0.4) / 4),
      targetFats: Math.round((targetCalories * 0.3) / 9)
    };
  };

  const handleCalculate = async () => {
    setSaving(true);
    try {
      const res = await api.post('/health-goals/calculate-tdee', form);
      if (res.data.success) setCalculated(res.data.data);
      else { setCalculated(calculateLocal(form)); toast.success('Calculated locally'); }
    } catch {
      setCalculated(calculateLocal(form));
      toast.success('Calculated offline');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!calculated) return;
    setSaving(true);
    try {
      await api.post('/health-goals', {
        ...form,
        targetCalories: calculated.targetCalories,
        targetProtein: calculated.targetProtein,
        targetCarbs: calculated.targetCarbs,
        targetFats: calculated.targetFats
      });
      toast.success('Health goals saved!');
      fetchGoals();
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Shimmer className="h-12 w-64 mb-8 rounded-xl" />
          <Shimmer className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Health Goals</h1>
              <p className="text-slate-500 dark:text-slate-400">Set personalized nutrition targets</p>
            </div>
          </div>

          {goals && (
            <FadeIn>
              <Card className="p-6 mb-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-200/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Current Goals Active</h3>
                  <Badge variant="emerald" className="ml-auto">{goals.goal_type}</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-600">{goals.target_calories}</p>
                    <p className="text-xs text-slate-500">kcal/day</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{goals.target_protein}g</p>
                    <p className="text-xs text-slate-500">Protein</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-2xl font-bold text-amber-600">{goals.target_carbs}g</p>
                    <p className="text-xs text-slate-500">Carbs</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-2xl font-bold text-violet-600">{goals.target_fats}g</p>
                    <p className="text-xs text-slate-500">Fats</p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          )}

          <FadeIn delay={100}>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Calculate Your Macros</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Goal</label>
                  <select value={form.goalType} onChange={(e) => setForm({ ...form, goalType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight</option>
                    <option value="build">Build Muscle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Activity Level</label>
                  <select value={form.activityLevel} onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="sedentary">Sedentary (desk job)</option>
                    <option value="light">Light (1-2 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (twice/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Age</label>
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                  <div className="flex gap-3">
                    {['male', 'female'].map(g => (
                      <button key={g} onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold border-2 transition-all ${form.gender === g ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-600 text-slate-500'}`}>
                        {g === 'male' ? 'Male' : 'Female'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Weight (kg)</label>
                  <input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Height (cm)</label>
                  <input type="number" step="0.1" value={form.height} onChange={(e) => setForm({ ...form, height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Meals Per Day</label>
                  <div className="flex gap-2">
                    {[3, 4, 5, 6].map(n => (
                      <button key={n} onClick={() => setForm({ ...form, mealsPerDay: n })}
                        className={`w-12 h-12 rounded-xl font-bold border-2 transition-all ${form.mealsPerDay === n ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700' : 'border-slate-200 dark:border-slate-600 text-slate-500'}`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="primary" onClick={handleCalculate} loading={saving} className="flex-1">
                  <Calculator className="w-4 h-4" /> Calculate
                </Button>
                {calculated && (
                  <Button variant="secondary" onClick={handleSave} loading={saving}>
                    <Save className="w-4 h-4" /> Save Goals
                  </Button>
                )}
              </div>

              {calculated && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl border border-emerald-200/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Your Results</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-xl">
                      <p className="text-xs text-slate-500">BMR</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{calculated.bmr}</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-xl">
                      <p className="text-xs text-slate-500">TDEE</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{calculated.tdee}</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <p className="text-xs text-emerald-600">Calories</p>
                      <p className="text-lg font-bold text-emerald-700">{calculated.targetCalories}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-xs text-blue-600">Protein</p>
                      <p className="text-lg font-bold text-blue-700">{calculated.targetProtein}g</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                      <p className="text-xs text-amber-600">Carbs</p>
                      <p className="text-lg font-bold text-amber-700">{calculated.targetCarbs}g</p>
                    </div>
                    <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                      <p className="text-xs text-violet-600">Fats</p>
                      <p className="text-lg font-bold text-violet-700">{calculated.targetFats}g</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </FadeIn>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default HealthGoals;
