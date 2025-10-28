'use client';

import { ExternalLink } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  about?: string;
  link: string;
  country: string;
  image: string;
  date: string;
  isbn?: string;
  statut?: string;
  detailsStatut?: string;
  resourceUrl?: string;


}

interface ResourceDetailContentProps {
  resource: Resource;
  language: 'fr' | 'en';
  t: any;
  onBack: () => void;
}

export default function ResourceDetailContent({ resource, language, t, onBack }: ResourceDetailContentProps) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 mt-[112px]">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Right: Image + Meta info */}
          <div className="w-full">
            <div className="w-[250px] h-64 md:h-[250px] overflow-hidden rounded-lg shadow-sm">
              <img
                src={resource.image}
                alt={resource.name}
                className="w-[250px] h-[250px] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/search.png";
                }}
              />
            </div>

            {/* Meta info */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm mt-6 mb-6">
              {resource.country && (
                <div>
                  <span className="font-bold text-gray-700">{t[language].filters.country}:</span>
                  <span className="ml-2 text-gray-700">{resource.country}</span>
                </div>
              )}
              {resource.date && (
                <div>
                  <span className="font-bold text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(resource.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
              {resource.isbn && (
                <div>
                  <span className="font-bold text-gray-700">ISSN:</span>
                  <span className="ml-2 text-gray-800">{resource.isbn}</span>
                </div>
              )}
              {resource.statut && (
                <div>
                  <span className="font-bold text-gray-700">Statut:</span>
                  <span
                    className={`ml-2 font-semibold ${
                      resource.statut === "ACTIVE" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {resource.statut.toLowerCase()}
                  </span>
                  {resource.detailsStatut && (
                    <span className="ml-2 text-gray-600">({resource.detailsStatut})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Left: Textual content */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{resource.name}</h1>

            <span
              className={`inline-block mb-6 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                resource.type === "article"
                  ? "bg-blue-100 text-blue-800"
                  : resource.type === "journal"
                  ? "bg-orange-100 text-orange-800"
                  : resource.type === "academy"
                  ? "bg-green-100 text-green-800"
                  : resource.type === "institution"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {resource.type}
            </span>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {resource.description || "Aucune description fournie."}
            </p>

            {resource.about && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {t[language].hero.about}
                </h2>
                <p className="text-gray-700 leading-relaxed">{resource.about}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={resource.link ?? resource.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
                {t[language].hero.website}
              </a>
              <button
                onClick={onBack}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}