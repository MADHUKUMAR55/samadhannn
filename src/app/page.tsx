import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Article } from '../types';
import { siteConfig } from '../config/site';
import { getSiteArticles } from '../lib/articles';
import { getCategoriesFromArticles, toCategoryName, toCategorySlug } from '../lib/categories';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdSenseAd from '../components/AdSenseAd';
import AdSenseScript from '../components/AdSenseScript';

const ARTICLES_LIMIT = 12;

export const dynamic = 'force-static';

function getArticleDate(article: Article): number {
  if (article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt) {
    return (article.createdAt as { toDate: () => Date }).toDate().getTime();
  }
  return 0;
}

export default async function HomePage() {
  let allArticles: Article[] = [];
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    allArticles = await getSiteArticles();
    articles = [...allArticles]
      .sort((a, b) => getArticleDate(b) - getArticleDate(a))
      .slice(0, ARTICLES_LIMIT);
  } catch (err) {
    console.error('Error fetching articles:', err);
    error = 'Failed to load articles. Please try again.';
  }

  const getContentPreview = (content: string | undefined) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]+>/g, '').slice(0, 160);
    return plainText + (plainText.length === 160 ? '...' : '');
  };

  const visibleCategories = getCategoriesFromArticles(allArticles);
  const latestArticles = articles.slice(0, 8);

  return (
    <div className="site-shell min-h-screen flex flex-col">
      {articles.length > 0 && <AdSenseScript />}
      <Navbar activePage="home" showSearch={false} />

      <main id="main-content" className="flex-1">
      <section className="page-hero text-white px-4 py-16 md:py-20">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#ffdca6]">Knowledge for better decisions</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-[1.08]">
            {siteConfig.tagline}
          </h1>
          <p className="text-[#dce9e4] text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {visibleCategories.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="bg-white/8 hover:bg-[#e99a2e] hover:text-[#17312a] text-white border border-white/25 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 mt-6 px-2 md:px-4">
          <aside className="w-full lg:w-56 flex-shrink-0 mb-4 lg:mb-0 order-2 lg:order-1">
            <div className="surface-card p-4 sticky top-4">
              <p className="eyebrow mb-2">Explore</p>
              <h2 className="font-bold text-xl mb-3 border-b border-[#dfd8c9] pb-3 text-[#17312a]">Categories</h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    className="w-full text-left px-3 py-2 rounded-lg transition font-bold block text-sm text-[#0f5c49] bg-[#dcece5]"
                  >
                    All Articles
                  </Link>
                </li>
                {visibleCategories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="w-full text-left px-3 py-2 rounded-lg transition font-medium block text-sm text-[#40534d] hover:bg-[#f1eee5]"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-4 order-1 lg:order-2" aria-label="Latest answers">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
            {articles.length === 0 ? (
              <div className="surface-card text-center text-gray-500 p-10">
                <h2 className="text-xl font-bold text-gray-900 mb-2">No articles available</h2>
                <p>Check back soon for new answers.</p>
              </div>
            ) : (
              articles.map((article: Article, idx: number) => (
                <React.Fragment key={article.id}>
                  <article className="surface-card surface-card-interactive p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Link href={`/category/${toCategorySlug(article.category)}`} className="text-xs bg-[#dcece5] text-[#0f5c49] px-3 py-1 rounded-full font-bold hover:bg-[#c9e0d6] transition-colors">
                        {toCategoryName(article.category)}
                      </Link>
                      <time className="text-xs text-gray-400">
                        {article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt
                          ? (article.createdAt as { toDate: () => Date }).toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : ''}
                      </time>
                      {typeof article.readTimeMinutes === 'number' && article.readTimeMinutes > 0 && (
                        <span className="text-xs text-gray-500">- {article.readTimeMinutes} min read</span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold mb-2 text-gray-900">
                      <Link href={`/article/${article.slug || article.id}`} className="hover:text-[#0f5c49] transition-colors">
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{getContentPreview(article.content)}</p>
                    <Link href={`/article/${article.slug || article.id}`} className="inline-flex items-center gap-2 bg-[#0f5c49] hover:bg-[#0a4638] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                      Read Answer <span aria-hidden>→</span>
                    </Link>
                  </article>

                  {(idx + 1) % 5 === 0 && idx < articles.length - 1 && <AdSenseAd />}
                </React.Fragment>
              ))
            )}
          </section>

          <aside className="w-full lg:w-72 flex-shrink-0 order-3">
            {latestArticles.length > 0 && (
              <div className="surface-card p-4 sticky top-4">
                <p className="eyebrow mb-2">Freshly published</p>
                <h2 className="font-bold text-xl mb-3 border-b border-[#dfd8c9] pb-3 text-[#17312a]">Latest Answers</h2>
                <ul className="space-y-3">
                  {latestArticles.map((article: Article, idx: number) => (
                    <li key={article.id} className="flex gap-2">
                      <span className="text-xs font-bold text-[#e99a2e] mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                      <Link href={`/article/${article.slug || article.id}`} className="block text-sm font-medium text-gray-800 hover:text-[#0f5c49] transition-colors leading-snug">
                        {article.title || 'Untitled'}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ['questions', 'answers', 'guides', 'blog', 'articles'],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.defaultImage, width: 1200, height: 630, alt: `${siteConfig.name} - clear answers` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.defaultImage],
  },
  alternates: { canonical: '/' },
};
