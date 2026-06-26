import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Clock, ChefHat, UtensilsCrossed, Sparkles } from 'lucide-react';
import { getFoodImage } from '../utils/images';
import api from '../services/api';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecipes(); }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredRecipes(recipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchQuery, recipes]);

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes');
      setRecipes(res.data.data.recipes || []);
    } catch (error) { console.error('Error:', error);
    } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Recipes</h1>
                <p className="text-slate-500 dark:text-slate-400">{recipes.length} recipes</p>
              </div>
            </div>
            <Link to="/generate">
              <Button variant="primary"><Sparkles className="w-5 h-5" /> Generate</Button>
            </Link>
          </div>

          <Card className="p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </Card>

          {filteredRecipes.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.05}>
              {filteredRecipes.map((recipe, idx) => (
                <StaggerItem key={recipe.id}>
                  <Link to={`/recipes/${recipe.id}`} className="block group">
                    <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                      <div className="h-40 overflow-hidden">
                        <img src={recipe.image_url || getFoodImage(recipe.cuisine_type, recipe.id)} alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">{recipe.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm text-slate-500">{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                          {recipe.cuisine_type && <Badge variant="default">{recipe.cuisine_type}</Badge>}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Card className="p-12">
              <EmptyState
                icon={<ChefHat className="w-12 h-12" />}
                title={recipes.length === 0 ? 'No recipes yet' : 'No recipes match your search'}
                description="Create your first AI-generated recipe!"
                actionText="Generate Your First Recipe"
                to="/generate"
              />
            </Card>
          )}
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default MyRecipes;
