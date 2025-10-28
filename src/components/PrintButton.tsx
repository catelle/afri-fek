'use client';

import { Printer, Settings, X } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';

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
  const uniqueCountries = [...new Set(resources.map(r => r.country))].sort();
  const uniqueTypes = [...new Set(resources.map(r => r.type))].sort();
  const uniqueDomains = [...new Set(resources.map(r => r.domainJournal).filter((d): d is string => typeof d === 'string'))].sort();
  
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
    return resources.filter(resource => {
      const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(resource.country);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(resource.type);
      const domainMatch = selectedDomains.length === 0 || (resource.domainJournal && selectedDomains.includes(resource.domainJournal));
      return countryMatch && typeMatch && domainMatch;
    });
  };

  const generatePDF = () => {
    const filteredResources = getFilteredResources();
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 30;
    const baseRowHeight = 12;
    const margin = 15;
    
    // Text wrapping function
    const wrapText = (text: string, maxWidth: number, fontSize: number = 8) => {
      pdf.setFontSize(fontSize);
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = pdf.getTextWidth(testLine);
        
        if (textWidth > maxWidth - 4) { // -4 for padding
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            lines.push(word);
          }
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    };
    
    // Professional black and white only
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.setFont('helvetica', 'normal');

    // Header on first page
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    const title = selectedLanguage === 'fr' ? 'Répertoire des Ressources Afri-Fek' : 'Afri-Fek Resources Directory';
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const dateText = selectedLanguage === 'fr' ? `Généré le ${new Date().toLocaleDateString('fr-FR')}` : `Generated on ${new Date().toLocaleDateString('en-US')}`;
    pdf.text(dateText, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Dynamic table setup based on selected fields
    const activeFields = availableFields.filter(f => selectedFields.includes(f.key));
    const totalWidth = activeFields.reduce((sum, f) => sum + f.width, 0);
    const availableWidth = pageWidth - 2 * margin;
    
    // Scale column widths to fit page
    const scaleFactor = availableWidth / totalWidth;
    const colWidths = activeFields.map(f => f.width * scaleFactor);
    const colPositions = [margin];
    
    // Calculate column positions
    for (let i = 1; i < colWidths.length; i++) {
      colPositions[i] = colPositions[i-1] + colWidths[i-1];
    }

    const drawTableHeaders = (y: number) => {
      // Table header background (light gray)
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, y - 2, pageWidth - 2 * margin, baseRowHeight, 'F');
      
      // Header borders
      pdf.setLineWidth(0.5);
      pdf.rect(margin, y - 2, pageWidth - 2 * margin, baseRowHeight);
      
      // Vertical lines for columns
      for (let i = 1; i < colPositions.length; i++) {
        pdf.line(colPositions[i], y - 2, colPositions[i], y + baseRowHeight - 2);
      }
      
      // Header text
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      
      activeFields.forEach((field, i) => {
        pdf.text(field.label, colPositions[i] + 2, y + 6);
      });
      
      return y + baseRowHeight;
    };

    // Draw initial table headers
    yPosition = drawTableHeaders(yPosition);

    // Table rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    
    filteredResources.forEach((resource, index) => {
      // Get field values dynamically
      const getFieldValue = (fieldKey: string) => {
        switch (fieldKey) {
          case 'name': return resource.name;
          case 'type': return resource.type;
          case 'description': return resource.description;
          case 'country': return resource.country;
          case 'year': return new Date(resource.date).getFullYear().toString();
          case 'isbn': return resource.isbn || '';
          case 'link': return resource.link ? (selectedLanguage === 'fr' ? 'Disponible en ligne' : 'Available online') : '';
          default: return '';
        }
      };
      
      // Prepare cell data with text wrapping
      const cellTexts = activeFields.map((field, i) => 
        wrapText(getFieldValue(field.key), colWidths[i])
      );
      
      // Calculate row height based on maximum lines in any cell
      const maxLines = Math.max(...cellTexts.map(lines => lines.length));
      const rowHeight = Math.max(baseRowHeight, maxLines * 10 + 4);
      
      // Check if we need a new page
      if (yPosition + rowHeight > pageHeight - 40) {
        pdf.addPage();
        yPosition = 30;
        yPosition = drawTableHeaders(yPosition);
      }

      // Row background (alternating)
      if (index % 2 === 1) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F');
      }
      
      // Row borders
      pdf.setLineWidth(0.3);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight);
      
      // Vertical lines for columns
      for (let i = 1; i < colPositions.length; i++) {
        pdf.line(colPositions[i], yPosition, colPositions[i], yPosition + rowHeight);
      }
      
      // Cell content with multi-line support
      pdf.setFontSize(8);
      cellTexts.forEach((lines, i) => {
        lines.forEach((line, lineIndex) => {
          pdf.text(line, colPositions[i] + 2, yPosition + 8 + (lineIndex * 10));
        });
      });
      
      yPosition += rowHeight;
    });

    // Add footer to all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer line
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      // Footer text
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const footerTitle = selectedLanguage === 'fr' ? 'Afri-Fek • Répertoire des Ressources de Santé Africaines' : 'Afri-Fek • African Health Resources Directory';
      pdf.text(footerTitle, margin, pageHeight - 12);
      const pageText = selectedLanguage === 'fr' ? `Page ${i} sur ${totalPages}` : `Page ${i} of ${totalPages}`;
      pdf.text(pageText, pageWidth - margin - 20, pageHeight - 12);
    }

    // Save PDF
    const filename = `afri-fek-resources-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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

            <div className="p-6 space-y-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Country Filter */}
                  {selectedFields.includes('country') && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        {selectedLanguage === 'fr' ? 'Pays' : 'Countries'}
                      </h4>
                      <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-2">
                        {uniqueCountries.map((country) => (
                          <label key={country} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country)}
                              onChange={() => toggleCountry(country)}
                              className="w-3 h-3 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-gray-700">{country}</span>
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
                      <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-2">
                        {uniqueTypes.map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={() => toggleType(type)}
                              className="w-3 h-3 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-gray-700">{type}</span>
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
                    <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-2">
                      {uniqueDomains.length > 0 ? (
                        uniqueDomains.map((domain) => (
                          <label key={domain} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={selectedDomains.includes(domain)}
                              onChange={() => toggleDomain(domain)}
                              className="w-3 h-3 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-gray-700">{domain}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          {selectedLanguage === 'fr' ? 'Aucun domaine disponible' : 'No domains available'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Filter Summary */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>
                      {selectedLanguage === 'fr' ? 'Ressources à exporter :' : 'Resources to export:'}
                    </strong> {getFilteredResources().length} {selectedLanguage === 'fr' ? 'sur' : 'of'} {resources.length}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowFieldSelector(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  {selectedLanguage === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    setShowFieldSelector(false);
                    generatePDF();
                  }}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                  disabled={getFilteredResources().length === 0}
                >
                  <Printer className="w-4 h-4" />
                  {selectedLanguage === 'fr' ? 'Générer PDF' : 'Generate PDF'} ({getFilteredResources().length} {selectedLanguage === 'fr' ? 'ressources' : 'resources'})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}