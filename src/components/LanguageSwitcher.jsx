import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' },
    { code: 'om', name: 'Afan Oromo', flag: '🇪🇹' },
    { code: 'ti', name: 'Tigrinya', flag: '🇪🇹' },
    { code: 'so', name: 'Somali', flag: '🇸🇴' },
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/5 border border-portal-border hover:bg-white/10 transition-all flex items-center gap-2 group"
        title="Switch Language"
      >
        <Languages className="w-5 h-5 text-portal-accent group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold text-portal-text-muted hidden sm:block uppercase tracking-wider">
          {currentLanguage.code}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-48 bg-portal-card border border-portal-border rounded-2xl shadow-2xl z-[100] p-2 backdrop-blur-xl"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-portal-text-muted px-3 py-2">
              Select Language
            </div>
            <div className="space-y-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    i18n.changeLanguage(l.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    i18n.language === l.code 
                      ? 'bg-portal-accent/10 text-portal-accent' 
                      : 'hover:bg-white/5 text-portal-text-muted hover:text-portal-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{l.flag}</span>
                    <span className="font-semibold">{l.name}</span>
                  </div>
                  {i18n.language === l.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
