import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { siteConfig } from '../../config/site';
import { createPageMetadata } from '../../lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Editorial Policy',
  description: `How ${siteConfig.name} researches, reviews, updates, and corrects its articles.`,
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar showSearch={false} />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <article className="legal-page-card p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Editorial Policy</h1>
            <div className="prose max-w-none text-gray-700">
              <p><strong>Last updated:</strong> {siteConfig.policyLastUpdated}</p>
              <p>This policy explains how the {siteConfig.editorialTeam.name} prepares and maintains content on {siteConfig.name}.</p>

              <h2>Editorial Responsibility</h2>
              <p>The editorial team is responsible for topic selection, review, publication, updates, and corrections. Each article should have a clear purpose and provide information that is useful beyond a brief summary of other pages.</p>

              <h2>Research and Sources</h2>
              <p>Writers and editors should use reputable sources appropriate to the topic. Primary sources such as official documentation, government publications, recognized medical organizations, and original research are preferred for factual or time-sensitive claims. Sources should be linked in the article when they help readers verify important information.</p>

              <h2>Health and Financial Topics</h2>
              <p>Health and financial articles are educational and are not a substitute for advice from a qualified professional. Claims that could affect a reader&apos;s health, safety, or finances require extra care, clear limitations, and authoritative sources.</p>

              <h2>Automated Tools</h2>
              <p>Software tools may assist with research organization, outlines, editing, or formatting. They are not treated as authoritative sources. The editorial team remains responsible for the accuracy, originality, and usefulness of published content.</p>

              <h2>Updates and Corrections</h2>
              <p>Articles may be updated when facts, products, or best practices change. Material updates should change the displayed update date. If you find an error, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> with the article URL and a description of the issue.</p>

              <h2>Advertising Independence</h2>
              <p>Advertising does not determine article conclusions. Ads are visually separated from editorial content, and advertisers do not receive favorable coverage in exchange for payment.</p>

              <p>For more information about the publication, see <Link href="/about">About Us</Link> or <Link href="/contact">Contact Us</Link>.</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
