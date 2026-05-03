import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface BitGridProps {
  bits: number[];
  onToggle: (index: number) => void;
  groupsOf?: number;
  labels?: { [key: number]: string };
  colors?: { [key: number]: string };
  title?: string;
  className?: string;
}

export const BitGrid: React.FC<BitGridProps> = ({ 
  bits, 
  onToggle, 
  groupsOf = 8, 
  labels,
  colors,
  title,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <div className="immersive-section-title">
          {title} <span className="opacity-40 ml-2">[{bits.length} BITS]</span>
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: Math.ceil(bits.length / groupsOf) }).map((_, gIdx) => (
          <div key={gIdx} className="grid grid-cols-8 gap-2 bg-black/20 p-3 rounded-lg border border-[var(--border-color)]">
            {bits.slice(gIdx * groupsOf, (gIdx + 1) * groupsOf).map((bit, bIdx) => {
              const actualIdx = gIdx * groupsOf + bIdx;
              
              // Custom colors mapping to theme variables
              let activeColorClass = "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-dim)]";
              if (colors?.[actualIdx]) {
                if (colors[actualIdx].includes("red")) activeColorClass = "bg-[var(--signed-color)] text-white shadow-[0_0_15px_rgba(255,77,77,0.3)]";
                else if (colors[actualIdx].includes("amber")) activeColorClass = "bg-[var(--exp-color)] text-black shadow-[0_0_15px_rgba(255,204,0,0.3)]";
                else if (colors[actualIdx].includes("emerald")) activeColorClass = "bg-[var(--man-color)] text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]";
              }
              
              return (
                <div key={actualIdx} className="flex flex-col items-center gap-1.5 min-w-[36px]">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggle(actualIdx)}
                    className={cn(
                      "w-10 h-10 rounded border transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden group",
                      bit === 1 
                        ? activeColorClass 
                        : "bg-black/40 border-[var(--border-color)] text-gray-500 hover:border-gray-600"
                    )}
                  >
                    <span className="text-sm font-bold z-10">{bit}</span>
                    <span className="text-[7px] absolute bottom-1 opacity-40 font-mono">
                      {bits.length - 1 - actualIdx}
                    </span>
                  </motion.button>
                  {labels?.[actualIdx] && (
                    <span className="text-[7px] font-mono text-[var(--accent)] uppercase tracking-tighter text-center max-w-[40px] leading-[1]">
                      {labels[actualIdx]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
