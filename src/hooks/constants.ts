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
    

    export const getDomainNames = () => {
  return [
    { key: 'domain1', label: 'Droit, économie, politique' },
    { key: 'domain2', label: 'Lettres et sciences humaines' },
    { key: 'domain3', label: 'Mathématiques' },
    { key: 'domain4', label: 'Sciences physiques' },
    { key: 'domain5', label: 'Sciences de la terre et de la vie' },
    { key: 'domain6', label: 'Sciences de l\'ingénieur' },
    { key: 'domain7', label: 'Sciences pharmaceutiques et médicales' }
  ];
};

     export  const getDefaultImage = (type: string) => {
        switch (type) {
          case "journal":
            return "/search.png";
          case "article":
            return "/hero3.jpeg";
          case "institution":
            return "/academy.jpg";
          case "blog":
            return "/academy.jpg";
          default:
            return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop";
        }}



        // lib/menu-data.ts

export const resourcesMenu = [
  {
    title: "Discover Resources",
    items: [
      {
        label: "Journals",
        description: "Explore peer-reviewed journals and academic publications.",
        filter: "journal",
      },
      {
        label: "Institutions",
        description: "Browse African universities, research centers, and foundations.",
        filter: "institution",
      },
      {
        label: "Blogs",
        description: "Find expert commentary, articles, and creator content.",
        filter: "blog",
      },
      {
        label: "Schools",
        description: "Educational academies, training centers, and e-learning platforms.",
        filter: "academy",
      },
      {
        label: "Articles",
        description: "Trending research articles and scientific summaries.",
        filter: "article",
      },
    ],
  },
]
