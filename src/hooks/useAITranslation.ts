import { useState, useEffect, useRef, useCallback } from 'react';

export const useAITranslation = () => {
  const [userLanguage, setUserLanguage] = useState<string>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const isProcessing = useRef(false);
  const translationCache = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    // Load saved language
    const savedLang = localStorage.getItem('user-language');
    const hasSelected = localStorage.getItem('user-language-selected');
    
    if (savedLang && hasSelected) {
      setUserLanguage(savedLang);
      if (savedLang !== 'fr') {
        // Hide page content during translation
        document.body.style.visibility = 'hidden';
        setTimeout(() => {
          translatePageContent().then(() => {
            document.body.style.visibility = 'visible';
          });
        }, 500);
      }
    }
    
    // Load translation cache
    const cached = localStorage.getItem('ai-translation-cache');
    if (cached) {
      try {
        translationCache.current = JSON.parse(cached);
      } catch {}
    }
  }, []);

  const translateText = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '' || targetLang === 'fr') return text;
    
    // Never translate "Afri-Fek" or "Afri-" or "Fek"
    if (text.includes('Afri-Fek') || text.includes('Afri-') || text.includes('Fek')) return text;
    
    const cacheKey = `${text.trim()}-${targetLang}`;
    if (translationCache.current[cacheKey]) {
      return translationCache.current[cacheKey];
    }
    
    // Map language codes correctly
    const langMap: {[key: string]: string} = {
      'en': 'en',
      'es': 'es', 
      'de': 'de',
      'it': 'it',
      'pt': 'pt',
      'ar': 'ar',
      'zh': 'zh-cn',
      'ru': 'ru'
    };
    
    const correctLang = langMap[targetLang] || targetLang;
    
    try {
      let translated = text;
      
      // Use Google Translate with correct language code
      try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${correctLang}&dt=t&q=${encodeURIComponent(text.slice(0, 400))}`);
        const data = await response.json();
        translated = data[0]?.[0]?.[0] || text;
      } catch {
        // Fallback to MyMemory
        try {
          const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=fr|${correctLang}`);
          const data = await response.json();
          
          if (data.responseStatus === 200 && data.responseData?.translatedText) {
            translated = data.responseData.translatedText;
          }
        } catch {
          translated = text;
        }
      }
      
      // Cache the translation
      translationCache.current[cacheKey] = translated;
      localStorage.setItem('ai-translation-cache', JSON.stringify(translationCache.current));
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  const translatePageContent = async (): Promise<void> => {
    if (userLanguage === 'fr' || isProcessing.current) {
      return Promise.resolve();
    }
    
    return new Promise(async (resolve) => {
    
    setIsTranslating(true);
    isProcessing.current = true;
    
    // Mark the page as translated to this language
    document.body.setAttribute('data-translated-lang', userLanguage);
    
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
            
            // Skip Afri-Fek brand elements
            if (text.includes('Afri-') || text.includes('Fek') || text.includes('Afri-Fek')) {
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
      resolve();
    }
    });
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

  const showLanguageNotification = (lang: string) => {
    const langNames: {[key: string]: string} = {
      'en': 'English',
      'es': 'Español', 
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'ar': 'العربية',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'ru': 'Русский'
    };
    
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; background: #1f2937; color: white; padding: 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 300px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">🌍</span>
          <span style="font-weight: bold;">Translate to ${langNames[lang]}?</span>
        </div>
        <p style="margin: 0 0 12px 0; font-size: 14px; opacity: 0.9;">We detected your language. Click to translate this page.</p>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.translateToLanguage('${lang}')" style="background: #d97706; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Translate</button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid #374151; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Dismiss</button>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  };

  const changeLanguage = (newLang: string) => {
    // Clear previous translation cache to avoid wrong language
    translationCache.current = {};
    localStorage.removeItem('ai-translation-cache');
    
    // Update state immediately for UI reflection
    setUserLanguage(newLang);
    localStorage.setItem('user-language', newLang);
    localStorage.setItem('user-language-selected', 'true');
    
    // Clear any previous translation markers
    document.body.removeAttribute('data-translated-lang');
    
    if (newLang !== 'fr') {
      // Start translation process
      setIsTranslating(true);
      setTimeout(() => {
        translatePageContent().then(() => {
          setIsTranslating(false);
        });
      }, 100);
    } else {
      window.location.reload();
    }
  };

  // Make function globally available
  if (typeof window !== 'undefined') {
    (window as any).translateToLanguage = changeLanguage;
  }

  return {
    userLanguage,
    setUserLanguage: changeLanguage,
    translatePageContent,
    translateResources,
    translateText,
    isTranslating,
    translationCache
  };
};