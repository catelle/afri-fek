'use client'

import React, { useState, useEffect } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { t } from '@/lib/traduction'
import { useAITranslation } from '@/hooks/useAITranslation'
import { uploadImage } from '@/lib/supabase'
import { supabaseKeepAlive } from '@/lib/supabase-keepalive'

import NewNavbar from './NewNavbar'
import LandingPageBackup from './LandingPage_backup'
import { ResourceList } from './resource/resource-list'
import ResourceForm from './ResourceForm'
import GeminiChat from './GeminiChat'
import ContactForm from './ContactForm'
import UserCommentForm from './UserCommentForm'
import LanguageSelector from './LanguageSelector'
import StatisticsBar from './StatisticsBar'
import { LandingFooter } from './footer'

export default function MainApp() {
  const [activeView, setActiveView] = useState<'home' | 'resources'>('home')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubmit, setShowSubmit] = useState(false)
  const [approvedResources, setApprovedResources] = useState<any[]>([])
  const [showStatistics, setShowStatistics] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showUserComment, setShowUserComment] = useState(false)
  const [pendingResourceData, setPendingResourceData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string; } | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  const {
    userLanguage,
    setUserLanguage,
    translatePageContent,
    isTranslating,
  } = useAITranslation()

  const [formData, setFormData] = useState({
    resourceTitle: '',
    resourceUrl: '',
    organisationName: '',
    email: '',
    country: '',
    language: 'fr',
    discipline: '',
    description: '',
    about: '',
    image: '',
    type: 'journal',
    chiefEditor: '',
    issnOnline: '',
    issnPrint: '',
    publisher: '',
    frequency: 'monthly',
    licenseType: 'open-access',
    status: 'pending',
    statut: 'active',
    domainJournal: '',
    coverageStatus: 'ongoing',
    coverageStartYear: '',
    coverageEndYear: '',
    peerReviewType: '',
    indexingDatabases: '',
    impactFactor: '',
    verificationStatus: '',
    dataSource: '',
    submittedBy: '',
    approvedBy: '',
    articleType: 'pdf',
    doiPrefix: '',
    citationCount: '',
    references: '',
    contactNumber: '',
    keywords: '',
    subjects: '',
    address: '',
    abbreviation: '',
    contact: '',
    source: '',
    filiere: '',
  })

  const handleLanguageChange = async (newLang: string) => {
    setUserLanguage(newLang)
  }

  useEffect(() => {
    if (isTranslating) {
      setShowBanner(true)
      const timer = setTimeout(() => {
        setShowBanner(false)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isTranslating])

  useEffect(() => {
    supabaseKeepAlive.start()
    return () => {
      supabaseKeepAlive.stop()
    }
  }, [])

  useEffect(() => {
    const currentLang = document.body.getAttribute('data-translated-lang')
    if (userLanguage !== 'fr' && currentLang !== userLanguage) {
      setTimeout(() => {
        translatePageContent()
      }, 1000)
    }
    document.body.style.opacity = '1'
  }, [userLanguage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const titleField = ['institution', 'universite'].includes(formData.type) ? formData.organisationName : formData.resourceTitle

    if (!titleField || !formData.description || !formData.resourceUrl) {
      setSubmitMessage({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires.' })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)
    setUploadProgress(0)

    const timeoutId = setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage({ type: 'error', message: 'Timeout - Veuillez réessayer.' })
    }, 30000)

    try {
      let imageUrl = ''

      if (selectedFile) {
        try {
          setUploadProgress(25)
          imageUrl = await uploadImage(selectedFile)
          setUploadProgress(100)
        } catch (error) {
          console.error('Supabase upload error:', error)
          imageUrl = ''
          setSubmitMessage({
            type: 'error',
            message: "Upload de l'image échoué, ressource soumise sans image."
          })
        }
      }

      const resourceData = {
        name: formData.type === 'institution' ? formData.organisationName : formData.resourceTitle,
        type: formData.type,
        description: formData.description,
        about: formData.about || '',
        link: formData.resourceUrl,
        country: formData.country || '',
        language: formData.language,
        image: imageUrl,
        resourceLanguage: formData.language,
        organisationName: formData.organisationName || '',
        chiefEditor: formData.chiefEditor || '',
        email: formData.email || '',
        articleType: formData.articleType || '',
        frequency: formData.frequency || '',
        licenseType: formData.licenseType || '',
        issnOnline: formData.issnOnline || '',
        issnPrint: formData.issnPrint || '',
        contactNumber: formData.contactNumber || '',
        discipline: formData.discipline || '',
        publisher: formData.publisher || '',
        domainJournal: formData.domainJournal || '',
        coverageStartYear: formData.coverageStartYear || '',
        coverageEndYear: formData.coverageEndYear || '',
        coverageStatus: formData.coverageStatus || '',
        keywords: formData.keywords || '',
        subjects: formData.subjects || '',
        doiPrefix: formData.doiPrefix || '',
        citationCount: formData.citationCount || '',
        references: formData.references || '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        statut: formData.statut || 'active',
        createdAt: new Date(),
        submittedAt: new Date().toISOString(),
        contact: formData.contact || '',
        abbreviation: formData.abbreviation || '',
        address: formData.address || '',
        filiere: formData.filiere || '',
      }

      const docRef = await addDoc(collection(db, 'ResourceFromA'), resourceData)
      setPendingResourceData({ ...resourceData, id: docRef.id })

      clearTimeout(timeoutId)
      setSubmitMessage({ type: 'success', message: 'Ressource soumise avec succès!' })
      setShowUserComment(true)

      // Reset form
      setFormData({
        resourceTitle: '',
        resourceUrl: '',
        organisationName: '',
        email: '',
        country: '',
        language: 'fr',
        discipline: '',
        description: '',
        about: '',
        image: '',
        type: 'journal',
        source: '',
        chiefEditor: '',
        issnOnline: '',
        issnPrint: '',
        publisher: '',
        frequency: 'monthly',
        licenseType: 'open-access',
        status: 'pending',
        statut: 'active',
        domainJournal: '',
        coverageStatus: 'ongoing',
        coverageStartYear: '',
        coverageEndYear: '',
        peerReviewType: '',
        indexingDatabases: '',
        impactFactor: '',
        verificationStatus: '',
        dataSource: '',
        submittedBy: '',
        approvedBy: '',
        articleType: 'pdf',
        doiPrefix: '',
        citationCount: '',
        references: '',
        contactNumber: '',
        keywords: '',
        subjects: '',
        abbreviation: '',
        contact: '',
        address: '',
        filiere: '',
      })
      setSelectedFile(null)
      setUploadProgress(0)
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Erreur soumission:', error)
      setSubmitMessage({
        type: 'error',
        message: `Erreur: ${error instanceof Error ? error.message : 'Veuillez réessayer'}`
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Veuillez sélectionner un fichier JPEG, PNG ou JPG.')
        e.target.value = ''
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Fichier trop volumineux ! La taille maximale autorisée est de 2 Mo.')
        e.target.value = ''
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUserCommentSubmit = async (commentData: {
    name: string
    phone: string
    message: string
  }) => {
    try {
      const response = await fetch('/api/send-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...commentData,
          resourceData: pendingResourceData,
        }),
      })

      if (response.ok) {
        setShowUserComment(false)
        setShowSubmit(false)
        setSubmitMessage(null)
        setPendingResourceData(null)
        alert('Commentaire envoyé avec succès!')
      } else {
        throw new Error('Failed to send comment')
      }
    } catch (error) {
      console.error('Error sending comment:', error)
      alert("Erreur lors de l'envoi du commentaire")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <NewNavbar
        setActiveView={setActiveView}
        setResourceFilter={setResourceFilter}
        onContactClick={() => setShowContact(true)}
        language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
        setLanguage={(lang: 'fr' | 'en') => setUserLanguage(lang)}
        setShowSubmit={setShowSubmit}
      />

      {showBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="translation-spinner border-orange-500 border-t-orange-200"></div>
            <span className="text-sm font-medium">...</span>
          </div>
        </div>
      )}

      {showStatistics && (
        <StatisticsBar
          resources={approvedResources}
          language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
          t={t}
        />
      )}

      <div className="flex-1 ">
        {activeView === 'home' ? (
          <LandingPageBackup
            resources={approvedResources}
            language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
            t={t}
            onNavigateToJournals={() => {
              setResourceFilter('all')
              setActiveView('resources')
            }}
            onSearchSelect={(term: string) => {
              setSearchTerm(term)
              setResourceFilter('all')
              setActiveView('resources')
            }}
          />
        ) : (
           <main className="max-w-7xl mx-auto px-4 py-10 bg-white">
            <ResourceList
              tab={resourceFilter}
              searchTerm={searchTerm}
              language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
              t={t}
            />
           </main>
        )}
      </div>

      <ResourceForm
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        formData={formData}
        onInputChange={(e) => {
          const { name, value } = e.target
          setFormData((prev) => ({ ...prev, [name]: value }))
        }}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        selectedFile={selectedFile}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        uploadProgress={uploadProgress}
        language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
        t={t}
      />

      <GeminiChat />

      <ContactForm isOpen={showContact} onClose={() => setShowContact(false)} />

      <UserCommentForm
        isOpen={showUserComment}
        onClose={() => {
          setShowUserComment(false)
          setShowSubmit(false)
          setSubmitMessage(null)
          setPendingResourceData(null)
        }}
        onSubmit={handleUserCommentSubmit}
        isSubmitting={isSubmitting}
        resourceData={pendingResourceData}
      />

      <LanguageSelector onLanguageSelect={handleLanguageChange} />

      {/* <Footer
        language={(['fr', 'en'].includes(userLanguage) ? userLanguage : 'en') as 'fr' | 'en'}
        t={t}
      /> */}
      <LandingFooter/>
    </div>
  )
}