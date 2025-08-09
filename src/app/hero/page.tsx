import { ExternalLink } from 'lucide-react';

const data = [
  {
    id: '1',
    name: 'Revue Médicale Africaine',
    description: 'Publication scientifique de référence en Afrique',
    link: 'https://example.com/revue',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
  }
];

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
          🌍 À la une ce mois-ci
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Découvrez une ressource inspirante sélectionnée pour son impact exceptionnel sur la santé en Afrique.
        </p>
        {data.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <img
              src={data[0].image}
              alt={data[0].name}
              className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-3">{data[0].name}</h3>
              <p className="text-gray-600 mb-6">{data[0].description}</p>
              <a
                href={data[0].link}
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
              >
                <ExternalLink className="w-5 h-5" /> En savoir plus
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}