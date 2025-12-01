"use client";

import { ExternalLink } from "lucide-react";
import { ResizedImage } from "./ResizeImage";
import { useState } from "react";
import { getDomainName } from "@/hooks/constants";

interface Resource {
  issnPrint: any;
  issnOnline: any;
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
  domainJournal?: string;
}

interface ResourceListProps {
  resources: Resource[];
  language: "fr" | "en";
  t: any;
}

export default function ResourceList3({
  resources,
  language,
  t,
}: ResourceListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (resources.length === 0) {
    return (
      <p className="text-center text-gray-500 flex-grow">
        {t[language].loading}
      </p>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = resources.slice(startIndex, endIndex);

  return (
   <div className="space-y-6">
  <ul className="flex flex-col space-y-4">
    {currentResources.map((item) => (
      <li
        key={item.id}
        tabIndex={0}
 className="flex flex-col sm:flex-row items-start bg-gray-100 gap-2 sm:gap-4 p-4 hover:bg-gray-150 cursor-pointer group transition"        onClick={() => {
          window.location.href = `/resource/${item.id}`;
        }}
      >
        {/* Left: Image */}
       <div className="w-full sm:w-48 h-auto sm:h-32 flex-shrink-0 overflow-hidden rounded-md bg-white flex items-center justify-center">
  <ResizedImage
    src={item.image}
    alt={item.name}
    className="max-w-full max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-200"
  />
</div>


        {/* Right: Details */}
       <div className="flex-1 min-w-0 flex flex-col gap-2 mt-2 sm:mt-0">
          {/* Title */}
          <h3 className="text-lg sm:text-[18px] font-semibold text-blue-900 underline group-hover:text-blue-800 break-words">
            {item.name}
          </h3>

          {/* ISSN + Status */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            {item.isbn && (
              <span>
                <span className="text-gray-500 font-medium">ISSN:</span> {item.isbn}
              </span>
            )}
            {item.issnOnline && (
              <span>
                <span className="text-gray-500 font-medium">ISSN en ligne:</span> {item.issnOnline}{item.issnPrint &&(<span>- ISSN imprimé: {item.issnPrint}</span>)}
              </span>
            )}
            
            {item.statut && item.type !== "blog" && (
              <span
                className={`font-semibold ${
                  item.statut === "ACTIVE"
                    ? "text-green-600 group-hover:text-green-800"
                    : "text-red-600 group-hover:text-red-800"
                }`}
              >
                Statut: {item.statut.toLowerCase()}{" "}
                {item.detailsStatut ? `(${item.detailsStatut})` : ""}
              </span>
            )}
          </div>

          {/* Links side by side */}
         <div className="flex flex-wrap items-center gap-4 mt-2">
  <button
    onClick={(e) => {
      e.stopPropagation(); // stop parent click
      e.preventDefault(); // ensure no weird link default
      window.location.href = `/resource/${item.id}`;
    }}
    className="text-sm text-orange-600 hover:text-orange-800 underline"
  >
    {t[language].hero.about}
  </button>

  <a
    href={item.link ?? item.resourceUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()} // prevent triggering the button
    className="text-sm text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
  >
    <ExternalLink className="w-4 h-4" />
    {t[language].hero.website}
  </a>
</div>


          {/* Domain journal below */}
          {item.domainJournal && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold text-gray-700">Domaine :</span>{" "}
              {getDomainName(item.domainJournal)}
            </p>
          )}
        </div>
      </li>
    ))}
  </ul>

  {/* Pagination (unchanged) */}
  {totalPages > 1 && (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg p-4 shadow-sm border gap-2 sm:gap-0">
      <div className="text-sm text-gray-700 text-center sm:text-left">
        {language === "fr" ? "Affichage" : "Showing"} {startIndex + 1}{" "}
        {language === "fr" ? "à" : "to"}{" "}
        {Math.min(endIndex, resources.length)}{" "}
        {language === "fr" ? "sur" : "of"} {resources.length}{" "}
        {language === "fr" ? "résultats" : "results"}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 text-sm"
        >
          {language === "fr" ? "Précédent" : "Previous"}
        </button>
        <span className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm">
          {currentPage}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 text-sm"
        >
          {language === "fr" ? "Suivant" : "Next"}
        </button>
      </div>
    </div>
  )}
</div>

  );
}
