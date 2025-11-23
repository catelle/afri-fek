import { Resource } from '@/lib/types/resource';
import { Search, Edit, Trash2, Upload, FileText, TrendingUp, Users, Calendar } from 'lucide-react';

interface ResourcesTabProps {
  filteredResources: Resource[];
  currentPage: number;
  itemsPerPage: number;
  uploading: boolean;
  uploadProgress: number;
  showUpload: boolean;
  xlsxFile: File | null;
  filters: any;
  onSetCurrentPage: (page: number) => void;
  onSetFilters: (filters: any) => void;
  onSetShowUpload: (show: boolean) => void;
  onSetXlsxFile: (file: File | null) => void;
  onStartEdit: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onXlsxUpload: () => void;
  onShowPrintFilters: () => void;
}

export default function ResourcesTab({
  filteredResources,
  currentPage,
  itemsPerPage,
  uploading,
  uploadProgress,
  showUpload,
  xlsxFile,
  filters,
  onSetCurrentPage,
  onSetFilters,
  onSetShowUpload,
  onSetXlsxFile,
  onStartEdit,
  onDeleteResource,
  onUpdateStatus,
  onXlsxUpload,
  onShowPrintFilters,
}: ResourcesTabProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, description..."
                value={filters.search}
                onChange={(e) => onSetFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              />
            </div>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => onSetFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => onSetFilters({ ...filters, type: e.target.value })}
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
            onChange={(e) => onSetFilters({ ...filters, country: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />

          <select
            value={filters.domain}
            onChange={(e) => onSetFilters({ ...filters, domain: e.target.value })}
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

      {/* CSV Upload */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Import XLSX Journaux</h3>
          <button
            onClick={() => onSetShowUpload(!showUpload)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Upload className="w-4 h-4" />
            Importer XLSX
          </button>
        </div>
        
        {showUpload && (
          <div className="p-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.pdf"
                  onChange={(e) => onSetXlsxFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats supportés: XLSX, XLS, PDF. Le système détectera automatiquement les colonnes disponibles.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onXlsxUpload}
                  disabled={!xlsxFile || uploading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition"
                >
                  {uploading ? `Import... ${uploadProgress}%` : 'Importer'}
                </button>
                <button
                  onClick={() => onSetShowUpload(false)}
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
            onClick={onShowPrintFilters}
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
            <p className="text-2xl font-bold text-gray-700">{filteredResources.filter(r => {
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
                <tr key={resource.id} className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
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
                    <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                      resource.status === 'approved' ? 'bg-green-100 text-green-800' :
                      resource.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {resource.status === 'approved' ? 'Approuvé' :
                       resource.status === 'pending' ? 'Attente' : 'Rejeté'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onStartEdit(resource)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {resource.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onUpdateStatus(resource.id, 'approved')}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition"
                            title="Approuver"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => onUpdateStatus(resource.id, 'rejected')}
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
                onClick={() => onSetCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Précédent
              </button>
              <span className="px-3 py-1 bg-amber-600 text-white rounded-md">
                {currentPage}
              </span>
              <button
                onClick={() => onSetCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredResources.length / itemsPerPage)))}
                disabled={currentPage >= Math.ceil(filteredResources.length / itemsPerPage)}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
