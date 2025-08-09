'use client';

import { ArrowRight, BookOpen, GraduationCap, Building2 } from 'lucide-react';

interface HeroSectionProps {
  totalItems: number;
}

export default function HeroSection({ totalItems }: HeroSectionProps) {
  const stats = [
    { icon: BookOpen, label: 'Health Journals', value: '150+', color: 'text-orange-600' },
    { icon: GraduationCap, label: 'Medical Academies', value: '75+', color: 'text-green-600' },
    { icon: Building2, label: 'Research Institutions', value: '200+', color: 'text-blue-600' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 py-20">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Africa's
            <span className="block gradient-text">Health Research</span>
            <span className="block text-gray-700">Excellence</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with leading health journals, medical academies, and research institutions 
            across the African continent. Advancing healthcare through knowledge and collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
              Explore Resources
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
              Submit Your Institution
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${
                  index === 0 ? 'from-orange-100 to-orange-200' :
                  index === 1 ? 'from-green-100 to-green-200' :
                  'from-blue-100 to-blue-200'
                } mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}