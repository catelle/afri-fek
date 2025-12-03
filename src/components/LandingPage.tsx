'use client';

import { ArrowRight, BookOpen, Globe, Users, Award, CheckCircle, Star, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, X, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AfricaMap } from './Map';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';
import { useAITranslation } from '@/hooks/useAITranslation';


interface LandingPageProps {
  resources: any[];
  language: 'fr' | 'en';
  t: any;
  onNavigateToJournals?: () => void;
}

export default function LandingPage({ resources, language, t, onNavigateToJournals }: LandingPageProps) {
  const { translateText, userLanguage } = useAITranslation();
  
  const stats = {
    total: resources.length,
    articles: resources.filter(r => r.type === 'article').length,
    journals: resources.filter(r => r.type === 'journal').length,
    countries: Array.from(new Set(resources.map(r => r.country).filter(Boolean))).length,
  };
      const countries = Array.from(new Set(resources.map(r => r.country).filter(Boolean)));
      const countryCount = countries.length;


  const [images, setImages] = useState(["/hero.jpg", "/hero2.jpg", "/minesup.jpeg"]);
  const [index, setIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
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
  
  const [translatedVisionContent, setTranslatedVisionContent] = useState({
    visionTitle: 'Notre vision',
    visionTexts: [
      'Booster l\'accès mondial aux recherches publiées dans les journaux africains. Des <strong class="text-amber-600">millions</strong> d\'articles de recherche africains sont téléchargés chaque mois, amplifiant la portée africaine et mondiale de la recherche du continent.',
      'Nous avons <strong class="text-amber-600">répertorié des académies, des institutions et des organisations dans le domaine de la santé en Afrique</strong>, afin de faciliter l\'accès aux savoirs, encourager les échanges scientifiques et valoriser les expertises locales sur la scène mondiale.',
      '<strong class="text-amber-600">Afri-Fek</strong> soutient les <strong class="text-amber-600"> modèles de publication Open Access et gratuits</strong>, et fournit l\'accès à une gamme complète de ressources gratuites pour assister les chercheurs, auteurs, éditeurs et journaux africains.'
    ]
  });

  // Load hero images from Firestore with cache
  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        // Try cache first
        const cachedImages = await cache.get('hero-images');
        if (cachedImages) {
          const imageUrls = cachedImages.map((img: any) => img.url);
          setImages(imageUrls);
        }
        
        // Always fetch fresh data
        const imagesDoc = await getDocs(query(collection(db, 'heroImages')));
        if (!imagesDoc.empty) {
          const imagesData = imagesDoc.docs[0].data().images || [];
          const imageUrls = imagesData.map((img: any) => img.url);
          const finalImages = imageUrls.length > 0 ? imageUrls : ["/hero.jpg", "/hero2.jpg", "/minesup.jpeg"];
          setImages(finalImages);
          
          // Cache the data
          await cache.set('hero-images', imagesData);
        }
      } catch (error) {
        console.error('Error loading hero images:', error);
      }
    };
    loadHeroImages();
  }, []);

  // Load landing content from Firestore with cache
  useEffect(() => {
    const loadLandingContent = async () => {
      try {
        // Try cache first
        const cachedContent = await cache.get(`landing-content-${language}`);
        if (cachedContent) {
          setLandingContent(cachedContent);
        }
        
        // Always fetch fresh data
        const contentDoc = await getDocs(query(collection(db, 'landingContent')));
        if (!contentDoc.empty) {
          const content = contentDoc.docs[0].data();
          // Use language-specific content or fallback to default
          const languageContent = {
            heroTitle: content[`heroTitle_${language}`] || content.heroTitle || t[language].hero.title,
            heroSubtitle: content[`heroSubtitle_${language}`] || content.heroSubtitle || t[language].hero.subtitle,
            visionTitle: content[`visionTitle_${language}`] || content.visionTitle || (language === 'en' ? 'Our Vision' : 'Notre vision'),
            visionTexts: content[`visionTexts_${language}`] || content.visionTexts || [
              language === 'en' ? 
                'Boost global access to research published in African journals. <strong class="text-amber-600">Millions</strong> of African research articles are downloaded monthly, amplifying the African and global reach of the continent\'s research.' :
                'Booster l\'accès mondial aux recherches publiées dans les journaux africains. Des <strong class="text-amber-600">millions</strong> d\'articles de recherche africains sont téléchargés chaque mois, amplifiant la portée africaine et mondiale de la recherche du continent.',
              language === 'en' ? 
                'We have <strong class="text-amber-600">listed academies, institutions and organizations in the field of health in Africa</strong>, in order to facilitate access to knowledge, encourage scientific exchanges and enhance local expertise on the global stage.' :
                'Nous avons <strong class="text-amber-600">répertorié des académies, des institutions et des organisations dans le domaine de la santé en Afrique</strong>, afin de faciliter l\'accès aux savoirs, encourager les échanges scientifiques et valoriser les expertises locales sur la scène mondiale.',
              language === 'en' ? 
                '<strong class="text-amber-600">Afri-Fek</strong> supports <strong class="text-amber-600">Open Access and free publication models</strong>, and provides access to a full range of free resources to assist African researchers, authors, editors and journals.' :
                '<strong class="text-amber-600">Afri-Fek</strong> soutient les <strong class="text-amber-600"> modèles de publication Open Access et gratuits</strong>, et fournit l\'accès à une gamme complète de ressources gratuites pour assister les chercheurs, auteurs, éditeurs et journaux africains.'
            ],
            quotes: content[`quotes_${language}`] || content.quotes || [
              {
                scientist: 'Tedros Adhanom Ghebreyesus',
                field: language === 'en' ? 'Public Health & WHO' : 'Santé publique & OMS',
                quote: language === 'en' ? 'When people are healthy, their families, communities and countries thrive.' : 'Quand les gens sont en bonne santé, leurs familles, leurs communautés et leurs pays prospèrent.'
              },
              {
                scientist: 'Catherine Kyobutungi',
                field: language === 'en' ? 'Epidemiologist' : 'Épidémiologiste',
                quote: language === 'en' ? 'We only see and access a tiny part – like the ears of a hippo in water – but we know that immense potential lies just below the surface.' : 'Nous ne voyons et n\'accédons qu\'à une toute petite partie – comme les oreilles d\'un hippopotame dans l\'eau – mais nous savons qu\'un immense potentiel se cache juste sous la surface.'
              },
              {
                scientist: 'Monique Wasunna',
                field: language === 'en' ? 'Medical Research' : 'Recherche médicale',
                quote: language === 'en' ? 'This disease that took my friend, I will do everything in my power to help other patients. I will be their advocate.' : 'Cette maladie qui a emporté mon amie, je ferai tout ce qui est en mon pouvoir pour aider les autres patients. Je serai leur avocate.'
              }
            ]
          };
          setLandingContent(languageContent);
          
          // Cache the data with language key
          await cache.set(`landing-content-${language}`, languageContent);
        }
      } catch (error) {
        console.error('Error loading landing content:', error);
      }
    };
    loadLandingContent();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(loadLandingContent, 30000);
    return () => clearInterval(interval);
  }, [language]);
  
  // AI translate vision content when userLanguage changes
  useEffect(() => {
    const translateVisionContent = async () => {
      if (userLanguage === 'fr') {
        // Use original French content
        setTranslatedVisionContent({
          visionTitle: landingContent.visionTitle,
          visionTexts: landingContent.visionTexts
        });
        return;
      }
      
      try {
        // Translate vision title and texts
        const [translatedTitle, ...translatedTexts] = await Promise.all([
          translateText(landingContent.visionTitle, userLanguage),
          ...landingContent.visionTexts.map(text => {
            // Remove HTML tags for translation, then add them back
            const cleanText = text.replace(/<[^>]*>/g, '');
            return translateText(cleanText, userLanguage).then((translated: string) => {
              // Restore HTML formatting
              return text.replace(cleanText, translated);
            });
          })
        ]);
        
        setTranslatedVisionContent({
          visionTitle: translatedTitle,
          visionTexts: translatedTexts
        });
      } catch (error) {
        console.error('Error translating vision content:', error);
        // Fallback to original content
        setTranslatedVisionContent({
          visionTitle: landingContent.visionTitle,
          visionTexts: landingContent.visionTexts
        });
      }
    };
    
    translateVisionContent();
  }, [userLanguage, landingContent.visionTitle, landingContent.visionTexts, translateText]);

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
    quote: "Nous ne voyons et n'accédons qu'à une toute petite partie , comme les oreilles d'un hippopotame dans l'eau, mais nous savons qu'un immense potentiel se cache juste sous la surface.",
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
  <div className="relative max-w-8xl  mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4">
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
  <div className="max-w-8xl mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Vision Content */}
      <div className="space-y-8">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-600 mb-6">
            {translatedVisionContent.visionTitle}
          </h2>
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          {/* Back Button for Color Changes */}
          {colorHistory.length > 0 && (
            <button
              onClick={() => {
                setColorHistory([]);
                // Reset colors to default
                document.querySelectorAll('.color-changeable').forEach(el => {
                  el.className = el.className.replace(/text-\w+-\d+/g, 'text-amber-600');
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors mb-4"
            >
              <Undo2 className="w-4 h-4" />
              Annuler les changements de couleur
            </button>
          )}
          <div className="animate-fade-in-up delay-100 p-6 bg-amber-50 rounded-xl border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: translatedVisionContent.visionTexts[0] }} />
          </div>

          <div className="animate-fade-in-up delay-200 p-6 bg-gray-50 rounded-xl border-l-4 border-gray-600 hover:shadow-lg transition-shadow">
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: translatedVisionContent.visionTexts[1] }} />
          </div>

          <div className="animate-fade-in-up delay-400 p-6 bg-amber-50 rounded-xl border-l-4 border-amber-600 hover:shadow-lg transition-shadow">
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: translatedVisionContent.visionTexts[2] }} />
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-8xl mx-auto px-4">
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

{/* Scientist Path Section - Zigzag Left/Right */}
<section className="py-20 bg-gray-50 overflow-hidden">
  <div className="max-w-8xl mx-auto px-4">
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

    </div>
  );
}