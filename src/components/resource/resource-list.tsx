"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, SortAsc, ExternalLink } from "lucide-react"
import { ResizedImage } from "../ResizeImage"
import { getDomainName } from "@/hooks/constants"
import PrintButton from "../PrintButton"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import React from "react"

interface Resource {
  resourceTitle: string;
  organisationName?: string;
  coverageStartYear?: number;
  issnPrint: any;
  issnOnline: any;
  id: string;
  name: string;
  type: string;
  description: string;
  link: string;
  country: string;
  image: string;
  isbn?: string;
  statut?: string;
  detailsStatut?: string;
  resourceUrl?: string;
  domainJournal?: string;
  Revues?: string;
  'NOM DE LA REVUE'?: string;
  isbn_issn?: string;
  'ISBN - ISSN'?: string;
  Status?: string;
  status?:string;
}


interface ResourceListProps {
  tab: string;
  searchTerm?: string;
  language: 'fr' | 'en';
  t: any;
}

export function ResourceList({
  tab,
  searchTerm = '',
  language,
  t
}: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(tab)
  const [sortBy, setSortBy] = useState('name')
  const [countryFilter, setCountryFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [countries, setCountries] = useState<string[]>([])
  const [domains, setDomains] = useState<string[]>([])

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  useEffect(() => {
    if (searchTerm) {
      setSearch(searchTerm)
    }
  }, [searchTerm])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        let q = query(collection(db, 'ResourceFromA'))

        const snapshot = await getDocs(q)
        const resourcesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Resource[]

        // Filter to only show approved or empty Status
        const approvedResources = resourcesData.filter(resource => 
          resource.status === 'approved' || !resource.status || resource.status === ''
        )

        console.log('Fetched resources:', approvedResources.length, approvedResources)
        setResources(approvedResources)

      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])
  // const countries = useMemo(() => {
  //   return [...new Set(resources.map(r => r.country).filter(Boolean))].sort()
  // }, [resources])

  const getDomainNames = () => [
    { key: 'domain1', label: 'Droit, économie, politique' },
    { key: 'domain2', label: 'Lettres et sciences humaines' },
    { key: 'domain3', label: 'Mathématiques' },
    { key: 'domain4', label: 'Sciences physiques' },
    { key: 'domain5', label: 'Sciences de la terre et de la vie' },
    { key: 'domain6', label: 'Sciences de l\'ingénieur' },
    { key: 'domain7', label: 'Sciences pharmaceutiques et médicales' }
  ]

  // const filteredResources = useMemo(() => {
  //   let filtered = resources.filter(resource => {
  //     const matchesTab = activeTab === 'all' || resource.type === activeTab
  //     const matchesSearch = !search || 
  //       resource.name?.toLowerCase().includes(search.toLowerCase()) ||
  //       resource.resourceTitle?.toLowerCase().includes(search.toLowerCase()) ||
  //       resource.description?.toLowerCase().includes(search.toLowerCase())
  //     const matchesCountry = countryFilter === 'all' || resource.country === countryFilter
  //     const matchesDomain = domainFilter === 'all' || getDomainName(resource.domainJournal || '') === domainFilter
  //     const matchesStatus = statusFilter === 'all' || 
  //       (statusFilter === 'active' && resource.statut === 'ACTIVE') ||
  //       (statusFilter === 'inactive' && resource.statut !== 'ACTIVE')

  //     return matchesTab && matchesSearch && matchesCountry && matchesDomain && matchesStatus
  //   })

   const filteredResources = React.useMemo(() => {
    const searchLower = search.toLowerCase()

    console.log('Filtering resources:', {
      totalResources: resources.length,
      activeTab,
      search,
      countryFilter,
      domainFilter,
      statusFilter
    })

    const filtered = resources
      .filter(resource => {
        // Filter by active tab
        const toLower = (v: any) =>
          typeof v === "string" ? v.toLowerCase() : "";

        if (activeTab !== "all" && toLower(resource.type) !== toLower(activeTab)) return false;
        if (countryFilter !== "all" && toLower(resource.country) !== toLower(countryFilter)) return false;
        if (domainFilter !== "all" && getDomainName(resource.domainJournal || '') !== domainFilter) return false;
        if (statusFilter !== "all" && toLower(resource.statut) !== toLower(statusFilter)) return false;

       const toStrLower = (v: any) =>
  typeof v === "string" ? v.toLowerCase() : "";

if (search) {
  const title = toStrLower(resource.resourceTitle || resource.name);
  const desc = toStrLower(resource.description);
  const org = toStrLower(resource.organisationName);

  return (
    title.includes(searchLower) ||
    desc.includes(searchLower) ||
    org.includes(searchLower)
  );
}


        return true
      })
      .sort((a, b) => {
        // Priority for specific ISSN combinations
        const aPriority = (
          (String(a.issnOnline || '').trim() === '2309-6535' && String(a.issnPrint || '').trim() === '1684-2782') ||
          (String(a.issnOnline || '').trim() === '3006-4090' && String(a.issnPrint || '').trim() === '3006-4104')
        )
        const bPriority = (
          (String(b.issnOnline || '').trim() === '2309-6535' && String(b.issnPrint || '').trim() === '1684-2782') ||
          (String(b.issnOnline || '').trim() === '3006-4090' && String(b.issnPrint || '').trim() === '3006-4104')
        )
        
        // Priority ALWAYS takes precedence
        if (aPriority && !bPriority) return -1
        if (!aPriority && bPriority) return 1
        
        // If there's a search term, prioritize relevance
        if (search) {
          const searchLower = search.toLowerCase()
          const getRelevanceScore = (resource: Resource) => {
            const title = (resource.resourceTitle || resource.name || '').toLowerCase()
            const desc = (resource.description || '').toLowerCase()
            const org = (resource.organisationName || '').toLowerCase()
            
            let score = 0
            if (title.includes(searchLower)) {
              score += title.startsWith(searchLower) ? 20 : title.indexOf(searchLower) === 0 ? 15 : 10
            }
            if (desc.includes(searchLower)) score += 5
            if (org.includes(searchLower)) score += 8
            
            return score
          }
          
          const scoreA = getRelevanceScore(a)
          const scoreB = getRelevanceScore(b)
          if (scoreA !== scoreB) return scoreB - scoreA
        }
        
        // Default sorting
        switch (sortBy) {
          case 'name':
            return String(a.resourceTitle ?? a.name ?? '')
              .localeCompare(String(b.resourceTitle ?? b.name ?? ''));

          case 'country':
            return String(a.country ?? '')
              .localeCompare(String(b.country ?? ''));

          case 'date':
            return (b.coverageStartYear ?? 0) - (a.coverageStartYear ?? 0);

          default:
            return 0;
        }
      })

    console.log('Filtered resources:', filtered.length)
    return filtered
  }, [resources, search, countryFilter, domainFilter, statusFilter, sortBy, activeTab])

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )


  const totalPages = Math.ceil(filteredResources.length / itemsPerPage)

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
console.log(paginatedResources)
  return (
    <div className="max-w-9xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-[#ecfccb] p-1 rounded-xl border border-amber-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Toutes</TabsTrigger>
              <TabsTrigger value="Journal" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Journaux</TabsTrigger>
              <TabsTrigger value="article" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Articles</TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Blogs</TabsTrigger>
              <TabsTrigger value="institution" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Institutions</TabsTrigger>
              <TabsTrigger value="university" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Universités</TabsTrigger>
              <TabsTrigger value="ouvrage" className="data-[state=active]:bg-[#fbbf24] data-[state=active]:text-white rounded-lg transition-all">Ouvrages</TabsTrigger>
              </TabsList>

            <div className="mt-6 space-y-6">
              {/* Enhanced Search Bar */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                      <input
                        type="search"
                        placeholder="🔍 Rechercher des ressources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[200px] pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none text-gray-800 placeholder-gray-500 shadow-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Enhanced Filters */}
                  <div className="flex flex-wrap gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48 bg-white border-2 border-amber-200 hover:border-amber-300 rounded-xl">
                        <SortAsc className="h-4 w-4 mr-2 text-amber-600" />
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Ordre alphabétique</SelectItem>
                        <SelectItem value="date">Date de publication</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={countryFilter} onValueChange={setCountryFilter}>
                      <SelectTrigger className="w-48 bg-white border-2 border-amber-200 hover:border-amber-300 rounded-xl">
                        <Filter className="h-4 w-4 mr-2 text-amber-600" />
                        <SelectValue placeholder="Filtrer par pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les Pays</SelectItem>
                        <SelectItem value="Afrique du Sud">Afrique du Sud</SelectItem>
                        <SelectItem value="Algérie">Algérie</SelectItem>
                        <SelectItem value="Angola">Angola</SelectItem>
                        <SelectItem value="Bénin">Bénin</SelectItem>
                        <SelectItem value="Botswana">Botswana</SelectItem>
                        <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                        <SelectItem value="Burundi">Burundi</SelectItem>
                        <SelectItem value="Cameroun">Cameroun</SelectItem>
                        <SelectItem value="Cap-Vert">Cap-Vert</SelectItem>
                        <SelectItem value="Centrafrique">Centrafrique</SelectItem>
                        <SelectItem value="Comores">Comores</SelectItem>
                        <SelectItem value="Congo">Congo</SelectItem>
                        <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                        <SelectItem value="Djibouti">Djibouti</SelectItem>
                        <SelectItem value="Égypte">Égypte</SelectItem>
                        <SelectItem value="Érythrée">Érythrée</SelectItem>
                        <SelectItem value="Éthiopie">Éthiopie</SelectItem>
                        <SelectItem value="Gabon">Gabon</SelectItem>
                        <SelectItem value="Gambie">Gambie</SelectItem>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Guinée">Guinée</SelectItem>
                        <SelectItem value="Guinée-Bissau">Guinée-Bissau</SelectItem>
                        <SelectItem value="Guinée équatoriale">Guinée équatoriale</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Lesotho">Lesotho</SelectItem>
                        <SelectItem value="Liberia">Liberia</SelectItem>
                        <SelectItem value="Libye">Libye</SelectItem>
                        <SelectItem value="Madagascar">Madagascar</SelectItem>
                        <SelectItem value="Malawi">Malawi</SelectItem>
                        <SelectItem value="Mali">Mali</SelectItem>
                        <SelectItem value="Maroc">Maroc</SelectItem>
                        <SelectItem value="Maurice">Maurice</SelectItem>
                        <SelectItem value="Mauritanie">Mauritanie</SelectItem>
                        <SelectItem value="Mozambique">Mozambique</SelectItem>
                        <SelectItem value="Namibie">Namibie</SelectItem>
                        <SelectItem value="Niger">Niger</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="Ouganda">Ouganda</SelectItem>
                        <SelectItem value="RDC">RDC</SelectItem>
                        <SelectItem value="Rwanda">Rwanda</SelectItem>
                        <SelectItem value="São Tomé-et-Príncipe">São Tomé-et-Príncipe</SelectItem>
                        <SelectItem value="Sénégal">Sénégal</SelectItem>
                        <SelectItem value="Seychelles">Seychelles</SelectItem>
                        <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
                        <SelectItem value="Somalie">Somalie</SelectItem>
                        <SelectItem value="Soudan">Soudan</SelectItem>
                        <SelectItem value="Soudan du Sud">Soudan du Sud</SelectItem>
                        <SelectItem value="Tanzanie">Tanzanie</SelectItem>
                        <SelectItem value="Tchad">Tchad</SelectItem>
                        <SelectItem value="Togo">Togo</SelectItem>
                        <SelectItem value="Tunisie">Tunisie</SelectItem>
                        <SelectItem value="Zambie">Zambie</SelectItem>
                        <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                      <SelectTrigger className="w-48 bg-white border-2 border-amber-200 hover:border-amber-300 rounded-xl">
                        <SelectValue placeholder="Domaine de recherche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les Domaines</SelectItem>
                        {getDomainNames().map((domain) => (
                          <SelectItem key={domain.key} value={domain.label}>{domain.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 bg-white border-2 border-amber-200 hover:border-amber-300 rounded-xl">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les Statuts</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="pause">En Pause</SelectItem>
                      </SelectContent>
                    </Select>
                    
                   
                  </div>
                </div>
              </div>

              {['all', 'Journal', 'article', 'blog', 'institution', 'university', 'ouvrage'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-6">
                  {/* Enhanced Results Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-[amber-50] border-amber-200 text-amber-800 px-3 py-1">
                          {filteredResources.length} ressources trouvées
                        </Badge>
                        {activeTab !== 'all' && (
                          <Badge className="bg-[#fbbf24] text-white px-3 py-1">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Page {currentPage} sur {totalPages}
                      </div>
                    </div>
                  </div>

                  <ul className="flex flex-col space-y-4">
                    
        {paginatedResources.map((item) => (
          <li
            key={item.id}
            tabIndex={0}
            className="flex flex-col sm:flex-row items-start bg-gray-100 gap-2 sm:gap-4 p-4 hover:bg-gray-150 cursor-pointer group transition" onClick={() => {
              window.location.href = `/resource/${item.id}`;
            }}
          >
          
            {/* Left: Image */}
            <div className="w-full sm:w-48 h-auto sm:h-32 flex-shrink-0 overflow-hidden rounded-md bg-white flex items-center justify-center">
              <ResizedImage
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-200"
              />
            </div>


            {/* Right: Details */}
            <div className="flex-1 min-w-0 flex flex-col gap-2 mt-2 sm:mt-0">
              {/* Title */}
              <h3 className="text-lg sm:text-[18px] font-semibold text-blue-900 underline group-hover:text-blue-800 break-words">
                {item.resourceTitle || item.name || item.Revues || item['NOM DE LA REVUE']}
              </h3>

              {/* ISSN + Status */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                {item.isbn && !item.issnOnline && (
                  <span>
                    <span className="text-gray-500 font-medium">ISSN:</span> {item.isbn}
                  </span>
                )}
                {item.issnOnline && (
                  <span>
                    <span className="text-gray-700 font-medium">ISSN en ligne:</span> {item.issnOnline}{item.issnPrint && (<span>- ISSN imprimé: {String(item.issnPrint)}</span>)}
                  </span>
                )}
                {item.isbn_issn && !item.issnOnline && (
                  <span>
                    <span className="text-gray-500 font-medium">ISSN:</span> {item.isbn_issn || item['ISBN - ISSN']}
                  </span>
                )}



                {item.statut && item.type !== "blog" && (
                  <span
                    className={`font-semibold ${item.statut === "ACTIVE"
                      ? "text-green-600 group-hover:text-green-800"
                      : "text-red-600 group-hover:text-red-800"
                      }`}
                  >
                    Statut: {item.statut.toLowerCase()}{" "}
                    {item.detailsStatut ? `(${item.detailsStatut})` : ""}
                  </span>
                )}
              </div>

              {/* Links side by side */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // stop parent click
                    e.preventDefault(); // ensure no weird link default
                    window.location.href = `/resource/${item.id}`;
                  }}
                  className="text-sm text-orange-600 hover:text-orange-800 underline"
                >
                  Voir details
                </button>

                <a
                  href={item.link ?? item.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // prevent triggering the button
                  className="text-sm text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Site Web
                </a>
              </div>


              {/* Domain journal below */}
              {item.domainJournal && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold text-gray-700">Domaine :</span>{" "}
                  {getDomainName(item.domainJournal)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <span className="flex items-center px-4">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  )}

                  {filteredResources.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Aucune {activeTab === 'all' ? 'ressource' : activeTab} trouvée</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total ressources</span>
                  <span className="text-lg font-bold text-amber-600">{resources.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Journaux</span>
                  <span className="text-sm font-medium text-gray-900">{resources.filter(r => r.type === 'Journal').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Articles</span>
                  <span className="text-sm font-medium text-gray-900">{resources.filter(r => r.type === 'article').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Institutions</span>
                  <span className="text-sm font-medium text-gray-900">{resources.filter(r => r.type === 'institution').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Countries */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pays populaires</h3>
              <div className="space-y-3">
                {countries.slice(0, 5).map((country) => {
                  const count = resources.filter(r => r.country === country).length;
                  return (
                    <div key={country} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setCountryFilter(country)}>
                      <span className="text-sm text-gray-700">{country}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setSearch('');
                    setCountryFilter('all');
                    setDomainFilter('all');
                    setStatusFilter('all');
                    setActiveTab('all');
                  }}
                  className="w-full px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition text-sm font-medium"
                >
                  Réinitialiser filtres
                </button>
                <PrintButton
                      resources={filteredResources}
                      language={language}
                      t={t}
                    />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}