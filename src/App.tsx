import React, { useState } from 'react';
import { IntegerSection } from './components/IntegerSection';
import { FloatSection } from './components/FloatSection';
import { CharSection } from './components/CharSection';
import { Binary, Waves, Type as TypeIcon, Cpu, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from './lib/i18n';

type Section = 'int' | 'float' | 'char';

export default function App() {
  const [activeTab, setActiveTab] = useState<Section>('int');
  const [lang, setLang] = useState<Language>('zh');

  const t = translations[lang];

  const tabs = [
    { id: 'int', icon: Binary, label: t.sidebar.integer, description: t.sidebar.intDesc },
    { id: 'float', icon: Waves, label: t.sidebar.float, description: t.sidebar.floatDesc },
    { id: 'char', icon: TypeIcon, label: t.sidebar.char, description: t.sidebar.charDesc },
  ];

  const toggleLang = () => setLang(l => l === 'en' ? 'zh' : 'en');

  return (
    <div className="flex h-screen w-full bg-[var(--bg-body)] text-[#e0e0e6] overflow-hidden selection:bg-[var(--accent-dim)] selection:text-[var(--accent)] font-mono">
      {/* Sidebar */}
      <aside className="w-[300px] flex-shrink-0 p-6 flex flex-col gap-8 bg-[var(--bg-card)] border-r border-[var(--border-color)] shadow-[inset_-10px_0_40px_rgba(0,0,0,0.5)] overflow-y-auto">
        <div className="brand space-y-1">
          <div className="immersive-label">{t.sidebar.visualizer}</div>
          <div className="immersive-title uppercase tracking-tighter">{t.sidebar.lab}</div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="immersive-section-title">{t.sidebar.baseType}</div>
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Section)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? "bg-[var(--accent-dim)] border-[var(--accent)] text-white shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                      : "bg-white/5 border-transparent hover:bg-white/10 text-gray-400"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[var(--accent)]" : ""}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase">{tab.label}</span>
                    <span className="text-[9px] opacity-50 tracking-wider font-mono">{tab.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="immersive-section-title">{t.sidebar.systemInfo}</div>
            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded border border-[var(--border-color)]">
                <div className="text-[9px] text-gray-500 uppercase mb-1">{t.sidebar.endianness}</div>
                <div className="text-xs">Little Endian (x86_64)</div>
              </div>
              <div className="bg-white/5 p-3 rounded border border-[var(--border-color)] text-right">
                <button 
                  onClick={toggleLang}
                  className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] ml-auto hover:opacity-80 transition-opacity"
                >
                  <Languages className="w-3 h-3" />
                  {lang === 'en' ? '中文' : 'ENGLISH'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-600 border border-white/5">TYPE_MAX</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-600 border border-white/5">TYPE_MIN</span>
          </div>
          <div className="text-[10px] text-gray-500 opacity-30">Visualizer v1.0.5 - Stable</div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto relative flex flex-col gap-8">
        <header className="flex justify-between items-end border-b border-[var(--border-color)] pb-6 mb-2">
          <div>
            <div className="immersive-label">{t.sidebar.lab}</div>
            <div className="immersive-title uppercase">
              {tabs.find(t_item => t_item.id === activeTab)?.label}
            </div>
          </div>
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + lang}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'int' && <IntegerSection lang={lang} />}
              {activeTab === 'float' && <FloatSection lang={lang} />}
              {activeTab === 'char' && <CharSection lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="mt-auto flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-[2px] opacity-40">
           <div>© 2026 {t.footer.visualizer}</div>
           <div>{t.footer.education}</div>
        </footer>
      </main>
    </div>
  );
}


