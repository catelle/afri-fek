import { NextApiRequest, NextApiResponse } from 'next';

const translateText = async (text: string, targetLang: string) => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resources, targetLang } = req.body;

  if (!resources || !targetLang) {
    return res.status(400).json({ error: 'Missing resources or targetLang' });
  }

  try {
    const translatedResources = await Promise.all(
      resources.map(async (resource: any) => {
        if (targetLang === 'fr') return resource;
        
        const [name, description, about] = await Promise.all([
          translateText(resource.name || '', targetLang),
          translateText(resource.description || '', targetLang),
          translateText(resource.about || '', targetLang)
        ]);
        
        return { ...resource, name, description, about };
      })
    );

    res.json(translatedResources);
  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
}