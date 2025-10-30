'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Search, Plus, BookOpen, GraduationCap, Building2, X, Menu } from 'lucide-react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GeminiChat from '@/components/GeminiChat';
import { t } from '@/lib/traduction';
import Navbar from '@/components/Navbar';
import ResourceDetailContent from '@/components/ResourceDetailContent';
import ResourceForm from '@/components/ResourceForm';
import { uploadImage } from '@/lib/supabase';

export default function ResourceDetail() {
  const params = useParams();
  const router = useRouter();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const [language, setLanguage] = useState<'fr' | 'en'>('fr');


  const [showStatistics, setShowStatistics] = useState(false);
  const [search, setSearch] = useState('');
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
    detailsStatut: '',
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
    coverageStartYear: '',
    coverageEndYear: '',
    coverageStatus: 'ongoing',
    publisher: '',
    domainJournal: '',
    discipline: '',
   
  });
  const [tab, setTab] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingResourceData, setPendingResourceData] = useState<any>(null);
  const [showClarification, setShowClarification] = useState(false);

  

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 1MB. Veuillez sélectionner une image JPEG, PNG ou JPG de 1MB maximum.');
        e.target.value = '';
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Veuillez sélectionner un fichier JPEG, PNG ou JPG de 1MB maximum.');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
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
          coverageStartYear: formData.coverageStartYear || '',
          coverageEndYear: formData.coverageEndYear || '',
          coverageStatus: formData.coverageStatus || 'ongoing',
          publisher: formData.publisher || '',
          domainJournal: formData.domainJournal || '',
          discipline: formData.discipline || '',
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          createdAt: new Date(),
          submittedAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'resources'), resourceData);
        
        // Store resource data for clarification form
        setPendingResourceData({ ...resourceData, id: docRef.id });
        
        clearTimeout(timeoutId);
        setSubmitMessage('Ressource soumise avec succès!');
        
        // Show clarification form
        setShowClarification(true);
        
        setFormData({
          name: '',
          type: 'article',
          description: '',
          about: '',
          link: '',
          country: '',
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
          coverageStartYear: '',
          coverageEndYear: '',
          coverageStatus: 'ongoing',
          publisher: '',
          domainJournal: '',
          discipline: '',
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

  useEffect(() => {
    const fetchResource = async () => {
      const resourceId = params?.id as string;
      
      try {
        // Search in both collections
        const [resourcesSnapshot, uploadedSnapshot] = await Promise.all([
          getDocs(collection(db, 'resources')),
          getDocs(collection(db, 'FormuploadedResult'))
        ]);
        
        // First try to find in resources collection
        let firestoreResource = resourcesSnapshot.docs.find(doc => doc.id === resourceId);
        
        // If not found, try FormuploadedResult collection
        if (!firestoreResource) {
          firestoreResource = uploadedSnapshot.docs.find(doc => doc.id === resourceId);
        }
        
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
            image: data.image || '/hero3.jpeg',
            date: data.date || new Date().toISOString().split('T')[0],
            isbn: data.isbn || '',
            statut: data.statut || '',
            detailsStatut: data.detailsStatut || '',
            publisher: data.publisher || '',
            coverageStartYear: data.coverageStartYear || '',
            coverageEndYear: data.coverageEndYear || '',
            coverageStatus: data.coverageStatus || '',
            resourceUrl: data.resourceUrl || '',
            domainJournal: data.domainJournal || '',
            issnOnline: data.issnOnline || '',
            issnPrint: data.issnPrint || ''
          });
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      }
      
      setLoading(false);
    };

    if (params?.id) {
      fetchResource();
    }
  }, [params?.id]);

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
      <Navbar 
        tab={tab} 
        setTab={(newTab) => {
          if (newTab === 'all') {
            router.push('/');
          } else {
            router.push(`/?tab=${newTab}`);
          }
        }} 
        language={language} 
        setLanguage={setLanguage} 
        resources={approvedResources}
        t={t}
        search={search}
        setSearch={setSearch}
        setShowSubmit={setShowSubmit}
        showStatistics={showStatistics}
        setShowStatistics={setShowStatistics}
      />
      
      {loading ? (
        <div className="min-h-screen bg-white flex items-center justify-center mt-[112px]">
          <p className="text-gray-500">{t[language].loading}</p>
        </div>
      ) : !resource ? (
        <div className="min-h-screen bg-white flex items-center justify-center mt-[112px]">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{t[language].hero.resourcenotfound}</p>
            <button
              onClick={() => router.push('/')}
              className="text-orange-500 hover:text-orange-600"
            >
              {t[language].hero.back}
            </button>
          </div>
        </div>
      ) : (
        <ResourceDetailContent
          resource={resource}
          language={language}
          t={t}
          onBack={() => router.push('/')}
        />
      )}

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
                coverageStartYear: formData.coverageStartYear || '',
                coverageEndYear: formData.coverageEndYear || '',
                coverageStatus: formData.coverageStatus || 'ongoing',
                publisher: formData.publisher || '',
                domainJournal: formData.domainJournal || '',
                discipline: formData.discipline || '',
                type: formData.type || 'article',
                description: formData.description || '',
                about: formData.about || '',
                image: formData.image || ''
              }}
              onInputChange={(e: { target: { name: any; value: any; }; }) => {
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
                  issnOnline: 'issnOnline',
                  issnPrint: 'issnPrint',
                  contactNumber: 'contactNumber',
                  coverageStartYear: 'coverageStartYear',
                  coverageEndYear: 'coverageEndYear',
                  coverageStatus: 'coverageStatus',
                  publisher: 'publisher',
                  domainJournal: 'domainJournal',
                  discipline: 'discipline'
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
              language={language}
              t={t}
            />
      
      
      {/* Gemini AI Chat */}
      <GeminiChat />
    </div>
  );
}