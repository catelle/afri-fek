"use client";

import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDomainName } from "@/hooks/constants";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ResizedImage } from "./ResizeImage";

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
  collectionName: string;
  language: "fr" | "en";
  t: any;
  resourceType?: string;
}

export default function ResourceList2({
  collectionName,
  language,
  t,
  resourceType,
}: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageHistory, setPageHistory] = useState<DocumentSnapshot[]>([]);

  const ITEMS_PER_PAGE = 10;

  const fetchResources = async (isNext = false, isPrev = false) => {
    setLoading(true);
    try {
      let  q = query(
          collection(db, collectionName),
          where('type', '==', resourceType),
          orderBy('uploadedAt', 'desc'),
          limit(ITEMS_PER_PAGE)
        
      );

      if (isNext && lastDoc) {
        q = query(
          collection(db, collectionName),
          where('type', '==', resourceType),
          orderBy('name'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      if (isPrev && pageHistory.length > 0) {
        const prevDoc = pageHistory[pageHistory.length - 2];
        if (prevDoc) {
          q = query(
            collection(db, collectionName),
            where('type', '==', resourceType),
            orderBy('name'),
            startAfter(prevDoc),
            limit(ITEMS_PER_PAGE)
          );
        } else {
          q = query(
            collection(db, collectionName),
            where('type', '==', resourceType),
            orderBy('name'),
            limit(ITEMS_PER_PAGE)
          );
        }
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];

      setResources(data);
      
      if (isNext) {
        setPageHistory(prev => [...prev, lastDoc!]);
      } else if (isPrev) {
        setPageHistory(prev => prev.slice(0, -1));
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [collectionName]);

  const handleNext = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
      fetchResources(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      fetchResources(false, true);
    }
  };
console.log({resourceType});
  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
  //         <Card key={i}>
  //           <CardContent className="p-4">
  //             <div className="flex gap-4">
  //               <Skeleton className="w-48 h-32" />
  //               <div className="flex-1 space-y-2">
  //                 <Skeleton className="h-6 w-3/4" />
  //                 <Skeleton className="h-4 w-1/2" />
  //                 <Skeleton className="h-4 w-2/3" />
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }

  // if (resources.length === 0) {
  //   return (
  //     <Card>
  //       <CardContent className="p-8 text-center">
  //         <p className="text-muted-foreground">{t[language].loading}</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }
console.log({resourceType});
  return (
    <div className="space-y-6">
       <div className="space-y-6">
  <ul className="flex flex-col space-y-4">
    {resources.map((item) => (
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

      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {language === "fr" ? "Page" : "Page"} {currentPage}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                {language === "fr" ? "Précédent" : "Previous"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!hasMore}
              >
                {language === "fr" ? "Suivant" : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}