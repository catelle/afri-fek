import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cache } from '@/lib/cache';
import { Resource, ResourceFilters, ResourceStats } from '@/lib/types/resource';

export class ResourceService {
  private static readonly CACHE_KEY = 'all-resources';
  private static readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  static async getResources(filters?: ResourceFilters): Promise<Resource[]> {
    try {
      // Try cache first
      const cachedData = await cache.get(this.CACHE_KEY);
      if (cachedData && this.isCacheValid(cachedData.timestamp)) {
        return this.applyFilters(cachedData.data, filters);
      }

      // Fetch from Firebase
      const resources = await this.fetchFromFirebase();
      
      // Cache the data
      await cache.set(this.CACHE_KEY, {
        data: resources,
        timestamp: Date.now()
      });

      return this.applyFilters(resources, filters);
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw new Error('Failed to fetch resources');
    }
  }

  static async getResourceById(id: string): Promise<Resource | null> {
    const resources = await this.getResources();
    return resources.find(r => r.id === id) || null;
  }

  static async getResourceBySlug(slug: string, type?: string): Promise<Resource | null> {
    const resources = await this.getResources();
    return resources.find(r => 
      this.generateSlug(r.name) === slug && 
      (!type || r.type === type)
    ) || null;
  }

  static async createResource(resourceData: Omit<Resource, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resourceData,
        createdAt: new Date(),
        status: 'pending'
      });
      
      // Invalidate cache
      await cache.delete(this.CACHE_KEY);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw new Error('Failed to create resource');
    }
  }

  static async updateResource(id: string, updates: Partial<Resource>): Promise<void> {
    try {
      const resourceRef = doc(db, 'resources', id);
      await updateDoc(resourceRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      // Invalidate cache
      await cache.delete(this.CACHE_KEY);
    } catch (error) {
      console.error('Error updating resource:', error);
      throw new Error('Failed to update resource');
    }
  }

  static async deleteResource(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'resources', id));
      
      // Invalidate cache
      await cache.delete(this.CACHE_KEY);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Failed to delete resource');
    }
  }

  static async getResourceStats(): Promise<ResourceStats> {
    const resources = await this.getResources();
    
    return {
      total: resources.length,
      journals: resources.filter(r => r.type === 'journal').length,
      articles: resources.filter(r => r.type === 'article').length,
      institutions: resources.filter(r => r.type === 'institution').length,
      countries: new Set(resources.map(r => r.country).filter(Boolean)).size
    };
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private static async fetchFromFirebase(): Promise<Resource[]> {
    const [manualResources, uploadedResources] = await Promise.all([
      this.fetchManualResources(),
      this.fetchUploadedResources()
    ]);

    return [...manualResources, ...uploadedResources].sort(this.sortResources);
  }

  private static async fetchManualResources(): Promise<Resource[]> {
    const snapshot = await getDocs(
      query(collection(db, 'resources'), where('status', '==', 'approved'))
    );
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        name: data.name || '',
        type: data.type || 'article',
        description: data.description || '',
        link: data.link || '',
        country: data.country || '',
        language: data.language || 'fr',
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'approved',
        createdAt: data.createdAt?.toDate() || new Date()
      } as any;
    });
  }

  private static async fetchUploadedResources(): Promise<Resource[]> {
    const snapshot = await getDocs(collection(db, 'FormuploadedResult'));
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        name: data.name || '',
        type: data.type || 'article',
        description: data.description || '',
        link: data.link || '',
        country: data.country || '',
        language: data.language || 'fr',
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'approved',
        createdAt: data.createdAt?.toDate() || new Date(),
        source: 'xlsx'
      } as any;
    });
  }

  private static applyFilters(resources: Resource[], filters?: ResourceFilters): Resource[] {
    if (!filters) return resources;

    return resources.filter(resource => {
      if (filters.type && resource.type !== filters.type) return false;
      if (filters.country && resource.country !== filters.country) return false;
      if (filters.language && resource.language !== filters.language) return false;
      if (filters.search && !resource.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      
      return true;
    });
  }

  private static sortResources(a: Resource, b: Resource): number {
    // Priority sorting logic
    const priorityA = this.getResourcePriority(a);
    const priorityB = this.getResourcePriority(b);
    
    if (priorityA !== priorityB) return priorityB - priorityA;
    
    // Sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }

  private static getResourcePriority(resource: Resource): number {
    const name = resource.name.toLowerCase();
    const description = resource.description?.toLowerCase() || '';
    
    if (name.includes('hsd') || name.includes('hra') || name.includes('afrimvoe')) return 3;
    if (description.includes('hsd') || description.includes('hra')) return 2;
    if (resource.image && !resource.image.includes('unsplash.com')) return 1;
    
    return 0;
  }

  private static isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }
}