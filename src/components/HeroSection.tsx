'use client';

import { useLandingData } from '@/hooks/useLandingData';

export default function HeroSection() {
  const { images, landingContent } = useLandingData();

  return (
    <section
      className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-cover bg-center px-6 md:px-20 mb-8"
      style={{ backgroundImage: `url(${images[0]})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
          {landingContent.heroTitle}
        </h1>
        <p className="text-sm md:text-base max-w-2xl mx-auto">
          {landingContent.heroSubtitle}
        </p>
      </div>
    </section>
  );
}