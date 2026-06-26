import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/Progress';
import { Shimmer } from '../components/ui/Skeleton';
import { Trophy, Zap, ChefHat, Apple, Flame, Calendar, Star, Target, Activity, Award, UtensilsCrossed, Package, ShoppingBag, BarChart3 } from 'lucide-react';
import api from '../services/api';

const iconMap = { ChefHat, UtensilsCrossed, Trophy, Calendar, Zap, Package, BarChart3, ShoppingBag };

const Achievements = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements');
      setData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Shimmer className="h-28 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <Shimmer key={i} className="h-44 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const { achievements = [], totalXp = 0, level = 1, xpInLevel = 0 } = data || {};

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Achievements</h1>
              <p className="text-slate-500 dark:text-slate-400">Track your progress and earn badges</p>
            </div>
          </div>

          <FadeIn>
            <Card className="p-6 mb-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Level {level}</h3>
                    <span className="text-sm font-semibold text-amber-600">{totalXp} XP</span>
                  </div>
                  <ProgressBar value={xpInLevel} max={500} color="from-amber-500 to-orange-500" />
                  <p className="text-xs text-slate-500 mt-1">{xpInLevel} / 500 XP to next level</p>
                </div>
              </div>
            </Card>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" staggerDelay={0.05}>
            {achievements.map((ach) => {
              const Icon = iconMap[ach.icon] || Trophy;
              return (
                <StaggerItem key={ach.key}>
                  <motion.div whileHover={{ y: -2 }} className={`p-5 rounded-2xl border-2 ${ach.unlocked ? 'bg-white dark:bg-slate-800 border-amber-400 dark:border-amber-500 shadow-md' : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${ach.unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <Icon className={`w-6 h-6 ${ach.unlocked ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{ach.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{ach.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{ach.unlocked ? '✅ Unlocked' : '🔒 Locked'}</p>
                    {ach.xp && <p className="text-xs text-amber-500 mt-1">+{ach.xp} XP</p>}
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default Achievements;
