import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Sparkles, Plus, X, Clock, Users, Leaf, Wheat, Flame, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const CUISINES = ['Any', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American'];
const DIETARY_OPTIONS = [
  { id: 'Vegetarian', icon: '🥬', label: 'Vegetarian' },
  { id: 'Vegan', icon: '🌱', label: 'Vegan' },
  { id: 'Gluten-Free', icon: '🌾', label: 'Gluten Free' },
  { id: 'Dairy-Free', icon: '🥛', label: 'Dairy Free' },
  { id: 'Keto', icon: '🥑', label: 'Keto' },
  { id: 'Paleo', icon: '🍖', label: 'Paleo' },
];
const COOKING_TIMES = [
  { value: 'quick', label: 'Quick (<30 min)' },
  { value: 'medium', label: 'Medium (30-60 min)' },
  { value: 'long', label: 'Long (>60 min)' }
];

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [usePantry, setUsePantry] = useState(false);
  const [cuisineType, setCuisineType] = useState('Any');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [servings, setServings] = useState(4);
  const [cookingTime, setCookingTime] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [savedRecipeId, setSavedRecipeId] = useState(null);
  const navigate = useNavigate();

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient) => setIngredients(ingredients.filter(i => i !== ingredient));

  const toggleDietary = (diet) => {
    setDietaryRestrictions(prev => prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]);
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0 && !usePantry) { toast.error('Add at least one ingredient'); return; }
    setGenerating(true);
    try {
      const res = await api.post('/recipes/generate', {
        ingredients: usePantry ? [] : ingredients,
        usePantryIngredients: usePantry,
        cuisineType: cuisineType === 'Any' ? null : cuisineType,
        dietaryRestrictions, servings, cookingTime
      });
      if (res.data.success) { setGeneratedRecipe(res.data.data.recipe); toast.success('Recipe generated!'); }
      else toast.error(res.data.message || 'Failed to generate');
    } catch (error) { console.error('Error:', error); toast.error(error.response?.data?.message || 'Failed to generate');
    } finally { setGenerating(false); }
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop'
  ];

  const handleSaveRecipe = async (shouldNavigate = true) => {
    try {
      const recipe = {
        name: generatedRecipe.name,
        description: generatedRecipe.description,
        cuisine_type: generatedRecipe.cuisineType || generatedRecipe.cuisine_type,
        difficulty: generatedRecipe.difficulty,
        prep_time: generatedRecipe.prepTime || generatedRecipe.prep_time,
        cook_time: generatedRecipe.cookTime || generatedRecipe.cook_time,
        servings: generatedRecipe.servings,
        instructions: generatedRecipe.instructions || [],
        dietary_tags: generatedRecipe.dietaryTags || generatedRecipe.dietary_tags || [],
        image_url: generatedRecipe.image_url || defaultImages[Math.floor(Math.random() * defaultImages.length)],
        ingredients: generatedRecipe.ingredients || [],
        nutrition: generatedRecipe.nutrition || {}
      };
      const res = await api.post('/recipes', recipe);
      setSavedRecipeId(res.data.data.recipe.id);
      toast.success('Recipe saved!');
      if (shouldNavigate) navigate(`/recipes/${res.data.data.recipe.id}`);
    } catch (error) { toast.error('Failed to save'); }
  };

  const handleViewDetails = () => {
    if (savedRecipeId) navigate(`/recipes/${savedRecipeId}`);
    else handleSaveRecipe(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <FadeIn>
            <div className="relative rounded-3xl p-8 md:p-12 mb-8 text-white overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-2">AI Recipe Generator</h1>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">Tell us what ingredients you have, and our AI will create a delicious recipe for you!</p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <FadeIn delay={100}>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-600">1</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ingredients</h2>
                  </div>

                  <label className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl mb-4 cursor-pointer border border-emerald-200 dark:border-emerald-800/30">
                    <input type="checkbox" checked={usePantry} onChange={(e) => setUsePantry(e.target.checked)}
                      className="w-5 h-5 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Use ingredients from my pantry</span>
                  </label>

                  <div className="flex gap-2 mb-4">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                      placeholder="Add ingredient (e.g., tomatoes)"
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                    <Button variant="primary" onClick={addIngredient}><Plus className="w-5 h-5" /></Button>
                  </div>

                  <AnimatePresence>
                    {ingredients.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
                        {ingredients.map((ing, idx) => (
                          <motion.span key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                            {ing}
                            <button onClick={() => removeIngredient(ing)} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </FadeIn>

              <FadeIn delay={200}>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-teal-600">2</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Preferences</h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cuisine</label>
                      <select value={cuisineType} onChange={(e) => setCuisineType(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                        {CUISINES.map(c => <option key={c} value={c}>{c === 'Any' ? 'Any Cuisine' : c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dietary</label>
                      <div className="flex flex-wrap gap-2">
                        {DIETARY_OPTIONS.map(diet => (
                          <button key={diet.id} onClick={() => toggleDietary(diet.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              dietaryRestrictions.includes(diet.id) ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`}>
                            <span>{diet.icon}</span> {diet.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cooking Time</label>
                        <select value={cookingTime} onChange={(e) => setCookingTime(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                          {COOKING_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Servings</label>
                        <select value={servings} onChange={(e) => setServings(parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} servings</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeIn>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={handleGenerate} disabled={generating}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    AI is cooking...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Generate AI Recipe
                  </span>
                )}
              </motion.button>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={150}>
                <Card className="p-6 h-full">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-emerald-500" />
                    Generated Recipe
                  </h2>

                  {generatedRecipe ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{generatedRecipe.name}</h3>
                      {generatedRecipe.description && <p className="text-slate-600 dark:text-slate-400">{generatedRecipe.description}</p>}

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {(generatedRecipe.prep_time || 0) + (generatedRecipe.cook_time || 0)} min</span>
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {generatedRecipe.servings} servings</span>
                        {generatedRecipe.cuisine_type && <Badge variant="emerald">{generatedRecipe.cuisine_type}</Badge>}
                        {generatedRecipe.difficulty && <Badge variant={generatedRecipe.difficulty === 'easy' ? 'emerald' : 'amber'}>{generatedRecipe.difficulty}</Badge>}
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Button variant="primary" onClick={() => handleSaveRecipe(false)} className="flex-1">Save Recipe</Button>
                        <Button variant="outline" onClick={handleViewDetails} className="flex-1">
                          View Details <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ChefHat className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">Your AI-generated recipe will appear here</p>
                      <p className="text-sm text-slate-400 mt-1">Fill in your ingredients and click generate</p>
                    </div>
                  )}
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

export default RecipeGenerator;
