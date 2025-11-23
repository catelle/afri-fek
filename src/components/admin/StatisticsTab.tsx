import { Resource } from '@/lib/types/resource';
import { FileText, TrendingUp, Activity, Globe } from 'lucide-react';

interface StatisticsTabProps {
  filteredResources: Resource[];
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Displays an overview of the resources statistics.
 * 
 * @param {StatisticsTabProps} props - The component props.
 * @param {Resource[]} props.filteredResources - The filtered resources.
/*******  bafafaf8-3cd0-43b8-ac0d-52e80157c1dc  *******/
export default function StatisticsTab({ filteredResources }: StatisticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ressources</p>
              <p className="text-2xl font-bold text-gray-900">{filteredResources.length}</p>
            </div>
            <FileText className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-green-600">{filteredResources.filter(r => r.status === 'approved').length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600">{filteredResources.filter(r => r.status === 'pending').length}</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pays</p>
              <p className="text-2xl font-bold text-blue-600">{Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean))).length}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
          <div className="space-y-3">
            {['approved', 'pending', 'rejected'].map(status => {
              const count = filteredResources.filter(r => r.status === status).length;
              const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
              const statusLabels = { approved: 'Approuvé', pending: 'En attente', rejected: 'Rejeté' };
              const colors = { approved: 'bg-green-500', pending: 'bg-yellow-500', rejected: 'bg-red-500' };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{statusLabels[status as keyof typeof statusLabels]}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${colors[status as keyof typeof colors]} h-2 rounded-full transition-all duration-300`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
          <div className="space-y-3">
            {['article', 'journal', 'academy', 'institution'].map(type => {
              const count = filteredResources.filter(r => r.type === type).length;
              const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
              const typeLabels = { article: 'Articles', journal: 'Journaux', academy: 'Académies', institution: 'Institutions' };
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Top Countries */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pays</h3>
        <div className="space-y-2">
          {Array.from(new Set(filteredResources.map(r => r.country).filter(Boolean)))
            .map(country => ({
              country,
              count: filteredResources.filter(r => r.country === country).length
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map(({ country, count }) => {
              const percentage = filteredResources.length > 0 ? (count / filteredResources.length) * 100 : 0;
              return (
                <div key={country} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">{country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
