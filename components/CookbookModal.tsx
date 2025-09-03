import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, Book, Trash2, Edit, Check } from 'lucide-react';
import type { Cookbook, Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface CookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  cookbooks: Cookbook[];
  allRecipes: Recipe[]; // Assuming a way to get all favorited/historical recipes
  onUpdateCookbook: (cookbook: Cookbook) => void;
  onDeleteCookbook: (id: string) => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

const CookbookModal: React.FC<CookbookModalProps> = ({ 
    isOpen, 
    onClose, 
    cookbooks, 
    allRecipes,
    onUpdateCookbook, 
    onDeleteCookbook, 
    onRecipeSelect 
}) => {
  const { t } = useTranslation();
  const [selectedCookbookId, setSelectedCookbookId] = useState<string | null>(null);
  const [editingCookbook, setEditingCookbook] = useState<Cookbook | null>(null);

  const selectedCookbook = cookbooks.find(cb => cb.id === selectedCookbookId);
  const cookbookRecipes = selectedCookbook 
    ? allRecipes.filter(r => selectedCookbook.recipeIds.includes(r.id))
    : [];

  const handleEditSave = () => {
      if (editingCookbook) {
          onUpdateCookbook(editingCookbook);
          setEditingCookbook(null);
      }
  };

  if (!isOpen) return null;

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 flex justify-center items-start p-4 pt-16 sm:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-4xl p-6 flex flex-col gap-4 relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-stone-100/70 hover:text-stone-100">
          <X size={24} />
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-100">{t('My Cookbooks')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
            {/* Cookbook List */}
            <div className="md:col-span-1 bg-black/20 p-2 rounded-lg space-y-2 overflow-y-auto custom-scrollbar">
                {cookbooks.map(cb => (
                    <button
                        key={cb.id}
                        onClick={() => setSelectedCookbookId(cb.id)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${selectedCookbookId === cb.id ? 'bg-black/40' : 'hover:bg-black/30'}`}
                    >
                        <h3 className={`font-semibold ${selectedCookbookId === cb.id ? 'text-amber-300' : 'text-stone-100'}`}>{cb.name}</h3>
                        <p className="text-xs text-stone-100/60">{t('{{count}} recipes', { count: cb.recipeIds.length })}</p>
                    </button>
                ))}
            </div>

            {/* Recipes in Selected Cookbook */}
            <div className="md:col-span-2 bg-black/20 p-4 rounded-lg overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                {selectedCookbook ? (
                    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                    <motion.div
                        key={selectedCookbook.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="flex justify-between items-start mb-4">
                           <div>
                            {editingCookbook?.id === selectedCookbook.id ? (
                                <input 
                                    type="text"
                                    value={editingCookbook.name}
                                    onChange={(e) => setEditingCookbook({...editingCookbook, name: e.target.value})}
                                    className="text-xl font-bold bg-transparent border-b-2 border-amber-400 focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-amber-300">{selectedCookbook.name}</h3>
                            )}
                           </div>
                           <div className="flex gap-2">
                                {editingCookbook?.id === selectedCookbook.id ? (
                                    <button onClick={handleEditSave} className="p-1 text-green-400"><Check size={20}/></button>
                                ) : (
                                    <button onClick={() => setEditingCookbook(selectedCookbook)} className="p-1"><Edit size={20}/></button>
                                )}
                                <button onClick={() => {onDeleteCookbook(selectedCookbook.id); setSelectedCookbookId(null)}} className="p-1 text-red-500/80"><Trash2 size={20}/></button>
                           </div>
                        </div>
                        {cookbookRecipes.length > 0 ? (
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {cookbookRecipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} onSelect={onRecipeSelect} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 text-stone-100/60 flex flex-col items-center gap-4">
                                <Book size={48} />
                                <p>{t('This cookbook is empty.')}</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" className="h-full flex items-center justify-center text-stone-100/60">
                        <p>{t('Select a cookbook to view its recipes.')}</p>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default CookbookModal;