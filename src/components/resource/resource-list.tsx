'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, Search, Filter, SortAsc, ArrowRight } from 'lucide-react'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ResizedImage } from '../ResizeImage'
import { getDomainName } from '@/hooks/constants'
import { getDomainNames } from '@/hooks/constants'
import PrintButton from '../PrintButton'


// interface Resource {
//   id: string
//   resourceTitle: string
//   type: string
//   description: string
//   resourceUrl: string
//   country: string
//   image?: string
//   issnOnline?: string
//   issnPrint?: string
//   publisher?: string
//   statut?: string
//   domainJournal?: string
//   organisationName?: string
//   language?: string
//   coverageStartYear?: number
// }
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

        console.log('Fetched resources:', resourcesData.length, resourcesData)
        setResources(resourcesData)

      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

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
        if (domainFilter !== "all" && toLower(resource.domainJournal) !== toLower(domainFilter)) return false;
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

  console.log(resources, filteredResources, paginatedResources)

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

  return (
    <div className="space-y-6">
 
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Toutes les ressources</TabsTrigger>
          <TabsTrigger value="Journal">Journaux</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="blog">Blogs</TabsTrigger>
          <TabsTrigger value="institution">Institutions</TabsTrigger>
          <TabsTrigger value="university">Universités</TabsTrigger>
        </TabsList>
      <div className="mt-6 space-y-4">
        
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
           {/* Scopus Database Banner */}
         
          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="search"
                aria-label={t[language].search}
                placeholder={`🔍 ${t[language].search}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 border border-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Trier par Nom</SelectItem>
                <SelectItem value="country">Trier par Pays</SelectItem>
                <SelectItem value="date">Trier par Date</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Pays</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Domaines</SelectItem>
                {getDomainNames().map((domain) => (
                  <SelectItem key={domain.key} value={domain.label}>{domain.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pause">En Pause</SelectItem>
              </SelectContent>
            </Select>
            <PrintButton
              language={language}
              t={t}
            />
          </div>
          
          {/* Scopus Database Banner - Fixed Position
          <div className="fixed top-4 left-4 z-40">
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.open('https://www.scopus.com', '_blank')}>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-xs">Browse Scopus</div>
                  <div className="text-xs opacity-90">Global Research</div>
                </div>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>*/}
        </div>
      </div> 

       {['all', 'Journal', 'article', 'blog', 'institution', 'university'].map((tabValue) => (
        <TabsContent key={tabValue} value={tabValue} className="mt-6"> 
      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {filteredResources.length} ressources trouvées
          </Badge>
          {activeTab !== 'all' && (
            <Badge>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      <ul className="flex flex-col space-y-4">
        {paginatedResources.map((item) => (
          <li
            key={item.id}
            tabIndex={0}
            className="flex flex-col sm:flex-row items-start bg-gray-100 gap-2 sm:gap-4 p-4 hover:bg-gray-150 cursor-pointer group transition" onClick={() => {
              window.location.href = `/resources/${item.id}`;
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
                {item.resourceTitle || item.name}
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
        <div className="flex justify-center gap-2">
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

      {filteredResources.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aucune {activeTab === 'all' ? 'ressource' : activeTab} trouvée</p>
          </CardContent>
        </Card>
      )}

        </TabsContent>
       ))}
       </Tabs>
    </div>
  )
}