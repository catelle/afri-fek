'use client';

interface HeroSectionProps {
  language: 'fr' | 'en';
  t: any;
}

export default function HeroSection({ language, t }: HeroSectionProps) {
  return (
    <section
      className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-cover bg-center px-6 md:px-20 mb-8"
      style={{ backgroundImage: 'url(/hero.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
          {t[language].hero.title}
        </h1>
        <p className="text-sm md:text-base max-w-2xl mx-auto">
          {t[language].hero.subtitle}
        </p>
      </div>
    </section>
  );
}