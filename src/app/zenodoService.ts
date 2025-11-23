// You will need to add your Zenodo access token to your environment variables
// For local development, you can add it to a .env.local file
const ZENODO_ACCESS_TOKEN = process.env.ZENODO_ACCESS_TOKEN;
const ZENODO_API_URL = 'https://zenodo.org/api/deposit/depositions'; // Use sandbox for testing: https://sandbox.zenodo.org/api/deposit/depositions

export const createZenodoDeposition = async (resourceData: any) => {
  if (!ZENODO_ACCESS_TOKEN) {
    throw new Error('Zenodo access token is not configured.');
  }

  // 1. Create the metadata object based on Zenodo's schema
  const metadata = {
    title: resourceData.name || 'No title provided',
    upload_type: 'dataset', // Or 'publication', 'software', etc.
    description: resourceData.description || 'No description provided.',
    creators: [{ name: resourceData.chiefEditor || 'Unknown Author' }],
    // Map other form fields to Zenodo metadata fields
    // Example of custom fields:
    keywords: resourceData.discipline ? [resourceData.discipline] : [],
    notes: `
      Organisation: ${resourceData.organisationName || 'N/A'}
      Link: ${resourceData.link || 'N/A'}
      Country: ${resourceData.country || 'N/A'}
      Language: ${resourceData.resourceLanguage || 'N/A'}
    `
  };

  // 2. Create a new deposition on Zenodo
  // This first step just creates an empty "bucket" to put files in
  const createResponse = await fetch(`${ZENODO_API_URL}?access_token=${ZENODO_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ metadata }),
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json();
    throw new Error(`Failed to create Zenodo deposition: ${JSON.stringify(errorData)}`);
  }

  const deposition = await createResponse.json();
  const bucketUrl = deposition.links.bucket;

  // 3. Upload the form data as a metadata.json file
  const metadataBlob = new Blob([JSON.stringify(resourceData, null, 2)], { type: 'application/json' });
  
  await fetch(`${bucketUrl}/metadata.json?access_token=${ZENODO_ACCESS_TOKEN}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: metadataBlob,
  });

  // If you have an actual file (like a PDF or image) to upload, you would do it here.
  // For example, if `resourceData.image` is a file URL, you would fetch it and upload it.

  // 4. Publish the deposition
  // This makes the record public and assigns a permanent DOI
  const publishResponse = await fetch(`${ZENODO_API_URL}/${deposition.id}/actions/publish?access_token=${ZENODO_ACCESS_TOKEN}`, {
    method: 'POST',
  });

  if (!publishResponse.ok) {
    const errorData = await publishResponse.json();
    throw new Error(`Failed to publish Zenodo deposition: ${JSON.stringify(errorData)}`);
  }

  const publishedDeposition = await publishResponse.json();
  
  console.log('Successfully published to Zenodo. DOI:', publishedDeposition.doi);

  // Return the DOI and other relevant info to be saved in Firebase
  return {
    id: publishedDeposition.id,
    doi: publishedDeposition.doi,
    zenodoUrl: publishedDeposition.links.html,
  };
};