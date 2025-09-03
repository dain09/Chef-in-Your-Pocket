import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import type { PantryItem } from '../types';
import { AlertTriangle, ChefHat, Tag } from 'lucide-react';
import { audioService } from '../services/audioService';

interface PantrySpotlightProps {
  pantryItems: PantryItem[];
  onGenerateFromPantry: (ingredients: string[]) => void;
}

const getDaysUntilExpiry = (expiryDate?: string): number => {
    if (!expiryDate) return Infinity;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const PantrySpotlight: React.FC<PantrySpotlightProps> = ({ pantryItems, onGenerateFromPantry }) => {
  const { t } = useTranslation();

  const expiringItems = useMemo(() => {
    return pantryItems
      .filter(item => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return days >= 0 && days <= 7; // Expiring within the next 7 days
      })
      .sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate));
  }, [pantryItems]);

  const handleGenerate = () => {
      audioService.playSwoosh();
      onGenerateFromPantry(expiringItems.map(item => item.name));
  };

  if (expiringItems.length === 0) {
    return null; // Don't render anything if there's nothing to show
  }

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
    >
      <GlassCard className="p-4 sm:p-6 !bg-gradient-to-tr from-amber-500/20 to-orange-500/20 space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-amber-300">
            <AlertTriangle size={40} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-100">{t('pantrySpotlight.title')}</h3>
            <p className="text-sm text-stone-100/80">{t('pantrySpotlight.description')}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
            {expiringItems.map(item => (
                <div key={item.id} className="bg-black/30 rounded-full px-3 py-1 text-sm flex items-center gap-2">
                    <Tag size={14} className="text-amber-400/80"/>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>

        {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
        <motion.button
          onClick={handleGenerate}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-md font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChefHat size={18} /> {t('pantrySpotlight.button')}
        </motion.button>
      </GlassCard>
    </motion.div>
  );
};

export default PantrySpotlight;