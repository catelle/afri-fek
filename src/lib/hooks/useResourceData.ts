import { useState, useEffect, useCallback } from 'react';
import { ResourceService, ResourceData } from '@/lib/services/resourceService';
import { useAITranslation } from '@/hooks/useAITranslation';

interface UseResourceDataReturn {
  resources: ResourceData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  stats: {
    total: number;
    articles: number;
    journals: number;
    countries: number;
  };
}

export function useResourceData(): UseResourceDataReturn {
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userLanguage, translateResources } = useAITranslation();

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let resourcesData = await ResourceService.getResources();
      
      if (userLanguage !== 'fr') {
        resourcesData = await translateResources(resourcesData);
      }
      
      setResources(resourcesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userLanguage, translateResources]);

  const refetch = useCallback(async () => {
    await fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const stats = {
    total: resources.length,
    articles: resources.filter(r => r.type === 'article').length,
    journals: resources.filter(r => r.type === 'journal').length,
    countries: Array.from(new Set(resources.map(r => r.country).filter(Boolean))).length,
  };

  return {
    resources,
    loading,
    error,
    refetch,
    stats
  };
}