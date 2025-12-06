import { NextResponse } from 'next/server';
import { ResourceService } from '@/lib/services/resources';

export async function GET() {
  try {
    // Skip resource fetching during build time to avoid indexedDB error
    let resources: any[] = [];
    try {
      resources = await ResourceService.getResources();
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Continue with empty resources array
    }
    const baseUrl = 'https://afri-fek.org';
    
    // Static pages
    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'daily', lastmod: undefined },
      { url: '/guide', priority: 0.8, changefreq: 'weekly', lastmod: undefined },
      { url: '/support', priority: 0.8, changefreq: 'weekly', lastmod: undefined },
      ];
    
    // Dynamic resource pages
    const resourcePages = resources.map(resource => ({
      url: `/resource/${resource.id}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: resource.createdAt
    }));
    
    const allPages = [...staticPages, ...resourcePages];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return a basic sitemap even if there's an error
    const baseUrl = 'https://afri-fek.org';
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  }
}