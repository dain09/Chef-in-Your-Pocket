import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Menu, Recipe, Ingredient } from '../types';
import GlassCard from './GlassCard';
import { audioService } from '../services/audioService';
import { ListPlus, ImageOff, ChefHat } from 'lucide-react';

type Course = 'appetizer' | 'mainCourse' | 'dessert';

interface MenuCardProps {
  menu: Menu;
  onAddToShoppingList: (menu: Menu) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button
        onClick={() => { audioService.playPop(); onClick(); }}
        className={`relative px-2 sm:px-4 py-2 text-xs sm:text-base font-semibold rounded-full transition-colors w-1/3 ${active ? 'text-pink-800' : 'text-pink-900/60 hover:text-pink-900'}`}
    >
        {active && <motion.div layoutId="menuTabPill" className="absolute inset-0 bg-white/50 rounded-full" />}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
);

const RecipeDetailView: React.FC<{ recipe: Recipe, langKey: 'en' | 'ar' }> = ({ recipe, langKey }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      {/* Left side: Image and details */}
      <div className="space-y-4">
        <div className="aspect-video bg-pink-200/50 flex items-center justify-center rounded-lg overflow-hidden">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.recipeName[langKey]} className="w-full h-full object-cover" />
          ) : (
            <ImageOff className="w-12 h-12 text-pink-400/50" />
          )}
        </div>
        <p className="text-pink-900/80 italic text-center text-sm sm:text-base">{recipe.description[langKey]}</p>
        <div className="flex justify-around text-center text-xs sm:text-sm text-pink-900/90">
          <div>
            <div className="font-bold">{t('prepTime')}</div>
            <div>{recipe.prepTime[langKey]}</div>
          </div>
          <div>
            <div className="font-bold">{t('cookTime')}</div>
            <div>{recipe.cookTime[langKey]}</div>
          </div>
          <div>
            <div className="font-bold">{t('servings')}</div>
            <div>{recipe.servings}</div>
          </div>
        </div>
      </div>
      {/* Right side: Ingredients and Steps */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-bold text-pink-900 mb-2">{t('ingredients')}</h4>
          <ul className="list-none list-inside columns-1 sm:columns-2 gap-x-6 text-sm sm:text-base text-pink-900/90 space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing.amount[langKey]} {ing.name[langKey]}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-pink-900 mb-2">{t('preparationMethod')}</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm sm:text-base text-pink-900/90">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step[langKey]}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const MenuCard: React.FC<MenuCardProps> = ({ menu, onAddToShoppingList }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';
  const [activeTab, setActiveTab] = useState<Course>('appetizer');

  const activeRecipe = menu[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto space-y-6"
    >
      <GlassCard className="p-0 overflow-hidden">
        <div className="relative aspect-video sm:aspect-[2.5/1] w-full">
            {menu.imageUrl ? (
              <img src={menu.imageUrl} alt={menu.occasion[langKey]} className="absolute inset-0 w-full h-full object-cover"/>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-400 to-orange-300"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
               <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-shadow-lg mb-2">{menu.occasion[langKey]}</h1>
               <p className="text-md sm:text-lg text-white/90 italic max-w-3xl text-shadow">{t('tagline')}</p>
            </div>
          </div>
      </GlassCard>

      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4 mb-6">
            <div className="flex justify-center items-center gap-1 sm:gap-4 flex-grow w-full sm:w-auto">
                <TabButton active={activeTab === 'appetizer'} onClick={() => setActiveTab('appetizer')}>
                    <ChefHat size={18} /> {t('appetizer')}
                </TabButton>
                <TabButton active={activeTab === 'mainCourse'} onClick={() => setActiveTab('mainCourse')}>
                    <ChefHat size={18} /> {t('mainCourse')}
                </TabButton>
                <TabButton active={activeTab === 'dessert'} onClick={() => setActiveTab('dessert')}>
                    <ChefHat size={18} /> {t('dessert')}
                </TabButton>
            </div>
            <motion.button
              onClick={() => onAddToShoppingList(menu)}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-pink-500/80 text-white text-sm font-semibold hover:bg-pink-500 transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <ListPlus className="w-4 h-4" /> {t('addAllToShoppingList')}
            </motion.button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-4 text-center">{activeRecipe.recipeName[langKey]}</h2>
            <RecipeDetailView recipe={activeRecipe} langKey={langKey} />
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

export default MenuCard;
