import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { Search, Clock, Users, ChefHat, Heart, Sparkles, Trash2 } from 'lucide-react';
import { getFoodImage } from '../utils/images';
import api from '../services/api';
import toast from 'react-hot-toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchFavorites(); }, []);

  const fetchFavorites = async () => {
    try { const res = await api.get('/favorites'); setFavorites(res.data.data.favorites || []); } catch (error) { console.error(error);
    } finally { setLoading(false); }
  };

  const removeFavorite = async (e, recipeId) => {
    e.preventDefault(); e.stopPropagation();
    try { await api.delete(`/favorites/${recipeId}`); setFavorites(favorites.filter(f => f.recipe_id !== recipeId)); toast.success('Removed from favorites'); } catch (error) { toast.error('Failed to remove'); }
  };

  const filtered = favorites.filter(fav => fav.recipe_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const gradients = ['from-rose-400 via-red-400 to-pink-500', 'from-amber-400 via-orange-400 to-red-400', 'from-violet-400 via-purple-400 to-fuchsia-400', 'from-cyan-400 via-blue-400 to-indigo-400', 'from-emerald-400 via-teal-400 to-cyan-400'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}</div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Favorites</h1>
              <p className="text-slate-500 dark:text-slate-400">{favorites.length} recipes you love</p>
            </div>
          </div>

          {favorites.length > 0 && (
            <Card className="p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search favorites..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
            </Card>
          )}

          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{searchTerm ? 'No favorites found' : 'No favorites yet'}</h2>
              <p className="text-slate-500 mb-8">{searchTerm ? 'Try a different search' : 'Click the heart icon on any recipe to add it here!'}</p>
              <Link to="/recipes"><Button variant="primary" size="lg"><Sparkles className="w-5 h-5" /> Browse Recipes</Button></Link>
            </Card>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.05}>
              {filtered.map((fav, idx) => (
                <StaggerItem key={fav.id}>
                  <Link to={`/recipes/${fav.recipe_id}`} className="block group">
                    <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                      <div className="h-48 relative overflow-hidden">
                        <img src={fav.image_url || getFoodImage(fav.cuisine_type, fav.recipe_id)} alt={fav.recipe_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <button onClick={(e) => removeFavorite(e, fav.recipe_id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 rounded-xl text-rose-500 hover:bg-rose-50 transition-all shadow-md">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 transition-colors">{fav.recipe_name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {fav.cuisine_type && <Badge variant="default">{fav.cuisine_type}</Badge>}
                          {fav.difficulty && <Badge variant={fav.difficulty === 'easy' ? 'emerald' : fav.difficulty === 'medium' ? 'amber' : 'red'}>{fav.difficulty}</Badge>}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {(fav.prep_time || 0) + (fav.cook_time || 0)} min</span>
                          {fav.calories && <span className="font-medium">{fav.calories} cal</span>}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default Favorites;
