import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useResourceDetail = (resourceId: string) => {
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const [resourcesSnapshot, uploadedSnapshot] = await Promise.all([
          getDocs(collection(db, 'resources')),
          getDocs(collection(db, 'FormuploadedResult'))
        ]);
        
        let firestoreResource = resourcesSnapshot.docs.find(doc => doc.id === resourceId);
        
        if (!firestoreResource) {
          firestoreResource = uploadedSnapshot.docs.find(doc => doc.id === resourceId);
        }
        
        if (firestoreResource) {
          const data = firestoreResource.data();
          setResource({
            id: firestoreResource.id,
            name: data.name,
            type: data.type,
            description: data.description,
            about: data.about || '',
            link: data.link,
            country: data.country || '',
            image: data.image || '/hero3.jpeg',
            date: data.date || new Date().toISOString().split('T')[0],
            isbn: data.isbn || '',
            statut: data.statut || '',
            detailsStatut: data.detailsStatut || '',
            publisher: data.publisher || '',
            coverageStartYear: data.coverageStartYear || '',
            coverageEndYear: data.coverageEndYear || '',
            coverageStatus: data.coverageStatus || '',
            resourceUrl: data.resourceUrl || '',
            domainJournal: data.domainJournal || '',
            issnOnline: data.issnOnline || '',
            issnPrint: data.issnPrint || ''
          });
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      }
      
      setLoading(false);
    };

    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  return { resource, loading };
};