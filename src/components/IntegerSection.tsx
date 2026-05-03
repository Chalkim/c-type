import React, { useState, useEffect } from 'react';
import { BitGrid } from './BitGrid';
import { bigIntToBinary, binaryToBigInt, getSignedValue, formatHex } from '@/src/lib/binaryUtils';
import { Hash, Binary, Ruler, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';

interface IntegerSectionProps {
  lang: Language;
}

export const IntegerSection: React.FC<IntegerSectionProps> = ({ lang }) => {
  const t = translations[lang].integer;
  const t_bits = translations[lang].bits;
  const [signed, setSigned] = useState(true);
  const [size, setSize] = useState<8 | 16 | 32 | 64>(32);
  const [bits, setBits] = useState<number[]>(new Array(32).fill(0));
  const [inputValue, setInputValue] = useState<string>("0");

  useEffect(() => {
    setBits(new Array(size).fill(0));
    setInputValue("0");
  }, [size]);

  const toggleBit = (idx: number) => {
    const newBits = [...bits];
    newBits[idx] = newBits[idx] === 0 ? 1 : 0;
    setBits(newBits);
    
    // Update input value
    if (signed) {
      setInputValue(getSignedValue(newBits).toString());
    } else {
      setInputValue(binaryToBigInt(newBits).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    try {
      const val = BigInt(e.target.value);
      setBits(bigIntToBinary(val, size));
    } catch {
      // Ignore invalid bigint input
    }
  };

  const currentVal = signed ? getSignedValue(bits) : binaryToBigInt(bits);
  
  const typeName = `${size === 8 ? 'char' : size === 16 ? 'short' : size === 32 ? 'int' : 'long long'}`;
  const fullType = `${signed ? '' : 'unsigned '}${typeName}`;

  const colors = {
    0: signed ? "bg-red-500" : "bg-indigo-500"
  };

  const labels = signed ? { 0: t_bits.sign } : {};

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="immersive-card p-6 space-y-6">
          <div className="space-y-4">
            <div className="immersive-section-title">
              <Ruler className="w-4 h-4 text-[var(--accent)]" />
              {t.config}
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={signed} 
                    onChange={(e) => setSigned(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-white/5 border border-[var(--border-color)] rounded-full peer-checked:bg-[var(--accent-dim)] peer-checked:border-[var(--accent)] transition-all" />
                  <div className="absolute top-1 left-1 w-3 h-3 bg-gray-500 rounded-full peer-checked:translate-x-5 peer-checked:bg-[var(--accent)] transition-all" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">{t.signedMode}</span>
              </label>

              <div className="flex items-center gap-1.5 ml-auto">
                {[8, 16, 32, 64].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s as any)}
                    className={`w-12 py-1 rounded text-[10px] font-bold border transition-all ${
                      size === s 
                        ? "bg-[var(--accent)] border-[var(--accent)] text-black shadow-[0_0_10px_var(--accent-dim)]" 
                        : "bg-white/5 border-[var(--border-color)] text-gray-500 hover:border-gray-600"
                    }`}
                  >
                    {s}BIT
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <div className="bg-black/40 p-4 rounded-lg border border-[var(--border-color)]">
              <div className="text-[9px] text-gray-600 uppercase font-mono mb-2 tracking-widest">{t.cDecl}</div>
              <code className="text-[var(--accent)] font-mono text-xs break-all">
                {fullType} val = {currentVal.toString()};
              </code>
            </div>
            
            <div className="space-y-2">
              <label className="immersive-label opacity-60">{t.decimalInput}</label>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/40 border border-[var(--border-color)] rounded-lg focus:border-[var(--accent)] outline-none font-mono text-sm text-white transition-all shadow-inner"
                  placeholder="Enter decimal..."
                />
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Value Preview */}
        <div className="immersive-card p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="immersive-section-title">
              <Binary className="w-4 h-4 text-[var(--accent)]" />
              {t.numericResult}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2 overflow-hidden">
                <span className="immersive-label opacity-40">{t.decInt}</span>
                <div className="text-2xl font-bold tracking-tighter text-white truncate" title={currentVal.toString()}>
                  {currentVal.toString()}
                </div>
              </div>
              <div className="space-y-2 overflow-hidden">
                <span className="immersive-label opacity-40">{t.hexBuffer}</span>
                <div className="text-xl font-bold tracking-tighter text-[var(--accent)] break-all">{formatHex(bits)}</div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
               <span className="immersive-label opacity-40">{t.limit}</span>
               <div className="flex gap-2">
                 <div className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-[var(--border-color)]">
                   MIN: {signed ? (-(2n ** BigInt(size - 1))).toString() : "0"}
                 </div>
                 <div className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-[var(--border-color)]">
                   MAX: {signed ? (2n ** BigInt(size - 1) - 1n).toString() : (2n ** BigInt(size) - 1n).toString()}
                 </div>
               </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[var(--accent-dim)] rounded-lg border border-[var(--accent)]/30 flex items-start gap-3">
            <Info className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-[var(--accent)] leading-relaxed opacity-80 font-bold uppercase tracking-tight">
              {signed ? t.signedNote : t.unsignedNote}
            </p>
          </div>
        </div>
      </div>

      <div className="immersive-card p-8">
        <BitGrid 
          title={t.bitstream}
          bits={bits} 
          onToggle={toggleBit} 
          groupsOf={8}
          colors={colors}
          labels={labels}
        />
      </div>
    </div>
  );
};

