export const filterAndSortResources = (
  resources: any[],
  tab: string,
  search: string,
  filterType: string | null,
  filterCountry: string | null,
  filterLanguage: string | null,
  filterDomain: string | null
) => {
  const topIssns = ["3006-4090", "2309-6535"];

  const filtered = resources.filter(
    (item) =>
      item &&
      (tab === "all" || item.type === tab) &&
      (item.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (!filterType || item.type === filterType) &&
      (!filterCountry || item.country === filterCountry) &&
      (!filterLanguage || item.resourceLanguage === filterLanguage) &&
      (!filterDomain || item.domainJournal === filterDomain)
  );

  const prioritized = filtered.map((item) => {
    const isTopPriority = topIssns.some((issn) =>
      (item.issnOnline || "").includes(issn)
    );

    const isDefaultImage =
      (item.image || "").includes("/logo-afrimvoe") ||
      (item.image || "").includes("unsplash.com");

    return {
      item,
      isTopPriority,
      isDefaultImage,
    };
  });

  // Separate top-priority and normal items
  const topPriorityItems = prioritized
    .filter((p) => p.isTopPriority)
    .map((p) => p.item);

  const otherItems = prioritized
    .filter((p) => !p.isTopPriority)
    .map((p) => p.item)
    .sort((a, b) => {
      const nameA = (a.name || "").trim();
      const nameB = (b.name || "").trim();

      const startsWithLetter = (str: string) => /^[A-Za-z]/.test(str);

      const aIsLetter = startsWithLetter(nameA);
      const bIsLetter = startsWithLetter(nameB);

      // If one starts with letter and the other not → letter first
      if (aIsLetter && !bIsLetter) return -1;
      if (!aIsLetter && bIsLetter) return 1;

      // Otherwise, normal alphabetical order
      return nameA.localeCompare(nameB);
    });

  // Combine: top first, then alphabetically sorted others
  return [...topPriorityItems, ...otherItems];
};

export const getUniqueCountries = (resources: any[]) => {
  return Array.from(new Set(resources.map((item) => item.country)));
};
