"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Database, Globe, BookOpen, Users } from 'lucide-react'
import { CardDecorator } from './card-decoretor'
import NewsletterModal from './NewsletterModal'
import PartnersModal from './PartnersModal'

const values = [
  {
    icon: Database,
    title: 'Base de Données Complète',
    description: 'Accès à des milliers de publications scientifiques africaines indexées et vérifiées par nos experts.'
  },
  {
    icon: Search,
    title: 'Recherche Avancée',
    description: 'Outils de recherche sophistiqués pour trouver rapidement les publications pertinentes dans votre domaine.'
  },
  {
    icon: Globe,
    title: 'Portée Internationale',
    description: 'Plateforme reconnue par les institutions africaines et internationales pour la diffusion de la recherche.'
  },
  {
    icon: BookOpen,
    title: 'Accès Libre',
    description: 'Promotion de l\'Open Access pour démocratiser l\'accès aux connaissances scientifiques africaines.'
  }
]

export function AboutSection() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [showPartners, setShowPartners] = useState(false)

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4 text-[#4d7c0f]">
            À Propos d'Afri-Fek
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            La Plateforme de Référence pour la Recherche Africaine
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Afri-Fek est la première base de données bibliographique dédiée à la recherche scientifique africaine.
            Notre mission est de valoriser et diffuser les travaux de recherche du continent africain à l'échelle mondiale,
            en facilitant l'accès aux publications, journaux et institutions de recherche.
          </p>
        </div>

        {/* Modern Values Grid with Enhanced Design */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
          {values.map((value, index) => (
            <Card key={index} className='group shadow-xs py-2'>
              <CardContent className='p-8'>
                <div className='flex flex-col items-center text-center'>
                  <CardDecorator>
                    <value.icon className='text-[#eab308] h-6 w-6' aria-hidden />
                  </CardDecorator>
                  <h3 className='mt-6 font-medium text-balance'>{value.title}</h3>
                  <p className='text-muted-foreground mt-3 text-sm'>{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-muted-foreground">🌍 Construite avec passion pour la communauté scientifique africaine</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="cursor-pointer bg-[#4d7c0f] hover:bg-[#3f6212]"
              onClick={() => setShowNewsletter(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Rejoindre la Communauté
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => setShowPartners(true)}
            >
              Découvrir nos Partenaires
            </Button>
          </div>
        </div>
      </div>
      
      <NewsletterModal 
        isOpen={showNewsletter} 
        onClose={() => setShowNewsletter(false)} 
      />
      <PartnersModal 
        isOpen={showPartners} 
        onClose={() => setShowPartners(false)} 
      />
    </section>
  )
}
