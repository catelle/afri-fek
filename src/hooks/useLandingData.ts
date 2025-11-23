import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';

export const useLandingData = (language: 'fr' | 'en', t: any) => {
  const [images, setImages] = useState(["/hero.jpg", "/hero2.jpg", "/hero3.jpg"]);
  const [landingContent, setLandingContent] = useState({
    heroTitle: t[language].hero.title,
    heroSubtitle: t[language].hero.subtitle,
    visionTitle: t[language].hero.visionTitle,
    visionTexts: t[language].hero.visionTexts,
    quotes: []
  });

  const loadHeroImages = useCallback(async () => {
    try {
      const cachedImages = await cache.get('hero-images');
      if (cachedImages) {
        const imageUrls = cachedImages.map((img: any) => img.url);
        setImages(imageUrls);
      }
      
      const imagesDoc = await getDocs(query(collection(db, 'heroImages')));
      if (!imagesDoc.empty) {
        const imagesData = imagesDoc.docs[0].data().images || [];
        const imageUrls = imagesData.map((img: any) => img.url);
        const finalImages = imageUrls.length > 0 ? imageUrls : ["/hero.jpg", "/hero2.jpg", "/hero3.jpg"];
        setImages(finalImages);
        await cache.set('hero-images', imagesData);
      }
    } catch (error) {
      console.error('Error loading hero images:', error);
    }
  }, []);

  const loadLandingContent = useCallback(async () => {
    try {
      const cachedContent = await cache.get(`landing-content-${language}`);
      if (cachedContent) {
        setLandingContent(cachedContent);
      }
      
      const contentDoc = await getDocs(query(collection(db, 'landingContent')));
      if (!contentDoc.empty) {
        const content = contentDoc.docs[0].data();
        const languageContent = {
          heroTitle: content[`heroTitle_${language}`] || content.heroTitle || t[language].hero.title,
          heroSubtitle: content[`heroSubtitle_${language}`] || content.heroSubtitle || t[language].hero.subtitle,
          visionTitle: content[`visionTitle_${language}`] || content.visionTitle || (language === 'en' ? 'Our Vision' : 'Notre vision'),
          visionTexts: content[`visionTexts_${language}`] || content.visionTexts || t[language].hero.visionTexts,
          quotes: content[`quotes_${language}`] || content.quotes || []
        };
        setLandingContent(languageContent);
        await cache.set(`landing-content-${language}`, languageContent);
      }
    } catch (error) {
      console.error('Error loading landing content:', error);
    }
  }, [language, t]);

  useEffect(() => {
    loadHeroImages();
  }, [loadHeroImages]);

  useEffect(() => {
    loadLandingContent();
    const interval = setInterval(loadLandingContent, 30000);
    return () => clearInterval(interval);
  }, [loadLandingContent]);

  return { images, landingContent };
};