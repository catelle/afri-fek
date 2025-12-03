'use client';

import { useState } from 'react';
import { X, Building2, Users, FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface PartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const partners = [
  {
    name: 'MINESUP Cameroun',
    logo: '/logo-minesup.png',
    description: 'Ministère de l\'Enseignement Supérieur du Cameroun',
    role: 'Partenaire institutionnel pour l\'accréditation des universités'
  },
  {
    name: 'MINSANTE Cameroun', 
    logo: '/logo-minsante.png',
    description: 'Ministère de la Santé Publique du Cameroun',
    role: 'Partenaire pour la recherche en santé publique'
  },
  {
    name: 'CAMES',
    logo: '/logo-cames.png', 
    description: 'Conseil Africain et Malgache pour l\'Enseignement Supérieur',
    role: 'Partenaire pour l\'harmonisation de l\'enseignement supérieur'
  },
  {
    name: 'OMS/WHO',
    logo: '/logoOms.png',
    description: 'Organisation Mondiale de la Santé',
    role: 'Partenaire pour la recherche médicale africaine'
  }
];

export default function PartnersModal({ isOpen, onClose }: PartnersModalProps) {
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Nos Partenaires</h2>
              <p className="text-white/90">Institutions qui soutiennent la recherche africaine</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showPartnerForm ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {partners.map((partner, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                        <p className="text-sm text-gray-600">{partner.description}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{partner.role}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Devenir Partenaire</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Rejoignez notre réseau de partenaires institutionnels et contribuez au développement 
                  de la recherche scientifique africaine.
                </p>
                <button
                  onClick={() => setShowPartnerForm(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  Devenir Partenaire
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <PartnerForm onBack={() => setShowPartnerForm(false)} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

function PartnerForm({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    country: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    partnershipType: '',
    resources: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      await addDoc(collection(db, 'partnerRequests'), {
        ...formData,
        submittedAt: new Date(),
        status: 'pending'
      });
      
      alert('Demande de partenariat soumise avec succès!');
      onClose();
    } catch (error) {
      console.error('Error submitting partner request:', error);
      alert('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          ← Retour
        </button>
        <h3 className="text-xl font-semibold">Demande de Partenariat</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'organisation *
            </label>
            <input
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'organisation *
            </label>
            <select
              required
              value={formData.organizationType}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Sélectionner</option>
              <option value="university">Université</option>
              <option value="research_center">Centre de recherche</option>
              <option value="government">Institution gouvernementale</option>
              <option value="ngo">ONG</option>
              <option value="international">Organisation internationale</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du contact *
            </label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de contact *
            </label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description de l'organisation *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de partenariat souhaité *
          </label>
          <select
            required
            value={formData.partnershipType}
            onChange={(e) => setFormData(prev => ({ ...prev, partnershipType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Sélectionner</option>
            <option value="content_provider">Fournisseur de contenu</option>
            <option value="institutional">Partenaire institutionnel</option>
            <option value="technical">Partenaire technique</option>
            <option value="funding">Partenaire financier</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ressources que vous pouvez apporter
          </label>
          <textarea
            rows={3}
            value={formData.resources}
            onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="Publications, expertise, financement, infrastructure..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
}