"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Github, Linkedin, Globe } from 'lucide-react'
import { CardDecorator } from './card-decoretor'


const team = [
  {
    id: 1,
    name: 'Dr. Amina Kone',
    role: 'Directrice Générale',
    description: 'Docteure en Sciences de l\'Information. Ancienne chercheuse à l\'Université de Yaoundé et consultante UNESCO.',
     image: '/team3.jpg',
    fallback: 'AK',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 2,
    name: 'Prof. Kwame Asante',
    role: 'Directeur Scientifique',
    description: 'Professeur en Bibliométrie à l\'Université du Ghana. Expert en indexation scientifique africaine.',
    image: '/team2.jpg',
    fallback: 'KA',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 3,
    name: 'Dr. Fatima Benali',
    role: 'Responsable Contenu',
    description: 'Spécialiste en documentation scientifique. Ancienne bibliothécaire à l\'Université Mohammed V.',
    image: '/team1.jpg',
    fallback: 'FB',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
   },
    {
    id: 5,
    name: 'Aisha Okonkwo',
    role: 'Développeuse Backend',
    description: 'Experte en bases de données et systèmes distribués. Ancienne développeuse chez Andela Nigeria.',
    image: '/team4.jpg',
    fallback: 'AO',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  // { https://images.unsplash.com/photo-1494790108755-2616b612b786?q=60&w=150&auto=format&fit=crop
  // https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=60&w=150&auto=format&fit=crop
  // https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=150&auto=format&fit=crop

  //   id: 4,
  //   name: 'Jean-Baptiste Nkomo',
  //   role: 'Développeur Frontend',
  //   description: 'Ingénieur logiciel spécialisé en interfaces utilisateur. Diplômé de l\'École Polytechnique de Yaoundé.',
  //   image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=60&w=150&auto=format&fit=crop',
  //   fallback: 'JN',
  //   social: {
  //     linkedin: '#',
  //     github: '#',
  //     website: '#'
  //   }
  // },
  // {
  //   id: 5,
  //   name: 'Aisha Okonkwo',
  //   role: 'Développeuse Backend',
  //   description: 'Experte en bases de données et systèmes distribués. Ancienne développeuse chez Andela Nigeria.',
  //   image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=60&w=150&auto=format&fit=crop',
  //   fallback: 'AO',
  //   social: {
  //     linkedin: '#',
  //     github: '#',
  //     website: '#'
  //   }
  // },
  // {
  //   id: 6,
  //   name: 'Dr. Mamadou Diallo',
  //   role: 'Responsable Partenariats',
  //   description: 'Expert en coopération scientifique internationale. Ancien coordinateur CAMES pour l\'Afrique de l\'Ouest.',
  //   image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=60&w=150&auto=format&fit=crop',
  //   fallback: 'MD',
  //   social: {
  //     linkedin: '#',
  //     github: '#',
  //     website: '#'
  //   }
  // },
  // {
  //   id: 7,
  //   name: 'Sarah Mwangi',
  //   role: 'Analyste UX',
  //   description: 'Spécialiste en expérience utilisateur pour les plateformes académiques. Diplômée de l\'Université de Nairobi.',
  //   image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=60&w=150&auto=format&fit=crop',
  //   fallback: 'SM',
  //   social: {
  //     linkedin: '#',
  //     github: '#',
  //     website: '#'
  //   }
  // },
  // {
  //   id: 8,
  //   name: 'Dr. Youssef El Mansouri',
  //   role: 'Responsable Qualité',
  //   description: 'Docteur en Sciences de l\'Éducation. Expert en évaluation et validation de contenus scientifiques.',
  //   image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?q=60&w=150&auto=format&fit=crop',
  //   fallback: 'YM',
  //   social: {
  //     linkedin: '#',
  //     github: '#',
  //     website: '#'
  //   }
  // }
]

export function TeamSection() {
  return (
    <section id="team" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4 text-[#4d7c0f]">
            Notre Équipe
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Rencontrez notre équipe
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nous sommes une équipe passionnée d'experts, de chercheurs et d'innovateurs dédiés à la valorisation et à la diffusion de la recherche scientifique africaine à travers le monde.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <Card key={member.id} className="shadow-xs py-2">
              <CardContent className="p-4">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <CardDecorator>
                      <Avatar className="h-24 w-24 border shadow-lg">
                        <AvatarImage
                          src={member.image}
                          alt={member.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {member.fallback}
                        </AvatarFallback>
                      </Avatar>
                    </CardDecorator>
                  </div>

                  {/* Name and Role */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-3">
                    {member.role}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-[#fbbf24] hover:text-primary"
                      asChild
                    >
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-[#fbbf24] hover:text-primary"
                      asChild
                    >
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} GitHub`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-[#fbbf24] hover:text-primary"
                      asChild
                    >
                      <a
                        href={member.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} Website`}
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
