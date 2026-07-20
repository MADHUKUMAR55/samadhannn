import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Article } from '../../../types';
import { siteConfig } from '../../../config/site';
import { getSiteArticles } from '../../../lib/articles';
import { getCategoriesFromArticles, toCategorySlug } from '../../../lib/categories';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AdSenseAd from '../../../components/AdSenseAd';
import AdSenseScript from '../../../components/AdSenseScript';

export const dynamicParams = false;

function getArticleDate(article: Article): number {
  if (article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt) {
    return (article.createdAt as { toDate: () => Date }).toDate().getTime();
  }
  return 0;
}

export async function generateStaticParams() {
  try {
    return getCategoriesFromArticles(await getSiteArticles()).map(category => ({ slug: category.slug }));
  } catch {
    return siteConfig.categories.map(category => ({ slug: category.slug }));
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category = siteConfig.categories.find(candidate => candidate.slug === slug);
  let allArticles: Article[] = [];
  let articles: Article[] = [];

  try {
    allArticles = await getSiteArticles();
    category = getCategoriesFromArticles(allArticles).find(candidate => candidate.slug === slug);
    articles = allArticles
        .filter(article => toCategorySlug(article.category) === slug)
        .sort((a, b) => getArticleDate(b) - getArticleDate(a))
        .slice(0, 20);
  } catch (err) {
    console.error('Error fetching category articles:', err);
  }

  if (!category) return notFound();
  const availableCategories = getCategoriesFromArticles(allArticles);

  const getContentPreview = (content: string | undefined) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]+>/g, '').slice(0, 150);
    return plainText + (plainText.length === 150 ? '...' : '');
  };

  return (
    <div className="site-shell min-h-screen flex flex-col">
      {articles.length > 0 && <AdSenseScript />}
      <Navbar showSearch={false} />

      <main id="main-content" className="flex-1">
      {/* Category Hero */}
      <div className="page-hero text-white py-12 px-4">
        <div className="relative z-10 max-w-4xl mx-auto">
          <nav className="text-sm text-[#bcd2c8] mb-3" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffdca6]">Browse by topic</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">{category.name} Articles</h1>
          <p className="text-[#dce9e4] text-lg">Browse all {category.name.toLowerCase()} articles on {siteConfig.name}</p>
          <p className="text-[#a9c4b8] text-sm mt-2">{articles.length} article{articles.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div>
        <div className="max-w-4xl mx-auto py-8 px-4">
          {articles.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="text-xl">No articles found in {category.name}.</p>
              <Link href="/" className="text-[#0f5c49] hover:underline mt-4 inline-block">← Back to all articles</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article, idx) => (
                <article key={article.id} className="surface-card surface-card-interactive p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-[#dcece5] text-[#0f5c49] px-3 py-1 rounded-full font-bold">{category.name}</span>
                    <span className="text-xs text-gray-400">
                      {article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt
                        ? (article.createdAt as { toDate: () => Date }).toDate().toLocaleDateString()
                        : ''}
                    </span>
                    {typeof article.readTimeMinutes === 'number' && article.readTimeMinutes > 0 && (
                      <span className="text-xs text-gray-500">• {article.readTimeMinutes} min read</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    <Link href={`/article/${article.slug || article.id}`} className="hover:text-[#0f5c49] transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">{getContentPreview(article.content)}</p>
                  <Link href={`/article/${article.slug || article.id}`} className="text-[#0f5c49] hover:text-[#0a4638] text-sm font-semibold">
                    Read more →
                  </Link>
                  {/* Keep advertising density proportional to available content. */}
                  {(idx + 1) % 6 === 0 && idx < articles.length - 1 && (
                    <div className="mt-4"><AdSenseAd /></div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Browse other categories */}
          <div className="mt-10 surface-card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Browse Other Categories</h2>
            <div className="flex flex-wrap gap-2">
              {availableCategories.filter(candidate => candidate.slug !== slug).map(cat => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="bg-[#dcece5] hover:bg-[#c9e0d6] text-[#0f5c49] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let category = siteConfig.categories.find(candidate => candidate.slug === slug);
  let hasArticles = false;
  try {
    const articles = await getSiteArticles();
    category = getCategoriesFromArticles(articles).find(candidate => candidate.slug === slug);
    hasArticles = articles.some(article => toCategorySlug(article.category) === slug);
  } catch {
    // A failed metadata lookup should not prevent the static export.
  }

  if (!category) return { title: 'Category Not Found', robots: { index: false, follow: true } };

  return {
    title: `${category.name} Articles`,
    description: `Browse practical ${category.name.toLowerCase()} guides and answers from ${siteConfig.name}.`,
    robots: hasArticles ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `${category.name} Articles | ${siteConfig.name}`,
      description: `Browse practical ${category.name.toLowerCase()} guides and answers from ${siteConfig.name}.`,
      url: `${siteConfig.url}/category/${slug}/`,
      type: 'website',
      images: [{ url: siteConfig.defaultImage, width: 1200, height: 630, alt: `${category.name} articles on ${siteConfig.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Articles | ${siteConfig.name}`,
      description: `Browse practical ${category.name.toLowerCase()} guides and answers from ${siteConfig.name}.`,
      images: [siteConfig.defaultImage],
    },
    alternates: { canonical: `${siteConfig.url}/category/${slug}/` },
  };
}
