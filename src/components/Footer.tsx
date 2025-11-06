'use client';

import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  language: 'fr' | 'en';
  t: any;
}

export default function Footer({ language, t }: FooterProps) {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-afri-removebg-preview.png"
                alt="Logo Afri-fek"
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-amber-500">Afri-Fek</span>
            </div>
            <p className="text-gray-300 mb-4">
              {language === 'fr' 
                ? 'la plateforme de reference pour la recherche scientifique africaine. Découvrez les journaux, académies et institutions de recherche à travers l\'Afrique.'
                : 'Reference platform for African science research. Discover journals, academies and research institutions across Africa.'
              }
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>{language === 'fr' ? 'Couverture continentale' : 'Continental coverage'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-500">
              {language === 'fr' ? 'Liens rapides' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition">
                  {language === 'fr' ? 'Accueil' : 'Home'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition">
                  {language === 'fr' ? 'Articles' : 'Articles'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition">
                  {language === 'fr' ? 'Journaux' : 'Journals'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition">
                  {language === 'fr' ? 'Académies' : 'Academies'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-500">
              {language === 'fr' ? 'Contact' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="text-sm">contact@afri-fek.org</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-amber-500" />
                <span className="text-sm">+237 6 81 34 56 41</span>
              </li>
               
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="text-sm">
                  {language === 'fr' ? 'Yaounde, Cameroun' : 'Yaounde, Cameroon'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Afri-Fek. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition">
              {language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition">
              {language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Service'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}