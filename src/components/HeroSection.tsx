'use client';

import { useLandingData } from '@/hooks/useLandingData';
import TranslatedText from './TranslatedText';
import Image from 'next/image';

export default function HeroSection() {
  const { images, landingContent } = useLandingData();

  return (
    <>
      <section
        className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-cover bg-center px-6 md:px-20 mb-8"
        style={{ backgroundImage: `url(${images[0]})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <TranslatedText 
            text={landingContent.heroTitle}
            tag="h1"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2"
          />
          <TranslatedText 
            text={landingContent.heroSubtitle}
            tag="p"
            className="text-sm md:text-base max-w-2xl mx-auto"
          />
        </div>
      </section>
      
      {/* Scopus Access Section */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-6 md:px-20 mb-8 rounded-lg">
        <div className="text-center mb-6">
          <TranslatedText 
            text="Accès Scopus - Partenaires Officiels"
            tag="h2"
            className="text-xl md:text-2xl font-bold text-gray-800 mb-2"
          />
          <TranslatedText 
            text="Accès gratuit aux bases de données scientifiques pour les institutions partenaires"
            tag="p"
            className="text-gray-600 text-sm md:text-base"
          />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center">
            <Image 
              src="/logoscopus.png" 
              alt="Scopus" 
              width={120} 
              height={60}
              className="mb-2"
            />
            <TranslatedText 
              text="Base de données Scopus"
              className="text-xs text-gray-600 text-center"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <Image 
              src="/logo-minesup.png" 
              alt="MINESUP" 
              width={80} 
              height={60}
              className="mb-2"
            />
            <TranslatedText 
              text="Ministère de l'Enseignement Supérieur"
              className="text-xs text-gray-600 text-center max-w-[100px]"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <Image 
              src="/logo-cames.png" 
              alt="CAMES" 
              width={80} 
              height={60}
              className="mb-2"
            />
            <TranslatedText 
              text="Conseil Africain et Malgache"
              className="text-xs text-gray-600 text-center max-w-[100px]"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <Image 
              src="/logoOms.png" 
              alt="OMS" 
              width={80} 
              height={60}
              className="mb-2"
            />
            <TranslatedText 
              text="Organisation Mondiale de la Santé"
              className="text-xs text-gray-600 text-center max-w-[100px]"
            />
          </div>
        </div>
        
        <div className="text-center mt-6">
          <TranslatedText 
            text="Pour qui : Chercheurs, Étudiants, Institutions académiques accréditées"
            className="text-sm text-gray-700 font-medium"
          />
        </div>
      </section>
    </>
  );
}