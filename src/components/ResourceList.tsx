'use client';

import { ExternalLink } from "lucide-react";
import { ResizedImage } from "./ResizeImage";



interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  link: string;
  country: string;
  image: string;
  isbn?: string;
  statut?: string;
  detailsStatut?: string;
  resourceUrl?: string;
}

interface ResourceListProps {
  resources: Resource[];
  language: 'fr' | 'en';
  t: any;
}



export default function ResourceList({ resources, language, t }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <p className="text-center text-gray-500 flex-grow">
        {t[language].loading}
      </p>
    );
  }

  return (
    <ul className="flex flex-col space-y-4">
      {resources.map((item) => (
        <li
          key={item.id}
          tabIndex={0}
          className="flex items-start bg-gray-100 gap-4 p-4 hover:bg-gray-150 cursor-pointer group transition"
          onClick={() => {
            window.location.href = `/resource/${item.id}`;
          }}
        >
          {/* Left: Image */}
          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-md">
            <ResizedImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Right: Details */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3 className="text-[18px] font-semibold text-blue-900 underline group-hover:text-blue-800">
              {item.name}
            </h3>
            {item.isbn && (
              <p className="text-sm text-gray-700">
                <span className="text-gray-500 font-medium">ISSN:</span>{" "}
                {item.isbn}
              </p>
            )}
           <div className="flex flex-col items-start space-y-2">
  <button
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = `/resource/${item.id}`;
    }}
    className="text-sm text-orange-600 hover:text-orange-800 underline text-left"
  >
    {t[language].hero.about}
  </button>

 
</div>
 <a
    href={item.link ?? item.resourceUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
  >
    <ExternalLink className="w-4 h-4" />
    {t[language].hero.website}
  </a>

            {item.statut && item.type !== 'blog' && (
              <h3
                className={`font-semibold mt-2 ${
                  item.statut === 'ACTIVE'
                    ? 'text-green-600 group-hover:text-green-800'
                    : 'text-red-600 group-hover:text-red-800'
                }`}
              >
                Statut: {item.statut.toLowerCase()} {item.detailsStatut ? `(${item.detailsStatut})` : ''}
              </h3>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}