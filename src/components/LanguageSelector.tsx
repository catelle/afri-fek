'use client';

import { useState, useEffect } from 'react';
import { Globe, X } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageSelect: (lang: string) => void;
}

export default function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('user-language-selected');
    if (!hasSelectedLanguage) {
      setTimeout(() => setShowModal(true), 2000);
    }
  }, []);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleLanguageSelect = (langCode: string) => {
    localStorage.setItem('user-language-selected', 'true');
    localStorage.setItem('user-language', langCode);
    setShowModal(false);
    onLanguageSelect(langCode);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Choose Language</h2>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('user-language-selected', 'true');
                setShowModal(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            Select your preferred language for the best experience
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 text-left"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-gray-800">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}