import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/supabase';

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (
    formData: any,
    selectedFile: File | null,
    setPendingResourceData: (data: any) => void,
    setShowUserComment: (show: boolean) => void,
    resetForm: () => void
  ) => {
 const titleField = ["institution", "universite"].includes(formData.type) ? formData.organisationName : formData.resourceTitle;
    if (!titleField || !formData.description || !formData.resourceUrl) {
      setSubmitMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setUploadProgress(0);

    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage("Timeout - Veuillez réessayer.");
    }, 30000);

    try {
      let imageUrl = "";

      if (selectedFile) {
        try {
          setUploadProgress(25);
          imageUrl = await uploadImage(selectedFile);
          setUploadProgress(100);
        } catch (error) {
          console.error("Supabase upload error:", error);
          imageUrl = "";
          setSubmitMessage("Upload de l'image échoué, ressource soumise sans image.");
        }
      }

      const resourceData = {
        name: formData.type === "institution" ? formData.organisationName : formData.resourceTitle,
        type: formData.type,
        description: formData.description,
        about: formData.about || "",
        link: formData.resourceUrl,
        country: formData.country || "",
        language: formData.language,
        image: imageUrl,
        resourceLanguage: formData.language,
        organisationName: formData.organisationName || "",
        chiefEditor: formData.chiefEditor || "",
        email: formData.email || "",
        articleType: formData.articleType || "",
        frequency: formData.frequency || "",
        licenseType: formData.licenseType || "",
        issnOnline: formData.issnOnline || "",
        issnPrint: formData.issnPrint || "",
        contactNumber: formData.contactNumber || "",
        discipline: formData.discipline || "",
        publisher: formData.publisher || "",
        domainJournal: formData.domainJournal || "",
        coverageStartYear: formData.coverageStartYear || "",
        coverageEndYear: formData.coverageEndYear || "",
        coverageStatus: formData.coverageStatus || "",
        abbreviation: formData.abbreviation || "",
        keywords: formData.keywords || "",
        subjects: formData.subjects || "",
        doiPrefix: formData.doiPrefix || "",
        citationCount: formData.citationCount || "",
        references: formData.references || "",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        createdAt: new Date(),
        submittedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "resources"), resourceData);
      setPendingResourceData({ ...resourceData, id: docRef.id });

      clearTimeout(timeoutId);
      setSubmitMessage("Ressource soumise avec succès!");
      setShowUserComment(true);
      resetForm();
      setUploadProgress(0);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Erreur soumission:", error);
      setSubmitMessage(`Erreur: ${error instanceof Error ? error.message : "Veuillez réessayer"}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return {
    isSubmitting,
    submitMessage,
    uploadProgress,
    handleSubmit,
    setSubmitMessage
  };
};