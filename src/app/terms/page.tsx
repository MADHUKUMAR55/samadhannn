import { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { siteConfig } from '../../config/site';
import { createPageMetadata } from '../../lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Terms and Conditions',
  description: `Terms and Conditions for ${siteConfig.name}. Read our terms of use before using our website.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar showSearch={false} />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="legal-page-card p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Terms and Conditions</h1>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p><strong>Last updated:</strong> {siteConfig.policyLastUpdated}</p>
              <p>Welcome to {siteConfig.name}. By accessing and using this website, you agree to be bound by these terms and conditions.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Acceptance of Terms</h2>
              <p>By using this website, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the website.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Use of Content</h2>
              <p>All content, including articles, images, and graphics, is for informational purposes only. You may not reproduce, distribute, or use our content without prior written permission.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Intellectual Property</h2>
              <p>All content, logos, and trademarks displayed on this website are the property of {siteConfig.name} or their respective owners and are protected by copyright laws.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Advertisements</h2>
              <p>This website may display advertisements through Google AdSense or other advertising services. Third parties provide those advertisements, and their presence does not constitute our endorsement of the advertised products, services, or claims.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Disclaimer of Warranties</h2>
              <p>The information provided on this website is for general informational purposes only. We make no warranties about the accuracy, completeness, or reliability of any information on this site. Use of the information is at your own risk.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Limitation of Liability</h2>
              <p>In no event shall {siteConfig.name} be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the website.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Changes to Terms</h2>
              <p>We reserve the right to update these terms at any time. Continued use of the website after any changes constitutes acceptance of the revised terms.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Contact Us</h2>
              <p>If you have questions about these terms, contact us at <a href={`mailto:${siteConfig.email}`} className="text-[#0f5c49] underline">{siteConfig.email}</a>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
