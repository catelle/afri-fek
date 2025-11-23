import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/supabase';
import { getInitialResourceFormData } from '@/utils/resourceDetailUtils';

export const useResourceDetailForm = () => {
  const [formData, setFormData] = useState(getInitialResourceFormData());
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
          imageUrl = await uploadImage(selectedFile);
          setUploadProgress(100);
        } catch (error) {
          console.error('Supabase upload error:', error);
          imageUrl = '';
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
        language: formData.language,
        image: imageUrl,
        statut: formData.statut,
        detailsStatut: formData.detailsStatut,
        resourceLanguage: formData.resourceLanguage,
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
      setPendingResourceData({ ...resourceData, id: docRef.id });
      
      clearTimeout(timeoutId);
      setSubmitMessage('Ressource soumise avec succès!');
      setShowClarification(true);
      
      setFormData(getInitialResourceFormData());
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

  return {
    formData,
    setFormData,
    selectedFile,
    isSubmitting,
    submitMessage,
    uploadProgress,
    pendingResourceData,
    showClarification,
    handleFileChange,
    handleSubmit
  };
};