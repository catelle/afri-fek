'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ClarificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clarification: string) => void;
  isSubmitting: boolean;
}

export default function ClarificationForm({ isOpen, onClose, onSubmit, isSubmitting }: ClarificationFormProps) {
  const [clarification, setClarification] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(clarification);
    setClarification('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Informations complémentaires</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Souhaitez-vous ajouter des informations complémentaires pour l'administrateur ?
            </label>
            <textarea
              value={clarification}
              onChange={(e) => setClarification(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Informations supplémentaires, contexte, ou clarifications..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onSubmit('');
                setClarification('');
              }}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Passer
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}