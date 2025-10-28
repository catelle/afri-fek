import { useState, useEffect, useRef } from 'react';

export const useAITranslation = () => {
  const [userLanguage, setUserLanguage] = useState<string>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<{[key: string]: string}>({});
  const isProcessing = useRef(false);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ko', 'ru'].includes(browserLang)) {
      setUserLanguage(browserLang);
      
      // Trigger translation immediately for detected language
      setTimeout(() => {
        if (browserLang !== 'fr') {
          translatePageContent();
        }
      }, 2000);
    }
    
    // Load translation cache
    const cached = localStorage.getItem('ai-translation-cache');
    if (cached) {
      try {
        setTranslationCache(JSON.parse(cached));
      } catch {}
    }
  }, []);

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '' || targetLang === 'fr') return text;
    
    const cacheKey = `${text.trim()}-${targetLang}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    try {
      let translated = text;
      
      // Use Google Translate
      try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.slice(0, 400))}`);
        const data = await response.json();
        translated = data[0]?.[0]?.[0] || text;
      } catch {
        // Fallback to MyMemory
        try {
          const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=fr|${targetLang}`);
          const data = await response.json();
          
          if (data.responseStatus === 200 && data.responseData?.translatedText) {
            translated = data.responseData.translatedText;
          }
        } catch {
          translated = text;
        }
      }
      
      // Cache the translation
      const newCache = { ...translationCache, [cacheKey]: translated };
      setTranslationCache(newCache);
      localStorage.setItem('ai-translation-cache', JSON.stringify(newCache));
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const translatePageContent = async () => {
    if (userLanguage === 'fr' || isProcessing.current) {
      console.log('Skipping translation:', { userLanguage, isProcessing: isProcessing.current });
      return;
    }
    
    console.log('Starting translation to:', userLanguage);
    
    setIsTranslating(true);
    isProcessing.current = true;
    
    try {
      // Find all text nodes
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            
            const tagName = parent.tagName.toLowerCase();
            if (['script', 'style', 'noscript'].includes(tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            
            const text = node.textContent?.trim();
            if (!text || text.length < 3) {
              return NodeFilter.FILTER_REJECT;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      const textNodes: Text[] = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node as Text);
      }
      
      // Process in batches
      const batchSize = 10;
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (textNode) => {
            const originalText = textNode.textContent?.trim();
            if (!originalText) return;
            
            try {
              const translatedText = await translateText(originalText, userLanguage);
              if (translatedText !== originalText) {
                textNode.textContent = translatedText;
              }
            } catch (error) {
              console.error('Error translating text node:', error);
            }
          })
        );
        
        // Small delay between batches
        if (i + batchSize < textNodes.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
    } catch (error) {
      console.error('Page translation error:', error);
    } finally {
      setIsTranslating(false);
      isProcessing.current = false;
    }
  };

  const translateResources = async (resources: any[]) => {
    if (userLanguage === 'fr' || !resources.length) return resources;
    
    try {
      const translatedResources = await Promise.all(
        resources.slice(0, 20).map(async (resource, index) => {
          await new Promise(resolve => setTimeout(resolve, index * 100));
          
          try {
            const [name, description] = await Promise.all([
              translateText(resource.name || '', userLanguage),
              resource.description ? translateText(resource.description.slice(0, 200), userLanguage) : ''
            ]);
            
            return {
              ...resource,
              name,
              description: description || resource.description,
              about: resource.about
            };
          } catch {
            return resource;
          }
        })
      );
      
      return [...translatedResources, ...resources.slice(20)];
    } catch (error) {
      console.error('Resource translation error:', error);
      return resources;
    }
  };

  return {
    userLanguage,
    setUserLanguage,
    translatePageContent,
    translateResources,
    isTranslating,
    translationCache
  };
};