'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  GraduationCap,
  Building2,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db} from '@/lib/firebase';
import GeminiChat from '@/components/GeminiChat';
import { t } from '@/lib/traduction';

// Ressources
const data = [
  {
    id: '1',
    name: 'Revue Médicale Africaine',
    type: 'journal',
    description: 'Publication scientifique de référence en Afrique',
    about: 'La Revue Médicale Africaine publie des travaux de recherche en médecine, santé publique et innovations médicales issus du continent.',
    link: 'https://example.com/revue',
    country: 'Sénégal',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Université Cheikh Anta Diop - Faculté de Médecine',
    type: 'academy',
    description: 'Institution universitaire de renom au Sénégal',
    about: 'La Faculté de Médecine de l\'UCAD forme des cadres de santé très appréciés dans toute l\'Afrique francophone.',
    link: 'https://example.com/ucad-medecine',
    country: 'Sénégal',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    date: '2024-01-10'
  },
  {
    id: '3',
    name: 'Institut Pasteur de Côte d\'Ivoire',
    type: 'institution',
    description: 'Centre de recherche en santé publique',
    about: 'L\'Institut Pasteur valorise la recherche et la prévention épidémiologique en Côte d\'Ivoire et dans la sous-région.',
    link: 'https://example.com/pasteur-civ',
    country: 'Côte d\'Ivoire',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop',
    date: '2024-01-08'
  },
  {
    id: '4',
    name: 'Nouvelles Approches en Médecine Tropicale',
    type: 'article',
    description: 'Article récent sur les innovations en médecine tropicale',
    about: 'Cet article explore les dernières avancées dans le traitement des maladies tropicales en Afrique subsaharienne.',
    link: 'https://example.com/article-medecine-tropicale',
    country: 'Ghana',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
    date: '2024-01-20'
  },
  {
    id: '5',
    name: 'Blog Santé Communautaire Afrique',
    type: 'blog',
    description: 'Blog dédié à la santé communautaire en Afrique',
    about: 'Ce blog partage des expériences et bonnes pratiques en matière de santé communautaire à travers le continent africain.',
    link: 'https://example.com/blog-sante-communautaire',
    country: 'Mali',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop',
    date: '2024-01-18'
  },
  {
    id: '6',
    name: 'Prévention du Paludisme : Nouvelles Stratégies',
    type: 'article',
    description: 'Article sur les stratégies innovantes de prévention du paludisme',
    about: 'Une analyse des nouvelles approches de prévention du paludisme développées par les chercheurs africains.',
    link: 'https://example.com/prevention-paludisme',
    country: 'Burkina Faso',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop',
    date: '2024-01-22'
  }
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState<typeof data[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [approvedResources, setApprovedResources] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'article',
    description: '',
    about: '',
    link: '',
    language:'',
    country: '',
    image: '',
    isbn:'',
    statut:'',
    detailsStatut:'',
    resourceLanguage: 'fr',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchApprovedResources();
  }, []);

  const fetchApprovedResources = async () => {
    try {
      const q = query(collection(db, 'resources'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const resources = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Fetched resource:', {
          id: doc.id,
          name: data.name,
          image: data.image,
          hasImage: !!data.image
        });
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          description: data.description,
          isbn:data.isbn,
          about: data.about || '',
          link: data.link,
          statut:data.statut,
          language:data.language,
          detailsStatut:data.detailsStatut,
          country: data.country || '',
          image: data.image || `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop`,
          date: data.date || new Date().toISOString().split('T')[0]
        };
      });
      console.log('Total approved resources:', resources.length);
      if (resources.length === 0) {
        console.log('No approved resources found in database');
      }
      setApprovedResources(resources);
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.link) {
      setSubmitMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setUploadProgress(0);

    // Set timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Timeout - Veuillez réessayer.');
    }, 30000); // 30 seconds timeout

    try {
      let imageUrl = `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop`;
      
      // Convert image to Base64 if file is selected
      if (selectedFile) {
        try {
          console.log('Converting image to Base64...');
          setUploadProgress(25);
          
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              setUploadProgress(75);
              resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(selectedFile);
          });
          
          imageUrl = base64 as string;
          setUploadProgress(100);
         // console.log('Image converted to Base64');
        } catch (error) {
         // console.log('Base64 conversion failed, using default image:', error);
          setSubmitMessage('Conversion d\'image échouée, utilisation d\'une image par défaut.');
        }
      }
      
      //console.log('Adding to Firestore with image URL:', imageUrl);
      // Add resource to Firestore with pending status
      const docRef = await addDoc(collection(db, 'resources'), {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        isbn:formData.isbn,
        about: formData.about || '',
        link: formData.link,
        country: formData.country || '',
        image: imageUrl,
        statut:formData.statut,
        language:formData.language,
        detailsStatut:formData.detailsStatut,
        resourceLanguage: formData.resourceLanguage,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        createdAt: new Date(),
        submittedAt: new Date().toISOString()
      });
      
     // console.log('Document added with ID:', docRef.id);
      clearTimeout(timeoutId);
      
      setSubmitMessage('Ressource soumise avec succès!');
      
      
      // Reset form
      setFormData({
        name: '',
        type: 'article',
        description: '',
        about: '',
        link: '',
        country: '',
        image: '',
        isbn:'',
        detailsStatut:'',
        language:'',
        statut:'',
        resourceLanguage: 'fr',
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowSubmit(false);
        setSubmitMessage('');
      }, 2000);
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Erreur soumission:', error);
      setSubmitMessage(`Erreur: ${error instanceof Error ? error.message : 'Veuillez réessayer'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }
      setSelectedFile(file);
    }
  };

  const allResources = [...approvedResources];
  const filtered = allResources
    .filter(
      (item) =>
        (tab === 'all' || item.type === tab) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


     const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 2;

  const prev = () => {
    setStartIndex((prev) => Math.max(prev - itemsToShow, 0));
  };

  const next = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsToShow, data.length - itemsToShow)
    );
  };

  if (!data || data.length === 0) return null;

  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;

// Calculate start/end indexes for slicing data
const startIndex2 = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const totalPages = Math.ceil(filtered.length / itemsPerPage);
const paginatedItems = filtered.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const [filterType, setFilterType] = useState<string | null>(null);
const [filterCountry, setFilterCountry] = useState<string | null>(null);
const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
const [language, setLanguage] = useState<'fr' | 'en'>('fr');


// Apply filters first, then pagination
const filteredData = filtered.filter(item => {
  return (
    (!filterType || item.type === filterType) &&
    (!filterCountry || item.country === filterCountry) &&
    (!filterLanguage || item.resourceLanguage === filterLanguage)
  );
});

// Then apply pagination to filtered data
const totalFilteredPages = Math.ceil(filteredData.length / itemsPerPage);
const paginatedFilteredItems = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}






      {/* Featured Section - Hidden on mobile */}
 {/* <section className="py-6 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          🌍 Ressources à la une
        </h2>

     <div className="relative">
  {/* Carousel Items */}
  {/* <div className="flex space-x-4 overflow-hidden px-14 justify-center">
    {data
      .slice(startIndex, startIndex + itemsToShow)
      .map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
        </a>
      ))}
  </div>  */}

  {/* Arrows */}
  {/* <button
    onClick={prev}
    disabled={startIndex === 0}
    className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full p-2 shadow-md disabled:opacity-30 hover:bg-orange-100 transition"
    aria-label="Précédent"
  >
    <ChevronLeft className="w-6 h-6 text-orange-500" />
  </button>
  <button
    onClick={next}
    disabled={startIndex >= data.length - itemsToShow}
    className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full p-2 shadow-md disabled:opacity-30 hover:bg-orange-100 transition"
    aria-label="Suivant"
  >
    <ChevronRight className="w-6 h-6 text-orange-500" />
  </button>
</div>

      </div>
    </section> */}
  



      {/* Tabs */}
 <nav className="fixed top-0 left-0 right-0 bg-gray-700 md:border-b z-50">
  <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
   
    
    {/* Navigation Tabs */}
    <div className="flex space-x-6 overflow-x-auto">
    {[
      { id: 'all', label: t[language].tabs.all },
      { id: 'article', label: t[language].tabs.articles, icon: BookOpen },
      { id: 'journal', label: t[language].tabs.journals, icon: BookOpen },
      { id: 'academy', label: t[language].tabs.academies, icon: GraduationCap },
      { id: 'institution', label: t[language].tabs.institutions, icon: Building2 },
      { id: 'blog', label: t[language].tabs.blogs, icon: BookOpen }
    ].map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setTab(id)}
        className={`py-4 text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition
          ${tab === id
            ? 'border-amber-500 text-amber-500'
            : 'border-transparent text-white hover:text-amber-500'}`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </button>
    ))}
    </div>

     {/* Language Switch */}
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 text-xs transition ${language === 'fr' ? 'text-amber-500' : 'text-white/70 hover:text-orange-300'}`}
      >
        {t[language].hero.french}
      </button>
      <span className="text-white/50">|</span>
      <button 
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs transition ${language === 'en' ? 'text-amber-500' : 'text-white/70 hover:text-orange-300'}`}
      >
        {t[language].hero.english}
      </button>
    </div>
  </div>
</nav>






<header className="fixed border-b border-gray-200 shadow-sm sticky top-0 z-40 bg-white mt-[56px]">
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
    
    {/* Logo + Title */}
    <div className="flex items-center gap-3">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-1 text-white">
        <span className="text-[40px] text-amber-600" >Afri-</span>
        <span className="text-[40px] text-amber-600">fek</span>
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 border border-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800 placeholder-gray-500"
        />
      </div>
    </div>
    
    {/* Submit Button */}
    <button
      type="button"
      onClick={() => setShowSubmit(true)}
      className="bg-amber-600 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-800 transition flex items-center gap-2 shadow-sm hover:shadow-md"
    >
      <Plus className="w-4 h-4" />
      {t[language].submit}
    </button>
    
  </div>
</header>


<main className="max-w-7xl mx-auto px-4 py-10 bg-white">
  {tab === 'all' ? (
    <>
      {/* Hero Section */}
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

      {/* Filter Bar */}
<div className="mb-6 flex flex-wrap gap-4 items-center">
  <select
    value={filterType ?? ""}
    onChange={(e) => setFilterType(e.target.value || null)}
    className="border border-gray-300 rounded-md px-4 py-2 text-sm"
  >
    <option value="">{t[language].filters.type}</option>
    <option value="article">Article</option>
    <option value="blog">Blog</option>
    <option value="academy">            {t[language].filters.academy}</option>
    <option value="journal">Journal</option>
    {/* Add more types as needed */}
  </select>

  <select
    value={filterCountry ?? ""}
    onChange={(e) => setFilterCountry(e.target.value || null)}
    className="border border-gray-300 rounded-md px-4 py-2 text-sm"
  >
    <option value="">            {t[language].filters.country}</option>
    {Array.from(new Set(filtered.map(item => item.country))).map((country) => (
      <option key={country} value={country}>
        {country}
      </option>
    ))}
  </select>

  {(filterType || filterCountry) && (
    <button
      onClick={() => {
        setFilterType(null);
        setFilterCountry(null);
      }}
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
      title="Effacer les filtres"
    >
      <X className="w-4 h-4" />
    </button>
  )}
</div>


      {/* List Section */}
      <section className="px-6 md:px-20 flex flex-col min-h-[66vh]">
        {filteredData.length === 0 ? (
          <p className="text-center text-gray-500 flex-grow">
            {t[language].loading}
          </p>
        ) : (
          <>
            <ul className="flex flex-col space-y-4">
              {filteredData.map((item) => (
                <li
                  key={item.id}
                  tabIndex={0}
                  className="flex items-start bg-gray-100 gap-4 p-4 hover:bg-gray-150 cursor-pointer group transition"
                  onClick={() => {
                    window.location.href = `/resource/${item.id}`;
                    setShowModal(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelected(item);
                      setShowModal(true);
                    }
                  }}
                >
                  {/* Left: Image */}
                  <div className="w-30 h-30 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop";
                      }}
                    />
                  </div>

                  {/* Right: Details */}
                  <div className="flex-1 min-w-0 flex  flex-col gap-1">
                    <h3 className="text-[18px] font-semibold text-blue-900 underline group-hover:text-blue-800">
                      {item.name}
                    </h3>
                    {item.isbn && <p className="text-sm text-gray-700">
                      <span className="text-gray-500 font-medium">ISSN:</span>{" "}
                      {item.isbn ?? "N/A"}
                    </p>}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/resource/${item.id}`;
                      }}
                      className="text-sm text-orange-600 hover:text-orange-800 underline text-left"
                    >
                      {t[language].hero.about}
                    </button>
                    <a
                      href={item.link ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-700 underline"
                    >
                      {t[language].hero.website}
                    </a>
                   {item.statut && item.type !='blog' &&<h3
  className={` font-semibold mt-2 group-hover: ${
    item.statut === 'ACTIVE'
      ? 'text-green-600 group-hover:text-green-800'
      : 'text-red-600 group-hover:text-red-800'
  }`}
>
  {t[language].hero.statut}: {item.statut.toLowerCase()} {item.detailsStatut ? (item.detailsStatut) : ''}
</h3>}

                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalFilteredPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div> */}
          </>
        )}
      </section>
    </>
  ) : (

    
    // Other tabs (e.g. 'article', 'blog', etc.)
    <section className="max-w-7xl mx-auto px-4 py-10 bg-white flex flex-col min-h-[66vh]">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
  {/* <select
    value={filterType ?? ""}
    onChange={(e) => setFilterType(e.target.value || null)}
    className="border border-gray-300 rounded-md px-4 py-2 text-sm"
  >
    <option value="">Type de ressource</option>
    <option value="article">Article</option>
    <option value="blog">Blog</option>
    <option value="academy">Académie</option>
    <option value="journal">Journal</option> */}
    {/* Add more types as needed */}
  {/* </select> */}

  <select
    value={filterCountry ?? ""}
    onChange={(e) => setFilterCountry(e.target.value || null)}
    className="border border-gray-300 rounded-md px-4 py-2 text-sm"
  >
    <option value=""> {t[language].filters.country}</option>
    {Array.from(new Set(filtered.map(item => item.country))).map((country) => (
      <option key={country} value={country}>
        {country}
      </option>
    ))}
  </select>

  {(filterType || filterCountry) && (
    <button
      onClick={() => {
        setFilterType(null);
        setFilterCountry(null);
      }}
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
      title="Effacer les filtres"
    >
      <X className="w-4 h-4" />
    </button>
  )}
</div>
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500 flex-grow">
             {t[language].loading}
        </p>
      ) : (
        <>
       <div className={`${tab === 'blog' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'flex flex-col space-y-4'}`}>
  {filteredData.map((item) => (
    <div
      key={item.id}
      tabIndex={0}
      className={`bg-gray-100 p-4 rounded-md hover:bg-gray-50 cursor-pointer group transition ${
        tab === 'blog' ? '' : 'flex items-start gap-4'
      }`}
      onClick={() => {
        setSelected(item);
        setShowModal(true);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelected(item);
          setShowModal(true);
        }
      }}
    >
      {/* Image */}
      <div className={`${tab === 'blog' ? 'w-full h-40 mb-3 overflow-hidden rounded-md' : 'w-30 h-30 flex-shrink-0 overflow-hidden rounded-md'}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop";
          }}
        />
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 ${tab !== 'blog' ? 'flex-1 min-w-0' : ''}`}>
        <h3 className="text-[18px] font-semibold text-blue-900 underline group-hover:text-blue-800">
          {item.name}
        </h3>
       {item.isbn && <p className="text-sm text-gray-700">
          <span className="text-gray-500 font-medium">ISSN:</span> {item.isbn ?? "N/A"}
        </p>}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/resource/${item.id}`;
          }}
          className="text-sm text-orange-600 hover:text-orange-800 underline text-left"
        >
           {t[language].hero.about}
        </button>
        <a
          href={item.link ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-700 underline"
        >
          {t[language].hero.website}
        </a>

        {item.statut && item.type !='blog' &&(
          <h3
            className={`font-semibold mt-2 group-hover: ${
              item.statut === 'ACTIVE'
                ? 'text-green-600 group-hover:text-green-800'
                : 'text-red-600 group-hover:text-red-800'
            }`}
          >
             {t[language].hero.statut}: {item.statut.toLowerCase()} {item.detailsStatut ?? ''}
          </h3>
        )}
      </div>
    </div>
  ))}
</div>


          {/* Pagination
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div> */}
        </>
      )}
    </section>
  )}
</main>





      {/* Modals */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
            <header className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">{selected.name}</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </header>
            <div className="p-6">
              <img 
                src={selected.image} 
                alt={selected.name} 
                className="w-full h-64 object-cover rounded mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop';
                }}
              />
              <p className="text-gray-700 mb-4">{selected.description}</p>
              <h3 className="font-semibold mb-2"> {t[language].submit}</h3>
              <p className="text-gray-600 mb-6">{selected.about}</p>
              <div className="flex gap-4">
                <a
                  href={selected.link}
                  target="_blank"
                  className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t[language].hero.explore}
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 px-5 py-2 rounded hover:bg-gray-200"
                >
                  {t[language].hero.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubmit && (
       <div className=" max-w-full mx-auto p-8 space-y-8 fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-lg w-full max-w-full overflow-hidden">
    {/* Header */}
    <header className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800"> {t[language].submit}</h2>
      <button
        onClick={() => setShowSubmit(false)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </header>

    {/* Form */}
   <form onSubmit={handleSubmit} className="max-w-full mx-auto p-8 space-y-8">
  {/* Message de soumission */}
  {submitMessage && (
    <div
      className={`p-3 rounded-lg text-sm font-medium ${
        submitMessage.includes('succès')
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      {submitMessage}
    </div>
  )}

  {/* Inputs en 2 colonnes */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { label:  t[language].hero.name, type: "text", name: "name", required: true },
      { label:  t[language].hero.isbnnumber, type: "text", name: "isbn", required: false },
      { label:  t[language].hero.website, type: "url", name: "link", required: true },
      { label: t[language].filters.country, type: "text", name: "country", placeholder: "ex: Sénégal" },
      { label: t[language].hero.statutdetails, type: "text", name: "detailsStatut", required: false },
    ].map((field, i) => (
      <div key={i}>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          {field.label}
        </label>
        <input
          {...field}
          value={formData[field.name as keyof typeof formData]}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
        />
      </div>
    ))}

    {/* Statut */}
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{t[language].hero.statut}</label>
      <select
        name="statut"
        value={formData.statut}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
    </div>

      {/* Statut */}
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{t[language].hero.language}</label>
      <select
        name="language"
        value={formData.language}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
      >
        <option value="fr">{t[language].hero.french}</option>
        <option value="en">{t[language].hero.english}</option>
      </select>
    </div>

    {/* Type */}
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">Type *</label>
      <select
        name="type"
        value={formData.type}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
      >
        <option value="article">Article</option>
        <option value="journal">Journal</option>
        <option value="academy">{t[language].filters.academy}</option>
        <option value="institution">Institution</option>
        <option value="blog">Blog</option>
      </select>
    </div>
  </div>

  {/* Textareas en plein largeur */}
  {[
    { label:t[language].hero.description, name: "description", required: true },
    { label: t[language].hero.about, name: "about", placeholder: "Description détaillée (optionnel)" },
  ].map((field, i) => (
    <div key={i}>
      <label className="block text-sm font-medium mb-1 text-gray-700">{field.label}</label>
      <textarea
        {...field}
        rows={3}
        value={formData[field.name as keyof typeof formData]}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
      />
    </div>
  ))}

  {/* Image */}
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition"
    />
    {selectedFile && (
      <p className="text-sm text-green-600 mt-1">
        {t[language].hero.selectedfile}Fichier sélectionné: {selectedFile.name}
      </p>
    )}
    <p className="text-xs text-gray-500 mt-1">
     {t[language].hero.filedescription} Sélectionnez une image (max 5MB) ou laissez vide pour l'image par défaut
    </p>
  </div>

  {/* Progress bar */}
  {uploadProgress > 0 && uploadProgress < 100 && (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-orange-500 h-2 transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-1">{t[language].hero.uploading}{uploadProgress}%</p>
    </div>
  )}

  {/* Buttons */}
  <div className="flex justify-end gap-3 pt-2">
    <button
      type="button"
      onClick={() => setShowSubmit(false)}
      disabled={isSubmitting}
      className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition disabled:opacity-50"
    >
     {t[language].hero.cancel}
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50"
    >
      {isSubmitting
        ? uploadProgress > 0
          ? `Upload ${uploadProgress}%`
          : t[language].hero.sending
        : t[language].hero.submit}
    </button>
  </div>
</form>

  </div>
</div>

      )}
      
      {/* Gemini AI Chat */}
      <GeminiChat />
    </div>
  );
}