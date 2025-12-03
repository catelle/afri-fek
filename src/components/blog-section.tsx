"use client"

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const blogs = [
    {
      id: 1,
      image: '/booster.jpg',
      category: 'Recherche',
      title: "Booster l'acces aux resources",
      description:"Booster l'accès aux travaux de recherche les plus pertinents pour les africains, plus particulièrement dans le domaine de la santé. Des milliers d'articles issus de journaux de recherche africains sont téléchargés chaque mois, amplifiant la portée de la recherche africaine et son impact sur le développement du continent."
    },
    {
      id: 2,
      image: '/repertorier.jpg',
      category: 'Repertoire',
      title: 'Repertorier les contributeurs',
      description:
        "Nous répertorions les revues, les institutions de formation, les établissements de soins et de recherche ainsi que les organisations dans le domaine de la science en Afrique et ailleurs, afin de faciliter l'accès aux savoirs, encourager les échanges scientifiques et valoriser les expertises locales sur la scène mondiale. Dans Afri-Fek, vous trouvez, outre les journaux indexés dans les grandes bases de données internationales comme Scopus, les revues accréditées par le Conseil Africain et Malgache pour l'Enseignement Supérieur (CAMES), notamment les revues institutionnelles (établissements de formation, instituts de recherche, sociétés savantes africaines reconnues). Afri-Fek est la base de données accréditée par le Conseil Scientifique du Comité Consultatif des Institutions Universitaires (CS-CCIU) du Ministère de l'Enseignement Supérieur de la République du Cameroun.",
    },
    {
      id: 3,
      image: '/soutenir.jpg',
      category: 'Design',
      title: 'Soutenir l\'Open Access gratuits',
      description:
        "Afri-Fek soutient les modèles de publication Open Access gratuits, et fournit l'accès à une gamme complète de ressources pour assister les chercheurs, auteurs et journaux des pays en développement. Afri-Fek invite les éditeurs de revues et les responsables d'institutions de formation et de recherche à se faire enregistrer."
    },
  ]

export function BlogSection() {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})
  
  const toggleExpanded = (id: number) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }
  
  return (
    <section id="blog" className="py-24 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4 text-amber-400">Le contenu</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Notre Vision
          </h2>
          <p className="text-lg text-muted-foreground">
            Restez informé des dernières tendances, des meilleures pratiques et des insights de notre équipe d’experts.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blogs.map(blog => (
            <Card key={blog.id} className="overflow-hidden py-0">
              <CardContent className="px-0">
                <div className="aspect-video">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={225}
                    className="size-full object-cover dark:invert dark:brightness-[0.95]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-muted-foreground text-xs tracking-widest uppercase">
                    {blog.category}
                  </p>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold hover:text-primary transition-colors">{blog.title}</h3>
                  </a>
                  <div className="text-muted-foreground">
                    <p className={`${!expandedCards[blog.id] ? 'line-clamp-5' : ''}`}>
                      {blog.description}
                    </p>
                    {blog.description.length > 200 && (
                      <button
                        onClick={() => toggleExpanded(blog.id)}
                        className="text-amber-600 hover:text-amber-700 hover:underline text-sm mt-2"
                      >
                        {expandedCards[blog.id] ? 'Lire moins' : 'Lire plus'}
                      </button>
                    )}
                  </div>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer"
                  >
                    Learn More
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
