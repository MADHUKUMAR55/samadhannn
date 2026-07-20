export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
  site?: string;
  views?: number;
  readTimeMinutes?: number;
  createdAt: unknown;
  updatedAt?: unknown;
}
