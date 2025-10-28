import { useAITranslation } from './useAITranslation';

export const useLanguageFallback = () => {
  const { userLanguage, setUserLanguage, translatePageContent, translateResources, isTranslating } = useAITranslation();
  
  // Get UI language with fallback to English for unsupported languages
  const getUILanguage = (): 'fr' | 'en' => {
    return ['fr', 'en'].includes(userLanguage) ? userLanguage as 'fr' | 'en' : 'en';
  };

  const handleLanguageChange = async (newLang: string) => {
    console.log('Language changed to:', newLang);
    setUserLanguage(newLang);
    
    // Translate entire page content for non-French languages
    if (newLang !== 'fr') {
      setTimeout(() => {
        translatePageContent();
      }, 500);
    }
  };

  return {
    userLanguage,
    uiLanguage: getUILanguage(),
    setUserLanguage,
    handleLanguageChange,
    translateResources,
    isTranslating
  };
};