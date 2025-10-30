export const getDomainName = (domain: string) => {
      const domains = {
        'domain1': 'Droit, économie, politique',
        'domain2': 'Lettres et sciences humaines', 
        'domain3': 'Mathématiques',
        'domain4': 'Sciences physiques',
        'domain5': 'Sciences de la terre et de la vie',
        'domain6': 'Sciences de l\'ingénieur',
        'domain7': 'Sciences pharmaceutiques et médicales'
      };
      return domains[domain as keyof typeof domains] || 'N/A';
    };
    