import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Menu, Recipe } from '../types';
import GlassCard from './GlassCard';
import { ListPlus, ImageOff } from 'lucide-react';
import { useBlobUrl } from '../hooks/useBlobUrl';

interface MenuCardProps {
  menu: Menu;
  onAddToShoppingList: (menu: Menu) => void;
  onViewRecipe: (recipe: Recipe) => void;
}

const CourseCard: React.FC<{ title: string; recipe: Recipe; onSelect: () => void; langKey: 'en' | 'ar' }> = ({ title, recipe, onSelect, langKey }) => {
    const { t } = useTranslation();
    const blobImageUrl = useBlobUrl(recipe.imageUrl);
    return (
        <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 items-center bg-white/20">
            <div className="w-full sm:w-1/3 h-40 sm:h-full flex-shrink-0 rounded-lg overflow-hidden">
                {recipe.imageUrl && recipe.imageUrl !== 'error' ? (
                    <img src={blobImageUrl} alt={recipe.recipeName[langKey]} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10 text-pink-900/30">
                        <ImageOff size={40} />
                    </div>
                )}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <p className="font-semibold text-pink-900/70">{title}</p>
                <h3 className="text-xl font-bold text-pink-900">{recipe.recipeName[langKey]}</h3>
                <p className="text-sm text-pink-900/80 mt-1 line-clamp-2">{recipe.description[langKey]}</p>
                <button 
                    onClick={onSelect} 
                    className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-500"
                >
                    {t('viewRecipe', 'View Recipe')}
                </button>
            </div>
        </GlassCard>
    );
};

const MenuCard: React.FC<MenuCardProps> = ({ menu, onAddToShoppingList, onViewRecipe }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
        <GlassCard className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-pink-900 text-center sm:text-left">{menu.occasion[langKey]}</h1>
                <motion.button
                  onClick={() => onAddToShoppingList(menu)}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-pink-500/80 text-white text-base font-semibold hover:bg-pink-500 transition-colors w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <ListPlus className="w-5 h-5" /> {t('addAllToShoppingList')}
                </motion.button>
            </div>
            
            <div className="space-y-4">
                <CourseCard title={t('appetizer')} recipe={menu.appetizer} onSelect={() => onViewRecipe(menu.appetizer)} langKey={langKey} />
                <CourseCard title={t('mainCourse')} recipe={menu.mainCourse} onSelect={() => onViewRecipe(menu.mainCourse)} langKey={langKey} />
                <CourseCard title={t('dessert')} recipe={menu.dessert} onSelect={() => onViewRecipe(menu.dessert)} langKey={langKey} />
            </div>
        </GlassCard>
    </motion.div>
  );
};

export default MenuCard;