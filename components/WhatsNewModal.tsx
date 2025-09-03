import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { X } from 'lucide-react';
import { audioService } from '../services/audioService';
import { changelog } from '../data/changelog';

interface WhatsNewModalProps {
  onClose: () => void;
}

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const langKey = i18n.language.split('-')[0] as 'en' | 'ar';

  const latestChangelog = changelog[0]; // Assuming the latest is always the first item

  const handleClose = () => {
    audioService.playSuccess();
    onClose();
  };

  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassCard
        className="w-full max-w-lg p-6 flex flex-col gap-6 relative !bg-[#102a2a]/95 backdrop-blur-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { type: 'spring' } }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 p-1 text-amber-300/70 hover:text-amber-200 z-20">
          <X size={24} />
        </button>

        <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-300">{latestChangelog.title[langKey]}</h2>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {latestChangelog.features.map((feature, index) => (
                // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
                <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.1 * index } }}
                >
                    <div className="flex-shrink-0 bg-amber-500/20 text-amber-400 rounded-lg p-2 mt-1">
                        <feature.icon size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-300">{feature.title[langKey]}</h3>
                        <p className="text-sm text-stone-100/80">{feature.description[langKey]}</p>
                    </div>
                </motion.div>
            ))}
        </div>
        
        <div className="flex justify-center mt-2">
            {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
            <motion.button
                onClick={handleClose}
                className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {t('whatsNew.continue')}
            </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WhatsNewModal;