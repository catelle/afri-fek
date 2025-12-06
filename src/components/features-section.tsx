"use client"

import {
  Search,
  BookOpen,
  Users,
  ArrowRight,
  Database,
  Globe,
  Award,
  FileText,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Map3D } from './Map3D'
import { Image3D } from './image-3d'
import { AfricaMap } from './Map'

const mainFeatures = [
  {
    icon: Database,
    title: 'Index Bibliographique Complet',
    description: 'Base de données exhaustive des publications scientifiques africaines indexées et vérifiées.'
  },
  {
    icon: Search,
    title: 'Recherche Multicritères',
    description: 'Outils de recherche avancés par auteur, sujet, institution, pays et période.'
  },
  {
    icon: Award,
    title: 'Qualité Certifiée',
    description: 'Publications évaluées par des pairs et validées par nos experts scientifiques.'
  },
  {
    icon: Globe,
    title: 'Visibilité Internationale',
    description: 'Plateforme reconnue pour promouvoir la recherche africaine à l\'international.'
  }
]

const secondaryFeatures = [
  {
    icon: BarChart3,
    title: 'Analyses Bibliométriques',
    description: 'Statistiques détaillées sur les citations, impact et tendances de recherche.'
  },
  {
    icon: FileText,
    title: 'Accès Texte Intégral',
    description: 'Liens directs vers les articles en accès libre et ressources complètes.'
  },
  {
    icon: Users,
    title: 'Réseau de Chercheurs',
    description: 'Connectez-vous avec la communauté scientifique africaine et internationale.'
  },
  {
    icon: BookOpen,
    title: 'Journaux Accrédités',
    description: 'Accès aux revues CAMES et journaux indexés dans les bases internationales.'
  }
]

interface FeaturessectionProps {
  onNavigateToJournals?: () => void;
  onNavigateToResources?:()=>void;
}
export const FeaturesSection = ({ onNavigateToJournals, onNavigateToResources }: FeaturessectionProps) => {
  
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4 text-[#4d7c0f]">Fonctionnalités Avancées</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Tout ce dont vous avez besoin pour votre recherche scientifique
          </h2>
          <p className="text-lg text-muted-foreground">
            Notre plateforme offre des outils de recherche sophistiqués, une base de données complète et des services dédiés pour accélérer vos travaux de recherche et maximiser leur impact.
          </p>
        </div>

        {/* First Feature Section */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16 mb-24">
          {/* Left Map */}
          {/* <Map3D
            direction="left"
          /> */}
              <div className="p-6">
                        <div className="relative rounded-lg overflow-hidden" style={{ height: '400px' }}>
                          <AfricaMap  />
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            <span>Pays avec des organisations enregistrées ( pays)</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Pays représentés: {}
                          </div>
                        </div>
                      </div> 
          {/* Right Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                L’une des plus grandes bases de données scientifiques africaines
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Afri-Fek réunit des milliers de publications, journaux et institutions de recherche africaines dans une plateforme unifiée et accessible à tous les chercheurs.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {mainFeatures.map((feature, index) => (
                <li key={index} className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors">
                  <div className="mt-0.5 flex shrink-0 items-center justify-center">
                    <feature.icon className="size-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
              <Button size="lg" className="cursor-pointer bg-[#4d7c0f] hover:bg-[#3f6212]" onClick={onNavigateToResources}>
                <span className='flex items-center '>
                  Explorer les Ressources
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </span>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer"  onClick={onNavigateToJournals}>
                Découvrir les Journaux
              </Button>
            </div>
          </div>
        </div>

        {/* Second Feature Section - Flipped Layout */}
{/* Second Feature Section */}
<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">

  {/* Left Content */}
  <div className="space-y-6 order-1">
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        Conçue pour les besoins de la recherche moderne
      </h3>
      <p className="text-muted-foreground text-base text-pretty">
        Chaque fonctionnalité suit les standards internationaux de l'information scientifique avec des outils d'analyse avancés qui s'intègrent parfaitement dans vos flux de travail de recherche.
      </p>
    </div>

    <ul className="grid gap-4 sm:grid-cols-2">
      {secondaryFeatures.map((feature, index) => (
        <li 
          key={index} 
          className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors"
        >
          <div className="mt-0.5 flex shrink-0 items-center justify-center">
            <feature.icon className="size-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-foreground font-medium">{feature.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
          </div>
        </li>
      ))}
    </ul>

    <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
      <Button size="lg" className="cursor-pointer bg-[#4d7c0f] hover:bg-[#3f6212]">
        <span className="flex items-center ">
          Guide d'Utilisation
          <ArrowRight className="ms-2 size-4" aria-hidden="true" />
        </span>
      </Button>

      <Button size="lg" variant="outline" className="cursor-pointer">
        Nos Partenaires
      </Button>
    </div>
  </div>

  {/* Right Image */}
  <div className="order-2">
    <Image3D
      lightSrc="/hero3.jpeg"
      darkSrc="/hero3.jpeg"
      alt="Illustration scientifique"
    />
  </div>
  
</div>

      </div>
    </section>
  )
}
