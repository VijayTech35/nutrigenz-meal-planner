import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ChefHat, Package, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ recipes: [], pantry: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) searchAll(query);
    else setResults({ recipes: [], pantry: [] });
  }, [query]);

  const searchAll = async (searchQuery) => {
    setLoading(true);
    try {
      const [recipesRes, pantryRes] = await Promise.all([
        api.get(`/recipes?search=${encodeURIComponent(searchQuery)}`).catch(() => ({ data: { data: { recipes: [] } } })),
        api.get(`/pantry?search=${encodeURIComponent(searchQuery)}`).catch(() => ({ data: { data: { items: [] } } }))
      ]);
      setResults({
        recipes: recipesRes.data?.data?.recipes?.slice(0, 5) || [],
        pantry: pantryRes.data?.data?.items?.slice(0, 5) || []
      });
    } catch (error) { console.error('Search error:', error);
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes, ingredients..."
                  className="flex-1 outline-none text-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
                />
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 rounded text-slate-400">ESC</kbd>
                <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-2">
              {loading && (
                <div className="p-8 text-center text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                </div>
              )}

              {!loading && query.length >= 2 && results.recipes.length === 0 && results.pantry.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No results found for "<strong>{query}</strong>"</p>
                </div>
              )}

              {!loading && results.recipes.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipes</h3>
                  {results.recipes.map(recipe => (
                    <Link key={recipe.id} to={`/recipes/${recipe.id}`} onClick={onClose}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all group">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{recipe.name}</p>
                        <p className="text-sm text-slate-500">{recipe.cuisine_type} • {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && results.pantry.length > 0 && (
                <div className="mt-2">
                  <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pantry Items</h3>
                  {results.pantry.map(item => (
                    <Link key={item.id} to="/pantry" onClick={onClose}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.category} • {item.quantity} {item.unit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-400 text-center">Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-500">ESC</kbd> to close</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
