import { getFirebaseAdmin } from '../app/firebaseAdmin';
import { siteConfig } from '../config/site';
import type { Article } from '../types';

let articlesPromise: Promise<Article[]> | null = null;

async function loadArticles(): Promise<Article[]> {
  const adminDb = getFirebaseAdmin();
  if (!adminDb) throw new Error('Firebase Admin SDK failed to initialize.');

  const snapshot = await adminDb.collection('visible-articles')
    .where('site', '==', siteConfig.siteId)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
}

export function getSiteArticles(): Promise<Article[]> {
  if (!articlesPromise) articlesPromise = loadArticles();
  return articlesPromise;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getSiteArticles();
  return articles.find(article => article.slug === slug) || null;
}
