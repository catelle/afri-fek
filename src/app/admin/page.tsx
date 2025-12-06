'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';
import { Edit, Trash2, Save, X, Filter, Search, Shield, LogOut, Upload, FileText, BarChart3, TrendingUp, Users, Globe, Calendar, Activity, Home, Settings, Image, Database, Menu, Mail } from 'lucide-react';
import ResourceForm from '@/components/ResourceForm';
import Footer from '@/components/Footer';
import RichTextEditor from '@/components/RichTextEditor';
import { getDomainName } from '@/hooks/constants';
import { ref } from 'firebase/storage';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import PartnersManagement from '@/components/admin/PartnersManagement';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  about: string;
  link: string;
  country: string;
  image: string;
  isbn: string;
  statut: string;
  detailsStatut: string;
  resourceLanguage: string;
  status: string;
  date: string;
  source?: string;
  // New fields
  resourceTitle?: string;
  resourceUrl?: string;
  organisationName?: string;
  chiefEditor?: string;
  email?: string;
  articleType?: string;
  frequency?: string;
  licenseType?: string;
  language?: string;
  issnOnline?: string;
  issnPrint?: string;
  contact?: string;
  coverageStartYear?: string;
  coverageEndYear?: string;
  coverageStatus?: string;
  publisher?: string;
  domainJournal?: string;
  discipline?: string;
  abbreviation?: string;
  references?:string;
  address?:string;
  citationCount?:string;
  keywords?:string;
  doiPrefix?:string;
  subjects?:string;
  filiere?:string;
  // Ouvrage specific fields
  authors?: string;
  isbn?: string;
  publishedYear?: string;
  pages?: string;
  edition?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editForm, setEditForm] = useState<Partial<Resource>>({});
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    country: '',
    search: '',
    domain: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploadedResources, setUploadedResources] = useState<Resource[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [heroImages, setHeroImages] = useState([
    { name: 'hero.jpg', url: '/hero.jpg' },
    { name: 'hero2.jpg', url: '/hero2.jpg' },
    { name: 'minesup3.png', url: '/minesup.jpeg' }
  ]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPrintFilters, setShowPrintFilters] = useState(false);
  const [printFilters, setPrintFilters] = useState({
    status: '',
    type: '',
    country: '',
    domain: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [xlsxFiles, setXlsxFiles] = useState<{ file1: File | null; file2: File | null }>({ file1: null, file2: null });
  const [processingXlsx, setProcessingXlsx] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAdminResourcesWithCache();
  }, []);

  const loadAdminResourcesWithCache = async () => {
    try {
      const cachedData = await cache.get('admin-resources');
      
      if (cachedData) {
        setResources(cachedData.resources || []);
        setUploadedResources(cachedData.uploadedResources || []);
        setLoading(false);
        
        // Background refresh if needed
        const needsRefresh = await cache.needsRefresh('admin-resources');
        if (needsRefresh) {
          fetchAllResources(false);
        }
      } else {
        fetchAllResources(true);
      }
    } catch (error) {
      console.error('Admin cache error:', error);
      fetchAllResources(true);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [resources, uploadedResources, filters]);



  const loadLandingContent = async () => {
    try {
      const contentDoc = await getDocs(query(collection(db, 'landingContent')));
      if (!contentDoc.empty) {
        const content = contentDoc.docs[0].data();
        console.log('Loaded content from Firebase:', content);
        // Ensure visionTexts is properly loaded
        setLandingContent({
          heroTitle: content.heroTitle || 'Découvrez la Recherche en Santé Africaine',
          heroSubtitle: content.heroSubtitle || 'La plateforme de référence pour accéder aux journaux, académies et institutions de recherche en santé à travers l\'Afrique',
          visionTitle: content.visionTitle || 'Notre vision',
          visionTexts: content.visionTexts || [
            'Booster l\'accès mondial aux recherches publiées dans les journaux africains. Des <strong class="text-amber-600">millions</strong> d\'articles de recherche africains sont téléchargés chaque mois, amplifiant la portée africaine et mondiale de la recherche du continent.',
            'Nous avons <strong class="text-amber-600">répertorié des académies, des institutions et des organisations dans le domaine de la santé en Afrique</strong>, afin de faciliter l\'accès aux savoirs, encourager les échanges scientifiques et valoriser les expertises locales sur la scène mondiale.',
            '<strong class="text-amber-600">Afri-Fek</strong> soutient les <strong class="text-amber-600"> modèles de publication Open Access et gratuits</strong>, et fournit l\'accès à une gamme complète de ressources gratuites pour assister les chercheurs, auteurs, éditeurs et journaux africains.'
          ],
          quotes: content.quotes || [
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
      }
      // If empty, keep the default values already set in state
    } catch (error) {
      console.error('Error loading landing content:', error);
    }
  };

  const loadHeroImages = async () => {
    try {
      const imagesDoc = await getDocs(query(collection(db, 'heroImages')));
      if (!imagesDoc.empty) {
        const images = imagesDoc.docs[0].data().images || [];
        setHeroImages(images);
      }
      // If empty, keep the default hero images already set in state
    } catch (error) {
      console.error('Error loading hero images:', error);
    }
  };

   const [landingContent, setLandingContent] = useState({
    heroTitle: 'Découvrez la Recherche en Santé Africaine',
    heroSubtitle: 'La plateforme de référence pour accéder aux journaux, académies et institutions de recherche en santé à travers l\'Afrique',
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

  const fetchAllResources = async (showLoading: boolean = true) => {
    if (showLoading) setLoading(true);
    try {
      const [resourcesSnapshot] = await Promise.all([
        getDocs(collection(db, 'ResourceFromA'))
        // getDocs(collection(db, 'FormuploadedResult'))
      ]);
      
      const allResources = resourcesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Resource)).sort((a, b) => {
        // Sort by status: pending first, then approved, then rejected
        const statusOrder = { pending: 0, approved: 1, rejected: 2 };
        const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
        const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
        if (statusA !== statusB) return statusA - statusB;
        // If same status, sort by date (newest first)
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });
      
      // const uploaded = uploadedSnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // } as Resource)).sort((a, b) => {
      //   // Sort by status: pending first, then approved, then rejected
      //   const statusOrder = { pending: 0, approved: 1, rejected: 2 };
      //   const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      //   const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      //   if (statusA !== statusB) return statusA - statusB;
      //   // If same status, sort by date (newest first)
      //   return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      // });
      
      setResources(allResources);
      setUploadedResources([]);
      
      // Cache the data
      await cache.set('admin-resources', {
        resources: allResources,
        // uploadedResources: uploaded
      });
      
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedResources = async () => {
    // This is now handled in fetchAllResources for better performance
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === 'admin@gmail.com' && loginForm.password === 'Ubuntu1') {
      setIsAuthenticated(true);
      // Load current data from database when admin logs in
      await loadLandingContent();
      await loadHeroImages();
    } else {
      alert('Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ email: '', password: '' });
  };

  const applyFilters = () => {
    let filtered = [...resources, ...uploadedResources];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.name?.toLowerCase().includes(searchLower) ||
        r.description?.toLowerCase().includes(searchLower) ||
        r.about?.toLowerCase().includes(searchLower)
      );
    }
    if (filters.status) {
      filtered = filtered.filter(r => r.statut === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters.country) {
      const countryLower = filters.country.toLowerCase();
      filtered = filtered.filter(r => r.country?.toLowerCase().includes(countryLower));
    }
    if (filters.domain) {
      filtered = filtered.filter(r => r.domainJournal === filters.domain);
    }
    
    // Sort by status: pending first, then approved, then rejected
    filtered.sort((a, b) => {
      const statusOrder = { pending: 0, approved: 1, rejected: 2 };
      const statusA = statusOrder[a.statut as keyof typeof statusOrder] ?? 3;
      const statusB = statusOrder[b.statut as keyof typeof statusOrder] ?? 3;
      
      // First priority: status (pending first)
      if (statusA !== statusB) return statusA - statusB;
      
      // Second priority: within same status, prioritize non-default images
      const isDefaultImageA = a.image?.includes('/logo-afrimvoe') || a.image?.includes('unsplash.com');
      const isDefaultImageB = b.image?.includes('/logo-afrimvoe') || b.image?.includes('unsplash.com');
      if (!isDefaultImageA && isDefaultImageB) return -1;
      if (isDefaultImageA && !isDefaultImageB) return 1;
      
      // Third priority: date (newest first)
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
    
    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const startEdit = (resource: Resource) => {
    setEditingResource(resource);
    setEditForm({
      ...resource,
       abbreviation: resource.abbreviation || '',
       statut: resource.statut || 'active',
       contact: resource.contact || '',
       references: resource.references || '',
       citationCount: resource.citationCount || '',
       keywords: resource.keywords || '',
       doiPrefix: resource.doiPrefix || '',
       subjects: resource.subjects || '',
       filiere: resource.filiere || '',
       // Ouvrage specific fields
       authors: resource.authors || '',
       isbn: resource.isbn || '',
       publishedYear: resource.publishedYear || '',
       pages: resource.pages || '',
       edition: resource.edition || '',
  });
  };

  const cancelEdit = () => {
    setEditingResource(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingResource || !editForm) return;
    
    try {
      let updatedForm = { ...editForm };
      
      // Handle image upload if a new file was selected
      if (selectedFile) {
        try {
          const { uploadImage } = await import('@/lib/supabase');
          const imageUrl = await uploadImage(selectedFile);
          updatedForm.image = imageUrl;
        } catch (error) {
          console.error('Image upload error:', error);
          alert('Erreur lors de l\'upload de l\'image, mais la ressource sera mise à jour sans nouvelle image.');
        }
      }
      
      const collection_name = 'ResourceFromA';
      const resourceRef = doc(db, collection_name, editingResource.id);
      await updateDoc(resourceRef, updatedForm);
      
      if (editingResource.source === 'XLSX_UPLOAD') {
        setUploadedResources(prev => prev.map(r => 
          r.id === editingResource.id ? { ...r, ...updatedForm } : r
        ));
      } else {
        setResources(prev => prev.map(r => 
          r.id === editingResource.id ? { ...r, ...updatedForm } : r
        ));
      }
      
      // Invalidate cache after update
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
      
      setEditingResource(null);
      setEditForm({});
      setSelectedFile(null);
      alert('Ressource mise à jour avec succès!');
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteResource = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) return;
    
    try {
      // Find the resource to determine which collection it belongs to
      const resource = [...resources, ...uploadedResources].find(r => r.id === id);
      const collection_name = 'ResourceFromA';
      
      await deleteDoc(doc(db, collection_name, id));
      
      if (resource?.source === 'XLSX_UPLOAD') {
        setUploadedResources(prev => prev.filter(r => r.id !== id));
      } else {
        setResources(prev => prev.filter(r => r.id !== id));
      }
      
      // Invalidate cache after delete
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // Find the resource to determine which collection it belongs to
      const resource = [...resources, ...uploadedResources].find(r => r.id === id);
      const collection_name = 'ResourceFromA';
      
      if (newStatus === 'rejected') {
        // Delete rejected resources
        await deleteDoc(doc(db, collection_name, id));
        
        if (resource?.source === 'XLSX_UPLOAD') {
          setUploadedResources(prev => prev.filter(r => r.id !== id));
        } else {
          setResources(prev => prev.filter(r => r.id !== id));
        }
      } else {
        // Update status for approved resources
        const resourceRef = doc(db, collection_name, id);
        await updateDoc(resourceRef, { status: newStatus, statut: 'ACTIVE' });
        
        // Update local state
        if (resource?.source === 'XLSX_UPLOAD') {
          setUploadedResources(prev => prev.map(r => 
            r.id === id ? { ...r, status: newStatus, statut: 'ACTIVE' } : r
          ));
        } else {
          setResources(prev => prev.map(r => 
            r.id === id ? { ...r, status: newStatus, statut: 'ACTIVE' } : r
          ));
        }
      }
      
      // Invalidate cache after update
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
      
      alert(`Ressource ${newStatus === 'approved' ? 'approuvée' : 'mise à jour'} avec succès!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };



  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }
    
    setUploadingHero(true);
    try {
      // Upload to Supabase
      const { uploadImage } = await import('@/lib/supabase');
      const imageUrl = await uploadImage(file);
      
      const newImageName = `hero${heroImages.length + 1}.jpg`;
      const newImage = { name: newImageName, url: imageUrl };
      
      // Update state
      const updatedImages = [...heroImages, newImage];
      setHeroImages(updatedImages);
      
      // Save to Firestore
      const imagesCollection = collection(db, 'heroImages');
      const existingDoc = await getDocs(imagesCollection);
      
      if (existingDoc.empty) {
        await addDoc(imagesCollection, { images: updatedImages });
      } else {
        const docRef = doc(db, 'heroImages', existingDoc.docs[0].id);
        await updateDoc(docRef, { images: updatedImages });
      }
      
      // Clear cache to force refresh
      await cache.delete('hero-images');
      
      alert(`Image ${newImageName} ajoutée avec succès!`);
    } catch (error) {
      console.error('Error uploading hero image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingHero(false);
    }
    
    // Reset input
    e.target.value = '';
  };
  
  const handleDeleteHeroImage = async (index: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image hero ?')) return;
    
    try {
      const imageToDelete = heroImages[index];
      const updatedImages = heroImages.filter((_, i) => i !== index);
      setHeroImages(updatedImages);
      
      // Update Firestore
      const imagesCollection = collection(db, 'heroImages');
      const existingDoc = await getDocs(imagesCollection);
      
      if (!existingDoc.empty) {
        const docRef = doc(db, 'heroImages', existingDoc.docs[0].id);
        await updateDoc(docRef, { images: updatedImages });
      }
      
      // Clear cache to force refresh
      await cache.delete('hero-images');
      
      alert(`Image ${imageToDelete.name} supprimée avec succès!`);
    } catch (error) {
      console.error('Error deleting hero image:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const contentCollection = collection(db, 'landingContent');
      const existingDoc = await getDocs(contentCollection);
      
      if (existingDoc.empty) {
        await addDoc(contentCollection, landingContent);
      } else {
        const docRef = doc(db, 'landingContent', existingDoc.docs[0].id);
        await updateDoc(docRef, landingContent);
      }
      
      // Clear cache to force refresh
      await cache.delete('landing-content');
      
      alert('Contenu sauvegardé avec succès!');
    } catch (error) {
      console.error('Error saving landing content:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const lookupResourceUrl = async (title: string, issn: string) => {
    try {
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      const possibleUrls = [
        `https://www.${cleanTitle}.com`,
        `https://${cleanTitle}.org`,
        `https://journal.${cleanTitle}.com`
      ];
      return possibleUrls[0];
    } catch (error) {
      return '';
    }
  };

  const assignDomain = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('droit') || text.includes('économie') || text.includes('politique') || text.includes('law') || text.includes('economic') || text.includes('political')) {
      return 'domain1';
    }
    if (text.includes('lettres') || text.includes('humaines') || text.includes('literature') || text.includes('humanities') || text.includes('social')) {
      return 'domain2';
    }
    if (text.includes('mathématique') || text.includes('mathematics') || text.includes('math')) {
      return 'domain3';
    }
    if (text.includes('physique') || text.includes('physics') || text.includes('chimie') || text.includes('chemistry')) {
      return 'domain4';
    }
    if (text.includes('terre') || text.includes('vie') || text.includes('biologie') || text.includes('earth') || text.includes('life') || text.includes('biology')) {
      return 'domain5';
    }
    if (text.includes('ingénieur') || text.includes('engineering') || text.includes('technologie') || text.includes('technology')) {
      return 'domain6';
    }
    if (text.includes('médical') || text.includes('pharmaceutique') || text.includes('santé') || text.includes('medical') || text.includes('health') || text.includes('pharmaceutical')) {
      return 'domain7';
    }
    return 'domain7'; // Default to medical/health
  };

  const handleProcessXlsxFiles = async () => {
    if (!xlsxFiles.file1 || !xlsxFiles.file2) return;
    
    setProcessingXlsx(true);
    try {
      const XLSX = await import('xlsx');
      
      // Process File 1
      const file1Buffer = await xlsxFiles.file1.arrayBuffer();
      const workbook1 = XLSX.read(file1Buffer, { type: 'array' });
      const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const data1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
      
      // Process File 2
      const file2Buffer = await xlsxFiles.file2.arrayBuffer();
      const workbook2 = XLSX.read(file2Buffer, { type: 'array' });
      const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
      const data2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
      
      const processedEntries = new Map();
      
      // Process File 1 (Scopus data)
      if (data1.length > 1) {
        const headers1 = data1[0] as string[];
        for (let i = 1; i < data1.length; i++) {
          const row = data1[i] as any[];
          if (row && row.length > 0) {
            const title = row[headers1.indexOf('Source Title')] || '';
            const issn = row[headers1.indexOf('ISSN')] || row[headers1.indexOf('EISSN')] || '';
            const description = title;
            const resourceUrl = await lookupResourceUrl(title, issn);
            const entry = {
              name: title,
              resourceTitle: title,
              type: 'journal',
              description: description,
              about: '',
              link: resourceUrl,
              resourceUrl: resourceUrl,
              country: '',
              image: '',
              isbn: row[headers1.indexOf('ISSN')] || row[headers1.indexOf('EISSN')] || '',
              issnOnline: row[headers1.indexOf('EISSN')] || '',
              issnPrint: row[headers1.indexOf('ISSN')] || '',
              statut: row[headers1.indexOf('Active or Inactive')] === 'Active' ? 'ACTIVE' : 'INACTIVE',
              detailsStatut: '',
              resourceLanguage: 'en',
              status: 'approved',
              date: new Date().toISOString().split('T')[0],
              source: 'XLSX_PROCESSED',
              publisher: row[headers1.indexOf('Publisher')] || '',
              organisationName: row[headers1.indexOf('Publisher')] || '',
              sourceType: row[headers1.indexOf('Source Type')] || '',
              domainJournal: assignDomain(title, description),
              discipline: row[headers1.indexOf('All Science Journal Classification Codes (ASJC)')] || '',
              licenseType: row[headers1.indexOf('Open Access Status')] === 'Open Access' ? 'open-access' : 'subscription',
              articleType: 'pdf',
              frequency: 'monthly'
            };
            
            const key = `${entry.name}_${entry.isbn}`.toLowerCase().replace(/\s+/g, '');
            if (entry.name && !processedEntries.has(key)) {
              processedEntries.set(key, entry);
            }
          }
        }
      }
      
      // Process File 2 (French journals)
      if (data2.length > 1) {
        const headers2 = data2[0] as string[];
        for (let i = 1; i < data2.length; i++) {
          const row = data2[i] as any[];
          if (row && row.length > 0) {
            const title = row[headers2.indexOf('Revues')] || '';
            const issn = row[headers2.indexOf('isbn_issn')] || '';
            const description = row[headers2.indexOf('revue_specialite')] || title;
            const resourceUrl = await lookupResourceUrl(title, issn);
            const entry = {
              name: title,
              resourceTitle: title,
              type: 'journal',
              description: description,
              about: '',
              link: resourceUrl,
              resourceUrl: resourceUrl,
              country: 'France',
              image: '/search.png',
              isbn: row[headers2.indexOf('isbn_issn')] || '',
              issnOnline: row[headers2.indexOf('isbn_issn')] || '',
              issnPrint: '',
              statut: row[headers2.indexOf('statut_revue')] || 'ACTIVE',
              detailsStatut: '',
              resourceLanguage: 'fr',
              status: 'approved',
              date: new Date().toISOString().split('T')[0],
              source: 'XLSX_PROCESSED',
              indexationProof: row[headers2.indexOf('preuve_indexation')] || '',
              domainJournal: assignDomain(title, description),
              discipline: description,
              publisher: '',
              organisationName: '',
              licenseType: 'open-access',
              articleType: 'pdf',
              frequency: 'monthly',
            };
            
            const key = `${entry.name}_${entry.isbn}`.toLowerCase().replace(/\s+/g, '');
            if (entry.name && !processedEntries.has(key)) {
              processedEntries.set(key, entry);
            }
          }
        }
      }
      
      const finalData = Array.from(processedEntries.values());
      const totalOriginal = (data1.length - 1) + (data2.length - 1);
      const duplicatesCount = totalOriginal - finalData.length;
      
      setProcessedData(finalData);
      setDuplicatesRemoved(duplicatesCount);
      
    } catch (error) {
      console.error('Error processing XLSX files:', error);
      alert('Erreur lors du traitement des fichiers XLSX');
    } finally {
      setProcessingXlsx(false);
    }
  };
  
  const handleDownloadProcessed = async () => {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Processed Resources');
    XLSX.writeFile(workbook, `processed_resources_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const translateResourceData = async (resource: any) => {
    if (!resource.description) return resource;
    
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(resource.description.slice(0, 200))}`);
      const data = await response.json();
      const translatedDesc = data[0]?.[0]?.[0] || resource.description;
      
      return {
        ...resource,
        description: translatedDesc
      };
    } catch {
      return resource;
    }
  };

  const handlePrintPDF = async () => {
    // Filter resources based on print filters
    let filteredForPrint = [...resources, ...uploadedResources];
    
    if (printFilters.status) {
      filteredForPrint = filteredForPrint.filter(r => r.statut === printFilters.status);
    }
    if (printFilters.type) {
      filteredForPrint = filteredForPrint.filter(r => r.type === printFilters.type);
    }
    if (printFilters.country) {
      filteredForPrint = filteredForPrint.filter(r => 
        r.country?.toLowerCase().includes(printFilters.country.toLowerCase())
      );
    }
    if (printFilters.domain) {
      filteredForPrint = filteredForPrint.filter(r => r.domainJournal === printFilters.domain);
    }
    
    // Translate resource descriptions to English
    const translatedResources = await Promise.all(
      filteredForPrint.map(resource => translateResourceData(resource))
    );
    
  
    // Generate compact PDF content with watermark
    const printContent = `
      <html>
        <head>
          <title>Liste des Ressources - Afri-Fek</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              font-size: 10px; 
              margin: 10px; 
              color: black;
              position: relative;
            }
            body::before {
              content: '';
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 300px;
              height: 300px;
              background-image: url('/logo-afri-removebg-preview.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              opacity: 0.1;
              z-index: -1;
            }
            .content {
              position: relative;
              z-index: 1;
              background: transparent;
              padding: 10px;
            }
            h1 { font-size: 16px; margin: 10px 0; text-align: center; color: #d97706; font-weight: bold; }
            .header-info { text-align: center; margin: 10px 0; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #333; padding: 4px; text-align: left; font-size: 9px; }
            th { background-color: #f8f9fa; font-weight: bold; color: #333; }
            .status-approved { background-color: #e8f5e8; }
            .status-pending { background-color: #fff3cd; }
            .type { font-weight: bold; }
            .number { font-weight: bold; color: #d97706; }
            .footer { margin-top: 15px; font-size: 8px; text-align: center; color: #666; }
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; z-index: 0; }
            @media print { 
              body { margin: 0; }
              .content { background: white; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">
            <img src="/logo-afri-removebg-preview.png" width="300" alt="Afri-Fek">
          </div>
          <div class="content">
            <h1>AFRI-FEK - Scientific Resources List</h1>
            <div class="header-info">
              <p><strong>Total:</strong> ${filteredForPrint.length} resources | <strong>Generated on:</strong> ${new Date().toLocaleDateString('en-US')} | <strong>Platform:</strong> afri-fek.org</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  <th style="width: 25%;">Resource Name</th>
                  <th style="width: 8%;">Type</th>
                  <th style="width: 12%;">Country</th>
                  <th style="width: 20%;">Domain</th>
                  <th style="width: 8%;">Status</th>
                  <th style="width: 22%;">URL/Contact</th>
                </tr>
              </thead>
              <tbody>
                ${translatedResources.map((resource, index) => `
                  <tr class="status-${resource.status}">
                    <td class="number">${index + 1}</td>
                    <td><strong>${resource.name || resource.resourceTitle || 'N/A'}</strong></td>
                    <td class="type">${resource.type || 'N/A'}</td>
                    <td>${resource.country || 'N/A'}</td>
                    <td style="font-size: 8px;">${getDomainName(resource.domainJournal || '')}</td>
                    <td>${resource.status === 'approved' ? 'Approved' : resource.status === 'pending' ? 'Pending' : 'Other'}</td>
                    <td style="font-size: 7px;">${resource.link || resource.resourceUrl || resource.email || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p><strong>Document officiel généré par AFRI-FEK</strong> - Plateforme de référence pour la recherche en santé africaine</p>
              <p>Pour plus d'informations: www.afri-fek.org | Ce document est protégé et authentifié</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
    
    setShowPrintFilters(false);
  };

  const handleXlsxUpload = async () => {
    if (!xlsxFile) return;
    
    setUploading(true);
    try {
      // Check if it's a PDF file
      if (xlsxFile.type === 'application/pdf') {
        await handlePdfUpload();
        return;
      }
      
      const XLSX = await import('xlsx');
      const arrayBuffer = await xlsxFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        alert('Le fichier XLSX doit contenir au moins 2 lignes (en-têtes + données)');
        return;
      }
      
      const headers = jsonData[0] as string[];
      console.log('Available headers:', headers);
      
      // Map all possible field names to their column indices
      const fieldMapping = {
        filiere: headers.findIndex(h => h && ['filiere', 'field', 'domaine', 'speciality'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        subjects: headers.findIndex(h => h && ['subjects', 'subject', 'sujets', 'sujet'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        statut: headers.findIndex(h => h && ['statut', 'status', 'etat'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        doiPrefix: headers.findIndex(h => h && ['doiPrefix', 'doi_prefix', 'doi'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        keywords: headers.findIndex(h => h && ['keywords', 'keyword', 'motscles', 'motscles'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        citationCount: headers.findIndex(h => h && ['citation', 'citations', 'citationCount', 'citedby'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        address: headers.findIndex(h => h && ['address', 'adresse'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        references: headers.findIndex(h => h && ['reference', 'references', 'ref', 'refs'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        status: headers.findIndex(h => h && ['status', 'statut'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        abbreviations: headers.findIndex(h => h && ['abbreviation', 'abbreviations', 'abreviation', 'abreviations'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        name: headers.findIndex(h => h && ['name', 'title', 'resourceTitle', 'revues'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        resourceUrl: headers.findIndex(h => h && ['url', 'link', 'resourceUrl'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        organisationName: headers.findIndex(h => h && ['organisation', 'organization', 'publisher'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        chiefEditor: headers.findIndex(h => h && ['editor', 'chief', 'redacteur'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        email: headers.findIndex(h => h && h.toString().toLowerCase().includes('email')),
        articleType: headers.findIndex(h => h && ['articleType', 'type'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        frequency: headers.findIndex(h => h && ['frequency', 'frequence'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        licenseType: headers.findIndex(h => h && ['license', 'licence'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        language: headers.findIndex(h => h && ['language', 'langue'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        issnOnline: headers.findIndex(h => h && ['issn', 'eissn', 'isbn'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        issnPrint: headers.findIndex(h => h && ['print', 'imprime'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        contact: headers.findIndex(h => h && ['contact', 'phone', 'telephone'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        country: headers.findIndex(h => h && ['country', 'pays'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        coverageStartYear: headers.findIndex(h => h && ['start', 'debut', 'year'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        coverageEndYear: headers.findIndex(h => h && ['end', 'fin', 'arret'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        coverageStatus: headers.findIndex(h => h && ['status', 'statut', 'active'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        publisher: headers.findIndex(h => h && ['publisher', 'editeur'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        domainJournal: headers.findIndex(h => h && ['domain', 'domaine', 'specialite'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        discipline: headers.findIndex(h => h && ['discipline', 'subject'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        description: headers.findIndex(h => h && ['description', 'about'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        about: headers.findIndex(h => h && ['about', 'apropos'].some(field => h.toString().toLowerCase().includes(field.toLowerCase()))),
        image: headers.findIndex(h => h && ['image', 'photo'].some(field => h.toString().toLowerCase().includes(field.toLowerCase())))
      };
      
      // Check if at least name field exists
      if (fieldMapping.name === -1) {
        alert('Colonne "name/title/revues" non trouvée dans le fichier XLSX');
        return;
      }
      
      const totalRows = jsonData.length - 1;
      let processedRows = 0;
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (row && row[fieldMapping.name]) {
          const resourceData = {
            // Core fields
            filiere: row[fieldMapping.filiere]?.toString() || '',
            subjects: row[fieldMapping.subjects]?.toString() || '',
            statut: row[fieldMapping.statut]?.toString() || 'ACTIVE',
            doiPrefix: row[fieldMapping.doiPrefix]?.toString() || '',
            citationCount: row[fieldMapping.citationCount]?.toString() || '',
            address: row[fieldMapping.address]?.toString() || '',
            references: row[fieldMapping.references]?.toString() || '',
            name: row[fieldMapping.name]?.toString() || '',
            resourceTitle: row[fieldMapping.name]?.toString() || '',
            type: row[fieldMapping.articleType]?.toString().toLowerCase() || 'journal',
            description: row[fieldMapping.description]?.toString() || row[fieldMapping.name]?.toString() || '',
            about: row[fieldMapping.about]?.toString() || '',
            link: row[fieldMapping.resourceUrl]?.toString() || '',
            resourceUrl: row[fieldMapping.resourceUrl]?.toString() || '',
            country: row[fieldMapping.country]?.toString() || '',
            image: row[fieldMapping.image]?.toString() || '',
            
            // ISSN/ISBN fields
            isbn: row[fieldMapping.issnOnline]?.toString() || '',
            issnOnline: row[fieldMapping.issnOnline]?.toString() || '',
            issnPrint: row[fieldMapping.issnPrint]?.toString() || '',
            
            // Organization fields
            organisationName: row[fieldMapping.organisationName]?.toString() || '',
            chiefEditor: row[fieldMapping.chiefEditor]?.toString() || '',
            email: row[fieldMapping.email]?.toString() || '',
            contact: row[fieldMapping.contact]?.toString() || '',
            publisher: row[fieldMapping.publisher]?.toString() || '',
            
            // Classification fields
            domainJournal: row[fieldMapping.domainJournal]?.toString() || 'domain7',
            discipline: row[fieldMapping.discipline]?.toString() || '',
            
            // Publication details
            articleType: row[fieldMapping.articleType]?.toString() || 'pdf',
            frequency: row[fieldMapping.frequency]?.toString() || 'monthly',
            licenseType: row[fieldMapping.licenseType]?.toString() || 'open-access',
            language: row[fieldMapping.language]?.toString() || 'fr',
            resourceLanguage: row[fieldMapping.language]?.toString() || 'fr',
            
            // Coverage fields
            coverageStartYear: row[fieldMapping.coverageStartYear]?.toString() || '',
            coverageEndYear: row[fieldMapping.coverageEndYear]?.toString() || '',
            coverageStatus: row[fieldMapping.coverageStatus]?.toString() || 'ongoing',
            
            // System fields
            detailsStatut: '',
            status: 'approved',
            date: new Date().toISOString().split('T')[0],
            source: 'XLSX_UPLOAD',
            createdAt: new Date()
          };
          
          await addDoc(collection(db, 'FormuploadedResult'), resourceData);
        }
        processedRows++;
        const progress = Math.round((processedRows / totalRows) * 100);
        setUploadProgress(progress);
      }
      
      // Invalidate cache and refetch data
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
      await fetchAllResources();
      setShowUpload(false);
      setXlsxFile(null);
      setUploadProgress(0);
      alert(`Données XLSX importées avec succès! ${processedRows} entrées traitées.`);
    } catch (error) {
      console.error('Error uploading XLSX:', error);
      alert('Erreur lors de l\'importation du XLSX');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePdfUpload = async () => {
    if (!xlsxFile || xlsxFile.type !== 'application/pdf') return;
    
    try {
      // Upload PDF to storage first
      const { uploadImage } = await import('@/lib/supabase');
      const pdfUrl = await uploadImage(xlsxFile);
      
      // Create a resource entry for the PDF
      const resourceData = {
        subjects: '',
        name: xlsxFile.name.replace('.pdf', ''),
        resourceTitle: xlsxFile.name.replace('.pdf', ''),
        type: 'article',
        description: `Document PDF: ${xlsxFile.name}`,
        about: 'Document PDF importé depuis le processeur XLSX',
        link: pdfUrl,
        resourceUrl: pdfUrl,
        country: '',
        image: '',
        isbn: '',
        issnOnline: '',
        issnPrint: '',
        organisationName: '',
        chiefEditor: '',
        email: '',
        contact: '',
        publisher: '',
        domainJournal: 'domain7',
        discipline: '',
        articleType: 'pdf',
        frequency: 'monthly',
        licenseType: 'open-access',
        language: 'fr',
        resourceLanguage: 'fr',
        coverageStartYear: '',
        coverageEndYear: '',
        coverageStatus: 'ongoing',
        statut: 'ACTIVE',
        detailsStatut: '',
        status: 'approved',
        date: new Date().toISOString().split('T')[0],
        source: 'PDF_UPLOAD',
        createdAt: new Date(),
        abbreviation: '',
        references:'',
        addres:'',
        citationCount:''
      };
      
      await addDoc(collection(db, 'FormuploadedResult'), resourceData);
      
      // Invalidate cache and refetch data
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
      await fetchAllResources();
      setShowUpload(false);
      setXlsxFile(null);
      setUploadProgress(0);
      alert('PDF uploadé avec succès!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Erreur lors de l\'upload du PDF');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Administration Afri-Fek</h1>
            <p className="text-gray-600 mt-2">Connectez-vous pour accéder au panneau d'administration</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                placeholder="admin@gmail.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="Ubuntu1"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des ressources...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home },
    { id: 'resources', label: 'Ressources', icon: Database },
    { id: 'xlsx-processor', label: 'Processeur XLSX', icon: Upload },
    { id: 'content', label: 'Contenu Landing', icon: Edit },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'partners', label: 'Partenaires', icon: Users },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-afri-removebg-preview.png" 
              alt="Afri-Fek Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-white">Afri-Fek Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors mb-1 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          {/* <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button> */}
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-300 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-300 text-sm">Administration Afri-Fek</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition"
                title="Toggle theme"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <p className="text-sm font-medium text-gray-300">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* XLSX Processor Tab */}
          {activeTab === 'xlsx-processor' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Processeur de fichiers XLSX</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border-2 border-dashed border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Fichier 1 (48,000 entrées)</h3>
                    <p className="text-sm text-gray-600 mb-3">Headers: Sourcerecord ID, Source Title, ISSN, EISSN, etc.</p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setXlsxFiles(prev => ({ ...prev, file1: e.target.files?.[0] || null }))}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg"
                    />
                    {xlsxFiles.file1 && (
                      <p className="text-sm text-green-600 mt-2">✓ {xlsxFiles.file1.name}</p>
                    )}
                  </div>
                  
                  <div className="border-2 border-dashed border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Fichier 2 (551 entrées)</h3>
                    <p className="text-sm text-gray-600 mb-3">Headers: CTS, Revues, isbn_issn, preuve_indexation, etc.</p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setXlsxFiles(prev => ({ ...prev, file2: e.target.files?.[0] || null }))}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg"
                    />
                    {xlsxFiles.file2 && (
                      <p className="text-sm text-green-600 mt-2">✓ {xlsxFiles.file2.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleProcessXlsxFiles}
                    disabled={!xlsxFiles.file1 || !xlsxFiles.file2 || processingXlsx}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {processingXlsx ? 'Traitement...' : 'Traiter les fichiers'}
                  </button>
                  
                  {processedData.length > 0 && (
                    <button
                      onClick={handleDownloadProcessed}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Télécharger ({processedData.length} entrées)
                    </button>
                  )}
                </div>
                
                {processingXlsx && (
                  <div className="mb-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        <span className="text-sm font-medium text-orange-700">Traitement en cours...</span>
                      </div>
                      <p className="text-xs text-orange-600">Mapping des champs et suppression des doublons</p>
                    </div>
                  </div>
                )}
                
                {processedData.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Traitement terminé</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">Entrées totales:</span>
                        <p className="font-bold text-green-800">{processedData.length}</p>
                      </div>
                      <div>
                        <span className="text-green-600">Doublons supprimés:</span>
                        <p className="font-bold text-green-800">{duplicatesRemoved}</p>
                      </div>
                      <div>
                        <span className="text-green-600">Fichier 1:</span>
                        <p className="font-bold text-green-800">{xlsxFiles.file1?.name}</p>
                      </div>
                      <div>
                        <span className="text-green-600">Fichier 2:</span>
                        <p className="font-bold text-green-800">{xlsxFiles.file2?.name}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Mapping des champs:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-600">Fichier 1 → Base de données:</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>Source Title → name</li>
                        <li>ISSN/EISSN → isbn</li>
                        <li>Publisher → publisher</li>
                        <li>Active or Inactive → status</li>
                        <li>Source Type → type</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Fichier 2 → Base de données:</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>Revues → name</li>
                        <li>isbn_issn → isbn</li>
                        <li>statut_revue → status</li>
                        <li>revue_specialite → description</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Modifier le contenu de la page d'accueil
            </h2>

            {/* Hero Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Section Héro
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre principal
                  </label>
                  <RichTextEditor
                    value={landingContent.heroTitle}
                    onChange={(value) =>
                      setLandingContent((prev) => ({
                        ...prev,
                        heroTitle: value
                      }))
                    }
                    placeholder="Sélectionnez du texte et utilisez les boutons pour le formater"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sélectionnez du texte et cliquez sur les boutons pour appliquer le formatage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre
                  </label>
                  <textarea
                    value={landingContent.heroSubtitle}
                    onChange={(e) =>
                      setLandingContent((prev) => ({
                        ...prev,
                        heroSubtitle: e.target.value
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Section Vision
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Vision
                  </label>
                  <input
                    type="text"
                    value={landingContent.visionTitle}
                    onChange={(e) =>
                      setLandingContent((prev) => ({
                        ...prev,
                        visionTitle: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Textes Vision (3 paragraphes - HTML autorisé)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Utilisez les boutons de formatage pour mettre en évidence le texte
                  </p>
                  {landingContent.visionTexts.map((text, index) => (
                    <div key={index}>
                      <label className="block text-xs text-gray-500 mb-1">
                        Paragraphe {index + 1}
                      </label>
                      <RichTextEditor
                        value={text}
                        onChange={(value) => {
                          const newTexts = [...landingContent.visionTexts];
                          newTexts[index] = value;
                          setLandingContent(prev => ({ ...prev, visionTexts: newTexts }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quotes Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Citations des Scientifiques</h3>
              <div className="space-y-6">
                {landingContent.quotes.map((quote, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">Citation {index + 1}</h4>
                      {landingContent.quotes.length > 1 && (
                        <button
                          onClick={() => {
                            const newQuotes = landingContent.quotes.filter((_, i) => i !== index);
                            setLandingContent(prev => ({ ...prev, quotes: newQuotes }));
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scientifique</label>
                        <input
                          type="text"
                          value={quote.scientist}
                          onChange={(e) => {
                            const newQuotes = [...landingContent.quotes];
                            newQuotes[index].scientist = e.target.value;
                            setLandingContent(prev => ({ ...prev, quotes: newQuotes }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
                        <input
                          type="text"
                          value={quote.field}
                          onChange={(e) => {
                            const newQuotes = [...landingContent.quotes];
                            newQuotes[index].field = e.target.value;
                            setLandingContent(prev => ({ ...prev, quotes: newQuotes }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
                        <textarea
                          value={quote.quote}
                          onChange={(e) => {
                            const newQuotes = [...landingContent.quotes];
                            newQuotes[index].quote = e.target.value;
                            setLandingContent(prev => ({ ...prev, quotes: newQuotes }));
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newQuote = {
                      scientist: '',
                      field: '',
                      quote: ''
                    };
                    setLandingContent(prev => ({ ...prev, quotes: [...prev.quotes, newQuote] }));
                  }}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-amber-500 hover:text-amber-600 transition"
                >
                  + Ajouter une citation
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Aperçu</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                  <h1
                    className="text-2xl font-bold"
                    dangerouslySetInnerHTML={{
                      __html: landingContent.heroTitle
                    }}
                  />
                  <p className="text-gray-600 mt-2">
                    {landingContent.heroSubtitle}
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {landingContent.visionTitle}
                  </h2>
                  <div className="space-y-3">
                    {landingContent.visionTexts.map((text, index) => (
                      <div key={index} className="p-3 bg-amber-50 rounded border-l-4 border-amber-500">
                        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: text }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Citations:</h3>
                  {landingContent.quotes.map((quote, index) => (
                    <div key={index} className="italic text-gray-600 border-l-2 border-amber-500 pl-3">
                      "{quote.quote}" - <strong>{quote.scientist}</strong> ({quote.field})
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
              >
                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}
         
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Resources</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredResources.length}</p>
                    <p className="text-orange-600 text-xs mt-1">+{resources.filter(r => {
                      const today = new Date();
                      const resourceDate = new Date(r.date);
                      const diffTime = Math.abs(today.getTime() - resourceDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length} this week</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredResources.filter(r => r.status === 'approved'||r.status === '' ).length}</p>
                    <p className="text-green-600 text-xs mt-1">{Math.round((filteredResources.filter(r => r.status === 'approved').length / filteredResources.length) * 100)}% of total</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-yellow-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredResources.filter(r => r.status === 'pending').length}</p>
                    <p className="text-yellow-600 text-xs mt-1">Need attention</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Countries</p>
                    <p className="text-2xl font-bold text-gray-900">{Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean))).length}</p>
                    <p className="text-blue-600 text-xs mt-1">Coverage</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Images Management */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Gestion Images Hero</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {heroImages.map((image, index) => (
                  <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <img 
                      src={image.url} 
                      alt={`Hero ${index + 1}`} 
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
                      }}
                    />
                    <p className="text-sm text-gray-600">{image.name}</p>
                    <button 
                      onClick={() => handleDeleteHeroImage(index)}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm transition"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                
                {heroImages.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      {uploadingHero ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Ajouter une image</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleHeroImageUpload}
                      className="mt-2 text-xs"
                      disabled={uploadingHero}
                    />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                Les images défilent automatiquement toutes les 4 secondes dans la section hero. Maximum 5 images.
              </div>
            </div>
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            {/* Compact Controls Bar */}
            {/* <div className="bg-white rounded-lg shadow p-3"> */}
               
                
                {/* Filters */}
                {/* <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Statut</option>
                    <option value="pending">Attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Rejeté</option>
                  </select>

                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Type</option>
                    <option value="article">Article</option>
                    <option value="journal">Journal</option>
                    <option value="academy">Académie</option>
                    <option value="institution">Institution</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Pays..."
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="px-2 py-1 border border-gray-300 rounded text-xs w-16 focus:ring-1 focus:ring-amber-500"
                  />
                </div> */}
              
              {/* Progress bar for upload */}
              {uploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-gray-700 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            {/* </div> */}
        
        {/* Hero Images Management */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900">Gestion Images Hero</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {heroImages.map((image, index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <img 
                  src={image.url} 
                  alt={`Hero ${index + 1}`} 
                  className="w-full h-32 object-cover rounded mb-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
                  }}
                />
                <p className="text-sm text-gray-600">{image.name}</p>
                <button 
                  onClick={() => handleDeleteHeroImage(index)}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm transition"
                >
                  Supprimer
                </button>
              </div>
            ))}
            
            {heroImages.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  {uploadingHero ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Ajouter une image</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleHeroImageUpload}
                  className="mt-2 text-xs"
                  disabled={uploadingHero}
                />
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            Les images défilent automatiquement toutes les 4 secondes dans la section hero. Maximum 5 images.
          </div>
        </div> */}
        
        {/* CSV Upload */}
        <div className="bg-white rounded-2xl shadow-lg  mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Import XLSX Journaux</h2>
            </div> */}
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              <Upload className="w-4 h-4" />
              Importer XLSX
            </button>
                 {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, description..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                />
              </div>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            >
              <option value="">Tous les types</option>
              <option value="article">Article</option>
              <option value="journal">Journal</option>
              <option value="academy">Université</option>
              <option value="institution">Institution</option>
              <option value="blog">Blog</option>
              <option value="ouvrage">Ouvrage</option>
            </select>

            <input
              type="text"
              placeholder="Filtrer par pays..."
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />

            <select
              value={filters.domain}
              onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            >
              <option value="">Tous les domaines</option>
              <option value="domain1">Droit, économie, politique</option>
              <option value="domain2">Lettres et sciences humaines</option>
              <option value="domain3">Mathématiques</option>
              <option value="domain4">Sciences physiques</option>
              <option value="domain5">Sciences de la terre et de la vie</option>
              <option value="domain6">Sciences de l'ingénieur</option>
              <option value="domain7">Sciences pharmaceutiques et médicales</option>
            </select>
          </div>
        </div>
          </div>
          
          {showUpload && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier XLSX (colonnes: Revues, ISBN)
                  </label> */}
                  <input
                    type="file"
                    accept=".xlsx,.xls,.pdf"
                    onChange={(e) => setXlsxFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formats supportés: XLSX, XLS, PDF. Le système détectera automatiquement les colonnes disponibles.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleXlsxUpload}
                    disabled={!xlsxFile || uploading}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition"
                  >
                    {uploading ? `Import... ${uploadProgress}%` : 'Importer'}
                  </button>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
              
              {uploading && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression de l'import</span>
                    <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Import en cours, veuillez patienter...</p>
                </div>
              )}
            </div>
          )}
        </div>

   
        {/* Print Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Imprimer Liste</h3>
            <button 
              onClick={() => setShowPrintFilters(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition"
            >
              Imprimer PDF
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-xl hover:shadow-md transition cursor-pointer">
              <div className="bg-amber-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-amber-700">Nouvelles Soumissions</p>
              <p className="text-2xl font-bold text-amber-600">{filteredResources.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition cursor-pointer">
              <div className="bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Taux d'Approbation</p>
              <p className="text-2xl font-bold text-gray-700">{Math.round((filteredResources.filter(r => r.status === 'approved').length / filteredResources.length) * 100)}%</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl hover:shadow-md transition cursor-pointer">
              <div className="bg-amber-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-amber-700">Journaux Actifs</p>
              <p className="text-2xl font-bold text-amber-600">{filteredResources.filter(r => r.type === 'journal' && r.status === 'approved').length}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition cursor-pointer">
              <div className="bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Cette Semaine</p>
              <p className="text-2xl font-bold text-gray-700">{resources.filter(r => {
                const today = new Date();
                const resourceDate = new Date(r.date);
                const diffTime = Math.abs(today.getTime() - resourceDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length}</p>
            </div>
          </div>
        </div> 

        {/* Resources Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Domain</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((resource) => (
                  <tr key={resource.id} id={`resource-${resource.id}`} className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{resource.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {resource.country}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {resource.domainJournal === 'domain1' ? 'Droit/Éco' :
                         resource.domainJournal === 'domain2' ? 'Lettres/SH' :
                         resource.domainJournal === 'domain3' ? 'Math' :
                         resource.domainJournal === 'domain4' ? 'Physique' :
                         resource.domainJournal === 'domain5' ? 'Terre/Vie' :
                         resource.domainJournal === 'domain6' ? 'Ingénieur' :
                         resource.domainJournal === 'domain7' ? 'Médical' : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                          resource.status === 'approved'|| resource.status === '' ? 'bg-green-100 text-green-800' :
                          resource.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resource.status === 'approved' || resource.status === '' ? 'Approuvé' :
                           resource.status === 'pending' ? 'Attente' : (resource.status !== 'pending'&& resource.status !== 'approved'&&resource.status !== '' ? 'Rejeté' : 'N/A')}
                        </span>
                       
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(resource)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteResource(resource.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                         {resource.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateStatus(resource.id, 'approved')}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition"
                              title="Approuver"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => updateStatus(resource.id, 'rejected')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition"
                              title="Rejeter"
                            >
                              ✗
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredResources.length > itemsPerPage && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredResources.length)} sur {filteredResources.length} résultats
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1 bg-amber-600 text-white rounded-md">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredResources.length / itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(filteredResources.length / itemsPerPage)}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}

        <ResourceForm
          isOpen={!!editingResource}
          onClose={cancelEdit}
          formData={{
            filiere: editForm.filiere || '',
            subjects: editForm.subjects || '',
            doiPrefix: editForm.doiPrefix || '',
            keywords: editForm.keywords || '',
            resourceTitle: editForm.name || '',
            resourceUrl: editForm.link || '',
            organisationName: editForm.organisationName || '',
            chiefEditor: editForm.chiefEditor || '',
            email: editForm.email || '',
            articleType: editForm.articleType || 'pdf',
            frequency: editForm.frequency || 'monthly',
            licenseType: editForm.licenseType || 'open-access',
            language: editForm.resourceLanguage || editForm.language || 'fr',
            issnOnline: editForm.issnOnline || editForm.isbn || '',
            issnPrint: editForm.issnPrint || '',
            contact: editForm.contact || '',
            country: editForm.country || '',
            coverageStartYear: editForm.coverageStartYear || '',
            coverageEndYear: editForm.coverageEndYear || '',
            coverageStatus: editForm.coverageStatus || 'ongoing',
            publisher: editForm.publisher || '',
            domainJournal: editForm.domainJournal || '',
            discipline: editForm.discipline || '',
            type: editForm.type || 'article',
            description: editForm.description || '',
            about: editForm.about || '',
            image: editForm.image || '',
            abbreviation: editForm.abbreviation || '', 
            status: editForm.status || 'active',
            references: editForm.references || '',
            address: editForm.address || '',
            citationCount: editForm.citationCount || 0,
            statut: editForm.statut || 'active',
            // Ouvrage specific fields
            authors: editForm.authors || '',
            isbn: editForm.isbn || '',
            publishedYear: editForm.publishedYear || '',
            pages: editForm.pages || '',
            edition: editForm.edition || '',
            
          }}
          onInputChange={(e) => {
            const { name, value } = e.target;
            setEditForm((prev) => ({ ...prev, [name]: value }));
            // Map new field names to old editForm structure
            const fieldMapping: { [key: string]: string } = {
              filiere: 'filiere',
              statut: 'statut',
              subjects: 'subjects',
              doiPrefix: 'doiPrefix',
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
              abbreviation: 'abbreviation',
              contact: 'contact',
              coverageStartYear: 'coverageStartYear',
              coverageEndYear: 'coverageEndYear', 
              coverageStatus: 'coverageStatus',
              publisher: 'publisher',
              domainJournal: 'domainJournal',
              discipline: 'discipline',
              resourceStartYear: 'coverageStartYear',
              status: 'status',
              references: 'references',
              address:'address',
              citationCount: 'citationCount',
              keywords: 'keywords',
              // Ouvrage specific fields
              authors: 'authors',
              isbn: 'isbn',
              publishedYear: 'publishedYear',
              pages: 'pages',
              edition: 'edition',
            };
            
            const mappedName = fieldMapping[name] || name;
            setEditForm(prev => ({ ...prev, [mappedName]: value }));
          }}
          onFileChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                alert('La taille du fichier ne doit pas dépasser 5MB');
                e.target.value = '';
                return;
              }
              setSelectedFile(file);
            }
          }}
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
          selectedFile={selectedFile}
          isSubmitting={false}
          submitMessage=""
          uploadProgress={0}
          language="fr"
          t={{
            fr: {
              submit: 'Éditer une ressource',
              form: { language: 'Langue de la ressource' }
            }
          }}
        />
        </div>
        )}
        
        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <NewsletterManagement />
        )}
        
        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <PartnersManagement />
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Ressources</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredResources.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approuvées</p>
                    <p className="text-2xl font-bold text-green-600">{filteredResources.filter(r => r.status === 'approved').length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{filteredResources.filter(r => r.status === 'pending').length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pays</p>
                    <p className="text-2xl font-bold text-blue-600">{Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean))).length}</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
                <div className="space-y-3">
                  {['approved', 'pending', 'rejected'].map(status => {
                    const count = filteredResources.filter(r => r.status === status).length;
                    const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
                    const statusLabels = { approved: 'Approuvé', pending: 'En attente', rejected: 'Rejeté' };
                    const colors = { approved: 'bg-green-500', pending: 'bg-yellow-500', rejected: 'bg-red-500' };
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{statusLabels[status as keyof typeof statusLabels]}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${colors[status as keyof typeof colors]} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Type Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
                <div className="space-y-3">
                  {['article', 'journal', 'blog', 'university', 'institution', 'ouvrage'].map(type => {
                    const count = filteredResources.filter(r => r.type === type).length;
                    const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
                    const typeLabels = { article: 'Articles', journal: 'Journaux', academy: 'Académies', institution: 'Institutions', ouvrage: 'Ouvrages', blog: 'Blogs', university: 'Universités' };
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Top Countries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pays</h3>
              <div className="space-y-2">
                {Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean)))
                  .map(country => ({
                    country,
                    count: filteredResources.filter(r => r.country === country).length
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 10)
                  .map(({ country, count }) => {
                    const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
                    return (
                      <div key={country} className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700">{country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        
        </main>
        
        {/* Print Filters Modal */}
        {showPrintFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filtres d'impression</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select
                      value={printFilters.status}
                      onChange={(e) => setPrintFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="approved">Approuvé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={printFilters.type}
                      onChange={(e) => setPrintFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Tous les types</option>
                      <option value="article">Article</option>
                      <option value="journal">Journal</option>
                      <option value="academy">Académie</option>
                      <option value="institution">Institution</option>
                      <option value="ouvrage">Ouvrage</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Pays</label>
                    <input
                      type="text"
                      placeholder="Filtrer par pays..."
                      value={printFilters.country}
                      onChange={(e) => setPrintFilters(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Domaine</label>
                    <select
                      value={printFilters.domain}
                      onChange={(e) => setPrintFilters(prev => ({ ...prev, domain: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Tous les domaines</option>
                      <option value="domain1">Droit, économie, politique</option>
                      <option value="domain2">Lettres et sciences humaines</option>
                      <option value="domain3">Mathématiques</option>
                      <option value="domain4">Sciences physiques</option>
                      <option value="domain5">Sciences de la terre et de la vie</option>
                      <option value="domain6">Sciences de l'ingénieur</option>
                      <option value="domain7">Sciences pharmaceutiques et médicales</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPrintFilters(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePrintPDF}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    Imprimer PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Footer language="fr" t={{ fr: { submit: 'Soumettre' } }} />
      </div>
    </div>
  );
}