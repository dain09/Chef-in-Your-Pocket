import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../types';
import { Clock, Users, Utensils, Trash2 } from 'lucide-react';
import { audioService } from '../services/audioService';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onDeleteFavorite?: (recipeId: string) => void;
  isCompact?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onDeleteFavorite, isCompact = false }) => {
  const { i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  const handleSelect = () => {
    audioService.playClick();
    onSelect(recipe);
  };

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click when deleting
      if (onDeleteFavorite) {
          audioService.playPop();
          onDeleteFavorite(recipe.id);
      }
  }

  if (isCompact) {
      return (
          // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
          <motion.div
            layoutId={`recipe-compact-${recipe.id}`}
            onClick={handleSelect}
            className="bg-black/20 p-3 rounded-lg cursor-pointer hover:bg-black/30 transition-colors"
            whileHover={{ y: -3 }}
          >
              <h4 className="font-semibold text-stone-100 truncate">{recipe.title[langKey]}</h4>
              <p className="text-xs text-stone-100/70 truncate">{recipe.cuisine[langKey]}</p>
          </motion.div>
      )
  }

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
        layoutId={`recipe-${recipe.id}`}
        onClick={handleSelect}
        className="bg-black/20 p-4 rounded-lg cursor-pointer overflow-hidden border border-amber-400/10 h-full flex flex-col"
        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' }}
    >
        <h3 className="font-bold text-lg text-amber-300 truncate">{recipe.title[langKey]}</h3>
        <div className="flex items-center gap-4 text-xs text-stone-100/60 my-2">
            <span className="flex items-center gap-1"><Utensils size={12}/> {recipe.cuisine[langKey]}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {recipe.cookTime[langKey]}</span>
            <span className="flex items-center gap-1"><Users size={12}/> {recipe.servings} Servings</span>
        </div>
        <p className="text-sm text-stone-100/80 line-clamp-3 flex-grow">{recipe.description[langKey]}</p>
        {onDeleteFavorite && (
            <div className="mt-2 pt-2 border-t border-amber-400/10 flex justify-end">
                 <button onClick={handleDelete} className="p-1 text-red-500/70 hover:text-red-400" aria-label="Delete favorite">
                    <Trash2 size={16} />
                 </button>
            </div>
        )}
    </motion.div>
  );
};

export default RecipeCard;