import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { siteConfig } from '../config/site';
import type { Metadata } from 'next';
import { getSiteArticles } from '../lib/articles';
import { getCategoriesFromArticles } from '../lib/categories';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  let categories = siteConfig.categories;
  try {
    categories = getCategoriesFromArticles(await getSiteArticles());
  } catch {
    // Keep the error page independent from backend availability.
  }

  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar showSearch={false} />
      <main id="main-content" className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <p className="font-display text-8xl font-extrabold text-[#0f5c49] mb-4">404</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#0f5c49] hover:bg-[#0a4638] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Go Home
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 transition-colors">
              About Us
            </Link>
          </div>
          <div className="mt-10">
            <p className="text-sm text-gray-400 mb-3">Or browse by category:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="text-xs bg-[#dcece5] text-[#0f5c49] px-3 py-1.5 rounded-full hover:bg-[#c9e0d6] transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
