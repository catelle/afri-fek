"use client";

import { X, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export interface FormData {
  resourceTitle: string;
  resourceUrl: string;
  organisationName: string;
  chiefEditor?: string;
  email?: string;
  articleType: string;
  frequency: string;
  licenseType: string;
  language: string;
  issnOnline?: string;
  issnPrint?: string;
  contactNumber?: string;
  country: string;
  coverageStartYear?: string;
  coverageEndYear?: string;
  coverageStatus?: string;
  publisher?: string;
  domainJournal?: string;
  discipline?: string;
  type: string;
  description?: string;
  resourceStartYear?: string;
  about?: string;
  image?: string;
  status?: string;
}

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedFile: File | null;
  isSubmitting: boolean;
  submitMessage: string;
  uploadProgress: number;
  language: "fr" | "en";
  t: any;
}

const formLabels = {
  fr: {
    title: "Soumettre une ressource",
    resourceTitle: "Titre de la ressource *",
    resourceUrl: "URL de la ressource *",
    organisationName: "Nom de l'organisation *",
    chiefEditor: "Rédacteur en chef",
    email: "Email",
    issnOnline: "ISSN en ligne",
    issnPrint: "ISSN imprimé",
    contactNumber: "Numéro de contact",
    discipline: "Discipline",
    publisher: "Éditeur / Maison d'édition",
    articleType: "Type d'article *",
    frequency: "Fréquence *",
    licenseType: "Type de licence *",
    status: "Statut *",
    domainJournal: "Domaine du journal",
    country: "Pays",
    language: "Langue *",
    type: "Type *",
    description: "Description *",
    about: "À propos",
    image: "Image",
    cancel: "Annuler",
    submit: "Soumettre",
    coverageTitle: "Couverture temporelle",
    startYear: "Année de début",
    endYear: "Année d'arrêt",
    coverageStatus: "Statut",
    selectDomain: "Sélectionnez un domaine",
    selectCountry: "Sélectionnez un pays",
    ongoing: "En cours",
    stopped: "Arrêté",
    active: "Actif",
    inactive: "Inactif",
    pause: "En pause",
    openAccess: "Accès libre",
    subscription: "Abonnement",
    free: "Gratuit",
    paid: "Payant",
    yearly: "Annuelle",
    monthly: "Mensuelle",
    weekly: "Hebdomadaire",
    daily: "Quotidienne",
    quarterly: "Trimestrielle",
    biannual: "Semestrielle"
  },
  en: {
    title: "Submit a resource",
    resourceTitle: "Resource title *",
    resourceUrl: "Resource URL *",
    organisationName: "Organization name *",
    chiefEditor: "Chief editor",
    email: "Email",
    issnOnline: "Online ISSN",
    issnPrint: "Print ISSN",
    contactNumber: "Contact number",
    discipline: "Discipline",
    publisher: "Publisher",
    articleType: "Article type *",
    frequency: "Frequency *",
    licenseType: "License type *",
    status: "Status *",
    domainJournal: "Journal domain",
    country: "Country",
    language: "Language *",
    type: "Type *",
    description: "Description *",
    about: "About",
    image: "Image",
    cancel: "Cancel",
    submit: "Submit",
    coverageTitle: "Time coverage",
    startYear: "Start year",
    endYear: "End year",
    coverageStatus: "Status",
    selectDomain: "Select a domain",
    selectCountry: "Select a country",
    ongoing: "Ongoing",
    stopped: "Stopped",
    active: "Active",
    inactive: "Inactive",
    pause: "Paused",
    openAccess: "Open access",
    subscription: "Subscription",
    free: "Free",
    paid: "Paid",
    yearly: "Yearly",
    monthly: "Monthly",
    weekly: "Weekly",
    daily: "Daily",
    quarterly: "Quarterly",
    biannual: "Biannual"
  }
};

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
  
  const labels = formLabels[formLanguage];

  return (
     <div className="fixed bg-white  inset-0 z-50 bg-black/50 flex items-start justify-center">
      <div className="bg-white w-full h-full overflow-hidden">
        <header className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {labels.title}
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

            {/* Two Column Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  labelKey: "resourceTitle",
                  type: "text",
                  name: "resourceTitle",
                  required: true,
                },
                {
                  labelKey: "resourceUrl",
                  type: "url",
                  name: "resourceUrl",
                  required: true,
                },
                {
                  labelKey: "organisationName",
                  type: "text",
                  name: "organisationName",
                  required: true,
                },
                {
                  labelKey: "chiefEditor",
                  type: "text",
                  name: "chiefEditor",
                  required: false,
                },
                {
                  labelKey: "email",
                  type: "email",
                  name: "email",
                  required: false,
                },
                {
                  labelKey: "issnOnline",
                  type: "text",
                  name: "issnOnline",
                  required: false,
                },
                {
                  labelKey: "issnPrint",
                  type: "text",
                  name: "issnPrint",
                  required: false,
                },
                {
                  labelKey: "contactNumber",
                  type: "tel",
                  name: "contactNumber",
                  required: false,
                },
                {
                  labelKey: "discipline",
                  type: "text",
                  name: "discipline",
                  required: false,
                },
                {
                  labelKey: "publisher",
                  type: "text",
                  name: "publisher",
                  required: false,
                },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {labels[field.labelKey as keyof typeof labels]}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    value={formData[field.name as keyof FormData] || ""}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
              ))}

              {/* Article Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.articleType}
                </label>
                <select
                  name="articleType"
                  value={formData.articleType}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="pdf">PDF</option>
                  <option value="word">Word</option>
                  <option value="html">HTML</option>
                  <option value="epub">EPUB</option>
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.frequency}
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="yearly">{labels.yearly}</option>
                  <option value="monthly">{labels.monthly}</option>
                  <option value="weekly">{labels.weekly}</option>
                  <option value="daily">{labels.daily}</option>
                  <option value="quarterly">{labels.quarterly}</option>
                  <option value="biannual">{labels.biannual}</option>
                </select>
              </div>

              {/* License Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.licenseType}
                </label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="open-access">{labels.openAccess}</option>
                  <option value="subscription">{labels.subscription}</option>
                  <option value="free">{labels.free}</option>
                  <option value="paid">{labels.paid}</option>
                  <option value="cc-by">CC BY</option>
                  <option value="cc-by-sa">CC BY-SA</option>
                  <option value="cc-by-nc">CC BY-NC</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.status}
                </label>
                <select
                  name="status"
                  value={formData.status || "active"}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="active">{labels.active}</option>
                  <option value="inactive">{labels.inactive}</option>
                  <option value="pause">{labels.pause}</option>
                </select>
              </div>

              {/* Domain Journal */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.domainJournal}
                </label>
                <select
                  name="domainJournal"
                  value={formData.domainJournal || ""}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="">{labels.selectDomain}</option>
                  <option value="domain1">Commission scientifique specialisee de droit, science economique et science politique</option>
                  <option value="domain2">Commission scientifique specialisee des lettres et sciences humaines</option>
                  <option value="domain3">Commission scientifique specialisee des mathematique</option>
                  <option value="domain4">Commission scientifique specialisee des sciences physiques</option>
                  <option value="domain5">Commission scientifique specialisee des sciences de la terre et de la vie</option>
                  <option value="domain6">Commission scientifique specialisee des sciences de l'ingenieur</option>
                  <option value="domain7">Commission scientifique specialisee des sciences pharmaceutiques et medicales</option>
                </select>
              </div>
            </div>

            {/* Coverage Section */}
            <div className="p-6 rounded-lg border  border-gray-300">
              <h3 className="text-lg font-semibold text-gray-600 mb-4">
                {labels.coverageTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Coverage Start Year */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {labels.startYear}
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

                {/* Coverage Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {labels.coverageStatus}
                  </label>
                  <select
                    name="coverageStatus"
                    value={formData.coverageStatus || "ongoing"}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                  >
                    <option value="ongoing">{labels.ongoing}</option>
                    <option value="stopped">{labels.stopped}</option>
                  </select>
                </div>

                {/* Coverage End Year - Only show if status is stopped */}
                {formData.coverageStatus === "stopped" && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {labels.endYear}
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

            {/* Continue with other fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.country}
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="">{labels.selectCountry}</option>
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
                  <option value="São Tomé-et-Príncipe">
                    São Tomé-et-Príncipe
                  </option>
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

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.language}
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe</option>
                  <option value="pt">Portugais</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {labels.type}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                >
                  <option value="article">Article</option>
                  <option value="journal">Journal</option>
                  <option value="academy">Académie</option>
                  <option value="institution">Institution</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
            </div>

            {/* Full Width Textareas */}
       

               {[
              { labelKey: "description", name: "description", required: true },
              {
                labelKey: "about",
                name: "about",
                placeholder: "Description détaillée (optionnel)",
              },
            ].map((field, i) => (
               <div key={field.name}>
    <label>{labels[field.labelKey as keyof typeof labels]}</label>
    <textarea
      name={field.name}
      value={formData[field.name as keyof FormData]}
      onChange={onInputChange}
       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-y min-h-[80px]"
                  style={{ height: "auto" }}
      rows={3}
    />
  </div>
            ))}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {labels.image}
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
                {labels.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? uploadProgress > 0
                    ? `Upload ${uploadProgress}%`
                    : formLanguage === 'fr' ? "Envoi..." : "Sending..."
                  : labels.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    // </div>
  );
}