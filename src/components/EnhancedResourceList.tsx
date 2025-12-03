'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Calendar, MapPin, BookOpen, ExternalLink, Star, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  country: string;
  image: string;
  link: string;
  date: string;
  domainJournal: string;
  status: string;
  publisher?: string;
  language?: string;
}

interface EnhancedResourceListProps {
  resources: Resource[];
  loading: boolean;
}

const features = [
  {
    icon: BookOpen,
    title: 'Index Bibliographique Complet',
    description: 'Base de données exhaustive des publications scientifiques africaines indexées et vérifiées.'
  },
  {
    icon: Search,
    title: 'Recherche Multicritères',
    description: 'Outils de recherche avancés par auteur, sujet, institution, pays et période.'
  },
  {
    icon: Star,
    title: 'Qualité Certifiée',
    description: 'Publications évaluées par des pairs et validées par nos experts scientifiques.'
  },
  {
    icon: ExternalLink,
    title: 'Visibilité Internationale',
    description: 'Plateforme reconnue pour promouvoir la recherche africaine à l\'international.'
  }
];

export default function EnhancedResourceList({ resources, loading }: EnhancedResourceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    country: '',
    domain: '',
    language: '',
    dateRange: '',
    publisher: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  useEffect(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.type || resource.type === filters.type;
      const matchesCountry = !filters.country || resource.country === filters.country;
      const matchesDomain = !filters.domain || resource.domainJournal === filters.domain;
      const matchesLanguage = !filters.language || resource.language === filters.language;
      const matchesPublisher = !filters.publisher || resource.publisher?.toLowerCase().includes(filters.publisher.toLowerCase());

      return matchesSearch && matchesType && matchesCountry && matchesDomain && matchesLanguage && matchesPublisher;
    });

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setFilteredResources(filtered);
  }, [resources, searchTerm, filters, sortBy]);

  const getDomainName = (domain: string) => {
    const domains = {
      'domain1': 'Droit, Économie, Politique',
      'domain2': 'Lettres et Sciences Humaines',
      'domain3': 'Mathématiques',
      'domain4': 'Sciences Physiques',
      'domain5': 'Sciences de la Terre et de la Vie',
      'domain6': 'Sciences de l\'Ingénieur',
      'domain7': 'Sciences Médicales'
    };
    return domains[domain as keyof typeof domains] || domain;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'journal': 'bg-blue-100 text-blue-800',
      'article': 'bg-green-100 text-green-800',
      'institution': 'bg-purple-100 text-purple-800',
      'blog': 'bg-orange-100 text-orange-800',
      'ouvrage': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Features Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-amber-100 p-3 rounded-full w-fit mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, sujet, institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Tous les types</option>
              <option value="journal">Journaux</option>
              <option value="article">Articles</option>
              <option value="institution">Institutions</option>
              <option value="blog">Blogs</option>
              <option value="ouvrage">Ouvrages</option>
            </select>

            <select
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Tous les pays</option>
              {Array.from(new Set(resources.map(r => r.country))).filter(Boolean).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filters.domain}
              onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Tous les domaines</option>
              <option value="domain1">Droit, Économie</option>
              <option value="domain2">Lettres, Sciences Humaines</option>
              <option value="domain3">Mathématiques</option>
              <option value="domain4">Sciences Physiques</option>
              <option value="domain5">Sciences de la Terre</option>
              <option value="domain6">Sciences de l'Ingénieur</option>
              <option value="domain7">Sciences Médicales</option>
            </select>

            <select
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Toutes les langues</option>
              <option value="Français">Français</option>
              <option value="English">English</option>
              <option value="العربية">العربية</option>
              <option value="Português">Português</option>
            </select>

            <input
              type="text"
              placeholder="Éditeur..."
              value={filters.publisher}
              onChange={(e) => setFilters(prev => ({ ...prev, publisher: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="date">Plus récent</option>
              <option value="name">Nom A-Z</option>
              <option value="country">Pays</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredResources.length} ressource(s) trouvée(s)
              </span>
              <button
                onClick={() => setFilters({ type: '', country: '', domain: '', language: '', dateRange: '', publisher: '' })}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement des ressources...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredResources.map((resource) => (
            <Card key={resource.id} className={`hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
              <CardContent className={`p-6 ${viewMode === 'list' ? 'flex items-center gap-6 w-full' : ''}`}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={resource.image || '/search.png'}
                        alt={resource.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/search.png';
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{resource.name}</h3>
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {resource.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(resource.date).getFullYear()}
                        </div>
                      </div>
                      {resource.domainJournal && (
                        <p className="text-xs text-amber-600 font-medium">
                          {getDomainName(resource.domainJournal)}
                        </p>
                      )}
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Accéder à la ressource
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={resource.image || '/search.png'}
                        alt={resource.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/search.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {resource.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(resource.date).getFullYear()}
                        </div>
                        {resource.domainJournal && (
                          <span className="text-amber-600 font-medium">
                            {getDomainName(resource.domainJournal)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Accéder
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ressource trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
}