'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building2, Check, X, Eye, Trash2, Plus, Users } from 'lucide-react';

interface PartnerRequest {
  id: string;
  organizationName: string;
  organizationType: string;
  country: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  partnershipType: string;
  resources: string;
  submittedAt: any;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovedPartner {
  id: string;
  organizationName: string;
  organizationType: string;
  country: string;
  website: string;
  description: string;
  partnershipType: string;
  approvedAt: any;
  logo?: string;
}

export default function PartnersManagement() {
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [approvedPartners, setApprovedPartners] = useState<ApprovedPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'approved'>('requests');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const requestsSnapshot = await getDocs(collection(db, 'partnerRequests'));
      const requestsData = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PartnerRequest[];
      setPartnerRequests(requestsData);

      const partnersSnapshot = await getDocs(collection(db, 'approvedPartners'));
      const partnersData = partnersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApprovedPartner[];
      setApprovedPartners(partnersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (request: PartnerRequest) => {
    try {
      await addDoc(collection(db, 'approvedPartners'), {
        organizationName: request.organizationName,
        organizationType: request.organizationType,
        country: request.country,
        website: request.website,
        description: request.description,
        partnershipType: request.partnershipType,
        approvedAt: new Date(),
        contactEmail: request.contactEmail,
        contactName: request.contactName
      });

      await updateDoc(doc(db, 'partnerRequests', request.id), {
        status: 'approved'
      });

      setPartnerRequests(prev => prev.map(r => 
        r.id === request.id ? { ...r, status: 'approved' } : r
      ));

      alert('Partenaire approuvé avec succès!');
      loadData();
    } catch (error) {
      console.error('Error approving partner:', error);
      alert('Erreur lors de l\'approbation');
    }
  };

  const rejectPartner = async (requestId: string) => {
    if (!confirm('Rejeter cette demande de partenariat ?')) return;

    try {
      await updateDoc(doc(db, 'partnerRequests', requestId), {
        status: 'rejected'
      });

      setPartnerRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' } : r
      ));

      alert('Demande rejetée');
    } catch (error) {
      console.error('Error rejecting partner:', error);
    }
  };

  const deletePartner = async (partnerId: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return;

    try {
      await deleteDoc(doc(db, 'approvedPartners', partnerId));
      setApprovedPartners(prev => prev.filter(p => p.id !== partnerId));
      alert('Partenaire supprimé');
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des partenaires...</p>
      </div>
    );
  }

  const pendingRequests = partnerRequests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Demandes en Attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partenaires Approuvés</p>
              <p className="text-2xl font-bold text-green-600">{approvedPartners.length}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Demandes</p>
              <p className="text-2xl font-bold text-blue-600">{partnerRequests.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux d'Approbation</p>
              <p className="text-2xl font-bold text-amber-600">
                {partnerRequests.length > 0 ? Math.round((approvedPartners.length / partnerRequests.length) * 100) : 0}%
              </p>
            </div>
            <Building2 className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Demandes ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Partenaires Approuvés ({approvedPartners.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'requests' ? (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune demande en attente</p>
              ) : (
                pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{request.organizationName}</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span> {request.organizationType}
                          </div>
                          <div>
                            <span className="font-medium">Pays:</span> {request.country}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span> {request.contactName}
                          </div>
                          <div>
                            <span className="font-medium">Partenariat:</span> {request.partnershipType}
                          </div>
                        </div>
                        <p className="mt-3 text-gray-700">{request.description}</p>
                        {request.website && (
                          <a 
                            href={request.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700 text-sm"
                          >
                            {request.website}
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => approvePartner(request)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => rejectPartner(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedPartners.map((partner) => (
                <div key={partner.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{partner.organizationName}</h3>
                    <button
                      onClick={() => deletePartner(partner.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-medium">Type:</span> {partner.organizationType}</div>
                    <div><span className="font-medium">Pays:</span> {partner.country}</div>
                    <div><span className="font-medium">Partenariat:</span> {partner.partnershipType}</div>
                  </div>
                  
                  <p className="mt-3 text-gray-700 text-sm">{partner.description}</p>
                  
                  {partner.website && (
                    <a 
                      href={partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-amber-600 hover:text-amber-700 text-sm"
                    >
                      Visiter le site
                    </a>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Approuvé le {partner.approvedAt?.toDate()?.toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Détails de la Demande</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedRequest.organizationName}</h3>
                  <p className="text-gray-600">{selectedRequest.organizationType} - {selectedRequest.country}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-gray-900">{selectedRequest.contactName}</p>
                    <p className="text-gray-600">{selectedRequest.contactEmail}</p>
                    {selectedRequest.contactPhone && (
                      <p className="text-gray-600">{selectedRequest.contactPhone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de Partenariat</label>
                    <p className="text-gray-900">{selectedRequest.partnershipType}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedRequest.description}</p>
                </div>
                
                {selectedRequest.resources && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ressources Proposées</label>
                    <p className="text-gray-900">{selectedRequest.resources}</p>
                  </div>
                )}
                
                {selectedRequest.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site Web</label>
                    <a 
                      href={selectedRequest.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700"
                    >
                      {selectedRequest.website}
                    </a>
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      approvePartner(selectedRequest);
                      setSelectedRequest(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => {
                      rejectPartner(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}