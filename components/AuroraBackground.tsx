import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Soup, UtensilsCrossed } from 'lucide-react';
import { audioService } from '../services/audioService';

interface AuroraBackgroundProps {
    colorOverlay?: string | null;
}

const iconTypes = [
    { Component: UtensilsCrossed, baseSize: 32 },
    { Component: Soup, baseSize: 28 },
    { Component: Utensils, baseSize: 36 },
];

// Helper to generate a single icon's properties
const generateIconProps = (id: number) => {
    const type = iconTypes[id % iconTypes.length];
    const size = type.baseSize + Math.random() * 12 - 6; // +/- 6px variance
    return {
        id,
        Component: type.Component,
        top: `${5 + Math.random() * 90}%`,
        left: `${5 + Math.random() * 90}%`,
        width: `${size}px`,
        height: `${size}px`,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        rotate: Math.random() * 360,
    };
};


const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ colorOverlay }) => {
    // Increase number of icons and manage them in state
    const [icons, setIcons] = useState(() =>
        Array.from({ length: 30 }).map((_, i) => generateIconProps(i))
    );

    // Handle interaction to make icons "jump"
    const handleInteraction = (id: number) => {
        audioService.playPop();
        setIcons(currentIcons =>
            currentIcons.map(icon =>
                icon.id === id ? generateIconProps(id) : icon
            )
        );
    };

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden animated-gradient">
      
      {/* Floating Utensils Layer */}
      <div className="absolute inset-0">
        {icons.map(icon => (
          <motion.div
            key={icon.id}
            className="absolute text-white/30 cursor-pointer"
            // Animate position, rotation for the "jump" and x/y for the drift
            animate={{
                top: icon.top,
                left: icon.left,
                rotate: icon.rotate,
                y: ['0rem', '2rem', '-1.5rem', '1rem', '-2rem', '0rem'],
                x: ['0rem', '-2rem', '1.5rem', '-1rem', '2rem', '0rem'],
            }}
            transition={{
                // Smooth transition for the jump
                top: { duration: 0.7, ease: 'easeOut' },
                left: { duration: 0.7, ease: 'easeOut' },
                rotate: { duration: 0.7, ease: 'easeOut' },
                // Looping transition for the drift
                y: {
                    duration: icon.duration,
                    delay: icon.delay,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                },
                 x: {
                    duration: icon.duration,
                    delay: icon.delay,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                },
            }}
            style={{
                width: icon.width,
                height: icon.height,
            }}
            // Trigger jump on hover or tap
            onHoverStart={() => handleInteraction(icon.id)}
            onTap={() => handleInteraction(icon.id)}
          >
            <icon.Component style={{ width: '100%', height: '100%' }} />
          </motion.div>
        ))}
      </div>
       
       <AnimatePresence>
        {colorOverlay && (
             <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: colorOverlay }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4, transition: { duration: 1, ease: 'easeInOut' } }}
                exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
            />
        )}
       </AnimatePresence>
    </div>
  );
};

export default AuroraBackground;