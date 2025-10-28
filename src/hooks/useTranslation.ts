import { useState, useEffect } from 'react';

export const useTranslation = () => {
  const [userLanguage, setUserLanguage] = useState<string>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'de', 'it', 'pt', 'ar'].includes(browserLang)) {
      setUserLanguage(browserLang);
    }
    
    // Load translation cache from localStorage
    const cached = localStorage.getItem('translation-cache');
    if (cached) {
      try {
        setTranslationCache(JSON.parse(cached));
      } catch {}
    }
  }, []);

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '') return text;
    
    const cacheKey = `${text}-${targetLang}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    try {
      // Use MyMemory API (free, no auth required)
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=fr|${targetLang}`);
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        
        // Cache the translation
        const newCache = { ...translationCache, [cacheKey]: translated };
        setTranslationCache(newCache);
        localStorage.setItem('translation-cache', JSON.stringify(newCache));
        
        return translated;
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const translateResources = async (resources: any[]) => {
    if (userLanguage === 'fr' || !resources.length) return resources;
    
    setIsTranslating(true);
    try {
      // Process only first 15 resources to avoid rate limiting
      const resourcesToTranslate = resources.slice(0, 15);
      const remainingResources = resources.slice(15);
      
      const translatedResources = [];
      
      // Process resources one by one with delays
      for (let i = 0; i < resourcesToTranslate.length; i++) {
        const resource = resourcesToTranslate[i];
        
        try {
          const translatedName = await translateText(resource.name || '', userLanguage);
          
          translatedResources.push({
            ...resource,
            name: translatedName,
            // Keep original description to avoid too many API calls
            description: resource.description,
            about: resource.about
          });
          
          // Add delay between requests (500ms)
          if (i < resourcesToTranslate.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch {
          translatedResources.push(resource);
        }
      }
      
      return [...translatedResources, ...remainingResources];
    } catch (error) {
      console.error('Translation error:', error);
      return resources;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateUIText = async (text: string) => {
    if (userLanguage === 'fr' || !text) return text;
    return await translateText(text, userLanguage);
  };

  return {
    userLanguage,
    setUserLanguage,
    translateResources,
    translateUIText,
    isTranslating,
    translationCache
  };
};