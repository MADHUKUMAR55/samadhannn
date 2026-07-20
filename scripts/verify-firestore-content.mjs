import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFile } from 'node:fs/promises';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const siteId = process.env.SITE_ID || 'answerlyy';

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();
const snapshot = await db.collection('visible-articles')
  .where('site', '==', siteId)
  .get();

if (snapshot.empty) {
  console.error(`No visible-articles documents found with site="${siteId}".`);
  console.error('Check the Firestore field name/value. The app only publishes documents whose site field matches this value.');
  process.exit(1);
}

const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
const errors = [];
const warnings = [];
const seenSlugs = new Set();

const toCategorySlug = value => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

for (const article of articles) {
  const label = article.slug || article.id;
  if (!article.title) errors.push(`${label}: missing title`);
  if (!article.slug) errors.push(`${article.id}: missing slug`);
  if (article.slug && seenSlugs.has(article.slug)) errors.push(`${label}: duplicate slug`);
  if (article.slug) seenSlugs.add(article.slug);
  if (!article.category) errors.push(`${label}: missing category`);
  if (article.category && !toCategorySlug(article.category)) {
    errors.push(`${label}: category cannot produce a valid URL slug`);
  }
  if (!article.metaDescription || article.metaDescription.length < 80) {
    warnings.push(`${label}: add a specific meta description of roughly 80-160 characters`);
  }

  const content = typeof article.content === 'string' ? article.content : '';
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  if (wordCount < 800) {
    warnings.push(`${label}: ${wordCount} words; review whether the article fully answers the query`);
  }
  if (!/href=["']https?:\/\//i.test(content)) {
    warnings.push(`${label}: no external source links found`);
  }
  if (!article.ogImage) {
    warnings.push(`${label}: no article-specific social/featured image`);
  }
}

if (articles.length < 10) {
  warnings.push(`only ${articles.length} published articles; build a broader set of original, useful content before AdSense review`);
}

if (errors.length) {
  console.error('Firestore content errors:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

const categories = Array.from(new Set(
  articles.map(article => toCategorySlug(article.category)).filter(Boolean),
));
const manifest = {
  siteId,
  categories,
  articles: articles.map(article => {
    const timestamp = article.updatedAt || article.createdAt;
    const lastmod = timestamp && typeof timestamp.toDate === 'function'
      ? timestamp.toDate().toISOString()
      : undefined;
    return { slug: article.slug, lastmod };
  }),
};

await writeFile(
  new URL('../.content-manifest.json', import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Firestore content check passed: found ${snapshot.size} article(s) for site="${siteId}".`);
if (warnings.length) {
  console.warn('Content quality review warnings (editorial guidance, not Google minimums):');
  warnings.forEach(warning => console.warn(`- ${warning}`));
}
