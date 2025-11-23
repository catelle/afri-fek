import { useEffect } from 'react';
import FilterBar from '@/components/FilterBar';
import ResourceList from '@/components/ResourceList';
import { LazyLandingPage } from '@/components/landing/LazyLandingPage';
import { ResourceDetailView } from './ResourceDetailView';

interface MainContentProps {
  tab: string;
  approvedResources: any[];
  userLanguage: string;
  t: any;
  onNavigateToJournals: () => void;
  filteredData: any[];
  filterCountry: string | null;
  setFilterCountry: (country: string | null) => void;
  filterLanguage: string | null;
  setFilterLanguage: (language: string | null) => void;
  filterDomain: string | null;
  setFilterDomain: (domain: string | null) => void;
  countries: string[];
  selectedResourceId?: string;
  onBackFromDetail?: () => void;
}

export const MainContent = ({
  tab,
  approvedResources,
  userLanguage,
  t,
  onNavigateToJournals,
  filteredData,
  filterCountry,
  setFilterCountry,
  filterLanguage,
  setFilterLanguage,
  filterDomain,
  setFilterDomain,
  countries,
  selectedResourceId,
  onBackFromDetail
}: MainContentProps) => {
  const language = (["fr", "en"].includes(userLanguage) ? userLanguage : "en") as "fr" | "en";

  return (
    <div className="flex-1 mt-[112px]">
      {selectedResourceId ? (
        <ResourceDetailView
          resourceId={selectedResourceId}
          language={language}
          t={t}
          onBack={onBackFromDetail || (() => {})}
        />
      ) : tab === "all" ? (
        <LazyLandingPage
          resources={approvedResources}
          language={language}
          t={t}
          onNavigateToJournals={onNavigateToJournals}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-10 bg-white">
          <FilterBar
            filterType={null}
            setFilterType={() => {}}
            filterCountry={filterCountry}
            setFilterCountry={setFilterCountry}
            filterLanguage={filterLanguage}
            setFilterLanguage={setFilterLanguage}
            filterDomain={filterDomain}
            setFilterDomain={setFilterDomain}
            countries={countries}
            language={language}
            t={t}
            allResources={filteredData}
          />
          <ResourceList
            resources={filteredData}
            language={language}
            t={t}
          />
        </main>
      )}
    </div>
  );
};