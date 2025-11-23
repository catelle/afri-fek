import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';

export interface ResourceData {
  id?: string;
  name: string;
  type: 'journal' | 'article' | 'institution';
  description: string;
  about?: string;
  link: string;
  country: string;
  language: string;
  image?: string;
  date: string;
  status: string;
  createdAt: Date;
  [key: string]: any;
}

export class ResourceService {
  static async getResources(): Promise<ResourceData[]> {
    try {
      const cachedData = await cache.get('all-resources');
      if (cachedData) {
        return cachedData;
      }

      if (!navigator.onLine) {
        return [];
      }

      const [manualResources, uploadedResources] = await Promise.all([
        this.fetchManualResources(),
        this.fetchUploadedResources()
      ]);

      const allResources = [...manualResources, ...uploadedResources].sort(this.sortResources);
      await cache.set('all-resources', allResources);
      
      return allResources;
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  }

  static async createResource(resourceData: Omit<ResourceData, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'resources'), {
      ...resourceData,
      createdAt: new Date(),
      status: 'pending'
    });
    
    await cache.delete('all-resources');
    return docRef.id;
  }

  private static async fetchManualResources(): Promise<ResourceData[]> {
    const snapshot = await getDocs(
      query(collection(db, 'resources'), where('status', '==', 'approved'))
    );
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        type: data.type || 'article',
        description: data.description || '',
        about: data.about,
        link: data.link || '',
        country: data.country || '',
        language: data.language || 'fr',
        image: data.image || this.getDefaultImage(data.type),
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'approved',
        createdAt: data.createdAt?.toDate() || new Date(),
        source: 'manual',
        ...data
      } as ResourceData;
    });
  }

  private static async fetchUploadedResources(): Promise<ResourceData[]> {
    const snapshot = await getDocs(collection(db, 'FormuploadedResult'));
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        type: data.type || 'article',
        description: data.description || '',
        about: data.about,
        link: data.link || '',
        country: data.country || '',
        language: data.language || 'fr',
        image: data.image || this.getDefaultImage(data.type),
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'approved',
        createdAt: data.createdAt?.toDate() || new Date(),
        source: 'xlsx',
        ...data
      } as ResourceData;
    });
  }

  private static getDefaultImage(type: string): string {
    switch (type) {
      case 'journal': return '/search.png';
      case 'article': return '/hero3.jpeg';
      case 'academy': return '/academy.jpg';
      default: return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop';
    }
  }

  private static sortResources(a: ResourceData, b: ResourceData): number {
    const priorityA = this.getResourcePriority(a);
    const priorityB = this.getResourcePriority(b);
    
    if (priorityA !== priorityB) return priorityB - priorityA;
    
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }

  private static getResourcePriority(resource: ResourceData): number {
    const name = resource.name?.toLowerCase() || '';
    const description = resource.description?.toLowerCase() || '';
    
    if (name.includes('hsd') || name.includes('hra') || name.includes('afrimvoe')) return 3;
    if (description.includes('hsd') || description.includes('hra')) return 2;
    if (resource.image && !resource.image.includes('unsplash.com')) return 1;
    
    return 0;
  }
}