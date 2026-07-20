import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { articleDrafts } from './article-drafts.mjs';

const shouldPublish = process.argv.includes('--publish');
const siteId = process.env.SITE_ID || 'samadhannn';
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

const prepared = [];
for (const article of articleDrafts) {
  const plainText = article.content.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;
  const externalLinks = (article.content.match(/href="https?:\/\//g) || []).length;

  if (wordCount < 1200) throw new Error(`${article.slug} has only ${wordCount} words.`);
  if (article.metaDescription.length < 120 || article.metaDescription.length > 160) {
    throw new Error(`${article.slug} meta description must be 120-160 characters.`);
  }
  if (externalLinks < 2) throw new Error(`${article.slug} needs at least two authoritative external links.`);

  prepared.push({ article, wordCount, externalLinks });
}

console.log(`Target Firestore site: ${siteId}`);
for (const item of prepared) {
  console.log(`- VALID ${item.article.slug} (${item.wordCount} words, ${item.externalLinks} external sources)`);
}

if (!shouldPublish) {
  console.log('Local validation complete. Add --publish to check Firestore and write the articles.');
  process.exit(0);
}

if (!serviceAccountKey) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY is required. Run with: node --env-file=.env.local scripts/publish-articles.mjs --publish');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKey);
} catch {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY must contain valid JSON.');
  process.exit(1);
}

if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const collection = db.collection('visible-articles');

for (const item of prepared) {
  const matches = await collection
    .where('site', '==', siteId)
    .where('slug', '==', item.article.slug)
    .get();

  if (matches.size > 1) {
    throw new Error(`Multiple existing documents use slug "${item.article.slug}" for site "${siteId}".`);
  }

  item.existing = matches.empty ? null : matches.docs[0];
  console.log(`- ${item.existing ? 'UPDATE' : 'CREATE'} ${item.article.slug}`);
}

const now = Timestamp.now();
const batch = db.batch();

for (const { article, existing } of prepared) {
  const ref = existing?.ref || collection.doc(article.slug);
  const existingData = existing?.data();
  batch.set(ref, {
    ...article,
    site: siteId,
    views: typeof existingData?.views === 'number' ? existingData.views : 0,
    createdAt: existingData?.createdAt || now,
    updatedAt: now,
  }, { merge: true });
}

await batch.commit();

for (const { article } of prepared) {
  const verification = await collection
    .where('site', '==', siteId)
    .where('slug', '==', article.slug)
    .get();
  if (verification.size !== 1) throw new Error(`Verification failed for ${article.slug}.`);
}

console.log(`Published and verified ${prepared.length} articles for site="${siteId}".`);
