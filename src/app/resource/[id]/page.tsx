'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Search, Plus, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GeminiChat from '@/components/GeminiChat';
import { t } from '@/lib/traduction';

export default function ResourceDetail() {
  const params = useParams();
  const router = useRouter();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    const fetchResource = async () => {
      const resourceId = params.id as string;
      
      try {
        const querySnapshot = await getDocs(collection(db, 'resources'));
        const firestoreResource = querySnapshot.docs.find(doc => doc.id === resourceId);
        
        if (firestoreResource) {
          const data = firestoreResource.data();
          setResource({
            id: firestoreResource.id,
            name: data.name,
            type: data.type,
            description: data.description,
            about: data.about || '',
            link: data.link,
            country: data.country || '',
            image: data.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
            date: data.date || new Date().toISOString().split('T')[0],
            isbn: data.isbn || '',
            statut: data.statut || '',
            detailsStatut: data.detailsStatut || ''
          });
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      }
      
      setLoading(false);
    };

    if (params.id) {
      fetchResource();
    }
  }, [params.id]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <p className="text-gray-500">Chargement...</p>
  //     </div>
  //   );
  // }

  // if (!resource) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-gray-500 mb-4">Ressource non trouvée</p>
  //         <button
  //           onClick={() => router.back()}
  //           className="text-orange-500 hover:text-orange-600"
  //         >
  //           Retour
  //         </button>
  //       </div>
  //     </div>
  //   );
 // }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Tabs */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-400 md:border-b z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Language Switch */}
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-xs text-white hover:text-orange-300 transition">
              {t[language].hero.french}
            </button>
            <span className="text-white/50">|</span>
            <button className="px-2 py-1 text-xs text-white/70 hover:text-orange-300 transition">
             {t[language].hero.english}
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'all', label: t[language].hero.all },
            { id: 'article', label: 'Articles', icon: BookOpen },
            { id: 'journal', label: 'Journals', icon: BookOpen },
            { id: 'academy', label: t[language].filters.academy, icon: GraduationCap },
            { id: 'institution', label: 'Institutions', icon: Building2 },
            { id: 'blog', label: 'Blogs', icon: BookOpen }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => router.push('/')}
              className="py-4 text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition border-transparent text-white hover:text-orange-900"
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </button>
          ))}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="fixed border-b border-gray-200 shadow-sm sticky top-0 z-40 bg-white mt-[56px]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-1 text-white">
              <span className="text-[40px] text-amber-500">Afri-</span>
              <span className="text-[40px] text-amber-500">fek</span>
            </h1>
            <img 
              src="/logo-afrimvoe3.png" 
              alt="Logo Afri-fek" 
              className="h-15 w-15 drop-shadow-sm hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="search"
                aria-label="Rechercher une organisation"
                placeholder={`🔍 ${t[language].search}`}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 border border-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="button"
            className="bg-amber-600 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-800 transition flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            {t[language].submit}
          </button>
        </div>
      </header>

     {loading ? (
      <div className="min-h-screen bg-white flex items-center justify-center mt-[112px]">
        <p className="text-gray-500"> {t[language].loading}</p>
      </div>
    ) : !resource ? (
      <div className="min-h-screen bg-white flex items-center justify-center mt-[112px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4"> {t[language].hero.resourcenotfound}</p>
          <button
            onClick={() => router.back()}
            className="text-orange-500 hover:text-orange-600"
          >
            {t[language].hero.back}
          </button>
        </div>
      </div>
    ) : (
      <main className="max-w-6xl mx-auto px-4 py-12 mt-[112px]">
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-10">
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left: Textual content */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{resource.name}</h1>

        <span
          className={`inline-block mb-6 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
            resource.type === "article"
              ? "bg-blue-100 text-blue-800"
              : resource.type === "journal"
              ? "bg-orange-100 text-orange-800"
              : resource.type === "academy"
              ? "bg-green-100 text-green-800"
              : resource.type === "institution"
              ? "bg-purple-100 text-purple-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {resource.type}
        </span>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {resource.description || "Aucune description fournie."}
        </p>

        {resource.about && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t[language].hero.about}</h2>
            <p className="text-gray-700 leading-relaxed">{resource.about}</p>
          </div>
        )}

        {/* Meta info */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          {resource.country && (
            <div>
              <span className="font-medium text-gray-500"> {t[language].filters.country} :</span>
              <span className="ml-2 text-gray-800">{resource.country}</span>
            </div>
          )}
          {resource.date && (
            <div>
              <span className="font-medium text-gray-500">Date :</span>
              <span className="ml-2 text-gray-800">
                {new Date(resource.date).toLocaleDateString("fr-FR")}
              </span>
            </div>
          )}
          {resource.isbn && (
            <div>
              <span className="font-medium text-gray-500">ISSN :</span>
              <span className="ml-2 text-gray-800">{resource.isbn}</span>
            </div>
          )}
          {resource.statut && (
            <div>
              <span className="font-medium text-gray-500">{t[language].hero.statut}</span>
              <span
                className={`ml-2 font-semibold ${
                  resource.statut === "ACTIVE"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {resource.statut.toLowerCase()}
              </span>
              {resource.detailsStatut && (
                <span className="ml-2 text-gray-600">
                  ({resource.detailsStatut})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={resource.link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            <ExternalLink className="w-4 h-4" />
             {t[language].hero.website}
          </a>
          <button
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            {t[language].hero.back}
          </button>
        </div>
      </div>

      {/* Right: Image + Date */}
      <div className="w-full">
        <div className="w-full h-64 md:h-[350px] overflow-hidden rounded-lg shadow-sm">
          <img
            src={resource.image}
            alt={resource.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop";
            }}
          />
        </div>

        {resource.date && (
          <p className="text-sm text-gray-500 mt-4 text-center">
                   {t[language].hero.publishthe}
           {" "}
            <span className="font-medium text-gray-800">
              {new Date(resource.date).toLocaleDateString("fr-FR")}
            </span>
          </p>
        )}
      </div>
    </div>
  </div>
</main>
    )}
      
      {/* Gemini AI Chat */}
      <GeminiChat />
    </div>
  );
}