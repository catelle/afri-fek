'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';
import { Edit, Trash2, Save, X, Filter, Search, Shield, LogOut, Upload, FileText, BarChart3, TrendingUp, Users, Globe, Calendar, Activity, Home, Settings, Image, Database, Menu } from 'lucide-react';
import ResourceForm from '@/components/ResourceForm';
import Footer from '@/components/Footer';

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
  contactNumber?: string;
  coverageStartYear?: string;
  coverageEndYear?: string;
  coverageStatus?: string;
  publisher?: string;
  domainJournal?: string;
  discipline?: string;
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
    search: ''
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
    { name: 'hero3.jpg', url: '/hero3.jpg' }
  ]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPrintFilters, setShowPrintFilters] = useState(false);
  const [printFilters, setPrintFilters] = useState({
    status: '',
    type: '',
    country: ''
  });

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

  useEffect(() => {
    // Load hero images from localStorage
    const savedImages = localStorage.getItem('hero-images');
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        setHeroImages(parsedImages);
      } catch (error) {
        console.error('Error loading hero images from localStorage:', error);
      }
    }
  }, []);

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
      const [resourcesSnapshot, uploadedSnapshot] = await Promise.all([
        getDocs(collection(db, 'resources')),
        getDocs(collection(db, 'FormuploadedResult'))
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
      
      const uploaded = uploadedSnapshot.docs.map(doc => ({
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
      
      setResources(allResources);
      setUploadedResources(uploaded);
      
      // Cache the data
      await cache.set('admin-resources', {
        resources: allResources,
        uploadedResources: uploaded
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === 'admin@gmail.com' && loginForm.password === 'Ubuntu1') {
      setIsAuthenticated(true);
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
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters.country) {
      const countryLower = filters.country.toLowerCase();
      filtered = filtered.filter(r => r.country?.toLowerCase().includes(countryLower));
    }
    
    // Sort by status: pending first, then approved, then rejected
    filtered.sort((a, b) => {
      const statusOrder = { pending: 0, approved: 1, rejected: 2 };
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      
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
    setEditForm(resource);
  };

  const cancelEdit = () => {
    setEditingResource(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingResource || !editForm) return;
    
    try {
      const collection_name = editingResource.source === 'XLSX_UPLOAD' ? 'FormuploadedResult' : 'resources';
      const resourceRef = doc(db, collection_name, editingResource.id);
      await updateDoc(resourceRef, editForm);
      
      if (editingResource.source === 'XLSX_UPLOAD') {
        setUploadedResources(prev => prev.map(r => 
          r.id === editingResource.id ? { ...r, ...editForm } : r
        ));
      } else {
        setResources(prev => prev.map(r => 
          r.id === editingResource.id ? { ...r, ...editForm } : r
        ));
      }
      
      // Invalidate cache after update
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
      
      setEditingResource(null);
      setEditForm({});
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
      const collection_name = resource?.source === 'XLSX_UPLOAD' ? 'FormuploadedResult' : 'resources';
      
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
      const collection_name = resource?.source === 'XLSX_UPLOAD' ? 'FormuploadedResult' : 'resources';
      
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
        await updateDoc(resourceRef, { status: newStatus });
        
        if (resource?.source === 'XLSX_UPLOAD') {
          setUploadedResources(prev => prev.map(r => 
            r.id === id ? { ...r, status: newStatus } : r
          ));
        } else {
          setResources(prev => prev.map(r => 
            r.id === id ? { ...r, status: newStatus } : r
          ));
        }
      }
      
      // Invalidate cache after update
      await cache.delete('admin-resources');
      await cache.delete('all-resources');
    } catch (error) {
      console.error('Error updating status:', error);
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
      // Convert to base64 and store in localStorage for demo
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const newImageName = `hero${heroImages.length + 1}.jpg`;
        const newImage = { name: newImageName, url: base64Data };
        
        // Update state
        const updatedImages = [...heroImages, newImage];
        setHeroImages(updatedImages);
        
        // Store in localStorage for persistence across page reloads
        localStorage.setItem('hero-images', JSON.stringify(updatedImages));
        
        alert(`Image ${newImageName} ajoutée avec succès!`);
        setUploadingHero(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading hero image:', error);
      alert('Erreur lors de l\'upload de l\'image');
      setUploadingHero(false);
    }
    
    // Reset input
    e.target.value = '';
  };
  
  const handleDeleteHeroImage = (index: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image hero ?')) return;
    
    const imageToDelete = heroImages[index];
    const updatedImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(updatedImages);
    
    // Update localStorage
    localStorage.setItem('hero-images', JSON.stringify(updatedImages));
    
    alert(`Image ${imageToDelete.name} supprimée avec succès!`);
  };

  const handleSave = () => {
    localStorage.setItem('landing-content', JSON.stringify(landingContent));
    alert('Contenu sauvegardé avec succès!');
  };

  const handlePrintPDF = () => {
    // Filter resources based on print filters
    let filteredForPrint = [...resources, ...uploadedResources];
    
    if (printFilters.status) {
      filteredForPrint = filteredForPrint.filter(r => r.status === printFilters.status);
    }
    if (printFilters.type) {
      filteredForPrint = filteredForPrint.filter(r => r.type === printFilters.type);
    }
    if (printFilters.country) {
      filteredForPrint = filteredForPrint.filter(r => 
        r.country?.toLowerCase().includes(printFilters.country.toLowerCase())
      );
    }
    
    // Generate compact PDF content
    const printContent = `
      <html>
        <head>
          <title>Liste des Ressources - Afri-Fek</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; margin: 10px; color: black; }
            h1 { font-size: 14px; margin: 5px 0; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 3px; text-align: left; font-size: 9px; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .status-approved { background-color: #e8f5e8; }
            .status-pending { background-color: #fff3cd; }
            .type { font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Liste des Ressources Afri-Fek</h1>
          <p style="text-align: center; margin: 5px 0;">Total: ${filteredForPrint.length} ressources</p>
          <table>
            <thead>
              <tr>
                <th style="width: 30%;">Nom</th>
                <th style="width: 10%;">Type</th>
                <th style="width: 15%;">Pays</th>
                <th style="width: 10%;">Statut</th>
                <th style="width: 35%;">URL Ressource</th>
              </tr>
            </thead>
            <tbody>
              ${filteredForPrint.map(resource => `
                <tr class="status-${resource.status}">
                  <td>${resource.name || 'N/A'}</td>
                  <td class="type">${resource.type || 'N/A'}</td>
                  <td>${resource.country || 'N/A'}</td>
                  <td>${resource.status === 'approved' ? 'Approuvé' : resource.status === 'pending' ? 'En attente' : 'Autre'}</td>
                  <td style="font-size: 8px;">${resource.link || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 10px; font-size: 8px; text-align: center;">Généré le ${new Date().toLocaleDateString('fr-FR')} - Afri-Fek Admin</p>
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
      const revuesIndex = headers.findIndex(h => h && h.toString().toLowerCase().includes('revues'));
      const isbnIndex = headers.findIndex(h => h && h.toString().toLowerCase().includes('isbn'));
      
      if (revuesIndex === -1 || isbnIndex === -1) {
        alert('Colonnes "Revues" et "ISBN" non trouvées dans le fichier XLSX');
        return;
      }
      
      const totalRows = jsonData.length - 1;
      let processedRows = 0;
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (row && row[revuesIndex] && row[isbnIndex]) {
          await addDoc(collection(db, 'FormuploadedResult'), {
            name: row[revuesIndex].toString(),
            type: 'journal',
            description: `${row[revuesIndex]}`,
            about: '',
            link: '',
            country: '',
            // image: '/logo-afrimvoe2.png',
            isbn: row[isbnIndex].toString(),
            statut: 'ACTIVE',
            detailsStatut: '',
            resourceLanguage: 'fr',
            status: 'approved',
            date: new Date().toISOString().split('T')[0],
            source: 'XLSX_UPLOAD',
            createdAt: new Date()
          });
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
      alert('Données XLSX importées avec succès!');
    } catch (error) {
      console.error('Error uploading XLSX:', error);
      alert('Erreur lors de l\'importation du XLSX');
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
    { id: 'content', label: 'Contenu Landing', icon: Edit },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },

    // { id: 'hero', label: 'Images Hero', icon: Image },
    // { id: 'import', label: 'Import XLSX', icon: Upload },
    // { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Afri-Fek</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
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
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-600 text-sm">Administration Afri-Fek</p>
              </div>
            </div>
            <div className="text-right">
               {/* <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button> */}
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">

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
                    Titre principal (HTML autorisé)
                  </label>
                  <textarea
                    value={landingContent.heroTitle}
                    onChange={(e) =>
                      setLandingContent((prev) => ({
                        ...prev,
                        heroTitle: e.target.value
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder='Utilisez <span class="text-amber-600">texte</span> pour les couleurs'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Utilisez text-amber-600 et text-blue-600 pour les couleurs
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
                    Utilisez &lt;strong class="text-amber-600"&gt;texte&lt;/strong&gt; pour mettre en évidence
                  </p>
                  {landingContent.visionTexts.map((text, index) => (
                    <div key={index}>
                      <label className="block text-xs text-gray-500 mb-1">
                        Paragraphe {index + 1}
                      </label>
                      <textarea
                        value={text}
                        onChange={(e) => {
                          const newTexts = [...landingContent.visionTexts];
                          newTexts[index] = e.target.value;
                          setLandingContent(prev => ({ ...prev, visionTexts: newTexts }));
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition"
              >
                Sauvegarder les modifications
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
              <div className=" bg-white rounded-2xl p-6 text-gray-600 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">Total Ressources</p>
                    <p className="text-3xl font-bold">{filteredResources.length}</p>
                    <p className="text-amber-700 text-xs mt-1">+{resources.filter(r => {
                      const today = new Date();
                      const resourceDate = new Date(r.date);
                      const diffTime = Math.abs(today.getTime() - resourceDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length} cette semaine</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <FileText className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Approuvées</p>
                    <p className="text-3xl font-bold">{filteredResources.filter(r => r.status === 'approved').length}</p>
                    <p className="text-amber-600 text-xs mt-1">{Math.round((filteredResources.filter(r => r.status === 'approved').length / filteredResources.length) * 100)}% du total</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">En Attente</p>
                    <p className="text-gray-700 text-3xl font-bold">{filteredResources.filter(r => r.status === 'pending').length}</p>
                    <p className="text-amber-600 text-xs mt-1">Nécessitent une action</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Activity className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Pays Couverts</p>
                    <p className="text-3xl font-bold">{Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean))).length}</p>
                    <p className="text-amber-600  text-xs mt-1">Couverture continentale</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Globe className="w-8 h-8" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <option value="academy">Académie</option>
              <option value="institution">Institution</option>
              <option value="blog">Blog</option>
            </select>

            <input
              type="text"
              placeholder="Filtrer par pays..."
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
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
                    accept=".xlsx,.xls"
                    onChange={(e) => setXlsxFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition"
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
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Pays</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((resource) => (
                  <tr key={resource.id} id={`resource-${resource.id}`} className="hover:bg-amber-50 transition-colors duration-200">
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
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                          resource.status === 'approved' ? 'bg-green-100 text-green-800' :
                          resource.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resource.status === 'approved' ? 'Approuvé' :
                           resource.status === 'pending' ? 'Attente' : 'Rejeté'}
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
            contactNumber: editForm.contactNumber || '',
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
            image: editForm.image || ''
          }}
          onInputChange={(e) => {
            const { name, value } = e.target;
            // Map new field names to old editForm structure
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
              discipline: 'discipline',
              resourceStartYear: 'coverageStartYear'
            };
            
            const mappedName = fieldMapping[name] || name;
            setEditForm(prev => ({ ...prev, [mappedName]: value }));
          }}
          onFileChange={() => {}}
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
          selectedFile={null}
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
                  {['article', 'journal', 'academy', 'institution'].map(type => {
                    const count = filteredResources.filter(r => r.type === type).length;
                    const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
                    const typeLabels = { article: 'Articles', journal: 'Journaux', academy: 'Académies', institution: 'Institutions' };
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