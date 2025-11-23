'use client';

import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  heroTitle: string;
  heroSubtitle: string;
  images: string[];
  index: number;
  onNavigateToJournals: () => void;
}

export default function HeroSection({ 
  heroTitle, 
  heroSubtitle, 
  images, 
  index, 
  onNavigateToJournals 
}: HeroSectionProps) {
  return (
    <section className="relative mt-[80px] md:mt-[80px]">
      {/* Mobile background */}
      <div className="absolute inset-0 mt-[10px] h-[32rem] md:hidden">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Hero ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left relative z-10 py-20 md:py-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white md:text-gray-900 mb-6 leading-tight">
              <span>{heroTitle}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 md:text-gray-600 mb-8">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onNavigateToJournals}
                className="border-2 border-gray-300 hover:border-gray-400 text-white md:text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition flex items-center gap-2 justify-center hover:bg-amber-50 hover:border-amber-400"
              >
                Explorer les Ressources
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 hover:border-gray-400 text-white md:text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition hover:bg-blue-50 hover:border-blue-400"
              >
                En Savoir Plus
              </button>
            </div>
          </div>

          {/* Desktop Image Slider */}
          <div className="relative hidden md:block h-80 lg:h-[24rem] w-full rounded-2xl overflow-hidden shadow-xl">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Hero ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}