'use client';

import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { useAITranslation } from '@/hooks/useAITranslation';
import { useLandingData } from '@/hooks/useLandingData';
import { getCountries } from '@/utils/statsCalculator';
import { useStatsData } from '@/hooks/useStatsData';
import { HeroSection } from './landing/HeroSection';
import { StatsSection } from './landing/StatsSection';
import { VisionSection } from './landing/VisionSection';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { ScientistsSection } from './landing/ScientistsSection';
import { LandingStyles } from './landing/LandingStyles';

interface LandingPageProps {
  resources: any[];
  language: 'fr' | 'en';
  t: any;
  onNavigateToJournals?: () => void;
}

const LandingPageBackup = memo(function LandingPageBackup({ resources, language, t, onNavigateToJournals }: LandingPageProps) {
  const { translateText, userLanguage } = useAITranslation();
  const { images, landingContent } = useLandingData(language, t);
  const stats = useStatsData();
  
  const [countries, setCountries] = useState<any[]>([]);
  const [translatedContent, setTranslatedContent] = useState(landingContent);

  useEffect(() => {
    const id = setTimeout(() => {
      setCountries(getCountries(resources));
    }, 0);
    return () => clearTimeout(id);
  }, [resources]);

  useEffect(() => {
    const translateContent = async () => {
      if (userLanguage && userLanguage !== 'fr') {
        const [
          translatedHeroTitle,
          translatedHeroSubtitle,
          translatedVisionTitle,
          ...translatedVisionTexts
        ] = await Promise.all([
          translateText(landingContent.heroTitle, userLanguage),
          translateText(landingContent.heroSubtitle, userLanguage),
          translateText(landingContent.visionTitle, userLanguage),
          ...landingContent.visionTexts.map((text: string) => translateText(text, userLanguage))
        ]);

        setTranslatedContent({
          ...landingContent,
          heroTitle: translatedHeroTitle,
          heroSubtitle: translatedHeroSubtitle,
          visionTitle: translatedVisionTitle,
          visionTexts: translatedVisionTexts,
        });
      } else {
        setTranslatedContent(landingContent);
      }
    };

    translateContent();
  }, [userLanguage, landingContent, translateText]);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        images={images}
        heroTitle={translatedContent.heroTitle}
        heroSubtitle={translatedContent.heroSubtitle}
        onNavigateToJournals={onNavigateToJournals}
      />

      <StatsSection stats={stats} />

      <VisionSection 
        visionTitle={translatedContent.visionTitle}
        visionTexts={translatedContent.visionTexts}
        countries={countries}
        resources={resources}
      />

      <TestimonialsSection />

      <ScientistsSection quotes={landingContent.quotes} />
      
      <LandingStyles />
    </div>
  );
});

export default LandingPageBackup;