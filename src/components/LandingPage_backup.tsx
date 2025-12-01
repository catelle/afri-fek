'use client';

import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { useAITranslation } from '@/hooks/useAITranslation';
import { useLandingData } from '@/hooks/useLandingData';
import { getCountries } from '@/utils/statsCalculator';
import { useStatsData } from '@/hooks/useStatsData';
import { VisionSection } from './landing/VisionSection';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { ScientistsSection } from './landing/ScientistsSection';
import { LandingStyles } from './landing/LandingStyles';
import { LogoCarousel } from './logo-carroussel';
import { StatsSection } from './stats-section';
import { Herosection } from './Herosection';
import { AboutSection } from './about-section';
import { FeaturesSection } from './features-section';
import { BlogSection } from './blog-section';
import { ContactSection } from './contact-section';
import { TeamSection } from './team-section';
import Footer from './Footer';

interface LandingPageProps {
  resources: any[];
  language: 'fr' | 'en';
  t: any;
  onNavigateToJournals?: () => void;
  onSearchSelect?: (searchTerm: string) => void;
}

const LandingPageBackup = memo(function LandingPageBackup({ resources, language, t, onNavigateToJournals, onSearchSelect }: LandingPageProps) {
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
      <Herosection
        onNavigateToJournals={onNavigateToJournals}
        onSearchSelect={onSearchSelect}
      />
      <BlogSection/>
      <LogoCarousel />
      <StatsSection/>
      {/* <StatsSection stats={stats} /> */}
      <AboutSection/>
      <FeaturesSection />
      <ContactSection/>
      <TeamSection/>
      

      {/* <VisionSection 
        visionTitle={translatedContent.visionTitle}
        visionTexts={translatedContent.visionTexts}
        countries={countries}
        resources={resources}
      />

      <TestimonialsSection />

      <ScientistsSection quotes={landingContent.quotes} />
      
      <LandingStyles /> */}
    </div>
  );
});

export default LandingPageBackup;