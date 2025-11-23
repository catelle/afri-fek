export const calculateStats = (resources: any[]) => {
  return {
    total: resources.length,
    articles: resources.filter(r => r.type === 'article').length,
    journals: resources.filter(r => r.type === 'journal').length,
    countries: Array.from(new Set(resources.map(r => r.country).filter(Boolean))).length,
  };
};

export const getCountries = (resources: any[]) => {
  return Array.from(new Set(resources.map(r => r.country).filter(Boolean)));
};