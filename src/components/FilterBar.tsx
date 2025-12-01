'use client';

import { X } from 'lucide-react';
import PrintButton from './PrintButton';

interface FilterBarProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  filterCountry: string | null;
  setFilterCountry: (country: string | null) => void;
  filterLanguage: string | null;
  setFilterLanguage: (language: string | null) => void;
  filterDomain?: string | null;
  setFilterDomain?: (domain: string | null) => void;
  countries: string[];
  language: 'fr' | 'en';
  t: any;
  allResources?: any[];
}

export default function FilterBar({
  filterType,
  setFilterType,
  filterCountry,
  setFilterCountry,
  filterLanguage,
  setFilterLanguage,
  filterDomain,
  setFilterDomain,
  countries,
  language,
  t,
  allResources = []
}: FilterBarProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center mt-[30px]">
      <select
        value={filterType ?? ""}
        onChange={(e) => setFilterType(e.target.value || null)}
        className="border border-gray-300 rounded-md px-4 py-2 text-sm"
      >
        <option value="">{t[language].filters.type}</option>
        <option value="article">Article</option>
        <option value="blog">Blog</option>
        <option value="academy">Académie</option>
        <option value="journal">Journal</option>
      </select>

      <select
        value={filterCountry ?? ""}
        onChange={(e) => setFilterCountry(e.target.value || null)}
        className="border border-gray-300 rounded-md px-4 py-2 text-sm"
      >
        <option value="">Pays</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <select
        value={filterLanguage ?? ""}
        onChange={(e) => setFilterLanguage(e.target.value || null)}
        className="border border-gray-300 rounded-md px-4 py-2 text-sm"
      >
        <option value="">Langue</option>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>

      {setFilterDomain && (
        <select
          value={filterDomain ?? ""}
          onChange={(e) => setFilterDomain(e.target.value || null)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Domaine</option>
          <option value="domain1">Droit, économie, politique</option>
          <option value="domain2">Lettres et sciences humaines</option>
          <option value="domain3">Mathématiques</option>
          <option value="domain4">Sciences physiques</option>
          <option value="domain5">Sciences de la terre et de la vie</option>
          <option value="domain6">Sciences de l'ingénieur</option>
          <option value="domain7">Sciences pharmaceutiques et médicales</option>
        </select>
      )}

      {(filterType || filterCountry || filterLanguage || filterDomain) && (
        <button
          onClick={() => {
            setFilterType(null);
            setFilterCountry(null);
            setFilterLanguage(null);
            setFilterDomain?.(null);
          }}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Effacer les filtres"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <PrintButton 
       
        language={language} 
        t={t} 
      />
    </div>
  );
}