import { useState, useEffect } from 'react';
import { resourceService } from '@/services/resourceService';

export const useStatsData = () => {
  const [stats, setStats] = useState({
    total: 0,
    countries: 0,
    journals: 0,
    articles: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Use the centralized service to get stats
        const realStats = await resourceService.getStats();
        setStats(realStats);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to zero values on error
        setStats({
          total: 0,
          countries: 0,
          journals: 0,
          articles: 0,
        });
      }
    };

    loadStats();
  }, []);

  return stats;
};