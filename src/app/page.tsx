'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  GraduationCap,
  Building2,
  ExternalLink,
  X
} from 'lucide-react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

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
    country: '',
    image: ''
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
          about: data.about || '',
          link: data.link,
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
          console.log('Image converted to Base64');
        } catch (error) {
          console.log('Base64 conversion failed, using default image:', error);
          setSubmitMessage('Conversion d\'image échouée, utilisation d\'une image par défaut.');
        }
      }
      
      console.log('Adding to Firestore with image URL:', imageUrl);
      // Add resource to Firestore with pending status
      const docRef = await addDoc(collection(db, 'resources'), {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        about: formData.about || '',
        link: formData.link,
        country: formData.country || '',
        image: imageUrl,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        createdAt: new Date(),
        submittedAt: new Date().toISOString()
      });
      
      console.log('Document added with ID:', docRef.id);
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
        image: ''
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

  const allResources = [...approvedResources, ...data];
  const filtered = allResources
    .filter(
      (item) =>
        (tab === 'all' || item.type === tab) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-orange-500">Afri-</span>
              <span className="text-green-500">fek</span>
            </h1>
            <img 
              src="/logo-afrimvoe.png" 
              alt="Afri-fek" 
              className="h-8 w-auto -mb-1"
            />
          </div>
          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une organisation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowSubmit(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Soumettre une ressource
          </button>
        </div>
      </header>

      {/* Featured Section - Hidden on mobile */}
      <section className="hidden md:block bg-gradient-to-r from-orange-50 to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🌍 Ressource à la une
            </h2>
            <p className="text-gray-600 text-sm">
              Découvrez notre sélection du moment
            </p>
          </div>
          {data.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
              <div className="md:flex">
                <img
                  src={data[0].image}
                  alt={data[0].name}
                  className="w-full md:w-1/3 h-48 md:h-32 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop';
                  }}
                />
                <div className="p-4 md:w-2/3">
                  <h3 className="text-lg font-semibold mb-2">{data[0].name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{data[0].description}</p>
                  <a
                    href={data[0].link}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" /> Voir plus
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <nav className="bg-white md:border-b">
        <div className="max-w-7xl mx-auto px-4 flex space-x-6 overflow-x-auto">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'article', label: 'Articles', icon: BookOpen },
            { id: 'journal', label: 'Revues', icon: BookOpen },
            { id: 'academy', label: 'Académies', icon: GraduationCap },
            { id: 'institution', label: 'Institutions', icon: Building2 },
            { id: 'blog', label: 'Blogs', icon: BookOpen }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`py-4 text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                tab === id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Cards */}
      <main className="max-w-7xl mx-auto px-4 py-0 md:py-10 bg-white">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">Aucune ressource trouvée.</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg border overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
                onClick={() => {
                  setSelected(item);
                  setShowModal(true);
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onLoad={() => console.log('Image loaded successfully:', item.image)}
                  onError={(e) => {
                    console.log('Image failed to load:', item.image);
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop';
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${
                        item.type === 'article'
                          ? 'bg-blue-100 text-blue-800'
                          : item.type === 'journal'
                          ? 'bg-orange-100 text-orange-800'
                          : item.type === 'academy'
                          ? 'bg-green-100 text-green-800'
                          : item.type === 'blog'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-xs">{item.country}</p>
                    <p className="text-gray-400 text-xs">{new Date(item.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </article>
            ))}
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
              <h3 className="font-semibold mb-2">À propos</h3>
              <p className="text-gray-600 mb-6">{selected.about}</p>
              <div className="flex gap-4">
                <a
                  href={selected.link}
                  target="_blank"
                  className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visiter
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 px-5 py-2 rounded hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubmit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <header className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Soumettre une ressource</h2>
              <button onClick={() => setShowSubmit(false)}>
                <X className="w-6 h-6" />
              </button>
            </header>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  submitMessage.includes('succès') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submitMessage}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="article">Article</option>
                  <option value="journal">Revue</option>
                  <option value="academy">Académie</option>
                  <option value="institution">Institution</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3} 
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">À propos</label>
                <textarea 
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={3} 
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Description détaillée (optionnel)"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Site web *</label>
                <input 
                  type="url" 
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Pays</label>
                <input 
                  type="text" 
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg" 
                  placeholder="ex: Sénégal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Fichier sélectionné: {selectedFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Sélectionnez une image (max 5MB) ou laissez vide pour l'image par défaut
                </p>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-1">Upload en cours... {uploadProgress}%</p>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubmit(false)}
                  disabled={isSubmitting}
                  className="bg-gray-100 px-5 py-2 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting ? (uploadProgress > 0 ? `Upload ${uploadProgress}%` : 'Envoi...') : 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}