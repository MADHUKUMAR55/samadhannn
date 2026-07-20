const amplifyUrl = process.env.AWS_APP_ID && process.env.AWS_BRANCH
  ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`
  : null;
const siteUrl = (process.env.SITE_URL || amplifyUrl || 'https://main.d3lco4t2dnqd7w.amplifyapp.com')
  .replace(/\/$/, '');

function getContentManifest() {
  try {
    const { readFileSync } = require('node:fs');
    return JSON.parse(readFileSync('.content-manifest.json', 'utf8'));
  } catch {
    console.warn('No content manifest found. Run scripts/verify-firestore-content.mjs before the production build.');
    return { categories: [], articles: [] };
  }
}

const contentManifest = getContentManifest();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  outDir: 'out',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: false,
  sitemapSize: 7000,
  exclude: ['/api/*', '/article/*', '/category/*', '/icon.svg', '/404', '/404.html'],
  additionalPaths: async () => [
    ...contentManifest.articles
      .filter(article => article.slug)
      .map(article => ({
        loc: `/article/${article.slug}/`,
        changefreq: 'weekly',
        priority: 0.8,
        ...(article.lastmod ? { lastmod: article.lastmod } : {}),
      })),
    ...contentManifest.categories.map(category => ({
      loc: `/category/${category}/`,
      changefreq: 'weekly',
      priority: 0.7,
    })),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
  },
  transform: async (config, path) => {
    return { loc: path, changefreq: 'monthly', priority: path === '/' ? 1 : 0.6 };
  },
};
