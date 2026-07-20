import { Article } from '../types';
import { siteConfig } from '../config/site';

interface StructuredDataProps {
  type: 'website' | 'article' | 'organization';
  article?: Article;
}

export default function StructuredData({ type, article }: StructuredDataProps) {
  const socialProfiles = [
    siteConfig.social.xHandle
      ? `https://x.com/${siteConfig.social.xHandle.replace('@', '')}`
      : '',
    siteConfig.social.facebookUrl,
  ].filter(Boolean);

  const articleDescription = article
    ? article.metaDescription || article.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
    : undefined;

  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteConfig.name,
          "description": siteConfig.description,
          "url": siteConfig.url,
          "inLanguage": "en",
        };
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteConfig.name,
          "url": siteConfig.url,
          "sameAs": socialProfiles.length ? socialProfiles : undefined,
        };
      case 'article':
        if (!article) return null;
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": articleDescription,
          "image": article.ogImage || undefined,
          "author": {
            "@type": "Organization",
            "name": siteConfig.editorialTeam.name,
            "url": siteConfig.editorialTeam.url,
          },
          "publisher": {
            "@type": "Organization",
            "name": siteConfig.name,
            "url": siteConfig.url,
          },
          "datePublished": article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt
            ? (article.createdAt as { toDate: () => Date }).toDate().toISOString()
            : undefined,
          "dateModified": article.updatedAt && typeof article.updatedAt === 'object' && 'toDate' in article.updatedAt
            ? (article.updatedAt as { toDate: () => Date }).toDate().toISOString()
            : article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt
            ? (article.createdAt as { toDate: () => Date }).toDate().toISOString()
            : undefined,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/article/${article.slug || article.id}`,
          },
          "articleSection": article.category,
          "keywords": Array.isArray(article.keywords) ? article.keywords.join(', ') : undefined,
          "inLanguage": "en",
        };
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
