'use client';

import { useState } from 'react';
import { MessageCircle, HelpCircle, Mail, Clock, Phone, ChevronDown, ChevronRight, Bot, FileText, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Comment soumettre une nouvelle ressource ?",
      answer: "Cliquez sur le bouton 'Soumettre une ressource' dans la navigation principale, sélectionnez le type de ressource, remplissez le formulaire avec les informations requises et soumettez. Votre ressource sera examinée par notre équipe dans les 5-7 jours ouvrables."
    },
    {
      question: "Combien de temps faut-il pour qu'une ressource soit validée ?",
      answer: "Le processus de validation prend généralement 5-7 jours ouvrables. Cela inclut la vérification technique (1-2 jours) et l'évaluation scientifique par notre comité d'experts (3-5 jours). Vous recevrez des notifications par email à chaque étape."
    },
    {
      question: "Quels types de ressources puis-je soumettre ?",
      answer: "Nous acceptons les journaux scientifiques, articles de recherche, institutions académiques, blogs scientifiques et ouvrages académiques. Toutes les ressources doivent être liées à la recherche africaine et respecter nos critères de qualité."
    },
    {
      question: "Comment utiliser les filtres de recherche ?",
      answer: "Utilisez la barre de recherche pour saisir vos mots-clés, puis affinez vos résultats avec les filtres disponibles : type de ressource, pays, domaine scientifique, langue et éditeur. Vous pouvez également trier les résultats par date, nom ou pays."
    },
    {
      question: "Qu'est-ce que le chat IA Gemini ?",
      answer: "Notre assistant IA Gemini est disponible 24h/24 pour répondre à vos questions sur l'utilisation d'Afri-Fek. Il peut vous aider à naviguer sur la plateforme, comprendre le processus de soumission, et trouver des ressources spécifiques."
    },
    {
      question: "Comment contacter le support technique ?",
      answer: "Vous pouvez nous contacter par email à support@afri-fek.org, utiliser le formulaire de contact sur notre site, ou discuter avec notre assistant IA Gemini. Notre équipe répond généralement dans les 2-4 heures pendant les heures ouvrables."
    },
    {
      question: "Quels sont les critères de qualité pour les ressources ?",
      answer: "Nous exigeons que les publications soient évaluées par des pairs, que les institutions soient accréditées par les autorités compétentes, et que toutes les ressources respectent les standards internationaux de publication. Notre comité scientifique valide chaque soumission."
    },
    {
      question: "Puis-je modifier une ressource après soumission ?",
      answer: "Une fois soumise, vous ne pouvez pas modifier directement une ressource. Cependant, vous pouvez contacter notre équipe de support avec les modifications nécessaires, et nous nous chargerons de la mise à jour si elle est justifiée."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Centre d'aide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Trouvez des réponses à vos questions ou contactez notre équipe de support
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Help Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Chat IA Gemini</h3>
              <p className="text-sm text-gray-600 mb-4">
                Assistance instantanée avec notre intelligence artificielle
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Démarrer le chat
              </button>
            </CardContent>
          </Card>

          <Link href="/guide">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Guide d'utilisation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Documentation complète sur l'utilisation d'Afri-Fek
                </p>
                <span className="text-green-600 text-sm font-medium">
                  Voir la documentation
                </span>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contacter le support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Envoyez-nous un message pour une aide personnalisée
              </p>
              <a 
                href="mailto:support@afri-fek.org"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block"
              >
                Envoyer un email
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@afri-fek.org</p>
                  <p className="text-sm text-gray-500">Réponse sous 2-4h</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Heures d'ouverture</h3>
                  <p className="text-gray-600">Lundi - Vendredi</p>
                  <p className="text-sm text-gray-500">8h00 - 18h00 (GMT+1)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Chat IA Gemini</h3>
                  <p className="text-gray-600">Assistant virtuel</p>
                  <p className="text-sm text-gray-500">Disponible 24h/24</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Questions fréquemment posées</h2>
            </div>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{item.question}</span>
                    {openFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-4 pb-4">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gemini Chat Information */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Assistant IA Gemini</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Que peut faire Gemini ?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span>Répondre aux questions sur l'utilisation d'Afri-Fek</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span>Vous guider dans le processus de soumission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span>Aider à trouver des ressources spécifiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span>Expliquer les critères de validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span>Fournir des informations sur les domaines scientifiques</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Comment utiliser Gemini ?</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 text-sm mb-3">
                    L'assistant Gemini est intégré directement dans l'interface d'Afri-Fek. 
                    Recherchez l'icône de chat dans le coin inférieur droit de votre écran.
                  </p>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p>💬 Cliquez sur l'icône pour ouvrir le chat</p>
                    <p>❓ Posez votre question en français ou en anglais</p>
                    <p>⚡ Recevez une réponse instantanée</p>
                    <p>🔄 Continuez la conversation si nécessaire</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}