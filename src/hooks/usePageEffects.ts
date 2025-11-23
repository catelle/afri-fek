import { useEffect } from 'react';
import { supabaseKeepAlive } from '@/lib/supabase-keepalive';

export const usePageEffects = (
  setTab: (tab: string) => void,
  isTranslating: boolean,
  setShowBanner: (show: boolean) => void,
  loadResourcesWithCache: () => void,
  userLanguage: string,
  translatePageContent: () => void
) => {
  // Handle tab from URL parameter only on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam) {
        setTab(tabParam);
      }
    }
  }, [setTab]);

  // Translation banner effect
  useEffect(() => {
    if (isTranslating) {
      setShowBanner(true);
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isTranslating]);

  // Load resources and start keepalive
  useEffect(() => {
    loadResourcesWithCache();
    supabaseKeepAlive.start();
    return () => {
      supabaseKeepAlive.stop();
    };
  }, []);

  // Translation effects
  useEffect(() => {
    const currentLang = document.body.getAttribute("data-translated-lang");
    if (userLanguage !== "fr" && currentLang !== userLanguage) {
      setTimeout(() => {
        translatePageContent();
      }, 1000);
    }
    document.body.style.opacity = "1";
  }, [userLanguage]);

  useEffect(() => {
    if (userLanguage !== "fr") {
      const observer = new MutationObserver(() => {
        const currentLang = document.body.getAttribute("data-translated-lang");
        if (currentLang !== userLanguage) {
          setTimeout(() => {
            translatePageContent();
          }, 500);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, [userLanguage]);
};