import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  about: string;
  country: string;
  date: string;
  status: string;
  source: string;
}

class ResourceService {
  private resources: Resource[] = [];
  private fetchPromise: Promise<Resource[]> | null = null;

  private fetchAllResources(): Promise<Resource[]> {
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      try {
        const [resourcesSnapshot, formUploadedSnapshot] = await Promise.all([
          getDocs(collection(db, 'resources')),
          getDocs(collection(db, 'FormuploadedResult'))
        ]);

        const resourcesData = resourcesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            type: data.type,
            description: data.description || '',
            about: data.about || '',
            country: data.country || '',
            date: data.date || new Date().toISOString().split('T')[0],
            status: data.status,
            source: 'resources',
            issnOnline: data.issnOnline || '',
            issnPrint: data.issnPrint || '',
            coverageStatus : data.coverageStatus || '',
            statut: data.statut || '',
            image:data.image ||'',
            domainJournal: data.domainJournal||'',

          };
        });

        const formUploadedData = formUploadedSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.resourceTitle || data.organisationName || data.name,
            type: data.resourceType || data.type,
            description: data.description || '',
            about: data.about || '',
            country: data.country || '',
            date: data.date || new Date().toISOString().split('T')[0],
            status: data.status || 'pending',
            source: 'FormuploadedResult',
              issnOnline: data.issnOnline || '',
            issnPrint: data.issnPrint || '',
            coverageStatus : data.coverageStatus || '',
            statut: data.statut || '',
            image:data.image ||'',
            domainJournal: data.domainJournal||'',


          };
        });

        const allDbResources = [...resourcesData, ...formUploadedData];
        console.log('Total resources loaded:', allDbResources.length, '(resources:', resourcesData.length, ', form uploads:', formUploadedData.length, ')');
        this.resources = allDbResources;
        return this.resources;
      } catch (error) {
        console.error('Error fetching resources:', error);
        this.resources = [];
        return [];
      }
    })();
    return this.fetchPromise;
  }

  async getAllResources(): Promise<Resource[]> {
    if (this.resources.length > 0) {
      return this.resources;
    }
    return this.fetchAllResources();
  }

  async getStats() {
    await this.getAllResources();

    if (!this.resources || this.resources.length === 0) {
        return {
            total: 0,
            countries: 0,
            journals: 0,
            articles: 0,
        };
    }
    const journals = this.resources.filter(r => r.type === 'journal').length;
    const articles = this.resources.filter(r => r.type === 'article').length;
    const countries = new Set(this.resources.map(r => r.country).filter(Boolean)).size;

    return {
      total: this.resources.length,
      countries: countries,
      journals: journals,
      articles: articles,
    };
  }
}

export const resourceService = new ResourceService();