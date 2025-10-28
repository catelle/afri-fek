'use client';

import { ArrowRight, BookOpen, Globe, Users, Award, CheckCircle, Star, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AfricaMap } from './Map';


interface LandingPageProps {
  resources: any[];
  language: 'fr' | 'en';
  t: any;
  onNavigateToJournals?: () => void;
}

export default function LandingPage({ resources, language, t, onNavigateToJournals }: LandingPageProps) {

  
  const stats = {
    total: resources.length,
    articles: resources.filter(r => r.type === 'article').length,
    journals: resources.filter(r => r.type === 'journal').length,
    countries: Array.from(new Set(resources.map(r => r.country).filter(Boolean))).length,
  };
      const countries = Array.from(new Set(resources.map(r => r.country).filter(Boolean)));
      const countryCount = countries.length;


  const [images, setImages] = useState(["/hero.jpg", "/hero2.jpg", "/hero3.jpg"]);
  const [index, setIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [landingContent, setLandingContent] = useState({
    heroTitle: t[language].hero.title,
    heroSubtitle: t[language].hero.subtitle,
    visionTitle: 'Notre vision',
    visionTexts: [
      'Booster l\'accès mondial aux recherches publiées dans les journaux africains. Des <strong class="text-amber-600">millions</strong> d\'articles de recherche africains sont téléchargés chaque mois, amplifiant la portée africaine et mondiale de la recherche du continent.',
      'Nous avons <strong class="text-amber-600">répertorié des académies, des institutions et des organisations dans le domaine de la santé en Afrique</strong>, afin de faciliter l\'accès aux savoirs, encourager les échanges scientifiques et valoriser les expertises locales sur la scène mondiale.',
      '<strong class="text-amber-600">Afri-Fek</strong> soutient les <strong class="text-amber-600"> modèles de publication Open Access et gratuits</strong>, et fournit l\'accès à une gamme complète de ressources gratuites pour assister les chercheurs, auteurs, éditeurs et journaux africains.'
    ],
    quotes: [
      {
        scientist: 'Tedros Adhanom Ghebreyesus',
        field: 'Santé publique & OMS',
        quote: 'Quand les gens sont en bonne santé, leurs familles, leurs communautés et leurs pays prospèrent.'
      },
      {
        scientist: 'Catherine Kyobutungi',
        field: 'Épidémiologiste',
        quote: 'Nous ne voyons et n\'accédons qu\'à une toute petite partie – comme les oreilles d\'un hippopotame dans l\'eau – mais nous savons qu\'un immense potentiel se cache juste sous la surface.'
      },
      {
        scientist: 'Monique Wasunna',
        field: 'Recherche médicale',
        quote: 'Cette maladie qui a emporté mon amie, je ferai tout ce qui est en mon pouvoir pour aider les autres patients. Je serai leur avocate.'
      }
    ]
  });

  // Load hero images from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('hero-images');
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        const imageUrls = parsedImages.map((img: any) => img.url);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error loading hero images:', error);
      }
    }
  }, []);

  // Load landing content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('landing-content');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setLandingContent(parsedContent);
      } catch (error) {
        console.error('Error loading landing content:', error);
      }
    }
  }, []);

  // Auto-change images every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

 const quotes = [
  {
    scientist: "Tedros Adhanom Ghebreyesus",
    field: "Santé publique & OMS",
    quote: "Quand les gens sont en bonne santé, leurs familles, leurs communautés et leurs pays prospèrent.",
  },
  {
    scientist: "Catherine Kyobutungi",
    field: "Épidémiologiste",
    quote: "Nous ne voyons et n’accédons qu’à une toute petite partie , comme les oreilles d’un hippopotame dans l’eau, mais nous savons qu’un immense potentiel se cache juste sous la surface.",
  },
  {
    scientist: "Monique Wasunna",
    field: "Recherche médicale",
    quote: "Cette maladie qui a emporté mon amie, je ferai tout ce qui est en mon pouvoir pour aider les autres patients. Je serai leur avocate.",
  },
];







  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
 <section className="relative mt-[80px] md:mt-[80px]">
  {/* Image as background on small screens */}
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
    <div className="absolute inset-0 bg-black/70"></div> {/* dark overlay */}
  </div>

  {/* Content */}
  <div className="relative max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

      {/* Text Content */}
      <div className="text-center lg:text-left relative z-10  py-20 md:py-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white md:text-gray-900 mb-6 leading-tight">
          <span>{landingContent.heroTitle}</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 md:text-gray-600 mb-8">
          {landingContent.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button 
            onClick={onNavigateToJournals}
            className="border-2 border-gray-300 hover:border-gray-400  text-white md:text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition flex items-center gap-2 justify-center hover:bg-amber-50 hover:border-amber-400"
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

      {/* Image Slider (only on large screens) */}
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


    {/* <section className="relative pt-6 mt-4 h-[18rem] w-full overflow-hidden">
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

  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
      <span className="text-amber-400">{t[language].hero.title}</span>
    </h1>

    <p className="text-xl text-gray-200 mb-8 max-w-2xl">
      {t[language].hero.subtitle}
    </p>

    <div className="flex flex-col sm:flex-row gap-4">
      <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center gap-2 justify-center">
        Explorer les Ressources
        <ArrowRight className="w-5 h-5" />
      </button>
      <button className="border-2 border-white hover:border-gray-300 text-white px-8 py-4 rounded-lg font-semibold text-lg transition">
        En Savoir Plus
      </button>
    </div>
  </div>
</section> */}


      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">{stats.total}+</div>
              <div className=" text-amber-600">Ressources Totales</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">{stats.countries}+</div>
              <div className=" text-amber-600">Pays Couverts</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">{stats.journals}+</div>
              <div className=" text-amber-600">Journaux Scientifiques</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">{stats.articles}+</div>
              <div className=" text-amber-600">Articles de Recherche</div>
            </div>
          </div>
        </div>
      </section>

  {/* Vision Section */}
<section id="vision-section" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Vision Content */}
      <div className="space-y-8">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-600 mb-6">
            {landingContent.visionTitle}
          </h2>
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div className="animate-fade-in-up delay-100 p-6 bg-amber-50 rounded-xl border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            {/* <p className="text-lg" dangerouslySetInnerHTML={{ __html: landingContent.visionTexts[0] }} /> */}
            <p className="text-lg">
              Booster l'accès mondial aux recherches publiées dans les journaux africains. Des <strong className="text-amber-600">millions</strong> d'articles de recherche africains sont téléchargés chaque mois, amplifiant la portée africaine et mondiale de la recherche du continent.

            </p>
          </div>

          <div className="animate-fade-in-up delay-200 p-6 bg-gray-50 rounded-xl border-l-4 border-gray-600 hover:shadow-lg transition-shadow">
            <p className="text-lg">
  Nous avons <strong className="text-amber-600">répertorié des académies, des institutions et des organisations dans le domaine de la santé en Afrique</strong>, 
  afin de faciliter l’accès aux savoirs, encourager les échanges scientifiques et valoriser 
  les expertises locales sur la scène mondiale.
</p>

          </div>

          <div className="animate-fade-in-up delay-400 p-6 bg-amber-50 rounded-xl border-l-4 border-amber-600 hover:shadow-lg transition-shadow">
            {/* <p className="text-lg" dangerouslySetInnerHTML={{ __html: landingContent.visionTexts[2] }} /> */}
            <p className="text-lg">
      <strong className="text-amber-600">Afri-Fek</strong> soutient les <strong className="text-amber-600"> modèles de publication Open Access et gratuits</strong>, et fournit l'accès à une gamme complète de ressources gratuites pour assister les chercheurs, auteurs, éditeurs et journaux africains.

            </p>
          </div>
        </div>
      </div>

      {/* Real Africa Map (side by side) */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
          {countryCount} Pays représentés
          </h2>
        </div>
        <div className="p-6">
          <div className="relative rounded-lg overflow-hidden h-[400px] bg-amber-100 flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors" onClick={() => setShowMap(true)}>
            <div className="text-center">
              <Globe className="w-16 h-16 text-amber-600 mx-auto mb-4 hover:scale-110 transition-transform" />
              <p className="text-amber-700 font-semibold">Carte Interactive</p>
              <p className="text-amber-600 text-sm">Cliquez pour ouvrir la carte</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>
                Pays avec des organisations enregistrées ({countryCount} pays)
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Pays représentés: {countries.join(", ")}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>


    {/* African Scientists Quotes Section */}
{/* African Scientists Facts (FAQ-style) */}
{/* <section className="py-20 bg-white">
  <div className="max-w-4xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Saviez-vous ?
      </h2>
      <p className="text-lg text-gray-600">
        Découvrez des faits inspirants sur des scientifiques africains et leurs recherches
      </p>
    </div>

    <div className="space-y-4">
      {quotes.map((q, i) => (
        <details key={i} className="group border-l-4 border-amber-500 bg-amber-50 p-6 rounded-lg cursor-pointer hover:shadow-md transition">
          <summary className="font-semibold text-gray-900 text-lg group-open:text-amber-600">
            {q.scientist} - {q.field}
          </summary>
          <p className="mt-2 text-gray-700">{q.fact}</p>
        </details>
      ))}
    </div>
  </div>
</section> */}




      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-600 mb-6">
              Ce que disent nos utilisateurs
          </h2>
        </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Afri-Fek m'a permis de découvrir des ressources de recherche que je n'aurais jamais trouvées ailleurs."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-amber-600 font-semibold text-lg">AK</span>
                </div>
                <div>
                  <div className="font-semibold">Dr. Amina Kone</div>
                  <div className="text-gray-500">Chercheur, Université de Dakar</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Une plateforme indispensable pour tout chercheur en santé travaillant sur l'Afrique."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">JM</span>
                </div>
                <div>
                  <div className="font-semibold">Prof. John Mensah</div>
                  <div className="text-gray-500">Directeur, Institut de Santé Publique</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Interface intuitive et ressources de qualité. Exactement ce dont nous avions besoin."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-lg">FA</span>
                </div>
                <div>
                  <div className="font-semibold">Dr. Fatima Al-Rashid</div>
                  <div className="text-gray-500">Chercheuse, Université du Caire</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Modal */}
      {/* {showMap && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Carte de l'Afrique - Pays représentés</h2>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="relative rounded-lg overflow-hidden bg-amber-100 flex items-center justify-center" style={{ height: '600px' }}>
                <div className="text-center">
                  <Globe className="w-24 h-24 text-amber-600 mx-auto mb-4" />
                  <p className="text-amber-700 font-semibold text-xl">Carte Interactive d'Afrique</p>
                  <p className="text-amber-600">Visualisation des {countryCount} pays représentés</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>Pays avec des organisations enregistrées ({countryCount} pays)</span>
                </div>
                <div className="text-xs text-gray-500">
                  Pays représentés: {countries.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

       {showMap && (
              <div 
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={() => setShowMap(false)}
              >
                <div 
                  className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Carte de l'Afrique - Pays représentés</h2>
                    <button
                      onClick={() => setShowMap(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="relative rounded-lg overflow-hidden" style={{ height: '600px' }}>
                      <AfricaMap countries={countries} resources={resources} />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span>Pays avec des organisations enregistrées ({countryCount} pays)</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Pays représentés: {countries.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

    
      <style jsx>{`
        .hero-slider {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          min-height: 400px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 2s ease-in-out;
        }
        .hero-slide.active {
          opacity: 1;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>


        {/* Scientist Path Section - Zigzag */}
{/* Scientist Path Section - Zigzag Left/Right */}
<section className="py-20 bg-gray-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-600 mb-6">
        Scientifiques Africains Inspirants
      </h2>
      <p className="text-xl text-gray-600">
        Découvrez les pionniers qui façonnent la recherche africaine
      </p>
    </div>

    <div className="space-y-12">
      {landingContent.quotes.map((quote, index) => (
        <div key={index} className={`flex ${
          index % 2 === 0 ? 'justify-start' : 'justify-end'
        }`}>
          {/* Content Block with Avatar Inside */}
          <div className={`relative p-6 rounded-xl shadow-lg transition-shadow hover:shadow-2xl max-w-2xl w-full
            ${index % 2 === 0 ? 'bg-amber-50 border-l-4 border-amber-500' : 'bg-gray-50 border-r-4 border-gray-600'}
          `}>
            {/* Avatar positioned inside */}
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                index % 4 === 0 ? 'bg-amber-500' :
                index % 4 === 1 ? 'bg-blue-500' :
                index % 4 === 2 ? 'bg-green-500' : 'bg-purple-500'
              }`}>
                {quote.scientist.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{quote.scientist}</h3>
                <p className={`text-sm font-medium ${
                  index % 4 === 0 ? 'text-amber-600' :
                  index % 4 === 1 ? 'text-blue-600' :
                  index % 4 === 2 ? 'text-green-600' : 'text-purple-600'
                }`}>{quote.field}</p>
                <p className="text-gray-700 italic mt-2">{quote.quote}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

    
     


      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8"> */}
            {/* About Afri-Fek */}
            {/* <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo-afrimvoe3.png"
                  alt="Afri-Fek Logo"
                  className="h-10 w-10"
                />
                <h3 className="text-2xl font-bold">
                  <span className="text-amber-400">Afri-</span>
                  <span className="text-blue-400">Fek</span>
                </h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Afri-Fek est la plateforme de référence pour la recherche en santé africaine. 
                Nous connectons chercheurs, institutions et ressources à travers tout le continent 
                pour faire avancer la science médicale en Afrique.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div> */}

            {/* Quick Links */}
            {/* <div>
              <h4 className="text-lg font-semibold mb-6">Liens Rapides</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Accueil</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Articles</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Journaux</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Institutions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">À Propos</a></li>
              </ul>
            </div> */}

            {/* Contact Info */}
            {/* <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">contact@afri-fek.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">+237 6 81 34 56 41</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">Yaounde, Cameroun</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Bottom Bar */}
          {/* <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Afri-Fek. Tous droits réservés. Plateforme de recherche en santé africaine.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition">Politique de Confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Conditions d'Utilisation</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Support</a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}