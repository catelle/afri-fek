'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, Send, Trash2, Users, Calendar, Edit } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: any;
  status: string;
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'newsletter'));
      const subscribersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscriber[];
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Supprimer cet abonné ?')) return;
    
    try {
      await deleteDoc(doc(db, 'newsletter', id));
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const sendNewsletter = async () => {
    if (!emailContent.subject || !emailContent.message) {
      alert('Veuillez remplir le sujet et le message');
      return;
    }

    setSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // emailjs.init('YOUR_PUBLIC_KEY');

      for (const subscriber of subscribers.filter(s => s.status === 'active')) {
        try {
          await emailjs.send(
             'service_w56969n',
             'template_i454ioq', 
            {
              to_email: subscriber.email,
              to_name: subscriber.name,
              subject: emailContent.subject,
              message: emailContent.message,
              from_name: 'Afri-Fek',
              from_email: 'noreply@afri-fek.org'
            },
             'XyUzH97_CifkN4obA'
          );
          successCount++;
        } catch (error) {
          console.error(`Error sending to ${subscriber.email}:`, error);
          errorCount++;
        }
      }

      alert(`Newsletter envoyée! Succès: ${successCount}, Erreurs: ${errorCount}`);
      setEmailContent({ subject: '', message: '' });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Erreur lors de l\'envoi de la newsletter');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des abonnés...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Abonnés</p>
              <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Abonnés Actifs</p>
              <p className="text-2xl font-bold text-green-600">{subscribers.filter(s => s.status === 'active').length}</p>
            </div>
            <Mail className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cette Semaine</p>
              <p className="text-2xl font-bold text-amber-600">
                {subscribers.filter(s => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return s.subscribedAt?.toDate() > weekAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Composer une Newsletter
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sujet
            </label>
            <input
              type="text"
              value={emailContent.subject}
              onChange={(e) => setEmailContent(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Nouvelles publications scientifiques africaines - Janvier 2024"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={emailContent.message}
              onChange={(e) => setEmailContent(prev => ({ ...prev, message: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Cher(e) membre de la communauté Afri-Fek,&#10;&#10;Nous sommes ravis de partager avec vous les dernières publications scientifiques africaines...&#10;&#10;Cordialement,&#10;L'équipe Afri-Fek"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={sendNewsletter}
              disabled={sending || !emailContent.subject || !emailContent.message}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? 'Envoi...' : `Envoyer à ${subscribers.filter(s => s.status === 'active').length} abonnés`}
            </button>
            
            <button
              onClick={() => setEmailContent({ subject: '', message: '' })}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Abonnés</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subscriber.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscriber.subscribedAt?.toDate()?.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      subscriber.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteSubscriber(subscriber.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}