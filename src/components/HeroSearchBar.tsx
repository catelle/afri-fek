'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface SearchResult {
  id: string
  resourceTitle?: string
  name?: string
  description: string
  type: string
}

interface HeroSearchBarProps {
  onSearchSelect: (searchTerm: string) => void
}

export function HeroSearchBar({ onSearchSelect }: HeroSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allResources, setAllResources] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetch all resources for complete search coverage
        const q = query(collection(db, 'ResourceFromA'))
        const snapshot = await getDocs(q)
        const resources = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SearchResult[]
        setAllResources(resources)
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }
    fetchResources()
  }, [])

  useEffect(() => {
    if (searchTerm.length > 1) {
      const search = searchTerm.toLowerCase()
      const filtered = allResources
        .map(resource => {
          const title = String(resource.resourceTitle || resource.name || '').toLowerCase()
          const desc = String(resource.description || '').toLowerCase()
          
          let score = 0
          if (title.includes(search)) score += title.startsWith(search) ? 10 : 5
          if (desc.includes(search)) score += 2
          
          return { ...resource, score }
        })
        .filter(resource => resource.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
      
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm, allResources])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setSearchTerm(suggestion.resourceTitle || suggestion.name || '')
    setShowSuggestions(false)
    onSearchSelect(searchTerm)
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearchSelect(searchTerm)
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher des ressources, journaux, institutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-amber-200 rounded-full focus:border-amber-500 focus:outline-none shadow-lg"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('')
              setShowSuggestions(false)
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
            >
              <div className="font-medium text-gray-900">
                {suggestion.resourceTitle || suggestion.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {suggestion.description}
              </div>
              <div className="text-xs text-amber-600 mt-1">
                {suggestion.type}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}