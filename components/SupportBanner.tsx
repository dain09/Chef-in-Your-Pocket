// NOTE: This component is unused and can be safely removed. 
// The solidarity message has been permanently integrated into the `Footer.tsx` component.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '../hooks/useLocalStorage';
import GlassCard from './GlassCard';
import { X } from 'lucide-react';
import { audioService } from '../services/audioService';

const SupportBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useLocalStorage('support-banner-dismissed-v1', false);

  const handleDismiss = () => {
    audioService.playPop();
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-20 p-2 sm:p-4 flex justify-center"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          <GlassCard className="p-2 sm:p-3 flex items-center gap-4 w-full max-w-md">
            <p className="flex-grow text-center text-sm sm:text-base text-pink-900/90 font-semibold">
              {t('banner.solidarityMessage')}
            </p>
            <button
              onClick={handleDismiss}
              className="p-1 text-pink-900/50 hover:text-pink-900"
              aria-label={t('banner.dismiss')}
            >
              <X size={18} />
            </button>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportBanner;
