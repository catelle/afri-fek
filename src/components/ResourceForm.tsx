"use client";

import { Globe, X } from "lucide-react";
import { useEffect, useState } from "react";

// Comprehensive FormData interface supporting all resource types
interface FormData {
  // Common fields
  resourceTitle: string;
  resourceUrl: string;
  organisationName: string;
  email?: string;
  country: string;
  language: string;
  discipline?: string;
  description?: string;
  about?: string;
  image?: string;
  type: string;
  
  // Journal-specific fields
  chiefEditor?: string;
  issnOnline?: string;
  issnPrint?: string;
  publisher?: string;
  frequency?: string;
  licenseType?: string;
  status?: string;
  domainJournal?: string;
  coverageStatus?: string;
  coverageStartYear?: string;
  coverageEndYear?: string;
  indexingDatabases?: string; // Premium feature
  impactFactor?: string; // Premium feature
  peerReviewType?: string;
  subjects?: string;
  
  // Article-specific fields
  articleType?: string;
  doiPrefix?: string;
  citationCount?: string;
  references?: string;
  
  // Institution-specific fields
  contactNumber?: string;
  
  // Common metadata fields
  keywords?: string;
  verificationStatus?: string;
  dataSource?: string;
  submittedBy?: string;
  approvedBy?: string;
}

// Field configuration for each resource type
type FieldConfig = {
  name: keyof FormData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  isPremium?: boolean; // For future premium features
};

const FIELD_GROUPS: Record<string, FieldConfig[]> = {
  journal: [
    { name: 'resourceTitle', label: 'Titre de la ressource *', type: 'text', required: true },
    { name: 'resourceUrl', label: 'URL de la ressource *', type: 'url', required: true },
    { name: 'organisationName', label: 'Nom de l\'organisation *', type: 'text', required: true },
    { name: 'chiefEditor', label: 'Rédacteur en chef', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'issnOnline', label: 'ISSN en ligne', type: 'text' },
    { name: 'issnPrint', label: 'ISSN imprimé', type: 'text' },
    { name: 'discipline', label: 'Discipline', type: 'text' },
    { name: 'publisher', label: 'Éditeur / Maison d\'édition', type: 'text' },
    { name: 'frequency', label: 'Fréquence *', type: 'select', required: true, options: [
      { value: 'yearly', label: 'Annuelle' },
      { value: 'monthly', label: 'Mensuelle' },
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'daily', label: 'Quotidienne' },
      { value: 'quarterly', label: 'Trimestrielle' },
      { value: 'biannual', label: 'Semestrielle' }
    ]},
    { name: 'licenseType', label: 'Type de licence *', type: 'select', required: true, options: [
      { value: 'open-access', label: 'Accès libre' },
      { value: 'subscription', label: 'Abonnement' },
      { value: 'free', label: 'Gratuit' },
      { value: 'paid', label: 'Payant' },
      { value: 'cc-by', label: 'CC BY' },
      { value: 'cc-by-sa', label: 'CC BY-SA' },
      { value: 'cc-by-nc', label: 'CC BY-NC' }
    ]},
    { name: 'status', label: 'Statut *', type: 'select', required: true, options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'pause', label: 'En pause' }
    ]},
    { name: 'domainJournal', label: 'Domaine du journal', type: 'select', options: [
      { value: 'domain1', label: 'Commission scientifique spécialisée de droit, science économique et science politique' },
      { value: 'domain2', label: 'Commission scientifique spécialisée des lettres et sciences humaines' },
      { value: 'domain3', label: 'Commission scientifique spécialisée des mathématiques' },
      { value: 'domain4', label: 'Commission scientifique spécialisée des sciences physiques' },
      { value: 'domain5', label: 'Commission scientifique spécialisée des sciences de la terre et de la vie' },
      { value: 'domain6', label: 'Commission scientifique spécialisée des sciences de l\'ingénieur' },
      { value: 'domain7', label: 'Commission scientifique spécialisée des sciences pharmaceutiques et médicales' }
    ]},
    // Premium features - can be conditionally disabled for free users
    { name: 'indexingDatabases', label: 'Bases de données d\'indexation', type: 'text', isPremium: true },
    { name: 'impactFactor', label: 'Facteur d\'impact', type: 'number', isPremium: true },
    { name: 'peerReviewType', label: 'Type d\'évaluation par les pairs', type: 'select', options: [
      { value: 'single-blind', label: 'Simple aveugle' },
      { value: 'double-blind', label: 'Double aveugle' },
      { value: 'open', label: 'Ouvert' }
    ]},
    { name: 'subjects', label: 'Sujets', type: 'text' },
    { name: 'keywords', label: 'Mots-clés', type: 'text' }
  ],
  article: [
    { name: 'resourceTitle', label: 'Titre de l\'article *', type: 'text', required: true },
    { name: 'resourceUrl', label: 'URL de l\'article *', type: 'url', required: true },
    { name: 'organisationName', label: 'Nom de l\'organisation *', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'articleType', label: 'Type d\'article *', type: 'select', required: true, options: [
      { value: 'pdf', label: 'PDF' },
      { value: 'word', label: 'Word' },
      { value: 'html', label: 'HTML' },
      { value: 'epub', label: 'EPUB' }
    ]},
    { name: 'licenseType', label: 'Type de licence *', type: 'select', required: true, options: [
      { value: 'open-access', label: 'Accès libre' },
      { value: 'subscription', label: 'Abonnement' },
      { value: 'free', label: 'Gratuit' },
      { value: 'paid', label: 'Payant' },
      { value: 'cc-by', label: 'CC BY' },
      { value: 'cc-by-sa', label: 'CC BY-SA' },
      { value: 'cc-by-nc', label: 'CC BY-NC' }
    ]},
    { name: 'discipline', label: 'Discipline', type: 'text' },
    { name: 'publisher', label: 'Éditeur', type: 'text' },
    { name: 'doiPrefix', label: 'Préfixe DOI', type: 'text' },
    { name: 'citationCount', label: 'Nombre de citations', type: 'number' },
    { name: 'references', label: 'Références', type: 'textarea' },
    { name: 'keywords', label: 'Mots-clés', type: 'text' }
  ],
  blog: [
    { name: 'resourceTitle', label: 'Titre du blog *', type: 'text', required: true },
    { name: 'resourceUrl', label: 'URL du blog *', type: 'url', required: true },
    { name: 'organisationName', label: 'Nom de l\'organisation *', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'discipline', label: 'Discipline', type: 'text' },
    { name: 'publisher', label: 'Éditeur', type: 'text' },
    { name: 'status', label: 'Statut *', type: 'select', required: true, options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'pause', label: 'En pause' }
    ]},
    { name: 'subjects', label: 'Sujets', type: 'text' },
    { name: 'keywords', label: 'Mots-clés', type: 'text' }
  ],
  institution: [
    { name: 'organisationName', label: 'Nom de l\'institution *', type: 'text', required: true },
    { name: 'resourceUrl', label: 'Site web *', type: 'url', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'contactNumber', label: 'Numéro de contact', type: 'tel' },
    { name: 'discipline', label: 'Discipline', type: 'text' },
    { name: 'domainJournal', label: 'Domaine d\'activité', type: 'select', options: [
      { value: 'domain1', label: 'Commission scientifique spécialisée de droit, science économique et science politique' },
      { value: 'domain2', label: 'Commission scientifique spécialisée des lettres et sciences humaines' },
      { value: 'domain3', label: 'Commission scientifique spécialisée des mathématiques' },
      { value: 'domain4', label: 'Commission scientifique spécialisée des sciences physiques' },
      { value: 'domain5', label: 'Commission scientifique spécialisée des sciences de la terre et de la vie' },
      { value: 'domain6', label: 'Commission scientifique spécialisée des sciences de l\'ingénieur' },
      { value: 'domain7', label: 'Commission scientifique spécialisée des sciences pharmaceutiques et médicales' }
    ]},
    { name: 'status', label: 'Statut *', type: 'select', required: true, options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'pause', label: 'En pause' }
    ]}
  ]
};

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedFile: File | null;
  isSubmitting: boolean;
  submitMessage: string;
  uploadProgress: number;
  language: "fr" | "en";
  t: any;
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
  language,
  t,
}: ResourceFormProps) {
  const [formLanguage, setFormLanguage] = useState<'fr' | 'en'>('fr');
  
  if (!isOpen) return null;
  
  // Translation function
  const translate = (fr: string, en: string) => formLanguage === 'en' ? en : fr;
  
  // Field translations
  const fieldTranslations: Record<string, { fr: string; en: string }> = {
    resourceTitle: { fr: 'Titre de la ressource *', en: 'Resource title *' },
    resourceUrl: { fr: 'URL de la ressource *', en: 'Resource URL *' },
    organisationName: { fr: 'Nom de l\'organisation *', en: 'Organization name *' },
    chiefEditor: { fr: 'Rédacteur en chef', en: 'Chief editor' },
    email: { fr: 'Email', en: 'Email' },
    issnOnline: { fr: 'ISSN en ligne', en: 'Online ISSN' },
    issnPrint: { fr: 'ISSN imprimé', en: 'Print ISSN' },
    discipline: { fr: 'Discipline', en: 'Discipline' },
    publisher: { fr: 'Éditeur / Maison d\'édition', en: 'Publisher' },
    frequency: { fr: 'Fréquence *', en: 'Frequency *' },
    licenseType: { fr: 'Type de licence *', en: 'License type *' },
    status: { fr: 'Statut *', en: 'Status *' },
    domainJournal: { fr: 'Domaine du journal', en: 'Journal domain' },
    contactNumber: { fr: 'Numéro de contact', en: 'Contact number' },
    keywords: { fr: 'Mots-clés', en: 'Keywords' },
    subjects: { fr: 'Sujets', en: 'Subjects' },
    description: { fr: 'Description *', en: 'Description *' },
    about: { fr: 'À propos', en: 'About' },
    country: { fr: 'Pays *', en: 'Country *' },
    language: { fr: 'Langue *', en: 'Language *' }
  };
  
  // Get current resource type fields
  const currentFields = FIELD_GROUPS[formData.type] || FIELD_GROUPS.journal;
  
  // Handle type change - clear non-visible fields
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    
    // Trigger the change with the new type
    onInputChange({
      target: { name: 'type', value: newType }
    } as React.ChangeEvent<HTMLSelectElement>);
  };
  
  // Render field based on configuration
  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] || '';
    const commonProps = {
      name: field.name,
      value,
      onChange: onInputChange,
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition",
      placeholder: field.placeholder,
      required: field.required
    };
    
    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Sélectionnez une option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-y min-h-[80px]"
          />
        );
      default:
        return <input {...commonProps} type={field.type} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center">
      <div className="bg-white w-full h-full overflow-hidden">
        <header className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {translate("Soumettre une ressource", "Submit a resource")}
          </h2>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <select
              value={formLanguage}
              onChange={(e) => setFormLanguage(e.target.value as 'fr' | 'en')}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <form onSubmit={onSubmit} className="p-8 space-y-6">
            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  submitMessage.includes("succès")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Resource Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {translate("Type de ressource *", "Resource type *")}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                required
              >
                <option value="journal">{translate("Journal", "Journal")}</option>
                <option value="article">{translate("Article", "Article")}</option>
                <option value="blog">{translate("Blog", "Blog")}</option>
                <option value="institution">{translate("Institution", "Institution")}</option>
              </select>
            </div>

            {/* Dynamic Fields Based on Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFields
                .filter(field => field.type !== 'textarea') // Handle textareas separately
                .map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {fieldTranslations[field.name] ? fieldTranslations[field.name][formLanguage] : field.label}
                    {/* Premium feature indicator */}
                    {field.isPremium && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {translate("Premium", "Premium")}
                      </span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* Coverage Section - Only for Journals */}
            {formData.type === 'journal' && (
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translate("Couverture temporelle", "Time coverage")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {translate("Année de début", "Start year")}
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
                      {translate("Statut", "Status")}
                    </label>
                    <select
                      name="coverageStatus"
                      value={formData.coverageStatus || "ongoing"}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                    >
                      <option value="ongoing">{translate("En cours", "Ongoing")}</option>
                      <option value="stopped">{translate("Arrêté", "Stopped")}</option>
                    </select>
                  </div>

                  {formData.coverageStatus === "stopped" && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        {translate("Année d'arrêt", "End year")}
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

            {/* Common Fields - Country and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {translate("Pays *", "Country *")}
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  required
                >
                  <option value="">{translate("Sélectionnez un pays", "Select a country")}</option>
                  <option value="Afrique du Sud">Afrique du Sud</option>
                  <option value="Algérie">Algérie</option>
                  <option value="Angola">Angola</option>
                  <option value="Bénin">Bénin</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cameroun">Cameroun</option>
                  <option value="Cap-Vert">Cap-Vert</option>
                  <option value="Centrafrique">Centrafrique</option>
                  <option value="Comores">Comores</option>
                  <option value="Congo">Congo</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Égypte">Égypte</option>
                  <option value="Érythrée">Érythrée</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Éthiopie">Éthiopie</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambie">Gambie</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Guinée">Guinée</option>
                  <option value="Guinée-Bissau">Guinée-Bissau</option>
                  <option value="Guinée équatoriale">Guinée équatoriale</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libye">Libye</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Mali">Mali</option>
                  <option value="Maroc">Maroc</option>
                  <option value="Maurice">Maurice</option>
                  <option value="Mauritanie">Mauritanie</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Namibie">Namibie</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ouganda">Ouganda</option>
                  <option value="RDC">RDC</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="São Tomé-et-Príncipe">São Tomé-et-Príncipe</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Somalie">Somalie</option>
                  <option value="Soudan">Soudan</option>
                  <option value="Soudan du Sud">Soudan du Sud</option>
                  <option value="Tanzanie">Tanzanie</option>
                  <option value="Tchad">Tchad</option>
                  <option value="Togo">Togo</option>
                  <option value="Tunisie">Tunisie</option>
                  <option value="Zambie">Zambie</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {translate("Langue *", "Language *")}
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  required
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe</option>
                  <option value="pt">Portugais</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>
            </div>

            {/* Textarea Fields */}
            {currentFields
              .filter(field => field.type === 'textarea')
              .map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            
            {/* Common Description and About Fields */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {translate("Description *", "Description *")}
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-y min-h-[80px]"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {translate("À propos", "About")}
              </label>
              <textarea
                name="about"
                value={formData.about || ""}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-y min-h-[80px]"
                rows={3}
                placeholder="Description détaillée (optionnel)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {translate("Image", "Image")}
              </label>

              {/* Show current or selected image */}
              {(formData.image || selectedFile) && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedFile ? 'Nouvelle image sélectionnée:' : 'Image actuelle:'}
                  </p>
                  <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image}
                    alt={selectedFile ? 'Nouvelle image' : 'Image actuelle'}
                    className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop";
                    }}
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition"
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {selectedFile.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.image
                  ? "Sélectionnez une nouvelle image pour remplacer l'actuelle"
                  : "Sélectionnez une image (max 5MB) ou laissez vide pour l'image par défaut"}
              </p>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Upload en cours... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2 py-6 pr-32">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition disabled:opacity-50"
              >
                {translate("Annuler", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? uploadProgress > 0
                    ? `Upload ${uploadProgress}%`
                    : translate("Envoi...", "Sending...")
                  : translate("Soumettre", "Submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}