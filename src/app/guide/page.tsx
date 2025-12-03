'use client';

import { useState } from 'react';
import { Search, Upload, Clock, MessageCircle, Filter, BookOpen, CheckCircle, ArrowRight, HelpCircle, FileText, Users, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState('submit');

  const sections = [
    { id: 'submit', title: 'Soumettre une ressource', icon: Upload },
    { id: 'search', title: 'Rechercher des ressources', icon: Search },
    { id: 'filter', title: 'Filtrer les résultats', icon: Filter },
    { id: 'scope', title: 'Portée des ressources', icon: Globe },
    { id: 'validation', title: 'Processus de validation', icon: Clock },
    { id: 'support', title: 'Obtenir de l\'aide', icon: MessageCircle }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Guide d'utilisation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comment utiliser Afri-Fek
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Découvrez comment tirer le meilleur parti de notre plateforme de recherche scientifique africaine
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Sections du guide</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeSection === section.id
                              ? 'bg-amber-100 text-amber-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:w-3/4 space-y-12">
            <section id="submit" className="scroll-mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Upload className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Soumettre une ressource</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Contribuez à l'enrichissement de notre base de données en soumettant vos publications, journaux, ou institutions de recherche.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Types de ressources acceptées :</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Journaux scientifiques</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Articles de recherche</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Institutions académiques</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Blogs scientifiques</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Ouvrages académiques</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Étapes de soumission :</h3>
                        <ol className="space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">1</span>
                            <span className="text-sm">Cliquez sur "Soumettre une ressource"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">2</span>
                            <span className="text-sm">Sélectionnez le type de ressource</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">3</span>
                            <span className="text-sm">Remplissez les informations requises</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">4</span>
                            <span className="text-sm">Ajoutez une image de couverture (optionnel)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">5</span>
                            <span className="text-sm">Soumettez pour validation</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="validation" className="scroll-mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Processus de validation</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Délai total moyen : 5-7 jours ouvrables</h4>
                      <p className="text-blue-800 text-sm">
                        Vous recevrez une notification par email à chaque étape du processus.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="support" className="scroll-mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Obtenir de l'aide</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Link href="/support" className="block">
                        <div className="p-6 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all cursor-pointer">
                          <HelpCircle className="w-8 h-8 text-red-600 mb-3" />
                          <h3 className="font-semibold text-gray-900 mb-2">Centre d'aide</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Consultez notre FAQ et nos guides détaillés
                          </p>
                          <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                            Accéder au support <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                      
                      <div className="p-6 border border-gray-200 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Chat IA Gemini</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Obtenez une assistance instantanée avec notre assistant IA
                        </p>
                        <span className="text-blue-600 text-sm font-medium">
                          Disponible 24h/24
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}