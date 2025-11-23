import { lazy, Suspense } from 'react';

const LandingPageBackup = lazy(() => import('../LandingPage_backup'));

interface LazyLandingPageProps {
  resources: any[];
  language: 'fr' | 'en';
  t: any;
  onNavigateToJournals: () => void;
}

export const LazyLandingPage = (props: LazyLandingPageProps) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <LandingPageBackup {...props} />
    </Suspense>
  );
};