import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import type { PantryItem } from '../types';
import GlassCard from './GlassCard';
import { X, Plus, Archive } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { audioService } from '../services/audioService';

interface PantryManagerProps {
  pantryItems: PantryItem[];
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: { duration: 0.3 }
    }
};

const PantryManager: React.FC<PantryManagerProps> = ({ pantryItems, setPantryItems }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newItemName.trim();
    if (trimmedName && !pantryItems.some(item => item.name.toLowerCase() === trimmedName.toLowerCase())) {
      audioService.playClick();
      const newItem: PantryItem = {
        id: new Date().toISOString(),
        name: trimmedName,
      };
      setPantryItems(prev => [...prev, newItem].sort((a,b) => a.name.localeCompare(b.name)));
      setNewItemName('');
      addToast(t('toastItemAddedToPantry', { item: trimmedName }), 'success');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    audioService.playPop();
    const itemToRemove = pantryItems.find(item => item.id === itemId);
    if (itemToRemove) {
      setPantryItems(prev => prev.filter(item => item.id !== itemId));
      addToast(t('toastItemRemovedFromPantry', { item: itemToRemove.name }), 'info');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <GlassCard className="p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-pink-900">{t('pantryViewTitle')}</h2>
                <p className="text-pink-900/70 mt-2">{t('pantryViewDescription')}</p>
            </div>
            
            <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-grow p-3 bg-white/30 border border-pink-500/30 rounded-lg text-pink-900 placeholder-pink-900/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow"
                    placeholder={t('addPantryItemPlaceholder')}
                />
                <motion.button
                    type="submit"
                    className="flex-shrink-0 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg disabled:opacity-50"
                    disabled={!newItemName.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={24} className="sm:hidden" />
                    <span className="hidden sm:inline">{t('addPantryItemButton')}</span>
                </motion.button>
            </form>

            <div className="space-y-2">
                {pantryItems.length === 0 ? (
                    <div className="text-center py-8 text-pink-900/70 flex flex-col items-center gap-4">
                        <Archive size={40} />
                        <p>{t('pantryIsEmpty')}</p>
                    </div>
                ) : (
                    <motion.ul 
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                        {pantryItems.map(item => (
                            <motion.li
                                key={item.id}
                                layout
                                variants={itemVariants}
                                exit="exit"
                                className="bg-white/20 p-2 rounded-lg flex justify-between items-center text-sm text-pink-900"
                            >
                                <span className="truncate pr-1">{item.name}</span>
                                <button onClick={() => handleRemoveItem(item.id)} className="flex-shrink-0 p-1 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                                    <X size={16} />
                                </button>
                            </motion.li>
                        ))}
                        </AnimatePresence>
                    </motion.ul>
                )}
            </div>
        </GlassCard>
    </div>
  );
};

export default PantryManager;
