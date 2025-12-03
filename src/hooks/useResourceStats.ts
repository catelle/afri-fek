'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ResourceStats {
  total: number
  journal: number
  article: number
  blog: number
  institution: number
  university: number
  academy: number
  ouvrage: number
}

export function useResourceStats() {
  const [stats, setStats] = useState<ResourceStats>({
    total: 0,
    journal: 0,
    article: 0,
    blog: 0,
    institution: 0,
    university: 0,
    academy: 0,
    ouvrage: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'ResourceFromA'))
        const resources = snapshot.docs.map(doc => doc.data())
        
        const counts = resources.reduce((acc, resource) => {
          const type = (resource.type || '').toLowerCase()
          acc.total++
          
          switch (type) {
            case 'journal':
              acc.journal++
              break
            case 'article':
              acc.article++
              break
            case 'blog':
              acc.blog++
              break
            case 'institution':
              acc.institution++
              break
            case 'university':
              acc.university++
              break
            case 'academy':
              acc.academy++
              break
            case 'ouvrage':
              acc.ouvrage++
              break
          }
          
          return acc
        }, {
          total: 0,
          journal: 0,
          article: 0,
          blog: 0,
          institution: 0,
          university: 0,
          academy: 0,
          ouvrage: 0
        })
        
        setStats(counts)
      } catch (error) {
        console.error('Error fetching resource stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}