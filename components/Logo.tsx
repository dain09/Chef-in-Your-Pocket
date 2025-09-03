import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChefHat } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  // Using the ChefHat icon component directly allows for dynamic styling via className.
  return (
    // FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors.
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      aria-label={`${t('appName')} logo`}
      className={className} // Pass className to the motion.div wrapper
    >
        <ChefHat className="w-full h-full" /> 
    </motion.div>
  );
};

export default memo(Logo);