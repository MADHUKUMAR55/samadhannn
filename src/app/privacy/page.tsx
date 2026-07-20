import { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { siteConfig } from '../../config/site';
import { createPageMetadata } from '../../lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your data.`,
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar showSearch={false} />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="legal-page-card p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Privacy Policy</h1>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p><strong>Last updated:</strong> {siteConfig.policyLastUpdated}</p>
              <p>At {siteConfig.name}, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Information We Collect</h2>
              <p>We may collect information about your visit using cookies, analytics services, and similar technologies. This includes your IP address, browser type, pages visited, and time spent on our website.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To improve our website and content quality</li>
                <li>To analyze website traffic and usage patterns</li>
                <li>To serve relevant advertisements through Google AdSense</li>
                <li>To respond to your inquiries and feedback</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Google AdSense &amp; Cookies</h2>
              <p>When advertising is enabled, third-party vendors, including Google, may place and read cookies in your browser or use web beacons and IP addresses to collect information as a result of ad serving. Google and its partners may use advertising cookies to serve ads based on your visits to this website and other websites.</p>
              <p>You can opt out of personalized advertising at <a href="https://adssettings.google.com/" className="text-[#0f5c49] underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Where required by law, we will request consent before using advertising cookies and provide a way to manage that choice.</p>
              <p>For more information about how Google uses data, visit <a href="https://policies.google.com/technologies/partner-sites" className="text-[#0f5c49] underline" target="_blank" rel="noopener noreferrer">Google&apos;s partner site policies</a>.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Sale of Personal Information</h2>
              <p>We do not sell personal information submitted through direct communications with us.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Data Protection</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of internet transmission is 100% secure.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Your Rights</h2>
              <p>You have the right to request access to, correction of, or deletion of your personal data. You can also control cookie settings through your browser preferences.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6">Contact Us</h2>
              <p>For privacy-related questions, contact us at <a href={`mailto:${siteConfig.email}`} className="text-[#0f5c49] underline">{siteConfig.email}</a>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
