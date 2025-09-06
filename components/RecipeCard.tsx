import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import type { Recipe } from '../types';
import { Clock, Utensils, Heart, Plus, Trash2, Edit, BookOpen } from 'lucide-react';
import { audioService } from '../services/audioService';
import { useBlobUrl } from '../hooks/useBlobUrl';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onAddToShoppingList?: (ingredients: string[]) => void;
  onToggleFavorite?: (recipeId: string) => void;
  onDeleteFavorite?: (recipeId: string) => void;
  onRemix?: (recipe: Recipe) => void;
  onStartCooking?: (recipe: Recipe) => void;
  isFavorite?: boolean;
  isCompact?: boolean; // For a smaller version of the card
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onAddToShoppingList,
  onToggleFavorite,
  onDeleteFavorite,
  onRemix,
  onStartCooking,
  isFavorite = false,
  isCompact = false,
}) => {
  const { i18n, t } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  
  const blobImageUrl = useBlobUrl(recipe.imageUrl);

  const handleSelect = (e: React.MouseEvent) => {
    // Prevent event bubbling if the click is on a button
    if ((e.target as HTMLElement).closest('button')) return;
    audioService.playSwoosh();
    onSelect(recipe);
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isCompact) {
      return (
           <motion.div layoutId={`recipe-${recipe.id}`} onClick={handleSelect} className="cursor-pointer w-full">
                <GlassCard
                    className="p-3 flex gap-4 items-center"
                    variants={cardVariants}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                    {blobImageUrl && recipe.imageUrl !== 'IMAGE_GENERATION_FAILED' ? (
                         <img src={blobImageUrl} alt={recipe.title[langKey]} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                        <div className="w-20 h-20 bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center text-amber-500/50">
                            <Utensils size={32} />
                        </div>
                    )}
                   <div className="flex-grow">
                        <h3 className="font-bold text-stone-100 line-clamp-2">{recipe.title[langKey]}</h3>
                        <p className="text-sm text-stone-100/70">{recipe.cuisine[langKey]}</p>
                   </div>
                </GlassCard>
           </motion.div>
      );
  }

  return (
    <motion.div layoutId={`recipe-${recipe.id}`} onClick={handleSelect} className="cursor-pointer w-full">
      <GlassCard
        className="overflow-hidden"
        variants={cardVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="relative">
            {blobImageUrl && recipe.imageUrl !== 'IMAGE_GENERATION_FAILED' ? (
                <img
                    src={blobImageUrl}
                    alt={recipe.title[langKey]}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-black/20 flex items-center justify-center text-amber-500/50">
                    <Utensils size={48} />
                </div>
            )}
         
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {onToggleFavorite && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); audioService.playClick(); onToggleFavorite(recipe.id); }}
                className={`p-2 rounded-full ${isFavorite ? 'bg-rose-500 text-white' : 'bg-black/40 text-stone-100/80 backdrop-blur-sm'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>
            )}
             {onDeleteFavorite && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); audioService.playPop(); onDeleteFavorite(recipe.id); }}
                className='p-2 rounded-full bg-red-500/80 text-white backdrop-blur-sm'
                whileHover={{ scale: 1.1, backgroundColor: 'rgb(239 68 68)' }}
                whileTap={{ scale: 0.9 }}
                aria-label='Delete from favorites'
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-stone-100 line-clamp-1">{recipe.title[langKey]}</h3>
          <p className="text-sm text-stone-100/80 line-clamp-3 h-[60px]">{recipe.description[langKey]}</p>
          <div className="flex justify-between items-center text-xs text-stone-100/70 pt-2 border-t border-amber-300/10">
            <span className="flex items-center gap-1.5"><Utensils size={12}/> {recipe.cuisine[langKey]}</span>
            <span className="flex items-center gap-1.5"><Clock size={12}/> {recipe.cookTime[langKey]}</span>
          </div>
          
           <div className="flex gap-2 pt-2">
            {onAddToShoppingList && (
                <motion.button onClick={(e) => { e.stopPropagation(); audioService.playPop(); onAddToShoppingList(recipe.ingredients.map(i => `${i.amount[langKey]} ${i.name[langKey]}`)); }} className="flex-1 text-sm flex items-center justify-center gap-2 p-2 bg-black/30 rounded-lg hover:bg-black/50" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                    <Plus size={16}/> {t('shoppingList')}
                </motion.button>
            )}
            {onRemix && (
                <motion.button onClick={(e) => { e.stopPropagation(); audioService.playClick(); onRemix(recipe); }} className="flex-1 text-sm flex items-center justify-center gap-2 p-2 bg-black/30 rounded-lg hover:bg-black/50" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                    <Edit size={16}/> {t('remix')}
                </motion.button>
            )}
             {onStartCooking && (
                <motion.button onClick={(e) => { e.stopPropagation(); audioService.playClick(); onStartCooking(recipe); }} className="flex-1 text-sm flex items-center justify-center gap-2 p-2 bg-teal-500 text-white rounded-lg" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                    <BookOpen size={16}/> {t('startCooking')}
                </motion.button>
            )}
           </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default RecipeCard;
