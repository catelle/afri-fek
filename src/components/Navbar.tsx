'use client';

import { useState } from 'react';
import { Search, Plus, Menu, X, BookOpen, GraduationCap, Building2 } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSubmitClick: () => void;
}

export default function Navbar({ searchTerm, onSearchChange, onSubmitClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Journals', icon: BookOpen, href: '#journals' },
    { name: 'Academies', icon: GraduationCap, href: '#academies' },
    { name: 'Institutions', icon: Building2, href: '#institutions' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">
                Afri-Fek
              </h1>
            </div>
            <div className="hidden md:block ml-4">
              <span className="text-gray-600 text-sm font-medium">Health Research Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search journals, academies, institutions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="hidden md:block">
            <button
              onClick={onSubmitClick}
              className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Submit
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm rounded-b-lg">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => {
                  onSubmitClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium mt-4"
              >
                <Plus className="w-4 h-4" />
                Submit Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}