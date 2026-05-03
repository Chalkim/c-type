import React, { useState } from 'react';
import { BitGrid } from './BitGrid';
import { bigIntToBinary, formatHex } from '@/src/lib/binaryUtils';
import { Type, Table as TableIcon, Hash, Binary } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations, Language } from '../lib/i18n';

interface CharSectionProps {
  lang: Language;
}

export const CharSection: React.FC<CharSectionProps> = ({ lang }) => {
  const t = translations[lang].char;
  const [char, setChar] = useState('A');
  const code = char.charCodeAt(0) || 0;
  const bits = bigIntToBinary(BigInt(code), 8);

  const toggleBit = (idx: number) => {
    const newBits = [...bits];
    newBits[idx] = newBits[idx] === 0 ? 1 : 0;
    const newCode = parseInt(newBits.join(''), 2);
    setChar(String.fromCharCode(newCode));
  };

  // Generate full printable ASCII table
  const fullAscii = Array.from({ length: 95 }, (_, i) => {
    const code = i + 32;
    return {
      dec: code,
      char: code === 32 ? 'SPC' : String.fromCharCode(code),
      hex: code.toString(16).toUpperCase().padStart(2, '0')
    };
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input area */}
        <div className="immersive-card p-6 flex flex-col gap-6">
          <div className="space-y-4">
            <div className="immersive-section-title">
              <Type className="w-4 h-4 text-[var(--accent)]" />
              {t.scalar}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative group">
                <input
                  type="text"
                  maxLength={1}
                  value={char === ' ' ? 'SPC' : char}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'SPC') setChar(' ');
                    else if (val.length > 0) setChar(val[val.length - 1]);
                    else setChar('');
                  }}
                  className="w-24 h-24 text-center text-4xl font-bold bg-black/40 border-2 border-[var(--border-color)] rounded-2xl focus:border-[var(--accent)] outline-none text-white transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] px-2 text-[9px] text-gray-500 font-mono border border-[var(--border-color)] rounded uppercase text-center whitespace-nowrap">8-BIT CHAR</span>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-[var(--border-color)]">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{t.decCode}</span>
                  <span className="text-xl font-mono font-bold text-[var(--accent)]">{code}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-[var(--border-color)]">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{t.hexBuffer}</span>
                  <span className="text-xl font-mono font-bold text-[var(--accent)]">{formatHex(bits)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col min-h-0">
             <div className="immersive-section-title">
              <TableIcon className="w-4 h-4 text-emerald-500" />
              {t.asciiSet} (32-126)
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[280px]">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 pt-2">
                {fullAscii.map((item) => (
                  <button
                    key={item.dec}
                    onClick={() => setChar(item.dec === 32 ? ' ' : item.char)}
                    className={cn(
                      "p-1.5 border rounded transition-all flex flex-col items-center gap-0.5",
                      code === item.dec 
                        ? "bg-[var(--accent-dim)] border-[var(--accent)] text-white shadow-[0_0_10px_rgba(0,242,255,0.1)]" 
                        : "bg-white/5 border-[var(--border-color)] text-gray-400 hover:border-gray-500 hover:bg-white/10"
                    )}
                  >
                    <span className={cn("font-bold text-sm", item.dec === 32 ? "text-[10px]" : "text-sm")}>{item.char}</span>
                    <span className="text-[8px] opacity-40 font-mono leading-none">{item.dec}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Binary View */}
        <div className="immersive-card p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
             <Binary className="w-16 h-16 text-[var(--accent)] opacity-20" />
             <h3 className="immersive-label opacity-40 italic">{t.encoding}</h3>
          </div>
          
          <div className="bg-black/20 p-6 rounded-xl border border-[var(--border-color)] relative z-10">
            <BitGrid 
              bits={bits} 
              onToggle={toggleBit} 
              groupsOf={8}
            />
          </div>

          <div className="w-full p-4 bg-[var(--accent-dim)]/50 rounded-xl border border-[var(--accent)]/30 font-mono text-[10px] leading-relaxed text-[var(--accent)] relative z-10 uppercase tracking-tight font-bold">
             {t.info}
          </div>

          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none grid grid-cols-12 gap-1 rotate-45 scale-150">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-sm bg-white" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
