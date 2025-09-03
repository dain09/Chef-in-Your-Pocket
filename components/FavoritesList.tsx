



import React from 'react';
import type { Recipe } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, Eye, ImageOff } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface FavoritesListProps {
  favorites: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onRemove: (recipeId: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
};

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelect, onRemove }) => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  const handleRemoveClick = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    onRemove(recipeId);
    addToast(t('toastRemovedFromFavorites'), 'info');
  };

  if (favorites.length === 0) {
    return (
        <div className="text-center py-16">
            <p className="text-pink-900/70">{t('noFavorites')}</p>
        </div>
    );
  }

  return (
    <motion.div 
        className="w-full max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <h2 className="text-3xl font-bold text-pink-900 mb-6 text-center">{t('myFavoriteRecipes')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {favorites.map((recipe) => (
              <motion.div
                key={recipe.id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              >
                <GlassCard className="p-0 h-full flex flex-col justify-between overflow-hidden">
                    <div>
                        <div className="aspect-[4/3] sm:aspect-video bg-pink-200/50 flex items-center justify-center">
                            {recipe.imageUrl ? (
                                <img src={recipe.imageUrl} alt={recipe.recipeName[langKey]} className="w-full h-full object-cover" />
                            ) : (
                                <ImageOff className="w-10 h-10 text-pink-400/50" />
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-pink-900 text-lg truncate">{recipe.recipeName[langKey]}</h3>
                            <p className="text-pink-900/70 text-sm line-clamp-2 mt-1 h-10">{recipe.description[langKey]}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 p-4 pt-0">
                        <motion.button
                            onClick={() => onSelect(recipe)}
                            className="flex-grow flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-black/10 text-pink-900 text-sm font-semibold hover:bg-black/20 transition-colors"
                             whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                           <Eye size={16}/> {t('viewRecipe')}
                        </motion.button>
                        <motion.button
                          onClick={(e) => handleRemoveClick(e, recipe.id)}
                          className="text-red-500 hover:text-red-400 p-2 bg-black/10 rounded-md"
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }} whileTap={{ scale: 0.9 }}
                        >
                          <X size={16} />
                        </motion.button>
                    </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
    </motion.div>
  );
};

export default FavoritesList;