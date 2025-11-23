import { Resource } from '@/lib/types/resource';
import { FileText, TrendingUp, Activity, Globe, Upload } from 'lucide-react';

interface DashboardTabProps {
  filteredResources: Resource[];
  resources: Resource[];
  heroImages: any[];
  uploadingHero: boolean;
  onHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteHeroImage: (index: number) => void;
}

export default function DashboardTab({
  filteredResources,
  resources,
  heroImages,
  uploadingHero,
  onHeroImageUpload,
  onDeleteHeroImage,
}: DashboardTabProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{filteredResources.length}</p>
              <p className="text-orange-600 text-xs mt-1">
                +{resources.filter(r => {
                  const today = new Date();
                  const resourceDate = new Date(r.date);
                  const diffTime = Math.abs(today.getTime() - resourceDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length} this week
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{filteredResources.filter(r => r.status === 'approved').length}</p>
              <p className="text-green-600 text-xs mt-1">{Math.round((filteredResources.filter(r => r.status === 'approved').length / filteredResources.length) * 100)}% of total</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-yellow-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{filteredResources.filter(r => r.status === 'pending').length}</p>
              <p className="text-yellow-600 text-xs mt-1">Need attention</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Countries</p>
              <p className="text-2xl font-bold text-gray-900">{Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean))).length}</p>
              <p className="text-blue-600 text-xs mt-1">Coverage</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Images Management */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">Gestion Images Hero</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {heroImages.map((image, index) => (
            <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <img 
                src={image.url} 
                alt={`Hero ${index + 1}`} 
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
                }}
              />
              <p className="text-sm text-gray-600">{image.name}</p>
              <button 
                onClick={() => onDeleteHeroImage(index)}
                className="mt-2 text-red-500 hover:text-red-700 text-sm transition"
              >
                Supprimer
              </button>
            </div>
          ))}
          
          {heroImages.length < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                {uploadingHero ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600">Ajouter une image</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onHeroImageUpload}
                className="mt-2 text-xs"
                disabled={uploadingHero}
              />
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          Les images défilent automatiquement toutes les 4 secondes dans la section hero. Maximum 5 images.
        </div>
      </div>
    </div>
  );
}
