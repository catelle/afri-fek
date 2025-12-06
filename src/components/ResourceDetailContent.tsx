"use client";

import { ExternalLink, BookOpen, Share2, Heart, Download, Eye, Calendar, MapPin, Tag, Star } from "lucide-react";
import { ResizedImage } from "./ResizeImage";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  about?: string;
  link: string;
  country: string;
  image: string;
  date: string;
  isbn?: string;
  statut?: string;
  detailsStatut?: string;
  resourceUrl?: string;
  coverageStartYear?: string;
  coverageEndYear?: string;
  coverageStatus?: string;
  publisher?: string;
  domainJournal?: string;
  issnOnline?: string;
  issnPrint?: string;
  Revues?:string;
  isbn_issn?:string;
   'NOM DE LA REVUE'?: string;
  'ISBN - ISSN'?:string;
}

interface ResourceDetailContentProps {
  resourceId: string;
  language?: "fr" | "en";
  t?: any;
  onBack?: () => void;
}

export default function ResourceDetailContent({
  resourceId,
  language,
  t,
  onBack,
}: ResourceDetailContentProps) {

  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchResource = async () => {
      try {
        console.log('Fetching resource with ID:', resourceId);
        
        // Try multiple collection names
        const collections = ['ResourceFromA', 'resources', 'Resources'];
        let resourceData = null;
        
        for (const collectionName of collections) {
          console.log(`Trying collection: ${collectionName}`);
          const docRef = doc(db, collectionName, resourceId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            resourceData = { id: docSnap.id, ...docSnap.data() } as Resource;
            console.log(`Found resource in ${collectionName}:`, resourceData);
            setResource(resourceData);
            
            // Fetch related resources from the same collection
            try {
              const relatedQuery = query(
                collection(db, collectionName),
                where('type', '==', resourceData.type),
                limit(4)
              );
              const relatedSnap = await getDocs(relatedQuery);
              const related = relatedSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Resource))
                .filter(r => r.id !== resourceId);
              setRelatedResources(related);
            } catch (relatedError) {
              console.log('Error fetching related resources:', relatedError);
            }
            break;
          }
        }
        
        if (!resourceData) {
          console.log('No document found with ID in any collection:', resourceId);
          
          // Fallback: Try to find by name if ID lookup failed
          console.log('Attempting fallback search by name...');
          for (const collectionName of collections) {
            try {
              const nameQuery = query(
                collection(db, collectionName),
                where('name', '==', resourceId)
              );
              const nameSnap = await getDocs(nameQuery);
              
              if (!nameSnap.empty) {
                resourceData = { id: nameSnap.docs[0].id, ...nameSnap.docs[0].data() } as Resource;
                console.log(`Found resource by name in ${collectionName}:`, resourceData);
                setResource(resourceData);
                
                // Fetch related resources
                try {
                  const relatedQuery = query(
                    collection(db, collectionName),
                    where('type', '==', resourceData.type),
                    limit(4)
                  );
                  const relatedSnap = await getDocs(relatedQuery);
                  const related = relatedSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Resource))
                    .filter(r => r.id !== nameSnap.docs[0].id);
                  setRelatedResources(related);
                } catch (relatedError) {
                  console.log('Error fetching related resources:', relatedError);
                }
                break;
              }
            } catch (nameError) {
              console.log(`Error searching by name in ${collectionName}:`, nameError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-[112px]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-[22px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ressource non trouvée</h1>
          <p className="text-gray-600 mb-4">La ressource avec l'ID "{resourceId}" n'existe pas ou a été supprimée.</p>
          <p className="text-sm text-gray-500 mb-4">Vérifiez la console pour plus de détails de débogage.</p>
          <button onClick={onBack} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-[22px]">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button onClick={onBack} className="hover:text-amber-600 transition">Accueil</button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{resource.name || resource['NOM DE LA REVUE']}</span>
      </nav>

      {/* Domain Articles Section */}
      {resource.domainJournal && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Articles du domaine: {resource.domainJournal}</h2>
              <p className="text-gray-600">Découvrez d'autres ressources dans le même domaine de recherche</p>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">24+</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Sciences Sociales', 'Économie', 'Politique', 'Anthropologie', 'Sociologie'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white border border-amber-300 rounded-full text-sm text-gray-700 hover:bg-amber-100 cursor-pointer transition">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Image */}
                <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <ResizedImage
                    src={resource.image || "/search.png"}
                    alt={resource.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Resource details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {resource.name || resource.Revues}
                  </h1>

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      resource.type === "article" ? "bg-blue-100 text-blue-700" :
                      resource.type === "journal" ? "bg-amber-100 text-amber-700" :
                      resource.type === "ouvrage" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      <Tag className="w-4 h-4 inline mr-1" />
                      {resource.type.toUpperCase()}
                    </span>

                    {resource.statut && (
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        resource.statut === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {resource.statut}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {resource.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {resource.country}
                      </div>
                    )}
                    {resource.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(resource.date).getFullYear()}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={resource.link || resource.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Accéder à la ressource
                    </a>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <Heart className="w-4 h-4" />
                      Sauvegarder
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations détaillées</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
                    Détails de publication
                  </h3>
                  {resource.country && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pays:</span>
                      <span className="text-sm font-medium text-gray-900">{resource.country}</span>
                    </div>
                  )}
                  {(resource.coverageStartYear || resource.date) && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Couverture:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {resource.coverageStartYear || new Date(resource.date).getFullYear()} - {resource.coverageEndYear || resource.coverageStatus || "En cours"}
                      </span>
                    </div>
                  )}
                  {resource.publisher && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Éditeur:</span>
                      <span className="text-sm font-medium text-gray-900">{resource.publisher}</span>
                    </div>
                  )}
                  {resource.domainJournal && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Domaine:</span>
                      <span className="text-sm font-medium text-gray-900">{resource.domainJournal}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
                    Identifiants
                  </h3>
                  {resource.issnPrint && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ISSN imprimé:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{resource.issnPrint}</span>
                    </div>
                  )}
                   {!resource.issnPrint && resource['NOM DE LA REVUE'] && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ISSN imprimé:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{resource['NOM DE LA REVUE']}</span>
                    </div>
                  )}
                  {resource.isbn_issn && !resource.issnPrint && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ISSN imprimé:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{resource.issnPrint}</span>
                    </div>
                  )}
                  {resource.issnOnline && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ISSN en ligne:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{resource.issnOnline}</span>
                    </div>
                  )}
                  {resource.isbn && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ISBN:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{resource.isbn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="text-gray-700 leading-relaxed">
                {resource.description ? (
                  <p>{resource.description}</p>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune description disponible pour cette ressource.</p>
                    <p className="text-sm text-gray-400 mt-2">Les informations détaillées peuvent être disponibles via le lien de la ressource.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          {resource.about && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations supplémentaires</h2>
                <p className="text-gray-700 leading-relaxed">{resource.about}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Resource Overview */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de la ressource</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">{resource.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">{resource.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">{resource.date ? new Date(resource.date).getFullYear() : 'Date non spécifiée'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button 
                  onClick={onBack}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Retour à la liste
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Download className="w-4 h-4" />
                  Télécharger les infos
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Eye className="w-4 h-4" />
                  Marquer comme lu
                </button>
              </div>
            </div>
          </div>

          {/* Resource Stats */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vues</span>
                  <span className="text-sm font-medium text-gray-900">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Téléchargements</span>
                  <span className="text-sm font-medium text-gray-900">567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Citations</span>
                  <span className="text-sm font-medium text-gray-900">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Note</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Resources */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ressources similaires</h3>
              <div className="space-y-3">
                {relatedResources.length > 0 ? (
                  relatedResources.slice(0, 3).map((related) => (
                    <div key={related.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded border">
                        <ResizedImage
                          src={related.image || "/search.png"}
                          alt={related.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{related.name}</h4>
                        <p className="text-xs text-gray-600 capitalize">{related.type}</p>
                        <p className="text-xs text-gray-500">{related.country}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune ressource similaire trouvée</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Popular Domains */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Domaines populaires</h3>
              <div className="space-y-2">
                {[
                  { name: 'Sciences Sociales', count: 156 },
                  { name: 'Économie', count: 89 },
                  { name: 'Médecine', count: 67 },
                  { name: 'Ingénierie', count: 45 },
                  { name: 'Éducation', count: 34 }
                ].map((domain) => (
                  <div key={domain.name} className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <span className="text-sm text-gray-700">{domain.name}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{domain.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}