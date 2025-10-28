'use client';

import { BookOpen, GraduationCap, Building2, Menu, X, Mail } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import { useAITranslation } from '@/hooks/useAITranslation';

interface NavbarProps {
  tab: string;
  setTab: (tab: string) => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: any;
  search: string;
  setSearch: (search: string) => void;
  setShowSubmit: (show: boolean) => void;
  showStatistics: boolean;
  setShowStatistics: (show: boolean) => void;
  resources?: any[];
  onContactClick?: () => void;
}

export default function Navbar({ resources = [], tab, setTab, language, setLanguage, t, search, setSearch, setShowSubmit, showStatistics, setShowStatistics, onContactClick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { userLanguage, setUserLanguage, translatePageContent, translateResources, isTranslating } = useAITranslation();
  const handleLanguageChange = async (newLang: string) => {
    console.log('Language changed to:', newLang);
    
    const currentLang = document.body.getAttribute('data-translated-lang');
    
    setUserLanguage(newLang);
    
    // Only translate if not already translated to this language
    if (newLang !== 'fr' && currentLang !== newLang) {
      console.log('Starting page translation to', newLang);
      setTimeout(() => {
        translatePageContent();
      }, 100);
    } else if (newLang === 'fr') {
      // Mark as French and reload page to show original content
      document.body.setAttribute('data-translated-lang', 'fr');
      window.location.reload();
    }
    
    // Translate resources
    if (resources.length > 0) {
      console.log('Translating', resources.length, 'resources');
      const translatedResources = await translateResources(resources);
      console.log('Translation completed');
      // setApprovedResources(translatedResources);
    }
  };

  const tabs = [
    { id: "all", label: t[language].tabs.all },
    { id: "article", label: t[language].tabs.articles, icon: BookOpen },
    { id: "journal", label: t[language].tabs.journals, icon: BookOpen },
    { id: "academy", label: t[language].tabs.academies, icon: GraduationCap },
    { id: "institution", label: t[language].tabs.institutions, icon: Building2 },
    { id: "blog", label: t[language].tabs.blogs, icon: BookOpen },
  ];

  const langs: ("fr" | "en")[] = ["fr", "en"];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
     
<nav className="bg-white md:bg-gray-700 md:border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Left side: Logo + Tabs */}
        <div className="flex items-center gap-2 text-white font-bold">
          <div className="flex items-center gap-2 md:hidden">
<span className="text-amber-600 md:text-white text-lg md:text-2xl font-bold">Afri-Fek</span>
            <img
              src="/logo-afrimvoe3.png"
              alt="Logo Afri-fek"
              className="h-8 w-8 drop-shadow-sm hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`py-4 text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  tab === id
                    ? "border-amber-500 text-amber-500"
                    : "border-transparent text-white hover:text-amber-500"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Contact + Language Switcher (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
         
          
          
          {/* <div className="flex items-center gap-2">
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
          </div> */}
           
                  <LanguageSelector 
                    currentLanguage={userLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                  {/* {isTranslating && (
                    <div className="mt-2 text-sm text-orange-600 bg-white px-2 py-1 rounded shadow">
                      Translating to {userLanguage}...
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
                    Current: {userLanguage}
                  </div> */}
               
                
           <button
            type="button"
            onClick={onContactClick}
            className="bg-gray-200 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Mail className="w-4 h-4" />
            Contact
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button  className="md:hidden text-black md:text-white" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-gray-800 w-64 h-full shadow-lg p-4">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white">
              <X size={20} />
            </button>
            <div className="mt-10 flex flex-col gap-4">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setTab(id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm transition ${
                    tab === id
                      ? "bg-amber-500/20 text-amber-500 font-semibold"
                      : "text-white hover:text-amber-500"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </button>
              ))}
              <div className="mt-6 border-t border-gray-600 pt-4">
               
          <button
            type="button"
            onClick={onContactClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Mail className="w-4 h-4" />
            Contact
          </button>
                
                <div className="flex gap-3">
                  {langs.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-sm transition ${
                        language === lang
                          ? "bg-amber-500/20 text-amber-500 font-semibold"
                          : "text-white hover:text-amber-500"
                      }`}
                    >
                      {lang === "fr" ? "Français" : "English"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </nav>
        <Header 
        search={search}
        resources={resources} 
        setSearch={setSearch}
        setShowSubmit={setShowSubmit}
        showStatistics={showStatistics}
        setShowStatistics={setShowStatistics}
        language={language}
        t={t}
        onContactClick={onContactClick}
      />
     
    </div>
  );
}