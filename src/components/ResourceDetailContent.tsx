"use client";

import { ExternalLink } from "lucide-react";
import { ResizedImage } from "./ResizeImage";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  coverageStartYear?: string;
  coverageEndYear?: string;
  coverageStatus?: string;
  publisher?: string;
  domainJournal?: string;
  issnOnline?: string;
  issnPrint?: string;
}

interface ResourceDetailContentProps {
  resourceId: string;
  language?: "fr" | "en";
  t?: any;
  onBack?: () => void;
}

export default function ResourceDetailContent({
  resourceId,
  language,
  t,
  onBack,
}: ResourceDetailContentProps) {

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchResource = async () => {
      try {
        const docRef = doc(db, 'ResourceFromA', resourceId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setResource({ id: docSnap.id, ...docSnap.data() } as Resource);
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId]);


  return (
    <main className="max-w-5xl mx-auto px-4 py-8 mt-[112px]">
      {/* Header Section */}
     {/* <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6"> */}
  <div className="p-6 border-b border-gray-100"></div> 
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
         <div className="flex items-start gap-6">
      
      {/* Image */}
      <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <ResizedImage
          src={resource?.image ?? "/search.png"}
          alt={resource?.name ?? "Resource Image"}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
          // onError={(e) => {
          //   const target = e.target as HTMLImageElement;
          //   target.src = "/search.png";
          // }}
        />
      </div>

      {/* Resource details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {resource?.name ?? "Resource Name"}
        </h1>

        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              resource?.type === "article"
                ? "bg-gray-100 text-gray-700"
                : resource?.type === "journal"
                ? "bg-amber-100 text-amber-700"
                : resource?.type === "academy"
                ? "bg-gray-100 text-gray-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {resource?.type.toUpperCase()}
          </span>

          {resource?.statut && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                resource?.statut === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {resource.statut}
            </span>
          )}
        </div>
      </div>
    </div>
       

        {/* Metadata Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Détails de publication
              </h3>
              {resource?.country && (
                <div className="flex gap-x-2 ">
                  <span className="text-sm text-gray-600">Pays: </span>
                  <span className="text-sm font-medium text-gray-900">
                    {resource.country}
                  </span>
                </div>
              )}
              {resource?.date && (
                <div className="flex gap-x-2">
                  <span className="text-sm text-gray-600">Couverture: </span>
                  <span className="text-sm font-medium text-gray-900">
                    {/* {new Date(resource.date).getFullYear()} */}
                    {resource.coverageStartYear || "N/A"} -{" "}
                    {resource.coverageEndYear || resource.coverageStatus || "N/A"}
                  </span>
                </div>
              )}
              {/* {resource.isbn && (
                <div className="flex gap-x-2">
                  <span className="text-sm text-gray-600">ISSN: </span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {resource.isbn}
                  </span>
                </div>
              )} */}
              {resource?.issnPrint && (
                <div className="flex gap-x-2 ">
                  <span className="text-sm text-gray-600">ISSN imprime: </span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {resource.issnPrint}
                  </span>
                </div>
              )}
             
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Informations générales{" "}
              </h3>
              <div className="flex gap-x-2 ">
                <span className="text-sm text-gray-600">Type: </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {resource?.type}
                </span>
              </div>
              <div className="flex gap-x-2 ">
                <span className="text-sm text-gray-600">Status: </span>
                <span
                  className={
                    resource?.statut
                      ? `text-sm font-medium ${
                          resource.statut === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-600"
                        }`
                      : `text-sm font-medium ${
                          resource?.coverageStatus === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-600"
                        }`
                  }
                >
                  {(resource?.statut
                    ? resource.statut
                    : resource?.coverageStatus) || "N/A"}
                </span>
              </div>
               {resource?.issnOnline && (
                <div className="flex gap-x-2">
                  <span className="text-sm text-gray-600">ISSN en ligne: </span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {resource.issnOnline}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Actions
              </h3>

              <div className="flex flex-col items-center gap-2">
                <a
                  href={resource?.link ?? resource?.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-amber-600 hover:underline hover:text-amber-700 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir plus
                </a>

                <a
                  onClick={onBack}
                  className="text-sm text-gray-600 hover:underline hover:text-gray-800 cursor-pointer transition"
                >
                  Retour
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resource?.description ||
              "No description available for this resource."}
          </p>
        </div>
      </div>

      {/* About Section */}
      {resource?.about && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <p className="text-gray-700 leading-relaxed">{resource.about}</p>
          </div>
        </div>
      )}
    </main>
  );
}
