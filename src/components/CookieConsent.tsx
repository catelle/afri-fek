'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowConsent(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Cookie consent modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          We use cookies
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          By using this website, you agree to allow cookies to be stored on your device to enhance site navigation, analyse site usage, and assist Afri-Fek's awareness-raising efforts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Accept all
          </Button>
          <Button 
            onClick={handleReject}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reject all
          </Button>
        </div>
      </div>
    </div>
  )
}