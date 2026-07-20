import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { siteConfig } from '../../config/site';
import { createPageMetadata } from '../../lib/metadata';
import { getSiteArticles } from '../../lib/articles';
import { getCategoriesFromArticles } from '../../lib/categories';

export const metadata: Metadata = createPageMetadata({
  title: 'About Us',
  description: `Learn about ${siteConfig.name} and our mission to provide clear, practical answers to everyday questions.`,
  path: '/about',
});

export default async function AboutPage() {
  let categories = siteConfig.categories;
  try {
    categories = getCategoriesFromArticles(await getSiteArticles());
  } catch {
    // Keep the page available during local builds without Firebase credentials.
  }

  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar activePage="about" showSearch={false} />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="legal-page-card p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">About {siteConfig.name}</h1>
            <div className="prose max-w-none text-gray-700 space-y-6">
              <p><strong>{siteConfig.name}</strong> is an independent informational publication covering practical topics that matter to everyday readers. We focus on useful questions and explain them in plain language.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
              <p>Our mission is to make useful information easier to understand. Articles should answer the question in the title, explain important context, and help readers decide what to research or do next.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Cover</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="bg-[#f1f7f3] border border-[#dcece5] rounded-xl p-3 text-center hover:bg-[#dcece5]">
                    <span className="font-semibold text-[#0f5c49]">{cat.name}</span>
                  </Link>
                ))}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Publish</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Clarity:</strong> We explain unfamiliar terms and avoid unnecessary jargon.</li>
                <li><strong>Sources:</strong> Factual and time-sensitive claims should be checked against reputable, preferably primary, sources.</li>
                <li><strong>Review:</strong> The editorial team is responsible for reviewing articles before publication.</li>
                <li><strong>Corrections:</strong> Readers can report an error, and material corrections should be made promptly.</li>
              </ul>
              <p>Read our <Link href="/editorial-policy" className="text-[#0f5c49] hover:text-[#0a4638] underline">Editorial Policy</Link> for the standards applied to authorship, sources, updates, and advertising.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Get in Touch</h2>
              <p>To suggest a topic, report an error, or ask about our content, please <Link href="/contact" className="text-[#0f5c49] hover:text-[#0a4638] underline">contact us</Link>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
