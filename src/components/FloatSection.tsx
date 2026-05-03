import React, { useState, useEffect } from 'react';
import { BitGrid } from './BitGrid';
import { float32ToBinary, binaryToFloat32, float64ToBinary, binaryToFloat64, formatHex } from '@/src/lib/binaryUtils';
import { Cpu, Variable, Calculator, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../lib/i18n';

interface FloatSectionProps {
  lang: Language;
}

export const FloatSection: React.FC<FloatSectionProps> = ({ lang }) => {
  const t = translations[lang].float;
  const t_bits = translations[lang].bits;
  const [isDouble, setIsDouble] = useState(false);
  const size = isDouble ? 64 : 32;
  const [bits, setBits] = useState<number[]>(new Array(size).fill(0));
  const [inputValue, setInputValue] = useState<string>("0");

  useEffect(() => {
    setBits(new Array(size).fill(0));
    setInputValue("0");
  }, [isDouble, size]);

  const toggleBit = (idx: number) => {
    const newBits = [...bits];
    newBits[idx] = newBits[idx] === 0 ? 1 : 0;
    setBits(newBits);
    
    const val = isDouble ? binaryToFloat64(newBits) : binaryToFloat32(newBits);
    setInputValue(val.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setBits(isDouble ? float64ToBinary(val) : float32ToBinary(val));
    }
  };

  const currentVal = isDouble ? binaryToFloat64(bits) : binaryToFloat32(bits);
  
  // IEEE 754 Parts
  const expSize = isDouble ? 11 : 8;
  const mantSize = isDouble ? 52 : 23;
  const bias = isDouble ? 1023 : 127;

  const sign = bits[0];
  const exponentBits = bits.slice(1, 1 + expSize);
  const mantissaBits = bits.slice(1 + expSize);

  const exponentValue = parseInt(exponentBits.join(''), 2);
  const mantissaValue = binaryToFraction(mantissaBits);

  function binaryToFraction(bits: number[]) {
    let fraction = 0;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] === 1) {
        fraction += Math.pow(2, -(i + 1));
      }
    }
    return fraction;
  }

  const colors: { [key: number]: string } = { 0: "bg-red-500" };
  for (let i = 1; i <= expSize; i++) colors[i] = "bg-amber-500";
  for (let i = 1 + expSize; i < size; i++) colors[i] = "bg-emerald-500";

  const labels: { [key: number]: string } = { 
    0: t_bits.sign,
    1: t_bits.exponent,
    [1 + expSize]: t_bits.mantissa
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="immersive-card p-6 space-y-6">
          <div className="space-y-4">
            <div className="immersive-section-title">
              <Cpu className="w-4 h-4 text-[var(--exp-color)]" />
              {t.precision}
            </div>
            
            <div className="flex gap-2">
              {[false, true].map((b) => (
                <button
                  key={b.toString()}
                  onClick={() => setIsDouble(b)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                    isDouble === b 
                      ? "border-[var(--accent)] bg-[var(--accent-dim)]" 
                      : "border-transparent bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className={`text-sm font-bold uppercase ${isDouble === b ? "text-[var(--accent)]" : "text-gray-500"}`}>
                    {b ? t.double : t.float}
                  </span>
                  <span className="text-[9px] font-mono opacity-50">
                    {b ? "64-BIT" : "32-BIT"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <div className="bg-black/40 p-4 rounded-lg border border-[var(--border-color)]">
              <div className="text-[9px] text-gray-600 uppercase font-mono mb-2 tracking-widest">{t.cDecl}</div>
              <code className="text-[var(--accent)] font-mono text-xs break-all">
                {isDouble ? 'double' : 'float'} val = {currentVal};
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
                  placeholder="Enter float..."
                />
                <Variable className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Formula Explorer */}
        <div className="immersive-card p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-6">
            <div className="immersive-section-title">
              <Calculator className="w-4 h-4 text-[var(--man-color)]" />
              {t.formula}
            </div>
            
            <div className="bg-black/40 p-4 rounded border border-[var(--border-color)] font-mono relative overflow-hidden">
              <div className="text-center text-lg leading-relaxed relative z-10">
                (-1)<sup className="text-[var(--signed-color)]">{sign}</sup> × 2<sup className="text-[var(--exp-color)]">{exponentValue} - {bias}</sup> × (1 + <span className="text-[var(--man-color)] text-sm">{mantissaValue.toFixed(6)}</span>)
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-[10px]">
              <div className="flex justify-between p-2 bg-white/5 rounded border-l-2 border-[var(--signed-color)]">
                <span className="opacity-40">{t.signComp}:</span>
                <span className="text-[var(--signed-color)] uppercase">{sign === 0 ? (lang === 'zh' ? '正 (0)' : 'Positive (0)') : (lang === 'zh' ? '负 (1)' : 'Negative (1)')}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded border-l-2 border-[var(--exp-color)]">
                <span className="opacity-40">{t.expOffset}:</span>
                <span className="text-[var(--exp-color)] uppercase">{exponentValue} ({lang === 'zh' ? '实际' : 'Actual'}: {exponentValue - bias})</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded border-l-2 border-[var(--man-color)]">
                <span className="opacity-40">{t.fraction}:</span>
                <span className="text-[var(--man-color)] truncate ml-4 font-bold">1.{mantissaBits.join('').slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
             <div className="immersive-label opacity-40 text-center">{t.result}</div>
             <div className="text-3xl font-bold tracking-tighter text-white text-center truncate px-2">
                {currentVal}
             </div>
          </div>
        </div>
      </div>

      <div className="immersive-card p-8">
        <BitGrid 
          title={`${isDouble ? t.double : t.float} ${t.mapping}`}
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

