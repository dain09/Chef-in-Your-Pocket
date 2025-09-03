import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { ChefHat, VenetianMask } from 'lucide-react';

const SkeletonPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-white/10 rounded-md ${className} animate-pulse`}></div>
);

const SkeletonSection: React.FC<{ icon: React.ElementType, lineCount?: number }> = ({ icon: Icon, lineCount = 3 }) => (
    <GlassCard className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center">
            <Icon className="w-6 h-6 text-cyan-300/50 me-3 animate-pulse" />
            <SkeletonPlaceholder className="h-6 w-1/3" />
        </div>
        <div className="space-y-3">
            {Array.from({ length: lineCount }).map((_, i) => (
                 <SkeletonPlaceholder key={i} className={`h-4 ${i === 0 ? 'w-full' : i === 1 ? 'w-5/6' : 'w-3/4'}`} />
            ))}
        </div>
    </GlassCard>
);

const RecipeCardSkeleton: React.FC = () => {
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <SkeletonPlaceholder className="h-10 w-3/4 mx-auto" />
        <SkeletonPlaceholder className="h-5 w-1/2 mx-auto" />
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mt-4">
          <SkeletonPlaceholder className="h-5 w-24" />
          <SkeletonPlaceholder className="h-5 w-24" />
          <SkeletonPlaceholder className="h-5 w-24" />
        </div>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <SkeletonPlaceholder className="h-10 w-40" />
        <SkeletonPlaceholder className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonSection icon={ChefHat} lineCount={4} />
        <SkeletonSection icon={ChefHat} lineCount={4} />
      </div>
      <SkeletonSection icon={ChefHat} lineCount={5} />
      <SkeletonSection icon={VenetianMask} lineCount={6} />
    </motion.div>
  );
};

export default RecipeCardSkeleton;
