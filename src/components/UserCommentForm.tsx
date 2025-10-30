'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface UserCommentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; message: string }) => void;
  isSubmitting: boolean;
  resourceData?: any;
}

export default function UserCommentForm({ isOpen, onClose, onSubmit, isSubmitting, resourceData }: UserCommentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      // Send email via EmailJS from browser
      await emailjs.send(
        'service_w56969n',
        'template_i454ioq', 
        {
          from_name: formData.name,
          phone: formData.phone,
          message: formData.message,
          to_email: 'contactafrifek@gmail.com',
          resource_name: resourceData?.name || 'N/A',
          organization: resourceData?.organisationName || 'N/A',
          admin_url: `${window.location.origin}/admin#resource-${resourceData?.id}`,
          country: resourceData?.country || 'N/A'
        },
        'XyUzH97_CifkN4obA'
      );
      
      console.log('Email sent successfully via EmailJS');
    } catch (error) {
      console.error('EmailJS error:', error);
    }
    
    // Always call the original submit (for logging)
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Informations complémentaires
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Merci pour votre soumission ! Veuillez fournir vos coordonnées pour que nous puissions vous contacter si nécessaire.
          </p>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Numéro de téléphone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Message ou commentaire *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-y"
              placeholder="Ajoutez des informations supplémentaires sur votre ressource..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}