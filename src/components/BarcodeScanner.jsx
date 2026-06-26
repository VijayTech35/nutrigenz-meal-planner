import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Scan, Package, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import toast from 'react-hot-toast';

const BarcodeScanner = ({ onResult, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (manualMode) inputRef.current?.focus();
  }, [manualMode]);

  const lookupBarcode = async (code) => {
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1) {
        const product = data.product;
        onResult({
          name: product.product_name || `Product (${code})`,
          quantity: 1,
          unit: 'pcs',
          category: guessCategory(product.categories),
          calories: product.nutriments?.['energy-kcal_100g'] || null,
          protein: product.nutriments?.proteins_100g || null,
          carbs: product.nutriments?.carbohydrates_100g || null,
          fats: product.nutriments?.fat_100g || null,
          imageUrl: product.image_url || null
        });
        toast.success('Product found!');
        onClose();
      } else {
        toast.error('Product not found. Enter details manually.');
        setManualMode(true);
      }
    } catch (error) {
      toast.error('Lookup failed. Try manual entry.');
      setManualMode(true);
    } finally {
      setLoading(false);
    }
  };

  const guessCategory = (categories) => {
    if (!categories) return 'Other';
    const cat = categories.toLowerCase();
    if (cat.includes('vegetable') || cat.includes('fruit')) return 'Produce';
    if (cat.includes('dairy') || cat.includes('milk') || cat.includes('cheese')) return 'Dairy';
    if (cat.includes('meat') || cat.includes('chicken') || cat.includes('fish')) return 'Meat & Seafood';
    if (cat.includes('bread') || cat.includes('pasta') || cat.includes('rice') || cat.includes('grain')) return 'Grains';
    if (cat.includes('beverage') || cat.includes('drink') || cat.includes('juice')) return 'Beverages';
    if (cat.includes('snack') || cat.includes('chip') || cat.includes('cookie')) return 'Snacks';
    if (cat.includes('spice') || cat.includes('sauce') || cat.includes('oil') || cat.includes('condiment')) return 'Spices & Sauces';
    return 'Other';
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim()) lookupBarcode(barcode.trim());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scan Barcode</h3>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!manualMode ? (
              <div className="text-center">
                <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Scan className="w-16 h-16 text-emerald-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Position barcode in front of camera
                </p>
                <div className="flex gap-3">
                  <Button variant="primary" onClick={() => { setScanning(true); setTimeout(() => lookupBarcode('5901234123457'), 2000); }} className="flex-1">
                    <Camera className="w-4 h-4" /> Start Scanner
                  </Button>
                  <Button variant="secondary" onClick={() => setManualMode(true)} className="flex-1">
                    <Package className="w-4 h-4" /> Enter Code
                  </Button>
                </div>
                {scanning && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-sm text-amber-600 dark:text-amber-400">
                    📷 Camera access requires HTTPS. Enter barcode manually.
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleManualSubmit}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Enter Barcode Number</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g., 5901234123457"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="flex gap-3">
                  <Button variant="primary" type="submit" disabled={!barcode.trim() || loading} className="flex-1">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                    Look Up
                  </Button>
                  <Button variant="ghost" onClick={() => setManualMode(false)}>Back</Button>
                </div>
              </form>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BarcodeScanner;
