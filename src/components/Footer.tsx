import Link from 'next/link';
import { siteConfig } from '../config/site';
import { getSiteArticles } from '../lib/articles';
import { getCategoriesFromArticles } from '../lib/categories';
import BrandLogo from './BrandLogo';

export default async function Footer() {
  let categories = siteConfig.categories;
  try {
    categories = getCategoriesFromArticles(await getSiteArticles());
  } catch {
    // Static fallback keeps legal and navigation pages buildable without Firebase.
  }

  return (
    <footer className="bg-[#123f34] border-t-4 border-[#e99a2e] mt-12 text-[#eaf3ee]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="font-bold text-[#ffdca6] mb-3 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/editorial-policy" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">Editorial Policy</Link></li>
              <li><Link href="/contact" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#ffdca6] mb-3 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/disclaimer" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#ffdca6] mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-[#c9d9d2] hover:text-white text-sm transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#ffdca6] mb-3 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/sitemap.xml" className="text-[#c9d9d2] hover:text-white text-sm transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLogo inverse />
          <p className="text-sm text-[#9fb8ad]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. | {siteConfig.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
