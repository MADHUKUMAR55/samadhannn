import type { Article } from '../types';
import { siteConfig } from '../config/site';

export interface SiteCategory {
  name: string;
  slug: string;
}

export function toCategorySlug(value: string | undefined): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toCategoryName(value: string | undefined): string {
  const raw = String(value || '').trim();
  const slug = toCategorySlug(raw);
  const configured = siteConfig.categories.find(category => category.slug === slug);
  if (configured) return configured.name;
  if (!raw) return 'Articles';
  if (raw !== raw.toLowerCase()) return raw;

  return raw
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

export function getCategoriesFromArticles(articles: Article[]): SiteCategory[] {
  const categories = new Map<string, SiteCategory>();

  for (const article of articles) {
    const slug = toCategorySlug(article.category);
    if (!slug || categories.has(slug)) continue;
    categories.set(slug, { slug, name: toCategoryName(article.category) });
  }

  if (!categories.size) return siteConfig.categories;
  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
}
