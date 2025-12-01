'use client';

import { BookOpen, GraduationCap, Building2, Menu, X, Mail } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import LanguageDropdown from './LanguageDropdown';


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
  onLanguageChange?: (lang: string) => void;
}

export default function Navbar({ resources = [], tab, setTab, language, setLanguage, t, search, setSearch, setShowSubmit, showStatistics, setShowStatistics, onContactClick, onLanguageChange }: NavbarProps) {
  const [open, setOpen] = useState(false);
  
  const handleLanguageChange = (newLang: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const tabs = [
    { id: "all", label: t[language].tabs.all },
    { id: "article", label: t[language].tabs.articles, icon: BookOpen },
    { id: "Journal", label: t[language].tabs.journals, icon: BookOpen },
    { id: "academy", label: t[language].tabs.academies, icon: GraduationCap },
    { id: "institution", label: t[language].tabs.institutions, icon: Building2 },
    { id: "blog", label: t[language].tabs.blogs, icon: BookOpen },
  ];

  const langs: ("fr" | "en")[] = ["fr", "en"];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
     
<nav className="bg-white md:bg-gray-700 md:border-b">
        <div className="max-w-8xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Left side: Logo + Tabs */}
        <div className="flex items-center gap-2 text-white font-bold">
          <div className="flex items-center gap-2 md:hidden">
<span className="text-amber-600 md:text-white text-lg md:text-2xl font-bold">Afri-Fek</span>
            <img
              src="/logo-afri-removebg-preview.png"
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

        {/* Right side: Language + Contact (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageDropdown 
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
                
        <button
  type="button"
  onClick={onContactClick}
  className="bg-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
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
              <div className="mt-6 border-t border-gray-600 pt-4 space-y-4">
                <div className="animate-bounce">
                  <LanguageSelector 
                    onLanguageSelect={(lang) => {
                      handleLanguageChange(lang);
                      setOpen(false);
                    }}
                  />
                </div>
              <button
  type="button"
  onClick={onContactClick}
  className="bg-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
>
  <Mail className="w-4 h-4" />
  Contact
</button>

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