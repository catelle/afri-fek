'use client';

import React, { useState, useEffect } from 'react';
import '../styles/translation.css';
import { ExternalLink, Facebook, Linkedin, Mail, MapPin, Phone, Twitter, X } from 'lucide-react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GeminiChat from '@/components/GeminiChat';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LandingPage from '@/components/LandingPage';
import FilterBar from '@/components/FilterBar';
import ResourceList from '@/components/ResourceList';
import ResourceForm from '@/components/ResourceForm';
import StatisticsBar from '@/components/StatisticsBar';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { t } from '@/lib/traduction';
import { cache } from '@/lib/cache';
import { useAITranslation } from '@/hooks/useAITranslation';
import { uploadImage } from '@/lib/supabase';
import { sendNotificationEmail } from '@/lib/email';
import ContactForm from '@/components/ContactForm';
import ClarificationForm from '@/components/ClarificationForm';
import UserCommentForm from '@/components/UserCommentForm';
import { supabaseKeepAlive } from '@/lib/supabase-keepalive';


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
    language:'',
    image: '',
    isbn: '',
    statut: '',
    publisher: '',
    detailsStatut: '',
    resourceLanguage: 'fr',
    domainJournal: '',
    // New fields
    organisationName: '',
    chiefEditor: '',
    email: '',
    articleType: 'pdf',
    frequency: 'monthly',
    licenseType: 'open-access',
    issnOnline: '',
    issnPrint: '',
    contactNumber: '',
    resourceStartYear: '',
    discipline: '',
    coverageEndYear: '',
    coverageStartYear: '',
    coverageStatus: ''
    
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [showStatistics, setShowStatistics] = useState(false);
  const { userLanguage, setUserLanguage, translatePageContent, translateResources, isTranslating } = useAITranslation();
  const [showBanner, setShowBanner] = useState(false);

  const handleLanguageChange = async (newLang: string) => {
    console.log('Language changed to:', newLang);
    
    // Update local language state immediately for UI reflection
    setLanguage(newLang as 'fr' | 'en');
    
    // Use the hook's setUserLanguage which handles translation
    setUserLanguage(newLang);
  };
  const [showContact, setShowContact] = useState(false);
  const [showClarification, setShowClarification] = useState(false);
  const [showUserComment, setShowUserComment] = useState(false);
  const [pendingResourceData, setPendingResourceData] = useState<any>(null);

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
    if (isTranslating) {
      setShowBanner(true);
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 30000); // 60 seconds

      return () => clearTimeout(timer);
    }
  }, [isTranslating]);


  useEffect(() => {
    loadResourcesWithCache();
    
    // Start Supabase keep-alive service
    supabaseKeepAlive.start();
    
    // Cleanup on unmount
    return () => {
      supabaseKeepAlive.stop();
    };
  }, []);

  // Trigger translation when language changes or page loads
  useEffect(() => {
    const currentLang = document.body.getAttribute('data-translated-lang');
    
    if (userLanguage !== 'fr' && currentLang !== userLanguage) {
      console.log('Auto-translating page to', userLanguage);
      setTimeout(() => {
        translatePageContent();
      }, 1000); // Increased delay for better reliability
    }
    
    // Always show content
    document.body.style.opacity = '1';
  }, [userLanguage]);

  // Also trigger translation when page content changes
  useEffect(() => {
    if (userLanguage !== 'fr') {
      const observer = new MutationObserver(() => {
        const currentLang = document.body.getAttribute('data-translated-lang');
        if (currentLang !== userLanguage) {
          setTimeout(() => {
            translatePageContent();
          }, 500);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => observer.disconnect();
    }
  }, [userLanguage]);

  const loadResourcesWithCache = async () => {
    try {
      // Always try to get cached data first
      const cachedData = await cache.get('all-resources');
      
      if (cachedData) {
        // Show cached data immediately (even if online)
        setApprovedResources(cachedData);
      }
      
      // Always check for updates if online (regardless of cache)
      if (navigator.onLine) {
        // Update in background without blocking UI
        fetchAndCacheResources(false);
      } else if (!cachedData) {
        // Only show empty if offline AND no cache
        console.log('Offline: No cached data available');
        setApprovedResources([]);
      }
    } catch (error) {
      console.error('Cache error:', error);
      // Try to fetch only if online
      if (navigator.onLine) {
        fetchAndCacheResources(false);
      }
    }
  };

  const fetchAndCacheResources = async (showLoading: boolean = true) => {
    // Skip Firebase if offline
    if (!navigator.onLine) {
      const cachedData = await cache.get('all-resources');
      if (cachedData) {
        setApprovedResources(cachedData);
      }
      return;
    }

    try {
      const getDefaultImage = (type: string) => {
        switch(type) {
          case 'journal': return '/search.png';
          case 'article': return '/hero3.jpeg';
          case 'academy': return '/academy.jpg';
          default: return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
        }
      };
      
      // Wave 1: Load manual resources first (faster)
      const resourcesSnapshot = await getDocs(query(collection(db, 'resources'), where('status', '==', 'approved')));
      
      const resources = resourcesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          description: data.description || '',
          link: data.link,
          country: data.country || '',
          image: data.image || getDefaultImage(data.type),
          date: data.date || new Date().toISOString().split('T')[0],
          resourceLanguage: data.resourceLanguage || 'fr',
          isbn: data.isbn || '',
          about: data.about || '',
          language: data.language || '',
          statut: data.statut || '',
          detailsStatut: data.detailsStatut || '',
          domainJournal: data.domainJournal || '',
          source: 'manual',
          publisher: data.publisher || '',
          organisationName: data.organisationName || '',
          chiefEditor: data.chiefEditor || '',
          email: data.email || '',
          articleType: data.articleType || '',
          frequency: data.frequency || '',
          licenseType: data.licenseType || '',
          issnOnline: data.issnOnline || '',
          issnPrint: data.issnPrint || '',
          contactNumber: data.contactNumber || '',
          resourceStartYear: data.resourceStartYear || '',
          discipline: data.discipline || '',
          coverageEndYear: data.coverageEndYear || '',
          coverageStartYear: data.coverageStartYear || '',
          coverageStatus: data.coverageStatus || ''
        };
      });
      
      // Show first wave immediately
      setApprovedResources(resources);
      
      // Wave 2: Load XLSX resources after short delay
      setTimeout(async () => {
        try {
          const uploadedSnapshot = await getDocs(collection(db, 'FormuploadedResult'));
          
          const uploadedResources = uploadedSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              type: data.type,
              description: data.description || '',
              link: data.link || '',
              country: data.country || '',
              image: data.image || getDefaultImage(data.type),
              date: data.date || new Date().toISOString().split('T')[0],
              resourceLanguage: data.resourceLanguage || 'fr',
              isbn: data.isbn || '',
              about: data.about || '',
              language: data.language || '',
              statut: data.statut || '',
              detailsStatut: data.detailsStatut || '',
              domainJournal: data.domainJournal || '',
              source: 'xlsx',
              publisher: data.publisher || '',
              organisationName: data.organisationName || '',
              chiefEditor: data.chiefEditor || '',
              email: data.email || '',
              articleType: data.articleType || '',
              frequency: data.frequency || '',
              licenseType: data.licenseType || '',
              issnOnline: data.issnOnline || '',
              issnPrint: data.issnPrint || '',
              contactNumber: data.contactNumber || '',
              resourceStartYear: data.resourceStartYear || '',
              discipline: data.discipline || '',
              coverageEndYear: data.coverageEndYear || '',
              coverageStartYear: data.coverageStartYear || '',
              coverageStatus: data.coverageStatus || ''
            };
          });
          
          // Add wave 2 to existing resources
          const allResources = [...resources, ...uploadedResources];
          
          // Set resources first, then translate if needed
          setApprovedResources(allResources);
          
          if (userLanguage !== 'fr') {
            console.log('Auto-translating resources to', userLanguage);
            const translatedResources = await translateResources(allResources);
            setApprovedResources(translatedResources);
          }
          
          // Cache complete data
          await cache.set('all-resources', allResources);
        } catch (error) {
          console.error('Wave 2 loading error:', error);
        }
      }, 200);
      
    } catch (error) {
      console.error('Firebase error, using cached data:', error);
      
      // Always try to use cached data when Firebase fails
      try {
        const cachedData = await cache.get('all-resources');
        if (cachedData) {
          console.log('Using cached data due to Firebase error');
          setApprovedResources(cachedData);
        } else {
          console.log('No cached data available');
          setApprovedResources([]);
        }
      } catch (cacheError) {
        console.error('Cache also failed:', cacheError);
        setApprovedResources([]);
      }
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
      let imageUrl = '';
      
      if (selectedFile) {
        try {
          setUploadProgress(25);
          // Upload to Supabase Storage
          imageUrl = await uploadImage(selectedFile);
          setUploadProgress(100);
        } catch (error) {
          console.error('Supabase upload error:', error);
          imageUrl = ''; // Leave empty if upload fails
          setSubmitMessage('Upload de l\'image échoué, ressource soumise sans image.');
        }
      }
      
      const resourceData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        isbn: formData.isbn,
        about: formData.about || '',
        link: formData.link,
        country: formData.country || '',
        language:formData.language,
        image: imageUrl,
        statut: formData.statut,
        detailsStatut: formData.detailsStatut,
        resourceLanguage: formData.resourceLanguage,
        domainJournal: formData.domainJournal || '',
        publisher: formData.publisher || '',
        // New fields
        organisationName: formData.organisationName || '',
        chiefEditor: formData.chiefEditor || '',
        email: formData.email || '',
        articleType: formData.articleType || 'pdf',
        frequency: formData.frequency || 'monthly',
        licenseType: formData.licenseType || 'open-access',
        issnOnline: formData.issnOnline || '',
        issnPrint: formData.issnPrint || '',
        contactNumber: formData.contactNumber || '',
        resourceStartYear: formData.resourceStartYear || '',
        discipline: formData.discipline || '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        createdAt: new Date(),
        submittedAt: new Date().toISOString(),
        coverageEndYear: formData.coverageEndYear || '',
        coverageStartYear: formData.coverageStartYear || '',
        coverageStatus: formData.coverageStatus || ''
      };
      
      const docRef = await addDoc(collection(db, 'resources'), resourceData);
      
      // Store resource data for clarification form
      setPendingResourceData({ ...resourceData, id: docRef.id });
      
      clearTimeout(timeoutId);
      setSubmitMessage('Ressource soumise avec succès!');
      
      // Show user comment form instead of clarification
      setShowUserComment(true);
      
      setFormData({
        name: '',
        type: 'article',
        description: '',
        about: '',
        link: '',
        country: '',
        domainJournal: '',
        publisher: '',
        language:'',
        image: '',
        isbn: '',
        detailsStatut: '',
        statut: '',
        resourceLanguage: 'fr',
        // New fields
        organisationName: '',
        chiefEditor: '',
        email: '',
        articleType: 'pdf',
        frequency: 'monthly',
        licenseType: 'open-access',
        issnOnline: '',
        issnPrint: '',
        contactNumber: '',
        resourceStartYear: '',
        discipline: '',
        coverageEndYear: '',
        coverageStartYear: '',
        coverageStatus: ''
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Erreur soumission:', error);
      setSubmitMessage(`Erreur: ${error instanceof Error ? error.message : 'Veuillez réessayer'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Veuillez sélectionner un fichier JPEG, PNG ou JPG.');
        e.target.value = '';
        return;
      }
      
      // Check image dimensions (2.5cm x 2.5cm = ~71x71 pixels at 72 DPI)
      const img = new Image();
      img.onload = () => {
        if (img.width > 71 || img.height > 71) {
          alert('Image trop grande! Maximum: 2.5cm x 2.5cm (71x71 pixels à 72 DPI). Veuillez redimensionner votre image.');
          e.target.value = '';
          return;
        }
        setSelectedFile(file);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const allResources = [...approvedResources];
  const filtered = allResources
    .filter(
      (item) =>
        (tab === 'all' || item.type === tab) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // Priority resources (always on top)
      const isPriorityA = a.name === 'Health Sciences and Disease' || 
                         a.name === 'Health Research in Africa (HRA)' ||
                         a.name?.toLowerCase().includes('hra') ||
                         a.name?.toLowerCase().includes('hsd') ||
                         a.name?.toLowerCase().includes('afrimvoe') ||
                         a.description?.toLowerCase().includes('hra') ||
                         a.description?.toLowerCase().includes('hsd') ||
                         a.description?.toLowerCase().includes('afrimvoe') ||
                         a.link?.toLowerCase().includes('hsd') ||
                         a.link?.toLowerCase().includes('hra');
      
      const isPriorityB = b.name === 'Health Sciences and Disease' || 
                         b.name === 'Health Research in Africa (HRA)' ||
                         b.name?.toLowerCase().includes('hra') ||
                         b.name?.toLowerCase().includes('hsd') ||
                         b.name?.toLowerCase().includes('afrimvoe') ||
                         b.description?.toLowerCase().includes('hra') ||
                         b.description?.toLowerCase().includes('hsd') ||
                         b.description?.toLowerCase().includes('afrimvoe') ||
                         b.link?.toLowerCase().includes('hsd') ||
                         b.link?.toLowerCase().includes('hra');
      
      // Priority items always come first
      if (isPriorityA && !isPriorityB) return -1;
      if (!isPriorityA && isPriorityB) return 1;
      
      // For non-priority items, sort by image quality
      const isDefaultImageA = a.image?.includes('/logo-afrimvoe') || a.image?.includes('unsplash.com');
      const isDefaultImageB = b.image?.includes('/logo-afrimvoe') || b.image?.includes('unsplash.com');
      
      // If one has real image and other has default, prioritize real image
      if (!isDefaultImageA && isDefaultImageB) return -1;
      if (isDefaultImageA && !isDefaultImageB) return 1;
      
      // If both have same image type, sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const filteredData = filtered.filter(item => {
    return (
      (!filterType || item.type === filterType) &&
      (!filterCountry || item.country === filterCountry) &&
      (!filterLanguage || item.resourceLanguage === filterLanguage)
    );
  });

  const countries = Array.from(new Set(filtered.map(item => item.country)));

  const handleUserCommentSubmit = async (commentData: { name: string; phone: string; message: string }) => {
    try {
      const response = await fetch('/api/send-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...commentData,
          resourceData: pendingResourceData
        })
      });
      
      if (response.ok) {
        setShowUserComment(false);
        setShowSubmit(false);
        setSubmitMessage('');
        setPendingResourceData(null);
        alert('Commentaire envoyé avec succès!');
      } else {
        throw new Error('Failed to send comment');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      alert('Erreur lors de l\'envoi du commentaire');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar 
        tab={tab} 
        setTab={setTab} 
        language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'} 
        setLanguage={(lang: 'fr' | 'en') => setUserLanguage(lang)} 
        resources={approvedResources}
        t={t}
        search={search}
        setSearch={setSearch}
        setShowSubmit={setShowSubmit}
        showStatistics={showStatistics}
        setShowStatistics={setShowStatistics}
        onContactClick={() => setShowContact(true)}
        onLanguageChange={handleLanguageChange}
      />
      
      <div className="fixed top-4 right-4 z-50">
        {/* <LanguageSelector 
          currentLanguage={userLanguage}
          onLanguageChange={handleLanguageChange}
        /> */}
        {/* {isTranslating && (
          <div className="mt-2 text-sm text-orange-600 bg-white px-2 py-1 rounded shadow">
            Translating to {userLanguage}...
          </div>
        )}
        <div className="mt-1 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          Current: {userLanguage}
        </div> */}
      </div>
      
     {showBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="translation-spinner border-orange-500 border-t-orange-200"></div>
            <span className="text-sm font-medium">...</span>
          </div>
        </div>
      )}

      {showStatistics && (
        <StatisticsBar 
          resources={approvedResources} 
          language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'} 
          t={t} 
        />
      )}
      
      <div className="flex-1 mt-[112px]">
      {tab === 'all' ? (
        <LandingPage 
          resources={approvedResources} 
          language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'} 
          t={t}
          onNavigateToJournals={() => setTab('journal')}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-10 bg-white ">
          <FilterBar 
            filterType={null}
            setFilterType={() => {}}
            filterCountry={filterCountry}
            setFilterCountry={setFilterCountry}
            filterLanguage={filterLanguage}
            setFilterLanguage={setFilterLanguage}
            countries={countries}
            language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
            t={t}
            allResources={filteredData}
          />
          <ResourceList 
            resources={filteredData} 
            language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'} 
            t={t} 
          />
        </main>
      )}
      </div>

      <ResourceForm
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        formData={{
          resourceTitle: formData.name || '',
          resourceUrl: formData.link || '',
          organisationName: formData.organisationName || '',
          chiefEditor: formData.chiefEditor || '',
          email: formData.email || '',
          articleType: formData.articleType || 'pdf',
          frequency: formData.frequency || 'monthly',
          licenseType: formData.licenseType || 'open-access',
          language: formData.resourceLanguage || 'fr',
          issnOnline: formData.issnOnline || '',
          issnPrint: formData.issnPrint || '',
          contactNumber: formData.contactNumber || '',
          country: formData.country || '',
          publisher: formData.publisher || '',
          domainJournal:formData.domainJournal,
          resourceStartYear: formData.resourceStartYear || '',
          discipline: formData.discipline || '',
          type: formData.type || 'article',
          description: formData.description || '',
          about: formData.about || '',
          image: formData.image || '',
          status: formData.statut || 'active',
          coverageEndYear:formData.coverageEndYear || '',
          coverageStartYear:formData.coverageStartYear || '',
          coverageStatus:formData.coverageStatus || ''
        }}
        onInputChange={(e) => {
          const { name, value } = e.target;
          // Map new field names to old formData structure
          const fieldMapping: { [key: string]: string } = {
            resourceTitle: 'name',
            resourceUrl: 'link',
            organisationName: 'organisationName',
            chiefEditor: 'chiefEditor',
            email: 'email',
            articleType: 'articleType',
            frequency: 'frequency',
            licenseType: 'licenseType',
            language: 'resourceLanguage',
            publisher: 'publisher',
            country: 'country',
            domainJournal: 'domainJournal',
            resourceStartYear: 'resourceStartYear',
            discipline: 'discipline',
            type: 'type',
            description: 'description',
            about: 'about',
            status: 'statut',
            issnOnline: 'issnOnline',
            issnPrint: 'issnPrint',
            contactNumber: 'contactNumber',
            resourceEndYear: 'resourceEndYear',
            coverageStartYear : 'coverageStartYear',
            coverageEndYear : 'coverageEndYear',
            coverageStatus : 'coverageStatus'
          };
          
          const mappedName = fieldMapping[name] || name;
          setFormData(prev => ({ ...prev, [mappedName]: value }));
        }}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        selectedFile={selectedFile}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        uploadProgress={uploadProgress}
        language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
        t={t}
      />

      <GeminiChat />
      
      <ContactForm 
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />
      
      <UserCommentForm 
        isOpen={showUserComment}
        onClose={() => {
          setShowUserComment(false);
          setShowSubmit(false);
          setSubmitMessage('');
          setPendingResourceData(null);
        }}
        onSubmit={handleUserCommentSubmit}
        isSubmitting={isSubmitting}
        resourceData={pendingResourceData}
      />
      
      <LanguageSelector onLanguageSelect={handleLanguageChange} />
      
      <Footer language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'} t={t} />
    </div>
  );
}