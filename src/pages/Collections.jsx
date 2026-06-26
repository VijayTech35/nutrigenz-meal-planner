import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Folder, Trash2, Edit2, MoreVertical, X, Sparkles, Bookmark } from 'lucide-react';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => { fetchCollections(); }, []);

  const fetchCollections = async () => {
    try { const res = await api.get('/collections'); setCollections(res.data.data.collections || []); } catch (error) { console.error(error);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCollection) { await api.put(`/collections/${editingCollection.id}`, formData); toast.success('Updated'); }
      else { await api.post('/collections', formData); toast.success('Created!'); }
      fetchCollections();
      setShowModal(false);
      setEditingCollection(null);
      setFormData({ name: '', description: '' });
    } catch (error) { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this collection?')) return;
    try { await api.delete(`/collections/${id}`); toast.success('Deleted'); fetchCollections(); } catch (error) { toast.error('Failed to delete'); }
  };

  const openEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({ name: collection.name, description: collection.description || '' });
    setShowModal(true);
  };

  const gradients = ['from-violet-500 to-purple-600', 'from-orange-500 to-amber-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500', 'from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-fuchsia-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}</div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-fuchsia-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Folder className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Collections</h1>
                <p className="text-slate-500 dark:text-slate-400">{collections.length} collections</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => { setEditingCollection(null); setFormData({ name: '', description: '' }); setShowModal(true); }}>
              <Plus className="w-5 h-5" /> New Collection
            </Button>
          </div>

          {collections.length === 0 ? (
            <Card className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Bookmark className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No collections yet</h2>
              <p className="text-slate-500 mb-8">Organize your favorite recipes into collections</p>
              <Button variant="primary" size="lg" onClick={() => setShowModal(true)}><Sparkles className="w-5 h-5" /> Create Collection</Button>
            </Card>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
              {collections.map((collection, idx) => (
                <StaggerItem key={collection.id}>
                  <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm group">
                    <div className={`h-32 bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center relative overflow-hidden`}>
                      <Folder className="w-16 h-16 text-white/50" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Link to={`/collections/${collection.id}`} className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-violet-600 transition-colors truncate">{collection.name}</h3>
                        </Link>
                        <div className="relative">
                          <button onClick={() => setActiveMenu(activeMenu === collection.id ? null : collection.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                            <MoreVertical className="w-5 h-5 text-slate-500" />
                          </button>
                          <AnimatePresence>
                            {activeMenu === collection.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10">
                                <button onClick={() => { openEdit(collection); setActiveMenu(null); }}
                                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-xl">
                                  <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => { handleDelete(collection.id); setActiveMenu(null); }}
                                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      {collection.description && <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{collection.description}</p>}
                      <p className="text-xs text-slate-500">{collection.recipe_count || 0} recipes</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCollection ? 'Edit Collection' : 'New Collection'}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Collection Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Weeknight Dinners" required />
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (optional)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" rows={3} placeholder="What's this collection for?" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" type="submit" className="flex-1">{editingCollection ? 'Save Changes' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default Collections;
