"use client";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Globe, X, Upload } from "lucide-react";
import { useState, useCallback } from "react";
import type { ChangeEvent, FormEvent, Key } from "react";

// FormData and FieldConfig will be defined in-file
interface FormData {
  [key: string]: any;
}

interface FieldConfig {
  name: string;
  labelKey: string; // Changed from label to labelKey
  type: "text" | "url" | "email" | "select" | "textarea" | "number" | "tel";
  required?: boolean;
  options?: { value: string; labelKey: string }[]; // Options also use labelKey
  isPremium?: boolean;
  placeholder?: string;
}

const translations = {
  fr: {
    resourceTitle: "Titre de la ressource *",
    abbreviation: "Abbréviation",
    resourceUrl: "URL de la ressource *",
    organisationName: "Propriétaire*",
    chiefEditor: "Rédacteur en chef",
    email: "Email",
    issnOnline: "ISSN en ligne",
    issnPrint: "ISSN imprimé",
    discipline: "Discipline",
    publisher: "Éditeur / Maison d'édition",
    frequency: "Fréquence *",
    licenseType: "Type de licence *",
    status: "Statut *",
    domainJournal: "Domaine de la resource",
    indexingDatabases: "Bases de données d'indexation",
    impactFactor: "Facteur d'impact",
    peerReviewType: "Type d'évaluation par les pairs",
    subjects: "Sujets",
    keywords: "Mots-clés",
    articleType: "Type d'article *",
    doiPrefix: "DOI",
    citationCount: "Nombre de citations",
    references: "Références",
    contactNumber: "Numéro de contact",
    submitResource: "Soumettre une ressource",
    resourceType: "Type de ressource *",
    country: "Pays *",
    language: "Langue *",
    description: "Description (250 mots max)",
    about: "À propos (250 mots max)",
    coverImage: "Image de couverture",
    uploading: "Téléversement...",
    cancel: "Annuler",
    submit: "Soumettre",
    submitting: "Soumission...",
    selectOption: "Sélectionnez une option",
    dragOrClick: "Glissez-déposez ou cliquez pour sélectionner",
    imageSpec: "PNG, JPG, GIF jusqu'à 10MB",
    yearly: "Annuelle",
    monthly: "Mensuelle",
    weekly: "Hebdomadaire",
    daily: "Quotidienne",
    quarterly: "Trimestrielle",
    biannual: "Semestrielle",
    openAccess: "Accès libre",
    subscription: "Abonnement",
    free: "Gratuit",
    paid: "Payant",
    ccBy: "CC BY",
    ccBySa: "CC BY-SA",
    ccByNc: "CC BY-NC",
    active: "Actif",
    inactive: "Inactif",
    pause: "En pause",
    domain1: "Commission scientifique spécialisée de droit, science économique et science politique",
    domain2: "Commission scientifique spécialisée des lettres et sciences humaines",
    domain3: "Commission scientifique spécialisée des mathématiques",
    domain4: "Commission scientifique spécialisée des sciences physiques",
    domain5: "Commission scientifique spécialisée des sciences de la terre et de la vie",
    domain6: "Commission scientifique spécialisée des sciences de l'ingénieur",
    domain7: "Commission scientifique spécialisée des sciences pharmaceutiques et médicales",
    domain8:"Autre",
    singleBlind: "Simple aveugle",
    doubleBlind: "Double aveugle",
    open: "Ouvert",
    pdf: "PDF",
    word: "Word",
    html: "HTML",
    epub: "EPUB",
    journal: "Journal",
    article: "Article",
    blog: "Blog",
    institution: "Institution",
    general: "Général",
    publication: "Publication",
    editorial: "Éditorial",
    timeCoverage: "Couverture temporelle",
    startYear: "Année de début",
    ongoing: "En cours",
    stopped: "Arrêté",
    endYear: "Année d'arrêt",
    briefDescription: "Brève description...",
    aboutOrganization: "À propos de l'organisation...",
    articleTitle: "Titre de l'article *",
    articleUrl: "URL de l'article *",
    blogTitle: "Titre du blog *",
    blogUrl: "URL du blog *",
    institutionName: "Nom de l'institution *",
    website: "Site web *",
    activityDomain: "Domaine d'activité",
    contactInstitution:"Contact institution",
    emailInstitution:"Email institution",
    contactJournal:"Contact journal",
    emailJournal:"Email journal",
    contactBlog:"Contact blog",
    emailBlog:"Email blog",
    address:"Adresse",
    school: "Universite",
    schoolName: "Nom de l'etablissement *",
    schoolContact: "Contact de l'etablissement",
    schoolEmail: "Email de l'etablissement",
    filiere: "Filière",
    mathematics: "Mathématiques",
    physics: "Physique",
    chemistry: "Chimie",
    biology: "Biologie",
    computerScience: "Informatique",
    engineering: "Ingénierie",
    geology: "Géologie",
    environmentalScience: "Sciences de l'environnement",
    statistics: "Statistiques",
    dataScience: "Science des données",
    biotechnology: "Biotechnologie",
    astronomy: "Astronomie",
    neuroscience: "Neurosciences",
    materialsScience: "Science des matériaux",
    robotics: "Robotique",
  },
  en: {
    resourceTitle: "Resource Title *",
    abbreviation: "Abbreviation",
    resourceUrl: "Resource URL *",
    organisationName: "Owner publisher *",
    chiefEditor: "Editor and Chief",
    email: "Email",
    issnOnline: "Online ISSN",
    issnPrint: "Print ISSN",
    discipline: "Discipline",
    publisher: "Publisher / Publishing House",
    frequency: "Frequency *",
    licenseType: "License Type *",
    status: "Status *",
    domainJournal: "Resource Domain",
    indexingDatabases: "Indexing Databases",
    impactFactor: "Impact Factor",
    peerReviewType: "Peer Review Type",
    subjects: "Subjects",
    keywords: "Keywords",
    articleType: "Article Type *",
    doiPrefix: "DOI",
    citationCount: "Citation Count",
    references: "References",
    contactNumber: "Contact Number",
    submitResource: "Submit a Resource",
    resourceType: "Resource Type *",
    country: "Country *",
    language: "Language *",
    description: "Description (250 words max)",
    about: "About (250 words max)",
    coverImage: "Cover Image",
    uploading: "Uploading...",
    cancel: "Cancel",
    submit: "Submit",
    submitting: "Submitting...",
    selectOption: "Select an option",
    dragOrClick: "Drag & drop or click to select",
    imageSpec: "PNG, JPG, GIF up to 10MB",
    yearly: "Yearly",
    monthly: "Monthly",
    weekly: "Weekly",
    daily: "Daily",
    quarterly: "Quarterly",
    biannual: "Biannual",
    openAccess: "Open Access",
    subscription: "Subscription",
    school: "University",
    schoolName: "University Name",
    schoolContact: "University Contact ",
    schoolEmail: "University Email",
    free: "Free",
    paid: "Paid",
    ccBy: "CC BY",
    ccBySa: "CC BY-SA",
    ccByNc: "CC BY-NC",
    active: "Active",
    inactive: "Inactive",
    pause: "On hold",
    domain1: "Specialized scientific commission for law, economics and political science",
    domain2: "Specialized scientific commission for letters and human sciences",
    domain3: "Specialized scientific commission for mathematics",
    domain4: "Specialized scientific commission for physical sciences",
    domain5: "Specialized scientific commission for earth and life sciences",
    domain6: "Specialized scientific commission for engineering sciences",
    domain7: "Specialized scientific commission for pharmaceutical and medical sciences",
    domain8: "Other",
    singleBlind: "Single-blind",
    doubleBlind: "Double-blind",
    open: "Open",
    pdf: "PDF",
    word: "Word",
    html: "HTML",
    epub: "EPUB",
    journal: "Journal",
    article: "Article",
    blog: "Blog",
    institution: "Institution",
    general: "General",
    publication: "Publication",
    editorial: "Editorial",
    timeCoverage: "Time coverage",
    startYear: "Start year",
    ongoing: "Ongoing",
    stopped: "Stopped",
    endYear: "End year",
    briefDescription: "Brief description...",
    aboutOrganization: "About the organization...",
    articleTitle: "Article Title *",
    articleUrl: "Article URL *",
    blogTitle: "Blog Title *",
    blogUrl: "Blog URL *",
    institutionName: "Institution Name *",
    website: "Website *",
    activityDomain: "Activity Domain",
    contactInstitution:"Institution contact",
    emailInstitution:"Institution email",
    contactJournal:"Journal contact",
    emailJournal:"Journal email",
    contactBlog:"Blog contact",
    emailBlog:"Blog email",
    address:"Address"
  },
};

const filiereOptions = [
  { value: "mathematics", labelKey: "mathematics" },
  { value: "physics", labelKey: "physics" },
  { value: "chemistry", labelKey: "chemistry" },
  { value: "biology", labelKey: "biology" },
  { value: "computer_science", labelKey: "computerScience" },
  { value: "engineering", labelKey: "engineering" },
  { value: "geology", labelKey: "geology" },
  { value: "environmental_science", labelKey: "environmentalScience" },
  { value: "statistics", labelKey: "statistics" },
  { value: "data_science", labelKey: "dataScience" },
  { value: "biotechnology", labelKey: "biotechnology" },
  { value: "astronomy", labelKey: "astronomy" },
  { value: "neuroscience", labelKey: "neuroscience" },
  { value: "materials_science", labelKey: "materialsScience" },
  { value: "robotics", labelKey: "robotics" },
];
const FIELD_GROUPS: Record<string, FieldConfig[]> = {
  journal: [
    { name: "resourceTitle", labelKey: "resourceTitle", type: "text", required: true },
    { name: "resourceUrl", labelKey: "resourceUrl", type: "url", required: true },
    { name: "organisationName", labelKey: "organisationName", type: "text", required: true },
    { name: "chiefEditor", labelKey: "chiefEditor", type: "text" },
    { name: "contact", labelKey: "contactJournal", type: "number" },
    { name: "email", labelKey: "emailJournal", type: "email" },
    { name: "issnOnline", labelKey: "issnOnline", type: "text" },
    { name: "issnPrint", labelKey: "issnPrint", type: "text" },
    { name: "discipline", labelKey: "discipline", type: "text" },
    { name: "publisher", labelKey: "publisher", type: "text" },
    { name: "abbreviation", labelKey: "abbreviation", type: "text" },

    {
      name: "frequency",
      labelKey: "frequency",
      type: "select",
      required: true,
      options: [
        { value: "yearly", labelKey: "yearly" },
        { value: "monthly", labelKey: "monthly" },
        { value: "weekly", labelKey: "weekly" },
        { value: "daily", labelKey: "daily" },
        { value: "quarterly", labelKey: "quarterly" },
        { value: "biannual", labelKey: "biannual" },
      ],
    },
    {
      name: "licenseType",
      labelKey: "licenseType",
      type: "select",
      required: true,
      options: [
        { value: "open-access", labelKey: "openAccess" },
        { value: "subscription", labelKey: "subscription" },
        { value: "free", labelKey: "free" },
        { value: "paid", labelKey: "paid" },
        { value: "cc-by", labelKey: "ccBy" },
        { value: "cc-by-sa", labelKey: "ccBySa" },
        { value: "cc-by-nc", labelKey: "ccByNc" },
      ],
    },
    {
      name: "statut",
      labelKey: "status",
      type: "select",
      required: true,
      options: [
        { value: "active", labelKey: "active" },
        { value: "inactive", labelKey: "inactive" },
        { value: "pause", labelKey: "pause" },
      ],
    },
    {
      name: "domainJournal",
      labelKey: "domainJournal",
      type: "select",
      options: [
        { value: "domain1", labelKey: "domain1" },
        { value: "domain2", labelKey: "domain2" },
        { value: "domain3", labelKey: "domain3" },
        { value: "domain4", labelKey: "domain4" },
        { value: "domain5", labelKey: "domain5" },
        { value: "domain6", labelKey: "domain6" },
        { value: "domain7", labelKey: "domain7" },
        { value: "domain8", labelKey: "domain8" },

      ],
    },
    { name: "indexingDatabases", labelKey: "indexingDatabases", type: "text", isPremium: true },
    { name: "impactFactor", labelKey: "impactFactor", type: "number", isPremium: true },
    {
      name: "peerReviewType",
      labelKey: "peerReviewType",
      type: "select",
      options: [
        { value: "single-blind", labelKey: "singleBlind" },
        { value: "double-blind", labelKey: "doubleBlind" },
        { value: "open", labelKey: "open" },
      ],
    },
    { name: "subjects", labelKey: "subjects", type: "text" },
    { name: "keywords", labelKey: "keywords", type: "text" },
  ],
  article: [
    { name: "resourceTitle", labelKey: "articleTitle", type: "text", required: true },
    { name: "resourceUrl", labelKey: "articleUrl", type: "url", required: true },
    { name: "organisationName", labelKey: "organisationName", type: "text", required: true },
    { name: "email", labelKey: "email", type: "email" },
    { name: "contact", labelKey: "contact", type: "number" },
    // { name: "abbreviation", labelKey: "abbreviation", type: "text" },

    {
      name: "articleType",
      labelKey: "articleType",
      type: "select",
      required: true,
      options: [
        { value: "pdf", labelKey: "pdf" },
        { value: "word", labelKey: "word" },
        { value: "html", labelKey: "html" },
        { value: "epub", labelKey: "epub" },
      ],
    },
    {
      name: "licenseType",
      labelKey: "licenseType",
      type: "select",
      required: true,
      options: [
        { value: "open-access", labelKey: "openAccess" },
        { value: "subscription", labelKey: "subscription" },
        { value: "free", labelKey: "free" },
        { value: "paid", labelKey: "paid" },
        { value: "cc-by", labelKey: "ccBy" },
        { value: "cc-by-sa", labelKey: "ccBySa" },
        { value: "cc-by-nc", labelKey: "ccByNc" },
      ],
    },
    { name: "discipline", labelKey: "discipline", type: "text" },
    { name: "publisher", labelKey: "publisher", type: "text" },
    { name: "doiPrefix", labelKey: "doiPrefix", type: "text" },
    { name: "citationCount", labelKey: "citationCount", type: "number" },
    { name: "references", labelKey: "references", type: "textarea" },
    { name: "keywords", labelKey: "keywords", type: "text" },
  ],
  blog: [
    { name: "resourceTitle", labelKey: "blogTitle", type: "text", required: true },
    { name: "resourceUrl", labelKey: "blogUrl", type: "url", required: true },
    { name: "organisationName", labelKey: "organisationName", type: "text", required: true },
    { name: "email", labelKey: "emailBlog", type: "email" },
    { name: "contact", labelKey: "contactBlog", type: "number" },
    { name: "discipline", labelKey: "discipline", type: "text" },
    { name: "publisher", labelKey: "publisher", type: "text" },
    { name: "abbreviation", labelKey: "abbreviation", type: "text" },
 {
      name: "domainJournal",
      labelKey: "activityDomain",
      type: "select",
      options: [
        { value: "domain1", labelKey: "domain1" },
        { value: "domain2", labelKey: "domain2" },
        { value: "domain3", labelKey: "domain3" },
        { value: "domain4", labelKey: "domain4" },
        { value: "domain5", labelKey: "domain5" },
        { value: "domain6", labelKey: "domain6" },
        { value: "domain7", labelKey: "domain7" },
      ],
    },
    {
      name: "statut",
      labelKey: "status",
      type: "select",
      required: true,
      options: [
        { value: "active", labelKey: "active" },
        { value: "inactive", labelKey: "inactive" },
        { value: "pause", labelKey: "pause" },
      ],
    },
    { name: "subjects", labelKey: "subjects", type: "text" },
    { name: "keywords", labelKey: "keywords", type: "text" },
  ],
  institution: [
    { name: "organisationName", labelKey: "institutionName", type: "text", required: true },
    { name: "resourceUrl", labelKey: "website", type: "url", required: true },
    { name: "email", labelKey: "emailInstitution", type: "email" },
    { name: "address", labelKey: "address", type: "text" },
    { name: "contact", labelKey: "contactInstitution", type: "number" },
    { name: "abbreviation", labelKey: "abbreviation", type: "text" },

    {
      name: "domainJournal",
      labelKey: "activityDomain",
      type: "select",
      options: [
        { value: "domain1", labelKey: "domain1" },
        { value: "domain2", labelKey: "domain2" },
        { value: "domain3", labelKey: "domain3" },
        { value: "domain4", labelKey: "domain4" },
        { value: "domain5", labelKey: "domain5" },
        { value: "domain6", labelKey: "domain6" },
        { value: "domain7", labelKey: "domain7" },
      ],
    },
        { name: "discipline", labelKey: "discipline", type: "text" },

    {
      name: "statut",
      labelKey: "status",
      type: "select",
      required: true,
      options: [
        { value: "active", labelKey: "active" },
        { value: "inactive", labelKey: "inactive" },
        { value: "pause", labelKey: "pause" },
      ],
    },
  ],
  school: [
    { name: "organisationName", labelKey: "schoolName", type: "text", required: true },
    { name: "resourceUrl", labelKey: "website", type: "url", required: true },
    { name: "email", labelKey: "schoolEmail", type: "email" },
    { name: "address", labelKey: "address", type: "text" },
    { name: "contact", labelKey: "schoolContact", type: "number" },
    { name: "discipline", labelKey: "discipline", type: "text" },
    { name: "abbreviation", labelKey: "abbreviation", type: "text" },
    {
      name: "filiere",
      labelKey: "filiere",
      type: "select",
      options: filiereOptions,
    },
    {
      name: "domainJournal",
      labelKey: "activityDomain",
      type: "select",
      options: [
        { value: "domain1", labelKey: "domain1" },
        { value: "domain2", labelKey: "domain2" },
        { value: "domain3", labelKey: "domain3" },
        { value: "domain4", labelKey: "domain4" },
        { value: "domain5", labelKey: "domain5" },
        { value: "domain6", labelKey: "domain6" },
        { value: "domain7", labelKey: "domain7" },
      ],
    },
    {
      name: "statut",
      labelKey: "status",
      type: "select",
      required: true,
      options: [
        { value: "active", labelKey: "active" },
        { value: "inactive", labelKey: "inactive" },
        { value: "pause", labelKey: "pause" },
      ],
    },
  ],
};

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  selectedFile: File | null;
  isSubmitting: boolean;
  submitMessage: { type: "success" | "error"; message: string } | null;
  uploadProgress: number;
  isEditing?: boolean;
}

export default function ResourceForm({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onFileChange,
  onSubmit,
  selectedFile,
  isSubmitting,
  submitMessage,
  uploadProgress,
  isEditing = false,
}: ResourceFormProps) {
  const [formLanguage, setFormLanguage] = useState<"fr" | "en">("fr");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const synthetic = { target: { files: [file] } } as any;
        onFileChange(synthetic);
      }
    },
  });

  const translate = useCallback(
    (key: string) => {
      return translations[formLanguage][key as keyof typeof translations.fr] || key;
    },
    [formLanguage]
  );

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] ?? "";
    const baseClass =
      "w-full px-3 py-2 border border-gray-300 rounded-lg " +
      "focus:ring-2 focus:ring-amber-500 focus:border-amber-500 " +
      "outline-none transition bg-white";

    const commonProps = {
      name: field.name,
      value,
      onChange: onInputChange,
      required: field.required,
      id: field.name,
    };

    switch (field.type) {
      case "select":
        return (
          <select {...commonProps} className={baseClass}>
            <option value="">{translate("selectOption")}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {translate(option.labelKey)}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            placeholder={field.placeholder ? translate(field.placeholder) : ""}
            rows={3}
            className={`${baseClass} resize-y min-h-[80px]`}
          />
        );
      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder ? translate(field.placeholder) : ""}
            className={baseClass}
          />
        );
    }
  };

  if (!isOpen) return null;

  const currentFields = FIELD_GROUPS[formData.type] || FIELD_GROUPS.journal;

  const groupedFields1 = {
    Identification: currentFields.filter((f) =>
      ["resourceTitle", "resourceUrl",  "issnOnline", "issnPrint","abbreviation","domainJournal","discipline"].includes(f.name)
    ),
    Administration: currentFields.filter((f) =>
      ["publisher","chiefEditor", "organisationName","contact","email","address" ].includes(f.name)
    ),
     Fonctionnement: currentFields.filter((f) =>
      [  "frequency", "licenseType", "statut"].includes(f.name)
    ),
  };
   const groupedFields2 = {
    Identification: FIELD_GROUPS.institution.filter((f) =>
      ["organisationName", "resourceUrl",  "domainJournal","discipline"].includes(f.name)
    ),
   
    details: FIELD_GROUPS.institution.filter((f) =>
      ["abbreviation","statut","address"].includes(f.name)
    ),
     contact: FIELD_GROUPS.institution.filter((f) =>
      ["contact", "email"].includes(f.name)
    ),
  };
   const groupedFields3 = {
    Identification: FIELD_GROUPS.blog.filter((f) =>
      ["resourceTitle", "resourceUrl", "organisationName","domainJournal","discipline"].includes(f.name)
    ),
   
    details: FIELD_GROUPS.blog.filter((f) =>
      ["abbreviation", "publisher", "statut", "subjects", "keywords"].includes(f.name)
    ),
     contact: FIELD_GROUPS.blog.filter((f) =>
      ["contact", "email"].includes(f.name)
    ),
  };

  const articleFields = {
    Identification: FIELD_GROUPS.article.filter(f => ["resourceTitle", "resourceUrl","domainJournal", "organisationName","doiPrefix"].includes(f.name)),
    details: FIELD_GROUPS.article.filter(f => ["discipline","articleType", "licenseType",  "publisher", ].includes(f.name)),
    meta: FIELD_GROUPS.article.filter(f => ["address","citationCount", "references", "keywords"].includes(f.name)),
  };

  const schoolFields = {
    Identification: FIELD_GROUPS.school.filter((f) =>
      ["organisationName", "resourceUrl", "abbreviation", "domainJournal","discipline"].includes(f.name)
    ),
    details: FIELD_GROUPS.school.filter((f) =>
      [ "statut","filiere", "address"].includes(f.name)
    ),
    contact: FIELD_GROUPS.school.filter((f) =>
      ["contact", "email"].includes(f.name)
    ),
  };

  let fieldsToRender;
  switch (formData.type) {
    case 'journal':
      fieldsToRender = groupedFields1;
      break;
    case 'institution':
      fieldsToRender = groupedFields2;
      break;
    case 'blog':
      fieldsToRender = groupedFields3;
      break;
    case 'article':
      fieldsToRender = articleFields;
      break;
    case 'university':
      fieldsToRender = schoolFields;
      break;
    default:
      fieldsToRender = groupedFields1;
  }


  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-9xl h-[100vh]  shadow-2xl overflow-hidden flex flex-col">
        <header className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {translate("submitResource")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Globe className="w-5 h-5 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
              <select
                value={formLanguage}
                onChange={(e) => setFormLanguage(e.target.value as "fr" | "en")}
                className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white appearance-none"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto">
          <form onSubmit={onSubmit} id="resource-form" className="p-8 space-y-8">
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1 text-gray-700">
                {translate("resourceType")}
              </label>
              {renderField({
                name: "type",
                labelKey: "resourceType",
                type: "select",
                required: true,
                options: [
                  { value: "journal", labelKey: "journal" },
                  { value: "article", labelKey: "article" },
                  { value: "blog", labelKey: "blog" },
                  { value: "institution", labelKey: "institution" },
                  { value: "university", labelKey: "school" },
                ],
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              {Object.entries(fieldsToRender).map(([groupName, fields]) =>
                fields.length > 0 ? (
                  <div key={groupName} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 capitalize">
                      {translate(groupName)}
                    </h3>
                    {fields.map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium mb-1 text-gray-700">
                          {translate(field.labelKey)}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
            {formData.type === "journal" && (
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate("timeCoverage")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {translate("startYear")}
                    </label>
                    <input
                      type="number"
                      name="coverageStartYear"
                      value={formData.coverageStartYear || ""}
                      onChange={onInputChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                      placeholder="Ex: 2010"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {translate("status")}
                    </label>
                    <select
                      name="coverageStatus"
                      value={formData.coverageStatus || "ongoing"}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                    >
                      <option value="ongoing">{translate("ongoing")}</option>
                      <option value="stopped">{translate("stopped")}</option>
                    </select>
                  </div>
                  {formData.coverageStatus === "stopped" && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        {translate("endYear")}
                      </label>
                      <input
                        type="number"
                        name="coverageEndYear"
                        value={formData.coverageEndYear || ""}
                        onChange={onInputChange}
                        min={formData.coverageStartYear || "1900"}
                        max={new Date().getFullYear()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                        placeholder="Ex: 2020"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
              <div className="space-y-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-1 text-gray-700">
                    {translate("country")}
                  </label>
                  {renderField({
                    name: "country",
                    labelKey: "country",
                    type: "select",
                    required: true,
                    options: [
                      "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi", "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo", "Côte d'Ivoire", "Djibouti", "Égypte", "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho", "Liberia", "Libye", "Madagascar", "Malawi", "Mali", "Maroc", "Maurice", "Mauritanie", "Mozambique", "Namibie", "Niger", "Nigeria", "Ouganda", "RDC", "Rwanda", "São Tomé-et-Príncipe", "Sénégal", "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud", "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe",
                    ].map((c) => ({ value: c, labelKey: c })),
                  })}
                </div>
                  <div>

        </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium mb-1 text-gray-700">
                    {translate("language")}
                  </label>
                  {renderField({
                    name: "language",
                    labelKey: "language",
                    type: "select",
                    required: true,
                    options: [
                      "Français", "English", "العربية", "Português", "Kiswahili", "isiZulu", "Yorùbá", "Hausa", "Igbo", "አማርኛ", "Oromoo", "Somali",
                    ].map((l) => ({ value: l, labelKey: l })),
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
                    {translate("description")}
                  </label>
                  {renderField({
                    name: "description",
                    labelKey: "description",
                    type: "textarea",
                    placeholder: "briefDescription",
                  })}
                </div>
                <div>
                  <label htmlFor="about" className="block text-sm font-medium mb-1 text-gray-700">
                    {translate("about")}
                  </label>
                  {renderField({
                    name: "about",
                    labelKey: "about",
                    type: "textarea",
                    placeholder: "aboutOrganization",
                  })}
                </div>
              </div>
            </div>

         <div>
  <label className="block text-sm font-medium text-gray-700">
    {translate("coverImage")}
  </label>
  <div
    {...getRootProps()}
    className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
      isDragActive ? "border-amber-500" : "border-gray-300"
    } border-dashed rounded-md cursor-pointer transition-colors`}
  >
    <div className="space-y-1 text-center">
      {formData.image && !selectedFile && (  
        <Image
  src={formData.image} // Ensure this is a valid URL or base64 string
  alt="Current resource image"
  width={296}
  height={296}
  className="mx-auto object-contain rounded-md"
  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement; // Type-cast target to HTMLImageElement
    target.src = "/path/to/fallback_image.jpg"; // Set the fallback image if there's an error
  }}
/>) }

      {selectedFile  ?  (
        // Display preview of selected file
        <div>
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            width={96}
            height={96}
            className="mx-auto object-contain rounded-md"
          />
          <p className="text-sm text-gray-600 mt-2">
            {selectedFile.name}
          </p>
        </div>
      )  : (
        // Fallback UI if no image selected or during initial state
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <p className="pl-1">{translate("dragOrClick")}</p>
          </div>
          <p className="text-xs text-gray-500">
            {translate("imageSpec")}
          </p>
        </>
      )}
    </div>
    <input {...getInputProps()} className="sr-only" />
  </div>
</div>

          </form>
        </div>

        <footer className="px-8 py-4 bg-gray-50 border-t sticky bottom-0 z-10">
          {isSubmitting && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-amber-700">
                  {translate("uploading")}
                </span>
                <span className="text-sm font-medium text-amber-700">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-amber-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {submitMessage && (
             <div
              className={`p-4 mb-4 text-sm rounded-lg ${
                submitMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitMessage.message}
            </div>
          )}

          <div className="flex justify-start items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              disabled={isSubmitting}
            >
              {translate("cancel")}
            </button>
            <button
              type="submit"
              form="resource-form"
              className="px-6 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-lg shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? translate("submitting") : translate("submit")}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}