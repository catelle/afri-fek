"use client";

import { X } from "lucide-react";

interface FormData {
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center">
      <div className="bg-white w-full h-full overflow-hidden">
        <header className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {language === "fr"
              ? "Soumettre une ressource"
              : "Submit a resource"}
          </h2>
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
                  label: "Titre de la ressource *",
                  type: "text",
                  name: "resourceTitle",
                  required: true,
                },
                {
                  label: "URL de la ressource *",
                  type: "url",
                  name: "resourceUrl",
                  required: true,
                },
                {
                  label: "Nom de l'organisation *",
                  type: "text",
                  name: "organisationName",
                  required: true,
                },
                {
                  label: "Rédacteur en chef",
                  type: "text",
                  name: "chiefEditor",
                  required: false,
                },
                {
                  label: "Email",
                  type: "email",
                  name: "email",
                  required: false,
                },
                {
                  label: "ISSN en ligne",
                  type: "text",
                  name: "issnOnline",
                  required: false,
                },
                {
                  label: "ISSN imprimé",
                  type: "text",
                  name: "issnPrint",
                  required: false,
                },
                {
                  label: "Numéro de contact",
                  type: "tel",
                  name: "contactNumber",
                  required: false,
                },
                {
                  label: "Discipline",
                  type: "text",
                  name: "discipline",
                  required: false,
                },
                {
                  label: "Éditeur / Maison d'édition",
                  type: "text",
                  name: "publisher",
                  required: false,
                },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {field.label}
                  </label>
                  <input
                    {...field}
                    value={formData[field.name as keyof FormData] || ""}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                  />
                </div>
              ))}

              {/* Article Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Type d'article *
                </label>
                <select
                  name="articleType"
                  value={formData.articleType}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
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
                  Fréquence *
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                >
                  <option value="yearly">Annuelle</option>
                  <option value="monthly">Mensuelle</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="daily">Quotidienne</option>
                  <option value="quarterly">Trimestrielle</option>
                  <option value="biannual">Semestrielle</option>
                </select>
              </div>

              {/* License Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Type de licence *
                </label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                >
                  <option value="open-access">Accès libre</option>
                  <option value="subscription">Abonnement</option>
                  <option value="free">Gratuit</option>
                  <option value="paid">Payant</option>
                  <option value="cc-by">CC BY</option>
                  <option value="cc-by-sa">CC BY-SA</option>
                  <option value="cc-by-nc">CC BY-NC</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Statut *
                </label>
                <select
                  name="status"
                  value={formData.status || "active"}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pause">En pause</option>
                </select>
              </div>

              {/* Domain Journal */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Domaine du journal
                </label>
                <select
                  name="domainJournal"
                  value={formData.domainJournal || ""}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                >
                  <option value="">Sélectionnez un domaine</option>
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
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-600 mb-4">
                Couverture temporelle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Coverage Start Year */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Année de début
                  </label>
                  <input
                    type="number"
                    name="coverageStartYear"
                    value={formData.coverageStartYear || ""}
                    onChange={onInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white"
                    placeholder="Ex: 2010"
                  />
                </div>

                {/* Coverage Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Statut
                  </label>
                  <select
                    name="coverageStatus"
                    value={formData.coverageStatus || "ongoing"}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white"
                  >
                    <option value="ongoing">En cours</option>
                    <option value="stopped">Arrêté</option>
                  </select>
                </div>

                {/* Coverage End Year - Only show if status is stopped */}
                {formData.coverageStatus === "stopped" && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Année d'arrêt
                    </label>
                    <input
                      type="number"
                      name="coverageEndYear"
                      value={formData.coverageEndYear || ""}
                      onChange={onInputChange}
                      min={formData.coverageStartYear || "1900"}
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white"
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
                  Pays
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                >
                  <option value="">Sélectionnez un pays</option>
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
                  Langue *
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
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
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
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
              { label: "Description *", name: "description", required: true },
              {
                label: "À propos",
                name: "about",
                placeholder: "Description détaillée (optionnel)",
              },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {field.label}
                </label>
                <textarea
                  {...field}
                  rows={3}
                  value={formData[field.name as keyof FormData]}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition resize-y min-h-[80px]"
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
              </div>
            ))}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Image
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
                className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition"
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
                    className="bg-orange-500 h-2 transition-all duration-300"
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
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? uploadProgress > 0
                    ? `Upload ${uploadProgress}%`
                    : "Envoi..."
                  : "Soumettre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
