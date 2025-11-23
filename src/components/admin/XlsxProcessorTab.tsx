import { Upload } from 'lucide-react';

interface XlsxProcessorTabProps {
  xlsxFiles: { file1: File | null; file2: File | null };
  processingXlsx: boolean;
  processedData: any[];
  duplicatesRemoved: number;
  onSetXlsxFiles: (files: { file1: File | null; file2: File | null }) => void;
  onProcessXlsxFiles: () => void;
  onDownloadProcessed: () => void;
}

export default function XlsxProcessorTab({
  xlsxFiles,
  processingXlsx,
  processedData,
  duplicatesRemoved,
  onSetXlsxFiles,
  onProcessXlsxFiles,
  onDownloadProcessed,
}: XlsxProcessorTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Processeur de fichiers XLSX</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-dashed border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Fichier 1 (48,000 entrées)</h3>
            <p className="text-sm text-gray-600 mb-3">Headers: Sourcerecord ID, Source Title, ISSN, EISSN, etc.</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onSetXlsxFiles({ ...xlsxFiles, file1: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-orange-200 rounded-lg"
            />
            {xlsxFiles.file1 && (
              <p className="text-sm text-green-600 mt-2">✓ {xlsxFiles.file1.name}</p>
            )}
          </div>
          
          <div className="border-2 border-dashed border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Fichier 2 (551 entrées)</h3>
            <p className="text-sm text-gray-600 mb-3">Headers: CTS, Revues, isbn_issn, preuve_indexation, etc.</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onSetXlsxFiles({ ...xlsxFiles, file2: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-orange-200 rounded-lg"
            />
            {xlsxFiles.file2 && (
              <p className="text-sm text-green-600 mt-2">✓ {xlsxFiles.file2.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={onProcessXlsxFiles}
            disabled={!xlsxFiles.file1 || !xlsxFiles.file2 || processingXlsx}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {processingXlsx ? 'Traitement...' : 'Traiter les fichiers'}
          </button>
          
          {processedData.length > 0 && (
            <button
              onClick={onDownloadProcessed}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Télécharger ({processedData.length} entrées)
            </button>
          )}
        </div>
        
        {processingXlsx && (
          <div className="mb-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                <span className="text-sm font-medium text-orange-700">Traitement en cours...</span>
              </div>
              <p className="text-xs text-orange-600">Mapping des champs et suppression des doublons</p>
            </div>
          </div>
        )}
        
        {processedData.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Traitement terminé</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-600">Entrées totales:</span>
                <p className="font-bold text-green-800">{processedData.length}</p>
              </div>
              <div>
                <span className="text-green-600">Doublons supprimés:</span>
                <p className="font-bold text-green-800">{duplicatesRemoved}</p>
              </div>
              <div>
                <span className="text-green-600">Fichier 1:</span>
                <p className="font-bold text-green-800">{xlsxFiles.file1?.name}</p>
              </div>
              <div>
                <span className="text-green-600">Fichier 2:</span>
                <p className="font-bold text-green-800">{xlsxFiles.file2?.name}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Mapping des champs:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-600">Fichier 1 → Base de données:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>Source Title → name</li>
                <li>ISSN/EISSN → isbn</li>
                <li>Publisher → publisher</li>
                <li>Active or Inactive → status</li>
                <li>Source Type → type</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-600">Fichier 2 → Base de données:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>Revues → name</li>
                <li>isbn_issn → isbn</li>
                <li>statut_revue → status</li>
                <li>revue_specialite → description</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
