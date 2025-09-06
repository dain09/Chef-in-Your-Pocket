import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { GraduationCap } from 'lucide-react';

// This is a placeholder component for a feature that is not yet fully implemented.
const ChefsAcademy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <GlassCard className="p-6">
      <div className="text-center">
        <GraduationCap size={48} className="mx-auto text-amber-400" />
        <h2 className="mt-4 text-2xl font-bold text-stone-100">{t('Chef\'s Academy')}</h2>
        <p className="mt-2 text-stone-100/70">{t('Coming soon! Sharpen your culinary skills with guided lessons.')}</p>
      </div>
    </GlassCard>
  );
};

export default ChefsAcademy;
