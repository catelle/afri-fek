'use client';

import { Printer, Settings, X } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { getDomainName } from '@/hooks/constants';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  country: string;
  date: string;
  link: string;
  isbn?: string;
  domainJournal?: string;
}

interface PrintButtonProps {
  resources: Resource[];
  language: 'fr' | 'en';
  t: any;
}

export default function PrintButton({ resources, language, t }: PrintButtonProps) {
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en'>(language);
  
  // Available fields configuration with translations
  const getFieldLabels = (lang: 'fr' | 'en') => [
    { key: 'name', label: lang === 'fr' ? 'Nom' : 'Name', width: 40, filterable: false },
    { key: 'type', label: lang === 'fr' ? 'Type' : 'Type', width: 18, filterable: true },
    { key: 'description', label: lang === 'fr' ? 'Description' : 'Description', width: 45, filterable: false },
    { key: 'country', label: lang === 'fr' ? 'Pays' : 'Country', width: 20, filterable: true },
    { key: 'year', label: lang === 'fr' ? 'Année' : 'Year', width: 12, filterable: false },
    { key: 'isbn', label: 'ISBN/ISSN', width: 15, filterable: false },
    { key: 'link', label: lang === 'fr' ? 'Lien' : 'Link', width: 25, filterable: false }
  ];
  
  const availableFields = getFieldLabels(selectedLanguage);
  
  const [selectedFields, setSelectedFields] = useState(
    availableFields.filter(f => f.key !== 'link').map(f => f.key)
  );
  
  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  
  // Get unique values for filterable fields
  const uniqueCountries = [...new Set(resources.map(r => r.country).filter(Boolean))].sort();
  const uniqueTypes = [...new Set(resources.map(r => r.type).filter(Boolean))].sort();
  const uniqueDomains = [...new Set(
    resources
      .map(r => r.domainJournal)
      .filter(d => d && String(d).trim() !== '')
  )].sort();
  
  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(k => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };
  
  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };
  
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };
  
  // Filter resources based on selected filters
  const getFilteredResources = () => {
    console.log('Selected domains:', selectedDomains);
    console.log('Resources with domains:', resources.map(r => ({ name: r.name, domainJournal: r.domainJournal })));
    
    return resources.filter(resource => {
      const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(resource.country);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(resource.type);
      const domainMatch = selectedDomains.length === 0 || selectedDomains.includes(resource.domainJournal || '');
      
      console.log(`Resource ${resource.name}: domain=${resource.domainJournal}, domainMatch=${domainMatch}`);
      
      return countryMatch && typeMatch && domainMatch;
    });
  };

  const generatePDF = async () => {
    const filteredResources = getFilteredResources();
    let translatedResources = filteredResources;
    
    const translateText = async (text: string, targetLang: string): Promise<string> => {
      if (!text?.trim()) return text;
      const sourceLang = targetLang === 'en' ? 'fr' : 'en';
      try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.slice(0, 400))}`);
        const data = await response.json();
        return data[0]?.[0]?.[0] || text;
      } catch {
        return text;
      }
    };
    
    // Domain translation function
    const getDomainNameForPDF = (domain: string) => {
      const domains = selectedLanguage === 'en' ? {
        'domain1': 'Law, Economics, Politics',
        'domain2': 'Letters and Human Sciences', 
        'domain3': 'Mathematics',
        'domain4': 'Physical Sciences',
        'domain5': 'Earth and Life Sciences',
        'domain6': 'Engineering Sciences',
        'domain7': 'Pharmaceutical and Medical Sciences'
      } : {
        'domain1': 'Droit, économie, politique',
        'domain2': 'Lettres et sciences humaines', 
        'domain3': 'Mathématiques',
        'domain4': 'Sciences physiques',
        'domain5': 'Sciences de la terre et de la vie',
        'domain6': 'Sciences de l\'ingénieur',
        'domain7': 'Sciences pharmaceutiques et médicales'
      };
      return domains[domain as keyof typeof domains] || 'N/A';
    };
    
    try {
      translatedResources = await Promise.all(
        filteredResources.map(async (resource) => ({
          ...resource,
          description: await translateText(resource.description ?? '', selectedLanguage),
          country: await translateText(resource.country ?? '', selectedLanguage),
          type: await translateText(resource.type ?? '', selectedLanguage)
        }))
      );
    } catch (error) {
      console.error('Translation error:', error);
    }
    
   
    const printContent = `
      <html>
        <head>
          <title>Afri-Fek Resources List</title>
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
              width: 400px;
              height: 400px;
              background-image: url('/logo-afri-removebg-preview.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              opacity: 0.08;
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
          <div class="content">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <img src="/logo-afri-removebg-preview.png" width="40" height="40" style="margin-right: 10px;" alt="Afri-Fek Logo">
              <h1 style="margin: 0;">AFRI-FEK - Scientific Resources List</h1>
            </div>
            <div class="header-info">
              <p><strong>${selectedLanguage === 'en' ? 'Total' : 'Total'}:</strong> ${translatedResources.length} ${selectedLanguage === 'en' ? 'resources' : 'ressources'} | <strong>${selectedLanguage === 'en' ? 'Generated on' : 'Généré le'}:</strong> ${new Date().toLocaleDateString(selectedLanguage === 'en' ? 'en-US' : 'fr-FR')} | <strong>${selectedLanguage === 'en' ? 'Platform' : 'Plateforme'}:</strong> afri-fek.org</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  ${selectedFields.includes('name') ? `<th style="width: ${selectedFields.includes('description') ? '20%' : '30%'};">${selectedLanguage === 'en' ? 'Resource Name' : 'Nom de la Ressource'}</th>` : ''}
                  ${selectedFields.includes('description') ? `<th style="width: 25%;">${selectedLanguage === 'en' ? 'Description' : 'Description'}</th>` : ''}
                  ${selectedFields.includes('type') ? `<th style="width: 10%;">${selectedLanguage === 'en' ? 'Type' : 'Type'}</th>` : ''}
                  ${selectedFields.includes('country') ? `<th style="width: 12%;">${selectedLanguage === 'en' ? 'Country' : 'Pays'}</th>` : ''}
                  <th style="width: 15%;">${selectedLanguage === 'en' ? 'Domain' : 'Domaine'}</th>
                  <th style="width: 8%;">${selectedLanguage === 'en' ? 'Status' : 'Statut'}</th>
                  ${selectedFields.includes('link') ? `<th style="width: 15%;">${selectedLanguage === 'en' ? 'URL/Contact' : 'URL/Contact'}</th>` : ''}
                </tr>
              </thead>
              <tbody>
                ${translatedResources.map((resource, index) => `
                  <tr class="status-approved">
                    <td class="number">${index + 1}</td>
                    ${selectedFields.includes('name') ? `<td><strong>${resource.name || 'N/A'}</strong></td>` : ''}
                    ${selectedFields.includes('description') ? `<td style="font-size: 8px;">${(resource.description || '').substring(0, 100)}${(resource.description || '').length > 100 ? '...' : ''}</td>` : ''}
                    ${selectedFields.includes('type') ? `<td class="type">${resource.type || 'N/A'}</td>` : ''}
                    ${selectedFields.includes('country') ? `<td>${resource.country || 'N/A'}</td>` : ''}
                    <td style="font-size: 8px;">${getDomainNameForPDF(resource.domainJournal || '')}</td>
                    <td>${selectedLanguage === 'en' ? 'Active' : 'Actif'}</td>
                    ${selectedFields.includes('link') ? `<td style="font-size: 7px;">${resource.link || 'N/A'}</td>` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p><strong>${selectedLanguage === 'en' ? 'Official document generated by AFRI-FEK' : 'Document officiel généré par AFRI-FEK'}</strong> - ${selectedLanguage === 'en' ? 'Reference platform for African health research' : 'Plateforme de référence pour la recherche en santé africaine'}</p>
              <p>${selectedLanguage === 'en' ? 'For more information' : 'Pour plus d\'informations'}: www.afri-fek.org | ${selectedLanguage === 'en' ? 'This document is protected and authenticated' : 'Ce document est protégé et authentifié'}</p>
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
  };

  const directPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Afri-Fek Resources List</title>
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
            .number { font-weight: bold; color: #d97706; }
            .footer { margin-top: 15px; font-size: 8px; text-align: center; color: #666; }
            @media print { 
              body { margin: 0; }
              .content { background: white; }
            }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>AFRI-FEK - Scientific Resources List</h1>
            <div class="header-info">
              <p><strong>Total:</strong> ${resources.length} resources | <strong>Generated on:</strong> ${new Date().toLocaleDateString('en-US')} | <strong>Platform:</strong> afri-fek.org</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Resource Name</th>
                  <th>Type</th>
                  <th>Country</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                ${resources.map((resource, index) => `
                  <tr>
                    <td class="number">${index + 1}</td>
                    <td><strong>${resource.name || 'N/A'}</strong></td>
                    <td>${resource.type || 'N/A'}</td>
                    <td>${resource.country || 'N/A'}</td>
                    <td style="font-size: 7px;">${resource.link || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p><strong>Official document generated by AFRI-FEK</strong> - Reference platform for African health research</p>
              <p>For more information: www.afri-fek.org | This document is protected and authenticated</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowFieldSelector(true)}
        className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-sm hover:shadow-md"
        title="Print resources to PDF"
      >
        <Printer className="w-4 h-4" />
        Imprimer Liste
      </button>

      {/* Field Selector Modal */}
      {showFieldSelector && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedLanguage === 'fr' ? 'Personnaliser l\'export PDF' : 'Customize PDF Export'}
              </h2>
              <button
                onClick={() => setShowFieldSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Language Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {selectedLanguage === 'fr' ? 'Langue du PDF' : 'PDF Language'}
                </h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="fr"
                      checked={selectedLanguage === 'fr'}
                      onChange={(e) => setSelectedLanguage(e.target.value as 'fr' | 'en')}
                      className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    />
                    <span className="text-gray-700">Français</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={selectedLanguage === 'en'}
                      onChange={(e) => setSelectedLanguage(e.target.value as 'fr' | 'en')}
                      className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    />
                    <span className="text-gray-700">English</span>
                  </label>
                </div>
              </div>

              {/* Column Selection */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {selectedLanguage === 'fr' ? 'Sélectionner les colonnes' : 'Select Columns'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedLanguage === 'fr' ? 'Choisissez les champs à inclure dans le PDF :' : 'Choose which fields to include in the PDF:'}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {availableFields.map((field) => (
                    <label key={field.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field.key)}
                        onChange={() => toggleField(field.key)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-gray-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {selectedLanguage === 'fr' ? 'Filtrer les ressources' : 'Filter Resources'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedLanguage === 'fr' ? 'Filtrez les ressources à inclure (laissez vide pour tout inclure) :' : 'Filter which resources to include (leave empty to include all):'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Country Filter */}
                  {selectedFields.includes('country') && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        {selectedLanguage === 'fr' ? 'Pays' : 'Countries'}
                      </h4>
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                        {uniqueCountries.map((country) => (
                          <label key={country} className="flex items-center gap-3 cursor-pointer text-sm hover:bg-white rounded-lg p-2 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country)}
                              onChange={() => toggleCountry(country)}
                              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-gray-800 font-medium">{country}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Type Filter */}
                  {selectedFields.includes('type') && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        {selectedLanguage === 'fr' ? 'Types de ressources' : 'Resource Types'}
                      </h4>
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                        {uniqueTypes.map((type) => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer text-sm hover:bg-white rounded-lg p-2 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={() => toggleType(type)}
                              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-gray-800 font-medium">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Domain Filter */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      {selectedLanguage === 'fr' ? 'Domaines' : 'Domains'}
                    </h4>
                    <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                      {['domain1', 'domain2', 'domain3', 'domain4', 'domain5', 'domain6', 'domain7'].map((domain) => (
                        <label key={domain} className="flex items-center gap-3 cursor-pointer text-sm hover:bg-white rounded-lg p-2 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedDomains.includes(domain)}
                            onChange={() => toggleDomain(domain)}
                            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                          />
                          <span className="text-gray-800 font-medium">{getDomainName(domain)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Filter Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-amber-800">
                      {selectedLanguage === 'fr' ? 'Ressources à exporter' : 'Resources to export'}
                    </p>
                    <div className="bg-amber-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                      {getFilteredResources().length}
                    </div>
                  </div>
                  <p className="text-sm text-amber-700 mt-2">
                    {selectedLanguage === 'fr' ? 'sur un total de' : 'out of'} {resources.length} {selectedLanguage === 'fr' ? 'ressources disponibles' : 'available resources'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFieldSelector(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                >
                  {selectedLanguage === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    setShowFieldSelector(false);
                    generatePDF();
                  }}
                  className="flex-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl"
                  disabled={getFilteredResources().length === 0}
                >
                  <Printer className="w-5 h-5" />
                  {selectedLanguage === 'fr' ? 'Générer PDF' : 'Generate PDF'}
                  <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                    {getFilteredResources().length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}