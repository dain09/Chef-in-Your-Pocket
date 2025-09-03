import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X, Check } from 'lucide-react';
import { audioService } from '../services/audioService';

interface PantryCheckModalProps {
  ingredients: string[];
  onConfirm: (availableIngredients: string[]) => void;
  onClose: () => void;
}

const PantryCheckModal: React.FC<PantryCheckModalProps> = ({ ingredients, onConfirm, onClose }) => {
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<string[]>(ingredients);

  const handleToggle = (item: string) => {
    setCheckedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleConfirm = () => {
    audioService.playSuccess();
    onConfirm(checkedItems);
    onClose();
  };

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
            <h3 className="text-xl font-bold text-stone-100">{t('Check Your Pantry')}</h3>
            <p className="text-sm text-stone-100/70">{t('Uncheck any ingredients you don\'t have.')}</p>
        </div>
        
        <ul className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/20 rounded-lg">
          <AnimatePresence>
            {ingredients.map((item, index) => (
              // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                className="flex items-center"
              >
                <label htmlFor={`pantry-item-${index}`} className="flex-grow flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    id={`pantry-item-${index}`}
                    checked={checkedItems.includes(item)}
                    onChange={() => handleToggle(item)}
                    className="w-5 h-5 bg-black/20 border-amber-400/40 rounded text-amber-400 focus:ring-amber-500/50 focus:ring-2"
                  />
                  <span className={`text-stone-100/90 transition-colors ${checkedItems.includes(item) ? '' : 'line-through text-stone-100/50'}`}>
                    {item}
                  </span>
                </label>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
        <motion.button
          onClick={handleConfirm}
          className="w-full py-2 text-lg font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('Confirm Ingredients')}
        </motion.button>
      </GlassCard>
    </motion.div>
  );
};

export default PantryCheckModal;