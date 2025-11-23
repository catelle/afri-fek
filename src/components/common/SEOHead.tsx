import Head from 'next/head';
import { Resource } from '@/lib/types/resource';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  resource?: Resource;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function SEOHead({ 
  title, 
  description, 
  canonical, 
  ogImage = '/og-image.jpg',
  resource,
  breadcrumbs 
}: SEOHeadProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Afri-Fek',
    url: 'https://afri-fek.org',
    description: 'Plateforme de référence pour la recherche en santé africaine',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://afri-fek.org/resources?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const breadcrumbStructuredData = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://afri-fek.org${crumb.url}`
    }))
  } : null;

  const resourceStructuredData = resource ? {
    '@context': 'https://schema.org',
    '@type': resource.type === 'journal' ? 'Periodical' : 
             resource.type === 'article' ? 'ScholarlyArticle' : 'Organization',
    name: resource.name,
    description: resource.description,
    url: resource.link,
    ...(resource.type === 'journal' && {
      issn: (resource as any).issnOnline || (resource as any).issnPrint,
      publisher: (resource as any).publisher
    }),
    ...(resource.type === 'institution' && {
      address: resource.country,
      contactPoint: {
        '@type': 'ContactPoint',
        email: (resource as any).email
      }
    })
  } : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      )}
      
      {resourceStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(resourceStructuredData) }}
        />
      )}
    </Head>
  );
}