import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, StaggerContainer, StaggerItem, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { Plus, Search, X, Calendar, AlertCircle, Package, Layers, Filter, Trash2, TrendingDown } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 'Other'];

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPantryItems(); fetchExpiringItems(); }, []);

  useEffect(() => {
    let filtered = items;
    if (searchQuery) filtered = filtered.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory !== 'All') filtered = filtered.filter(i => i.category === selectedCategory);
    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory]);

  const fetchPantryItems = async () => {
    try {
      const response = await api.get('/pantry');
      setItems(response.data.data.items || []);
    } catch (error) { console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const fetchExpiringItems = async () => {
    try {
      const response = await api.get('/pantry/expiring-soon?days=7');
      setExpiringItems(response.data.data.items || []);
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/pantry/${id}`);
      setItems(items.filter(i => i.id !== id));
      toast.success('Item deleted');
    } catch (error) { toast.error('Failed to delete item'); }
  };

  const handleAddItem = async (newItem) => {
    try {
      const res = await api.post('/pantry', { name: newItem.name, quantity: parseInt(newItem.quantity) || 1, unit: newItem.unit, category: newItem.category, expiry_date: newItem.expiry_date || null });
      setItems([...items, res.data.data.item]);
      toast.success('Item added!');
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to add item'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pantry</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{items.length} ingredients</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5" /> Add Item
            </Button>
          </div>

          {expiringItems.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-300">Items Expiring Soon</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">{expiringItems.length} item{expiringItems.length > 1 ? 's' : ''} expiring within 7 days</p>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {['All', ...CATEGORIES].map(cat => (
              <motion.button
                key={cat} whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-700'
                }`}
              >{cat}</motion.button>
            ))}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients..." 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-sm" />
          </div>

          {filteredItems.length > 0 ? (
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" staggerDelay={0.05}>
              {filteredItems.map(item => (
                <StaggerItem key={item.id}>
                  <PantryItemCard item={item} onDelete={handleDelete} isExpiring={expiringItems.some(e => e.id === item.id)} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Card className="p-12">
              <EmptyState
                icon={<Package className="w-12 h-12" />}
                title={items.length === 0 ? 'Your pantry is empty' : 'No items match your search'}
                description="Add ingredients to get AI-powered recipe suggestions based on what you have."
                actionText="Add Your First Ingredient"
                action={() => setShowAddModal(true)}
              />
            </Card>
          )}
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Ingredient">
          <AddItemForm onSuccess={handleAddItem} onClose={() => setShowAddModal(false)} />
        </Modal>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

const PantryItemCard = ({ item, onDelete, isExpiring }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
    className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border ${isExpiring ? 'border-amber-300 dark:border-amber-700' : 'border-slate-200 dark:border-slate-700'} shadow-sm relative group`}
  >
    <button onClick={() => onDelete(item.id)} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-500 shadow-sm">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
    <div className="flex items-start gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isExpiring ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
        <Package className={`w-5 h-5 ${isExpiring ? 'text-amber-600' : 'text-emerald-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</h3>
        <p className="text-sm text-slate-500">{item.quantity} {item.unit}</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <Badge variant={isExpiring ? 'amber' : 'default'}>{item.category}</Badge>
      {item.expiry_date && (
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(item.expiry_date).toLocaleDateString()}
        </span>
      )}
    </div>
  </motion.div>
);

const AddItemForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({ name: '', quantity: 1, unit: 'pieces', category: 'Other', expiry_date: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Please enter a name'); return; }
    setLoading(true);
    await onSuccess(form);
    setLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Tomatoes" required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} min="1" />
        <Select label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
          {['pieces', 'kg', 'g', 'L', 'ml', 'cups', 'tbsp', 'tsp'].map(u => <option key={u} value={u}>{u}</option>)}
        </Select>
      </div>
      <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Input label="Expiry Date (optional)" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" type="submit" loading={loading} className="flex-1">Add Ingredient</Button>
      </div>
    </form>
  );
};

export default Pantry;
