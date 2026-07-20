import type { Metadata } from 'next';
import { siteConfig } from '../config/site';

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  const url = `${siteConfig.url}${normalizedPath}`;

  return {
    title,
    description,
    alternates: { canonical: normalizedPath },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      images: [{
        url: siteConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - clear answers`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.defaultImage],
    },
  };
}
