import { notFound } from "next/navigation";
import Link from 'next/link';
import { Metadata } from 'next';
import ArticleContent from '../../../components/ArticleContent';
import AdSenseAd from '../../../components/AdSenseAd';
import AdSenseScript from '../../../components/AdSenseScript';
import { Article } from '../../../types';
import StructuredData from '../../../components/StructuredData';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ShareButtons from '../../../components/ShareButtons';
import ReadingProgress from '../../../components/ReadingProgress';
import RelatedArticles from '../../../components/RelatedArticles';
import { siteConfig } from '../../../config/site';
import { fallbackArticleSlugs } from '../../../config/fallbackArticleSlugs';
import { getArticleBySlug, getSiteArticles } from '../../../lib/articles';
import { getCategoriesFromArticles, toCategoryName, toCategorySlug } from '../../../lib/categories';

export const dynamicParams = false;

function toDate(value: unknown): Date | null {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

const getFallbackArticleSlugs = () => fallbackArticleSlugs.map(slug => ({ slug }));

export async function generateStaticParams() {
  try {
    const params = (await getSiteArticles())
      .map(article => article.slug ? { slug: article.slug } : null)
      .filter(Boolean) as { slug: string }[];
    return params.length ? params : getFallbackArticleSlugs();
  } catch {
    return getFallbackArticleSlugs();
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);
    if (!article) return notFound();
    const articleUrl = `${siteConfig.url}/article/${article.slug || article.id}/`;
    const hasBackToHome = article.content?.includes('Back to Home');
    const hasArticleContent = Boolean(article.content?.replace(/<[^>]*>/g, '').trim());

    let siteArticles: Article[] = [];
    try {
      siteArticles = await getSiteArticles();
    } catch {
      // The article remains useful even if related-content loading fails.
    }

    const relatedArticles = siteArticles
      .filter(candidate => toCategorySlug(candidate.category) === toCategorySlug(article.category))
      .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0))
      .slice(0, 5);
    const moreArticles = [...siteArticles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8);
    const availableCategories = getCategoriesFromArticles(siteArticles);

    const publishedDate = toDate(article.createdAt);
    const updatedDate = toDate(article.updatedAt);

    return (
      <>
        {hasArticleContent && <AdSenseScript />}
        <StructuredData type="article" article={article} />
        <ReadingProgress />
        <Navbar showSearch={false} />

        <main id="main-content" className="site-shell py-8 px-2">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Left spacer for symmetry on desktop */}
            <div className="w-full lg:w-56 flex-shrink-0 order-2 lg:order-1 hidden lg:block" />

            {/* Main Content */}
            <div className="flex-1 order-1 lg:order-2">
              <div className="max-w-3xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumbs items={[
                  { label: 'Home', href: '/' },
                  { label: toCategoryName(article.category), href: `/category/${toCategorySlug(article.category)}` },
                  { label: article.title || 'Article' },
                ]} />

                {/* Article Card */}
                <article className="surface-card p-6 md:p-10 mb-6" itemScope itemType="https://schema.org/Article">
                  {/* Meta info bar */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                    <Link href={`/category/${toCategorySlug(article.category)}`} className="bg-[#dcece5] text-[#0f5c49] px-3 py-1 rounded-full font-bold hover:bg-[#c9e0d6] transition-colors">
                      {toCategoryName(article.category)}
                    </Link>
                    {publishedDate && (
                      <time className="text-gray-400" dateTime={publishedDate.toISOString()} itemProp="datePublished">
                        {publishedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </time>
                    )}
                    {typeof article.readTimeMinutes === 'number' && article.readTimeMinutes > 0 && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {article.readTimeMinutes} min read
                      </span>
                    )}
                    {typeof article.views === 'number' && article.views >= 0 && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {article.views.toLocaleString()} views
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 text-[#17312a] leading-[1.12]" itemProp="headline">
                    {article.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 mb-6">
                    <span>By</span>
                    <Link href="/editorial-policy" className="font-semibold text-[#0f5c49] hover:underline" itemProp="author">
                      {siteConfig.editorialTeam.name}
                    </Link>
                    {updatedDate && publishedDate && updatedDate.getTime() > publishedDate.getTime() && (
                      <>
                        <span aria-hidden>·</span>
                        <time dateTime={updatedDate.toISOString()} itemProp="dateModified">
                          Updated {updatedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </time>
                      </>
                    )}
                  </div>

                  {toCategorySlug(article.category) === 'health' && (
                    <aside className="mb-6 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-gray-700">
                      This article provides general educational information, not medical advice. Consult a qualified healthcare professional for personal guidance. See our <Link href="/disclaimer" className="font-semibold text-[#0f5c49] underline">disclaimer</Link>.
                    </aside>
                  )}

                  {article.ogImage && (
                    <figure className="mb-6 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.ogImage}
                        alt={article.title || 'Article featured image'}
                        width={1200}
                        height={630}
                        className="h-auto w-full"
                        loading="eager"
                      />
                    </figure>
                  )}

                  {/* Share buttons - top */}
                  <div className="mb-6 pb-4 border-b border-gray-100">
                    <ShareButtons url={articleUrl} title={article.title || ''} />
                  </div>

                  {/* Article Content */}
                  <div itemProp="articleBody">
                    <ArticleContent html={article.content || ''} />
                  </div>

                  {/* A single in-flow placement keeps ads clearly separated from navigation. */}
                  {hasArticleContent && (
                    <div className="my-8">
                      <AdSenseAd />
                    </div>
                  )}

                  {/* Bottom share + navigation */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <ShareButtons url={articleUrl} title={article.title || ''} />

                    {!hasBackToHome && (
                      <Link href="/" className="inline-flex items-center gap-2 bg-[#0f5c49] hover:bg-[#0a4638] text-white px-5 py-2.5 rounded-lg font-semibold text-sm mt-4 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Home
                      </Link>
                    )}
                  </div>
                </article>

                {/* Related Articles */}
                <RelatedArticles articles={relatedArticles} currentId={article.id} />

              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 order-3">
              <div className="sticky top-4 space-y-4">
                {/* Related discovery */}
                <div className="surface-card p-4">
                  <p className="eyebrow mb-2">Keep exploring</p>
                  <h2 className="font-bold text-xl mb-3 border-b border-[#dfd8c9] pb-3 text-[#17312a]">More Answers</h2>
                  <ul className="space-y-3">
                    {moreArticles.map((t: Article, idx: number) => (
                      <li key={t.id} className="flex gap-2">
                        <span className="text-xs font-bold text-[#e99a2e] mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                        <Link href={`/article/${t.slug || t.id}`} className={`block text-sm font-medium ${t.id === article.id ? 'text-[#0f5c49] font-bold' : 'text-gray-800'} hover:text-[#0f5c49] transition-colors leading-snug`}>
                          {t.title || 'Untitled'}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Categories */}
                <div className="surface-card p-4">
                  <h2 className="font-bold text-base mb-2 text-gray-700">Browse Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(cat => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${cat.slug === toCategorySlug(article.category) ? 'bg-[#0f5c49] text-white' : 'bg-[#dcece5] text-[#0f5c49] hover:bg-[#c9e0d6]'}`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    return notFound();
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return { title: 'Article Not Found', robots: { index: false, follow: true } };
    const description = article.metaDescription || article.content?.replace(/<[^>]+>/g, '').slice(0, 155) || '';

    return {
      title: article.metaTitle || article.title,
      description,
      keywords: article.keywords?.length ? article.keywords : [article.category, 'article', 'blog', siteConfig.name.toLowerCase()],
      authors: [{ name: siteConfig.editorialTeam.name, url: siteConfig.editorialTeam.url }],
      openGraph: {
        title: article.metaTitle || article.title,
        description,
        type: 'article',
        url: `${siteConfig.url}/article/${article.slug}/`,
        siteName: siteConfig.name,
        images: [{ url: article.ogImage || siteConfig.defaultImage, width: 1200, height: 630, alt: article.title }],
        publishedTime: article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt
          ? (article.createdAt as { toDate: () => Date }).toDate().toISOString() : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.metaTitle || article.title,
        description,
        images: [article.ogImage || siteConfig.defaultImage],
        creator: siteConfig.social.xHandle || undefined,
      },
      alternates: { canonical: `${siteConfig.url}/article/${article.slug}/` },
    };
  } catch {
    return { title: 'Article' };
  }
}
