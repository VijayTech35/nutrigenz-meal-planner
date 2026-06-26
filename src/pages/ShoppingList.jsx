import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/Progress';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ShoppingCart, Plus, X, Check, Trash2, Download, Package, ListChecks } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Spices', 'Beverages', 'Other'];

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchShoppingList(); }, []);

  const fetchShoppingList = async () => {
    try {
      const res = await api.get('/shopping-list');
      const listItems = res.data.data.items || [];
      setItems(listItems);
      organizeByCategory(listItems);
    } catch (error) { console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const organizeByCategory = (itemsList) => {
    const grouped = {};
    itemsList.forEach(item => {
      const cat = item.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    setGroupedItems(grouped);
  };

  const handleToggleChecked = async (id) => {
    try {
      await api.patch(`/shopping-list/${id}/toggle`);
      const updated = items.map(item => item.id === id ? { ...item, is_checked: !item.is_checked } : item);
      setItems(updated);
      organizeByCategory(updated);
    } catch (error) { toast.error('Failed to update'); }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/shopping-list/${id}`);
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      organizeByCategory(updated);
      toast.success('Item removed');
    } catch (error) { toast.error('Failed to delete'); }
  };

  const handleClearChecked = async () => {
    if (!confirm('Remove all checked items?')) return;
    try {
      await api.delete('/shopping-list/checked');
      const updated = items.filter(item => !item.is_checked);
      setItems(updated);
      organizeByCategory(updated);
      toast.success('Checked items cleared');
    } catch (error) { toast.error('Failed to clear'); }
  };

  const handleAddItem = async (newItem) => {
    try {
      const res = await api.post('/shopping-list', {
        ingredient_name: newItem.name, quantity: parseInt(newItem.quantity) || 1,
        unit: newItem.unit, category: newItem.category
      });
      const updated = [...items, res.data.data.item];
      setItems(updated);
      organizeByCategory(updated);
      toast.success('Item added');
    } catch (error) { toast.error('Failed to add'); }
  };

  const exportToCSV = () => {
    const headers = ['Category', 'Item', 'Quantity', 'Unit', 'Checked'];
    const rows = Object.entries(groupedItems).flatMap(([cat, catItems]) =>
      catItems.map(item => [cat, item.ingredient_name, item.quantity, item.unit, item.is_checked ? 'Yes' : 'No']));
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported!');
  };

  const checkedCount = items.filter(i => i.is_checked).length;
  const totalCount = items.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4 mb-6" />
          <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-64" />
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
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shopping List</h1>
                <p className="text-slate-500 dark:text-slate-400">{checkedCount} of {totalCount} items checked</p>
              </div>
            </div>
            <div className="flex gap-2">
              {checkedCount > 0 && <Button variant="ghost" onClick={handleClearChecked} className="text-red-500">Clear Checked</Button>}
              <Button variant="secondary" onClick={exportToCSV}><Download className="w-4 h-4" /> Export</Button>
              <Button variant="primary" onClick={() => setShowAddModal(true)}><Plus className="w-5 h-5" /> Add Item</Button>
            </div>
          </div>

          {totalCount > 0 && (
            <FadeIn>
              <Card className="p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ListChecks className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="text-sm text-slate-500 ml-auto">{Math.round((checkedCount / totalCount) * 100)}%</span>
                </div>
                <ProgressBar value={checkedCount} max={totalCount} />
              </Card>
            </FadeIn>
          )}

          {Object.keys(groupedItems).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, categoryItems], ci) => (
                <FadeIn key={category} delay={ci * 50}>
                  <Card className="overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                      <h2 className="font-bold text-slate-900 dark:text-white">{category}</h2>
                      <p className="text-sm text-slate-500">{categoryItems.length} items</p>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {categoryItems.map((item, ii) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ii * 0.03 }}
                          className={`flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition ${item.is_checked ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
                        >
                          <motion.button whileTap={{ scale: 0.8 }}
                            onClick={() => handleToggleChecked(item.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                              item.is_checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-500 hover:border-emerald-500'
                            }`}>
                            {item.is_checked && <Check className="w-4 h-4 text-white" />}
                          </motion.button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${item.is_checked ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{item.ingredient_name}</p>
                            <p className="text-sm text-slate-500">{item.quantity} {item.unit}</p>
                          </div>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <EmptyState
                icon={<ShoppingCart className="w-12 h-12" />}
                title="Shopping list is empty"
                description="Add items or generate from your meal plan"
                actionText="Add Item"
                action={() => setShowAddModal(true)}
              />
            </Card>
          )}
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Item">
          <AddItemForm onSuccess={handleAddItem} onClose={() => setShowAddModal(false)} />
        </Modal>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

const AddItemForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({ name: '', quantity: 1, unit: 'pieces', category: 'Other' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSuccess(form);
    setLoading(false);
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Tomatoes" required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} min="1" />
        <Select label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
          {['pieces', 'kg', 'g', 'L', 'ml'].map(u => <option key={u} value={u}>{u}</option>)}
        </Select>
      </div>
      <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" type="submit" loading={loading} className="flex-1">Add Item</Button>
      </div>
    </form>
  );
};

export default ShoppingList;
