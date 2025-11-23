import { useState, useEffect, useCallback } from 'react';
import { resourceService } from '@/services/resourceService';

export const useResourceData = () => {
  const [approvedResources, setApprovedResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('empty');

  const loadResources = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const data = await resourceService.getAllResources();
      const approved = data.filter((resource: any) => resource.status === 'approved');
  setApprovedResources(approved);
  setCacheStatus(approved.length > 0 ? `cached-${approved.length}` : 'empty');
    } catch (error) { 
      console.error("Error loading resources:", error);
      setApprovedResources([]);
      setCacheStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  return { approvedResources, loadResources, isLoading, cacheStatus };
};