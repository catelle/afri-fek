"use client"
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const data = [
  {
    id: '1',
    name: 'Revue Médicale Africaine',
    description: 'Publication scientifique de référence en Afrique',
    link: 'https://example.com/revue',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
  }
];

export default function Hero() {
  const images = ["/hero.jpg", "/hero2.jpg", "/minesup.jpeg"];
  const [index, setIndex] = useState(0);

  // Auto-change images every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);
  return (
     <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Text Content */}
          {/* <div className="flex flex-col justify-start">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Découvrez la <span className="text-amber-600">Recherche</span> en Santé
              <br />
              <span className="text-blue-600">Africaine</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La plateforme de référence pour accéder aux journaux, académies et
              institutions de recherche en santé à travers l'Afrique
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center gap-2 justify-center">
                Explorer les Ressources
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition">
                En Savoir Plus
              </button>
            </div>
          </div> */}

          {/* Image Slider */}
          {/* <div className="relative h-[24rem] w-full rounded-2xl overflow-hidden shadow-2xl">
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
          </div> */}
        </div>
      </div>
    </section>
  );
}