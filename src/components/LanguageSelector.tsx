import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors">
        {/* <Globe className="text-white/50" size={20} /> */}
        <span className="hidden md:inline text-white/50">
          {languages.find(l => l.code === currentLanguage)?.flag} {currentLanguage.toUpperCase()}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                currentLanguage === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span >{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}