'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GeminiChat from '@/components/GeminiChat';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import ResourceList from '@/components/ResourceList';
import ResourceForm from '@/components/ResourceForm';

import { t } from '@/lib/traduction';


export default function Home() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [showSubmit, setShowSubmit] = useState(false);
  const [approvedResources, setApprovedResources] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'article',
    description: '',
    about: '',
    link: '',
    country: '',
    language: '',
    image: '',
    isbn: '',
    statut: '',
    detailsStatut: '',
    resourceLanguage: 'fr',
    // Add missing FormData properties with default values
    resourceTitle: '',
    resourceUrl: '',
    organisationName: '',
    articleType: '',
    frequency: '', // Added missing property
    licenseType: '', // Added missing property
    // Add any other required fields with default values
    // Example:
    // publicationDate: '',
    // author: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  // Handle tab from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        setTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    fetchApprovedResources();
  }, []);

  const fetchApprovedResources = async () => {
    try {
      const q = query(collection(db, 'resources'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const resources = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const getDefaultImage = (type: string) => {
          switch(type) {
            case 'journal': return '/logo-afrimvoe2.png';
            case 'article': return '/logo-afrimvoe3.png';
            case 'academy': return '/logo-afrimvoe.png';
            default: return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
          }
        };
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          description: data.description,
          isbn: data.isbn,
          about: data.about || '',
          link: data.link,
          language:data.language,
          statut: data.statut,
          detailsStatut: data.detailsStatut,
          country: data.country || '',
          image: data.image || getDefaultImage(data.type),
          date: data.date || new Date().toISOString().split('T')[0],
          resourceLanguage: data.resourceLanguage || 'fr'
        };
      });
      
      // Also fetch uploaded resources
      const uploadedQuery = await getDocs(collection(db, 'FormuploadedResult'));
      const uploadedResources = uploadedQuery.docs.map(doc => {
        const data = doc.data();
        const getDefaultImage = (type: string) => {
          switch(type) {
            case 'journal': return '/logo-afrimvoe2.png';
            case 'article': return '/logo-afrimvoe3.png';
            case 'academy': return '/logo-afrimvoe.png';
            default: return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
          }
        };
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          description: data.description,
          isbn: data.isbn,
          about: data.about || '',
          link: data.link,
          language: data.language,
          statut: data.statut,
          detailsStatut: data.detailsStatut,
          country: data.country || '',
          image: data.image || getDefaultImage(data.type),
          date: data.date || new Date().toISOString().split('T')[0],
          resourceLanguage: data.resourceLanguage || 'fr'
        };
      });
      
      const allResources = [...resources, ...uploadedResources];
      setApprovedResources(allResources);
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

    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Timeout - Veuillez réessayer.');
    }, 30000);

    try {
      let imageUrl = `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop`;
      
      if (selectedFile) {
        try {
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
        } catch (error) {
          setSubmitMessage('Conversion d\'image échouée, utilisation d\'une image par défaut.');
        }
      }
      
      const docRef = await addDoc(collection(db, 'resources'), {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        isbn: formData.isbn,
        about: formData.about || '',
        link: formData.link,
        country: formData.country || '',
        language: formData.language,
        image: imageUrl,
        statut: formData.statut,
        detailsStatut: formData.detailsStatut,
      });

      setFormData({
        name: '',
        type: 'article',
        description: '',
        about: '',
        link: '',
        country: '',
        language: '',
        image: '',
        isbn: '',
        detailsStatut: '',
        statut: '',
        resourceLanguage: 'fr',
        // Reset missing FormData properties as well
        resourceTitle: '',
        resourceUrl: '',
        organisationName: '',
        articleType: '',
        frequency: '', // Reset missing property
        licenseType: '', // Reset missing property
        // Reset any other required fields
        // publicationDate: '',
        // author: '',
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
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
      if (file.size > 5 * 1024 * 1024) {
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

  const filteredData = filtered.filter(item => {
    return (
      (!filterType || item.type === filterType) &&
      (!filterCountry || item.country === filterCountry) &&
      (!filterLanguage || item.resourceLanguage === filterLanguage)
    );
  });

  const countries = Array.from(new Set(filtered.map(item => item.country)));

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar 
        tab={tab}
        setTab={setTab}
        language={language}
        setLanguage={setLanguage}
        t={t} search={''} setSearch={function (search: string): void {
          throw new Error('Function not implemented.');
        } } setShowSubmit={function (show: boolean): void {
          throw new Error('Function not implemented.');
        } } showStatistics={false} setShowStatistics={function (show: boolean): void {
          throw new Error('Function not implemented.');
        } }      />
      
      <Header 
        search={search}
        setSearch={setSearch}
        setShowSubmit={setShowSubmit}
        language={language}
        t={t} showStatistics={false} setShowStatistics={function (show: boolean): void {
          throw new Error('Function not implemented.');
        } }      />

      <main className="max-w-7xl mx-auto px-4 py-10 bg-white mt-[112px]">
        {tab === 'all' ? (
          <>
            <HeroSection language={language} t={t} />
            
            <FilterBar 
              filterType={filterType}
              setFilterType={setFilterType}
              filterCountry={filterCountry}
              setFilterCountry={setFilterCountry}
              filterLanguage={filterLanguage}
              setFilterLanguage={setFilterLanguage}
              countries={countries}
              language={language}
              t={t}
              allResources={filteredData}
            />

            <section className="px-6 md:px-20 flex flex-col min-h-[66vh]">
              <ResourceList 
                resources={filteredData} 
                language={language} 
                t={t} 
              />
            </section>
          </>
        ) : (
          <section className="max-w-7xl mx-auto px-4 py-10 bg-white flex flex-col min-h-[66vh]">
            <FilterBar 
              filterType={null}
              setFilterType={() => {}}
              filterCountry={filterCountry}
              setFilterCountry={setFilterCountry}
              filterLanguage={filterLanguage}
              setFilterLanguage={setFilterLanguage}
              countries={countries}
              language={language}
              t={t}
              allResources={filteredData}
            />
            <ResourceList 
              resources={filteredData} 
              language={language} 
              t={t} 
            />
          </section>
        )}
      </main>

      <ResourceForm
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        selectedFile={selectedFile}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        uploadProgress={uploadProgress}
        language={language}
        t={t}
      />

      <GeminiChat />
    </div>
  );
}