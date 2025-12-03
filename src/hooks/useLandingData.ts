import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';

export const useLandingData = () => {
  const [images, setImages] = useState(["/hero.jpg", "/hero2.jpg", "/minesup.jpeg"]);
  const [landingContent, setLandingContent] = useState({
    heroSubtitle: "La plateforme de référence pour accéder aux journaux, blogs et institutions de recherche scientifique en Afrique et pour l'Afrique. Accréditée par le Conseil Scientifique du Comité Consultatif des Institutions Universitaires de la République du Cameroun.",
    heroTitle: "la base de données scientifiques dédiée au développement de l’Afrique.",
    visionTitle: "Our Vision",
    visionTexts: ["Connecting researchers across Africa", "Promoting health innovation", "Building knowledge networks"],
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
        const finalImages = imageUrls.length > 0 ? imageUrls : ["/hero.jpg", "/hero2.jpg", "/minesup.jpeg"];
        setImages(finalImages);
        await cache.set('hero-images', imagesData);
      }
    } catch (error) {
      console.error('Error loading hero images:', error);
    }
  }, []);

  const loadLandingContent = useCallback(async () => {
    try {
      const cachedContent = await cache.get('landing-content');
      if (cachedContent) {
        setLandingContent(cachedContent);
      }
      
      const contentDoc = await getDocs(query(collection(db, 'landingContent')));
      if (!contentDoc.empty) {
        const content = contentDoc.docs[0].data();
        const languageContent = {
          heroTitle: content.heroTitle || "Afri-Fek, la Base de Données de la Recherche Scientifique au Service du Développement de l'Afrique",
          heroSubtitle: content.heroSubtitle || "La plateforme de référence pour accéder aux journaux, blogs et institutions de recherche scientifique en Afrique et pour l'Afrique. Accréditée par le Conseil Scientifique du Comité Consultatif des Institutions Universitaires de la République du Cameroun.",
          visionTitle: content.visionTitle || "Our Vision",
          visionTexts: content.visionTexts || ["Connecting researchers across Africa", "Promoting health innovation", "Building knowledge networks"],
          quotes: content.quotes || []
        };
        setLandingContent(languageContent);
        await cache.set('landing-content', languageContent);
      }
    } catch (error) {
      console.error('Error loading landing content:', error);
    }
  }, []);

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