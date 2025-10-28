export const translateText = async (text: string, targetLang: string) => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const translateResource = async (resource: any, targetLang: string) => {
  if (targetLang === 'fr') return resource;
  
  const [name, description, about] = await Promise.all([
    translateText(resource.name, targetLang),
    translateText(resource.description, targetLang),
    translateText(resource.about || '', targetLang)
  ]);
  
  return { ...resource, name, description, about };
};
