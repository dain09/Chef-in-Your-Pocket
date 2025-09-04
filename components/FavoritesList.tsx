import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../types';
import GlassCard from './GlassCard';
import { Star, X } from 'lucide-react';
import { useBlobUrl } from '../hooks/useBlobUrl';

interface FavoriteItemProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onRemove: (recipeId: string) => void;
}

const FavoriteItemCard: React.FC<FavoriteItemProps> = ({ recipe, onSelect, onRemove }) => {
    const { i18n, t } = useTranslation();
    const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
    const blobImageUrl = useBlobUrl(recipe.imageUrl);
    
    return (
        <GlassCard className="group relative overflow-hidden flex flex-col h-full">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(recipe.id);
                }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/30 hover:bg-red-500 rounded-full text-white transition-colors"
                aria-label={t('removeFromFavorites', 'Remove from favorites')}
             >
                <X size={16} />
             </button>
            <div className="h-40 bg-pink-200/50 overflow-hidden">
              {blobImageUrl ? (
                <img src={blobImageUrl} alt={recipe.recipeName[langKey]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10 text-pink-900/30">
                  <Star size={40} />
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-pink-900 truncate">{recipe.recipeName[langKey]}</h3>
                <p className="text-sm text-pink-900/70 line-clamp-2 flex-grow">{recipe.description[langKey]}</p>
                <button onClick={() => onSelect(recipe)} className="mt-4 w-full text-center py-2 text-sm bg-pink-500/80 text-white rounded-lg hover:bg-pink-500 transition-colors">
                    {t('viewRecipe')}
                </button>
            </div>
        </GlassCard>
    );
};

interface FavoritesListProps {
  favorites: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onRemove: (recipeId: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelect, onRemove }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pink-900">{t('myFavoriteRecipes')}</h2>
      </div>
      <AnimatePresence>
        {favorites.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
          >
            {favorites.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FavoriteItemCard recipe={recipe} onSelect={onSelect} onRemove={onRemove} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <GlassCard className="p-8 max-w-md mx-auto">
              <Star size={48} className="mx-auto text-pink-900/30 mb-4" />
              <p className="text-pink-900/70">{t('noFavorites')}</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesList;
