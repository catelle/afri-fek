'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { Eye, Check, X, LogOut } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  about: string;
  link: string;
  country: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        fetchResources();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Erreur de connexion');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setResources([]);
  };

  const fetchResources = async () => {
    try {
      const q = query(collection(db, 'resources'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const resourcesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      
      const sortedResources = resourcesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.submittedAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.submittedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setResources(sortedResources);
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
    }
  };

  const handleApprove = async (resourceId: string) => {
    try {
      await updateDoc(doc(db, 'resources', resourceId), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
      // Remove from pending list
      setResources(resources.filter(r => r.id !== resourceId));
      alert('Ressource approuvée avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (resourceId: string) => {
    if (confirm('Voulez-vous vraiment rejeter cette ressource?')) {
      try {
        await deleteDoc(doc(db, 'resources', resourceId));
        setResources(resources.filter(r => r.id !== resourceId));
        alert('Ressource rejetée et supprimée.');
      } catch (error) {
        console.error('Erreur lors du rejet:', error);
        alert('Erreur lors du rejet');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin - Afri-fek</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-orange-500">Afri-fek</span> Admin
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Ressources en attente</h2>
          <p className="text-gray-600">{resources.length} ressource(s) à valider</p>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune ressource en attente</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{resource.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      resource.type === 'article' ? 'bg-red-100 text-red-800' :
                      resource.type === 'journal' ? 'bg-orange-100 text-orange-800' :
                      resource.type === 'academy' ? 'bg-green-100 text-green-800' :
                      resource.type === 'blog' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {resource.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedResource(resource);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(resource.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(resource.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{resource.country}</span>
                  <span>{resource.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {showModal && selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
            <header className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">{selectedResource.name}</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </header>
            <div className="p-6">
              {selectedResource.image && (
                <img
                  src={selectedResource.image}
                  alt={selectedResource.name}
                  className="w-full h-64 object-cover rounded mb-4"
                />
              )}
              <p className="text-gray-700 mb-4">{selectedResource.description}</p>
              {selectedResource.about && (
                <>
                  <h3 className="font-semibold mb-2">À propos</h3>
                  <p className="text-gray-600 mb-4">{selectedResource.about}</p>
                </>
              )}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Pays: {selectedResource.country}</span>
                <a
                  href={selectedResource.link}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Voir le lien
                </a>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleApprove(selectedResource.id);
                    setShowModal(false);
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Approuver
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedResource.id);
                    setShowModal(false);
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}