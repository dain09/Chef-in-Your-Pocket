import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { BarChart2 } from 'lucide-react';
import type { FlavorProfileData } from '../types';

interface FlavorProfileProps {
    data: FlavorProfileData;
}

// This is a placeholder component for a feature that is not yet fully implemented.
const FlavorProfile: React.FC<FlavorProfileProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <GlassCard className="p-6">
       <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
            <BarChart2 /> {t('Flavor Profile')}
       </h3>
       <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                    <span className="w-20 capitalize text-stone-100/80">{key}</span>
                    <div className="w-full bg-black/20 rounded-full h-4">
                        <div 
                            className="bg-gradient-to-r from-teal-400 to-cyan-500 h-4 rounded-full"
                            style={{ width: `${value}%`}}
                        />
                    </div>
                </div>
            ))}
       </div>
    </GlassCard>
  );
};

export default FlavorProfile;
