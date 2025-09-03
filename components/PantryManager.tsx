import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, Trash2, PlusCircle, Archive, AlertTriangle } from 'lucide-react';
import { audioService } from '../services/audioService';
import type { PantryItem } from '../types';

interface PantryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  pantryItems: PantryItem[];
  onUpdatePantry: (items: PantryItem[]) => void;
  onPantryChallenge: () => void;
}

const getExpiryStatus = (expiryDate?: string): 'fresh' | 'nearing' | 'expired' => {
  if (!expiryDate) return 'fresh';
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'nearing';
  return 'fresh';
};

const PantryManager: React.FC<PantryManagerProps> = ({ isOpen, onClose, pantryItems, onUpdatePantry, onPantryChallenge }) => {
  const { t } = useTranslation();
  const [newItem, setNewItem] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      audioService.playPop();
      const newItemObject: PantryItem = {
        id: new Date().toISOString(),
        name: newItem.trim(),
        date: new Date().toISOString().split('T')[0],
        ...(expiryDate && { expiryDate }),
      };
      onUpdatePantry([...pantryItems, newItemObject]);
      setNewItem('');
      setExpiryDate('');
    }
  };

  const handleRemoveItem = (id: string) => {
    audioService.playPop();
    onUpdatePantry(pantryItems.filter(item => item.id !== id));
  };
  
  if (!isOpen) return null;

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-md p-6 flex flex-col gap-4 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 p-2 text-stone-100/70 hover:text-stone-100 z-10">
          <X size={24} />
        </button>
        <div className="text-center">
            <h3 className="text-xl font-bold text-stone-100">{t('myPantry')}</h3>
            <p className="text-sm text-stone-100/70">{t('pantryDescription')}</p>
        </div>
        
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={t('pantryPlaceholder')}
                className="flex-grow p-2 bg-black/30 border border-amber-400/30 rounded-lg text-stone-100 placeholder-stone-100/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
             <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="p-2 bg-black/30 border border-amber-400/30 rounded-lg text-stone-100/70"
                min={new Date().toISOString().split("T")[0]}
            />
            {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
            <motion.button type="submit" className="p-2 bg-teal-500 text-white rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <PlusCircle size={20}/>
            </motion.button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/20 rounded-lg custom-scrollbar">
          <AnimatePresence>
            {pantryItems.length > 0 ? pantryItems.map((item, index) => {
              const status = getExpiryStatus(item.expiryDate);
              const statusColor = {
                fresh: 'text-stone-100/90',
                nearing: 'text-amber-400',
                expired: 'text-red-500',
              };
              return (
                // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 bg-black/20 rounded-md"
                >
                  <span className={`font-medium ${statusColor[status]}`}>{item.name}</span>
                  <div className="flex items-center gap-2">
                    {item.expiryDate && (
                      <span className={`text-xs ${statusColor[status]}`}>
                          {status === 'nearing' && t('expiresSoon')}
                          {status === 'expired' && t('expired')}
                      </span>
                    )}
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500/70 hover:text-red-500">
                        <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            }) : (
                <div className="text-center py-8 text-stone-100/60 flex flex-col items-center gap-3">
                    <Archive size={32}/>
                    <p>{t('pantryEmpty')}</p>
                </div>
            )}
          </AnimatePresence>
        </div>

         {pantryItems.length > 0 && (
            // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
            <motion.button
                onClick={onPantryChallenge}
                className="w-full flex items-center justify-center gap-2 py-2 text-md font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
                <AlertTriangle size={18} /> {t('pantryChallenge')}
            </motion.button>
        )}

      </GlassCard>
    </motion.div>
  );
};

export default PantryManager;