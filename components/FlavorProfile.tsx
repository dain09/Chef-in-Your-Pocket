import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { FlavorProfileData } from '../types';

interface FlavorProfileProps {
    data: FlavorProfileData;
}

const RadarChart: React.FC<{ data: FlavorProfileData }> = ({ data }) => {
    const { t } = useTranslation();
    const size = 200;
    const center = size / 2;
    const labels = ['sweet', 'salty', 'sour', 'bitter', 'umami'] as const;
    const numAxes = labels.length;

    const getPoint = (value: number, index: number): { x: number; y: number } => {
        const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
        const radius = (value / 100) * (center * 0.8);
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    };

    const points = labels.map((label, i) => getPoint(data[label], i));
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

    return (
        <div className="relative w-full max-w-[200px] aspect-square mx-auto">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                {/* Concentric circles (grid) */}
                {[...Array(4)].map((_, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={(center * 0.8 * (i + 1)) / 4}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                    />
                ))}
                
                {/* Axes lines */}
                {labels.map((_, i) => {
                    const endPoint = getPoint(100, i);
                    return <line key={i} x1={center} y1={center} x2={endPoint.x} y2={endPoint.y} stroke="rgba(255, 255, 255, 0.1)" />;
                })}

                {/* Data shape */}
                {/* FIX: Corrected the JSX syntax for the motion component. The previous syntax was invalid and caused parsing errors. */}
                <motion.path
                    d={pathData}
                    fill="rgba(251, 191, 36, 0.4)"
                    stroke="rgb(251, 191, 36)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </svg>
            {/* Labels */}
            {labels.map((label, i) => {
                const { x, y } = getPoint(120, i); // Position labels slightly outside the chart
                return (
                    <div
                        key={label}
                        className="absolute text-xs text-stone-100/80"
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {t(`flavors.${label}`)}
                    </div>
                );
            })}
        </div>
    );
};


const FlavorProfile: React.FC<FlavorProfileProps> = ({ data }) => {
  return (
    <div className="w-full">
       <RadarChart data={data} />
    </div>
  );
};

export default FlavorProfile;