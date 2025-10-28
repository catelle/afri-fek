import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message, resourceData } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log notification for admin review
  const emailData = {
    to: 'contactafrifek@gmail.com',
    from: `${name} (${phone})`,
    message,
    resource: resourceData?.name,
    organization: resourceData?.organisationName,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`,
    timestamp: new Date().toISOString()
  };
  
  console.log('\n📧 NEW COMMENT NOTIFICATION 📧');
  console.log('================================');
  console.log('TO:', emailData.to);
  console.log('FROM:', emailData.from);
  console.log('MESSAGE:', emailData.message);
  console.log('RESOURCE:', emailData.resource);
  console.log('ORGANIZATION:', emailData.organization);
  console.log('URL:', emailData.url);
  console.log('TIME:', emailData.timestamp);
  console.log('================================\n');
  
  res.status(200).json({ 
    success: true, 
    message: 'Comment received successfully - admin will be notified'
  });
}