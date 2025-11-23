import { useState, useEffect, useCallback } from 'react';
import { Resource, ResourceFilters, ResourceStats } from '@/lib/types/resource';
import { ResourceService } from '@/lib/services/resources';

interface UseResourcesReturn {
  resources: Resource[];
  stats: ResourceStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: ResourceFilters) => void;
}

export function useResources(initialFilters?: ResourceFilters): UseResourcesReturn {
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResourceFilters>(initialFilters || {});

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resourcesData, statsData] = await Promise.all([
        ResourceService.getResources(filters),
        ResourceService.getResourceStats()
      ]);
      
      setResources(resourcesData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: ResourceFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refetch = useCallback(async () => {
    await fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    stats,
    loading,
    error,
    refetch,
    updateFilters
  };
}

export function useResource(id: string) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resourceData = await ResourceService.getResourceById(id);
        setResource(resourceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  return { resource, loading, error };
}