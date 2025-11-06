import { Metadata } from 'next';

export const siteConfig = {
  name: 'Afri-Fek',
  description: 'Plateforme de référence pour la recherche en santé africaine. Découvrez des journaux, articles et institutions de recherche à travers l\'Afrique.',
  url: 'https://afri-fek.org',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/afrifek',
    github: 'https://github.com/afrifek',
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'recherche africaine',
    'santé Afrique',
    'journaux scientifiques',
    'publications médicales',
    'institutions recherche',
    'African research',
    'health journals',
  ],
  authors: [
    {
      name: 'Afri-Fek Team',
      url: siteConfig.url,
    },
  ],
  creator: 'Afri-Fek',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@afrifek',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const generatePageMetadata = (
  title: string,
  description: string,
  path: string,
  image?: string
): Metadata => ({
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}${path}`,
    images: image ? [image] : [siteConfig.ogImage],
  },
  twitter: {
    title,
    description,
    images: image ? [image] : [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}${path}`,
  },
});