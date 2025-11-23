import { NextResponse } from 'next/server';
import { ResourceService } from '@/lib/services/resources';

export async function GET() {
  try {
    const resources = await ResourceService.getResources();
    const baseUrl = 'https://afri-fek.org';
    
    // Static pages
    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'daily', lastmod: undefined },
      { url: '/resources', priority: 0.9, changefreq: 'daily', lastmod: undefined },
      { url: '/resources/journals', priority: 0.8, changefreq: 'daily', lastmod: undefined },
      { url: '/resources/articles', priority: 0.8, changefreq: 'daily', lastmod: undefined },
      { url: '/resources/institutions', priority: 0.8, changefreq: 'daily', lastmod: undefined },
      { url: '/submit', priority: 0.7, changefreq: 'weekly', lastmod: undefined },
      { url: '/about', priority: 0.6, changefreq: 'monthly', lastmod: undefined },
      { url: '/contact', priority: 0.6, changefreq: 'monthly', lastmod: undefined },
    ];
    
    // Dynamic resource pages
    const resourcePages = resources.map(resource => ({
      url: `/resources/${resource.type}s/${ResourceService.generateSlug(resource.name)}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: resource.updatedAt || resource.createdAt
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
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}