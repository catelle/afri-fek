'use client';

interface SimpleNavbarProps {
  onBack?: () => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}

export default function SimpleNavbar({ onBack, language, setLanguage }: SimpleNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-700 md:border-b z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        
        {/* Left side: Logo + Text */}
        <div className="flex items-center gap-2">
          <img
            src="/logo-afrimvoe3.png"
            alt="Logo Afri-fek"
            className="h-8 w-8 drop-shadow-sm hover:scale-105 transition-transform duration-300"
          />
          <span className="text-white font-bold">Afri-Fek</span>
        </div>

        {/* Right side: Language switcher and back button */}
        <div className="flex items-center gap-4">
          {/* Language Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs transition ${
                language === 'fr' ? 'text-amber-500 font-semibold' : 'text-white/70 hover:text-orange-300'
              }`}
            >
              FR
            </button>
            <span className="text-white/50">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs transition ${
                language === 'en' ? 'text-amber-500 font-semibold' : 'text-white/70 hover:text-orange-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="text-orange-500 hover:text-orange-600 hidden md:block text-sm"
            >
              Retour
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}