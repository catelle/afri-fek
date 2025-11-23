// import { Metadata } from 'next';
// import { generatePageMetadata } from '@/lib/config/seo';
// import { useResources } from '@/lib/hooks/useResources';
// import SEOHead from '@/components/common/SEOHead';
// import Breadcrumbs, { generateBreadcrumbs } from '@/components/common/Breadcrumbs';
// import ResourceList from '@/components/ResourceList';

// export const metadata: Metadata = generatePageMetadata(
//   'Journaux Scientifiques Africains',
//   'Découvrez une collection complète de journaux scientifiques africains dans le domaine de la santé. Accédez aux dernières recherches et publications médicales du continent.',
//   '/resources/journals'
// );

// export default function JournalsPage() {
//   const { resources, loading, error, updateFilters } = useResources({ type: 'journal' });
//   const breadcrumbs = generateBreadcrumbs('/resources/journals');

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <SEOHead
//         title="Journaux Scientifiques Africains"
//         description="Découvrez une collection complète de journaux scientifiques africains dans le domaine de la santé."
//         canonical="https://afri-fek.org/resources/journals"
//         breadcrumbs={breadcrumbs}
//       />
      
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           {/* Breadcrumbs */}
//           <Breadcrumbs items={breadcrumbs} className="mb-6" />
          
//           {/* Page Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">
//               Journaux Scientifiques Africains
//             </h1>
//             <p className="text-lg text-gray-600 max-w-3xl">
//               Explorez notre collection de journaux scientifiques africains spécialisés 
//               dans la recherche en santé. Découvrez les dernières avancées médicales 
//               et les innovations du continent africain.
//             </p>
//           </div>

//           {/* Filters */}
//           <div className="mb-6">
//             <ResourceFilter 
//               onFilterChange={updateFilters}
//               resourceType="journal"
//             />
//           </div>

//           {/* Results */}
//           <div className="bg-white rounded-lg shadow-sm">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {loading ? 'Chargement...' : `${resources.length} journaux trouvés`}
//               </h2>
//             </div>
            
//             <ResourceList 
//               resources={resources}
//               loading={loading}
//               type="journal"
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }