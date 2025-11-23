import { NextResponse } from 'next/server';

export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /resources/
Allow: /resources/journals/
Allow: /resources/articles/
Allow: /resources/institutions/
Allow: /submit/

# Sitemap location
Sitemap: https://afri-fek.org/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}