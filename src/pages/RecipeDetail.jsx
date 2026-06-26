import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { getFoodImage } from '../utils/images';
import toast from 'react-hot-toast';
import { Clock, Users, ChefHat, ArrowLeft, Trash2, Share2, Copy, Heart, Printer, Play, Flame, Target, Leaf, Loader2 } from 'lucide-react';
import api from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(4);
  const [imageError, setImageError] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => { fetchRecipe(); checkFavorite(); }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      const data = res.data.data.recipe;
      if (data) {
        setRecipe(data);
        setServings(data.servings || 4);
        addToRecentlyViewed({ id: data.id, name: data.name, cuisine_type: data.cuisine_type, difficulty: data.difficulty, prep_time: data.prep_time, cook_time: data.cook_time });
      } else { toast.error('Recipe not found'); navigate('/recipes'); }
    } catch (error) { toast.error('Failed to load'); navigate('/recipes');
    } finally { setLoading(false); }
  };

  const checkFavorite = async () => {
    try { const res = await api.get(`/favorites/${id}/check`); setIsFavorite(res.data.data.isFavorite); } catch (error) { console.error(error); }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) { await api.delete(`/favorites/${id}`); toast.success('Removed from favorites'); }
      else { await api.post(`/favorites/${id}`); toast.success('Added to favorites'); }
      setIsFavorite(!isFavorite);
    } catch (error) { toast.error('Failed to update'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;
    try { await api.delete(`/recipes/${id}`); toast.success('Deleted'); navigate('/recipes'); } catch (error) { toast.error('Failed to delete'); }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/recipes/${id}`;
    if (navigator.share) { try { await navigator.share({ title: recipe.name, text: recipe.description, url }); } catch (err) { if (err.name !== 'AbortError') copyToClipboard(url); } }
    else copyToClipboard(url);
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); toast.success('Link copied!'); };

  const handlePrint = () => window.print();

  const startCookingMode = () => navigate(`/recipes/${id}/cook`);

  const toggleIngredient = (idx) => {
    const next = new Set(checkedIngredients);
    next.has(idx) ? next.delete(idx) : next.add(idx);
    setCheckedIngredients(next);
  };

  const adjustQty = (originalQty, originalServings) => ((originalQty * servings) / originalServings).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!recipe) return null;

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const origServings = recipe.servings || 4;
  const gradients = ['from-emerald-500 to-teal-500', 'from-orange-500 to-rose-500', 'from-violet-500 to-purple-500', 'from-amber-500 to-orange-500', 'from-cyan-500 to-blue-500'];
  const gradient = gradients[id % gradients.length];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <Link to="/recipes" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 mb-6 font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Recipes
          </Link>

          <FadeIn>
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-6">
              {imageError ? (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                  <ChefHat className="w-20 h-20 text-white/50" />
                </div>
              ) : (
                <img src={recipe.image_url || getFoodImage(recipe.cuisine_type, recipe.id)} alt={recipe.name}
                  className="w-full h-full object-cover" onError={() => setImageError(true)} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl font-bold text-white mb-2">{recipe.name}</h1>
                {recipe.description && <p className="text-white/90 text-lg">{recipe.description}</p>}
              </div>
            </div>
          </FadeIn>

          <Card className="p-6 md:p-8 mb-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={toggleFavorite}
                className={`p-2.5 rounded-xl transition-all ${isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"><Share2 className="w-5 h-5" /></button>
              <button onClick={handlePrint} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"><Printer className="w-5 h-5" /></button>
              <button onClick={startCookingMode} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"><Play className="w-5 h-5" /></button>
              <button onClick={handleDelete} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.cuisine_type && <Badge variant="emerald">{recipe.cuisine_type}</Badge>}
              {recipe.difficulty && <Badge variant={recipe.difficulty === 'easy' ? 'emerald' : recipe.difficulty === 'medium' ? 'amber' : 'red'}>{recipe.difficulty}</Badge>}
              {recipe.dietary_tags?.map(tag => <Badge key={tag} variant="violet">{tag}</Badge>)}
            </div>

            <div className="flex flex-wrap gap-6 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-500" /> <span className="font-semibold">{totalTime} min</span></span>
              {recipe.prep_time && <span className="text-sm">Prep: {recipe.prep_time} min</span>}
              {recipe.cook_time && <span className="text-sm">Cook: {recipe.cook_time} min</span>}
              {recipe.calories && <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> {recipe.calories} cal</span>}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FadeIn delay={100}>
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ingredients</h2>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">Servings:</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl font-bold transition-all">−</button>
                  <span className="text-xl font-bold text-slate-900 dark:text-white w-12 text-center">{servings}</span>
                  <button onClick={() => setServings(servings + 1)} className="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl font-bold transition-all">+</button>
                  {servings !== origServings && <button onClick={() => setServings(origServings)} className="text-sm text-emerald-600 font-semibold">Reset</button>}
                </div>

                <div className="space-y-3">
                  {recipe.ingredients?.map((ing, idx) => {
                    const qty = adjustQty(ing.quantity, origServings);
                    const checked = checkedIngredients.has(idx);
                    return (
                      <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={checked} onChange={() => toggleIngredient(idx)}
                          className="mt-1.5 w-5 h-5 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500" />
                        <span className={`${checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          <span className="font-bold">{qty}</span> {ing.unit} {ing.name || ing.ingredient_name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </Card>
            </FadeIn>

            <div className="lg:col-span-2 space-y-6">
              <FadeIn delay={200}>
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Instructions</h2>
                  <ol className="space-y-5">
                    {recipe.instructions?.map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className={`shrink-0 w-10 h-10 bg-gradient-to-br ${gradient} text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md`}>{idx + 1}</span>
                        <p className="text-slate-700 dark:text-slate-300 pt-2 flex-1 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </FadeIn>

              {recipe.nutrition && (
                <FadeIn delay={300}>
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Nutrition (per serving)</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <NutritionCard label="Calories" value={recipe.nutrition.calories} unit="kcal" gradient="from-orange-500 to-red-500" />
                      <NutritionCard label="Protein" value={recipe.nutrition.protein} unit="g" gradient="from-blue-500 to-cyan-500" />
                      <NutritionCard label="Carbs" value={recipe.nutrition.carbs} unit="g" gradient="from-amber-500 to-yellow-500" />
                      <NutritionCard label="Fats" value={recipe.nutrition.fats} unit="g" gradient="from-violet-500 to-purple-500" />
                      <NutritionCard label="Fiber" value={recipe.nutrition.fiber} unit="g" gradient="from-emerald-500 to-teal-500" />
                    </div>
                  </Card>
                </FadeIn>
              )}

              {recipe.user_notes && (
                <FadeIn delay={400}>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6">
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2"><Leaf className="w-5 h-5" /> Notes</h3>
                    <p className="text-emerald-800 dark:text-emerald-400">{recipe.user_notes}</p>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

const NutritionCard = ({ label, value, unit, gradient }) => (
  <motion.div whileHover={{ y: -2 }} className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
    <div className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value} {unit}</div>
    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{label}</div>
  </motion.div>
);

export default RecipeDetail;
