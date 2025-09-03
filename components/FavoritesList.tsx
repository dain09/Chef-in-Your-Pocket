import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { Heart, X } from 'lucide-react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface FavoritesListProps {
  favorites: Recipe[];
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onDeleteFavorite: (recipeId: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onClose, onSelectRecipe, onDeleteFavorite }) => {
  const { t } = useTranslation();

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
            <h2 className="text-2xl font-bold text-stone-100">{t('myFavorites')}</h2>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar -mr-2 pr-2">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {favorites.map(recipe => (
                    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                    <motion.div
                        key={recipe.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <RecipeCard 
                            recipe={recipe} 
                            onSelect={onSelectRecipe}
                            onDeleteFavorite={onDeleteFavorite}
                        />
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 text-stone-100/60 flex flex-col items-center gap-4">
                <Heart size={48} />
                <p>{t('favoritesEmpty')}</p>
                <p className="text-sm">{t('favoritesEmptyHint')}</p>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default FavoritesList;