import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, BookPlus, Check } from 'lucide-react';
import type { Cookbook, Recipe } from '../types';
import { useToast } from '../contexts/ToastContext';
import { audioService } from '../services/audioService';

interface AddToCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  cookbooks: Cookbook[];
  onAddToCookbooks: (recipeId: string, cookbookIds: string[]) => void;
  onCreateCookbook: (name: string, description: string) => Cookbook;
}

const AddToCookbookModal: React.FC<AddToCookbookModalProps> = ({ 
    isOpen, 
    onClose, 
    recipe, 
    cookbooks, 
    onAddToCookbooks,
    onCreateCookbook
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [selectedCookbooks, setSelectedCookbooks] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCookbookName, setNewCookbookName] = useState('');
  
  React.useEffect(() => {
      if(isOpen) {
          // Pre-select cookbooks that already contain this recipe
          const preselected = cookbooks
              .filter(cb => cb.recipeIds.includes(recipe.id))
              .map(cb => cb.id);
          setSelectedCookbooks(preselected);
      }
  }, [isOpen, cookbooks, recipe.id]);

  const handleToggleCookbook = (id: string) => {
    setSelectedCookbooks(prev => 
      prev.includes(id) ? prev.filter(cbId => cbId !== id) : [...prev, id]
    );
  };
  
  const handleSave = () => {
      onAddToCookbooks(recipe.id, selectedCookbooks);
      addToast(t('Recipe saved to cookbooks!'), 'success');
      onClose();
  };

  const handleCreateCookbook = (e: React.FormEvent) => {
      e.preventDefault();
      if (newCookbookName.trim()) {
          const newCookbook = onCreateCookbook(newCookbookName.trim(), '');
          setSelectedCookbooks(prev => [...prev, newCookbook.id]);
          setNewCookbookName('');
          setShowCreateForm(false);
          audioService.playSuccess();
      }
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
            <h3 className="text-xl font-bold text-stone-100">{t('Add to Cookbook')}</h3>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/20 rounded-lg custom-scrollbar">
            {cookbooks.map(cb => (
                <button
                    key={cb.id}
                    onClick={() => handleToggleCookbook(cb.id)}
                    className="w-full flex items-center justify-between p-2 text-left bg-black/20 rounded-md hover:bg-black/30 transition-colors"
                >
                    <span className="font-medium text-stone-100/90">{cb.name}</span>
                    {selectedCookbooks.includes(cb.id) && <Check className="text-amber-400" />}
                </button>
            ))}
            {cookbooks.length === 0 && !showCreateForm && (
                 <p className="text-center text-stone-100/60 p-4">{t("You don't have any cookbooks yet.")}</p>
            )}
        </div>
        
        {showCreateForm ? (
             <form onSubmit={handleCreateCookbook} className="flex gap-2">
                <input
                    type="text"
                    value={newCookbookName}
                    onChange={e => setNewCookbookName(e.target.value)}
                    placeholder={t('New cookbook name...')}
                    className="flex-grow p-2 bg-black/30 border border-amber-400/30 rounded-lg text-stone-100 placeholder-stone-100/50 focus:ring-2 focus:ring-amber-500"
                    autoFocus
                />
                {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                <motion.button type="submit" className="p-2 bg-teal-500 text-white rounded-lg" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    <Check size={20}/>
                </motion.button>
             </form>
        ) : (
            <motion.button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-stone-100/80 bg-black/30 rounded-lg hover:bg-black/40"
            >
                <BookPlus size={16} /> {t('Create New Cookbook')}
            </motion.button>
        )}

        {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
        <motion.button
            onClick={handleSave}
            className="w-full py-2 text-lg font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {t('Save Changes')}
        </motion.button>
      </GlassCard>
    </motion.div>
  );
};

export default AddToCookbookModal;