import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { audioService } from '../services/audioService';
import { useToast } from '../contexts/ToastContext';

interface ShoppingListProps {
  items: string[];
  onClear: () => void;
  onUpdateItems: (items: string[]) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onClear, onUpdateItems }) => {
  const { i18n, t } = useTranslation();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  // Reset checked state if the main list is cleared
  useEffect(() => {
    if (items.length === 0) {
        setCheckedItems([]);
    }
  }, [items]);

  if (items.length === 0 && isOpen) {
      setIsOpen(false);
  }
  if (items.length === 0) return null;


  const handleToggleChecked = (item: string) => {
    setCheckedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };
  
  const handleClearChecked = () => {
    audioService.playPop();
    onUpdateItems(items.filter(item => !checkedItems.includes(item)));
    setCheckedItems([]);
  };
  
  const handleClearAll = () => {
    onClear();
    addToast(t('toastShoppingListCleared'), 'info');
  };

  const positionClasses = i18n.dir() === 'rtl' 
    ? 'fixed bottom-6 right-6 z-30'
    : 'fixed bottom-6 left-6 z-30';
  
  const modalPositionClasses = i18n.dir() === 'rtl'
    ? 'fixed bottom-24 right-6 z-20'
    : 'fixed bottom-24 left-6 z-20';

  return (
    <>
      {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
      <motion.button
        className={`${positionClasses} w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-black/30`}
        onClick={() => { audioService.playPop(); setIsOpen(!isOpen); }}
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        animate={{ scale: isOpen ? 0.9 : 1 }}
      >
        <AnimatePresence>
            {isOpen ? (
                // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                <motion.div key="close" initial={{ rotate: -90, opacity: 0}} animate={{ rotate: 0, opacity: 1}} exit={{ rotate: 90, opacity: 0}}>
                    <X size={28} />
                </motion.div>
            ) : (
                 // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                 <motion.div key="cart" initial={{ rotate: -90, opacity: 0}} animate={{ rotate: 0, opacity: 1}} exit={{ rotate: 90, opacity: 0}}>
                    <ShoppingCart size={28} />
                </motion.div>
            )}
        </AnimatePresence>
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-gray-800">
            {items.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className={modalPositionClasses}
          >
            <GlassCard className="p-4 w-[85vw] sm:w-80 max-h-96 flex flex-col !bg-[#102a2a]/95">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-400/30">
                 <h3 className="text-lg font-bold text-amber-300">{t('shoppingList')}</h3>
                 <button onClick={handleClearAll} className="text-red-500 hover:text-red-400 p-1" aria-label={t('clearAll')}>
                    <Trash2 size={18} />
                 </button>
              </div>
             
              <ul className="space-y-2 overflow-y-auto flex-grow p-1">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`item-${index}`}
                      checked={checkedItems.includes(item)}
                      onChange={() => handleToggleChecked(item)}
                      className="w-5 h-5 bg-black/20 border-amber-400/40 rounded text-amber-400 focus:ring-amber-500/50 focus:ring-2"
                    />
                    <label htmlFor={`item-${index}`} className={`flex-grow text-stone-100/90 transition-colors ${checkedItems.includes(item) ? 'line-through text-stone-100/50' : ''}`}>
                        {item}
                    </label>
                  </li>
                ))}
              </ul>
               {checkedItems.length > 0 && (
                 // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                 <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleClearChecked}
                    className="mt-2 w-full text-center py-2 text-sm bg-red-500/50 text-white rounded-lg hover:bg-red-500/70"
                 >
                    {t('clearChecked')} ( {checkedItems.length} )
                 </motion.button>
               )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShoppingList;