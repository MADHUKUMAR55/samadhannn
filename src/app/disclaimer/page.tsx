import { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { siteConfig } from '../../config/site';
import { createPageMetadata } from '../../lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Disclaimer',
  description: `Disclaimer for ${siteConfig.name}. Read our content and advertising disclaimers.`,
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar showSearch={false} />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="legal-page-card p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Disclaimer</h1>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p><strong>Last updated:</strong> {siteConfig.policyLastUpdated}</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">General Disclaimer</h2>
              <p>The information provided on {siteConfig.name} ({siteConfig.domain}) is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">External Links Disclaimer</h2>
              <p>The site may contain links to other websites or content belonging to third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Professional Disclaimer</h2>
              <p>The site does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Advertising Disclaimer</h2>
              <p>{siteConfig.name} may use Google AdSense or another advertising service. Advertisements are separated from editorial content. We may receive revenue from advertising interactions, but the presence of an advertisement does not constitute an endorsement of the advertised product or service.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Contact Us</h2>
              <p>If you have questions about this Disclaimer, contact us at <a href={`mailto:${siteConfig.email}`} className="text-[#0f5c49] underline">{siteConfig.email}</a>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
