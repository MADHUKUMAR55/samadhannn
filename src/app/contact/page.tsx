import { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { siteConfig } from '../../config/site';
import { createPageMetadata } from '../../lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact Us',
  description: `Get in touch with ${siteConfig.name}. Questions, feedback, or partnership inquiries — we'd love to hear from you.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Navbar activePage="contact" showSearch={false} />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="legal-page-card p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Contact Us</h1>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg">We&apos;d love to hear from you! Whether you have a question about our content, want to suggest a topic, report an issue, or explore partnerships — we&apos;re here to help.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f1f7f3] border border-[#dcece5] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#dcece5] p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#0f5c49]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Email Us</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">For general inquiries and feedback:</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-[#0f5c49] font-semibold hover:underline">{siteConfig.email}</a>
                </div>

                <div className="bg-[#fff8e9] border border-[#f4ddb6] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#ffe9c3] p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#a66312]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Response Time</h2>
                  </div>
                  <p className="text-sm text-gray-600">We aim to respond to all inquiries within <strong>24-48 hours</strong> on business days.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3">What can we help with?</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="text-[#e99a2e]">✓</span> Content questions or corrections</li>
                  <li className="flex items-center gap-2"><span className="text-[#e99a2e]">✓</span> Topic suggestions for new articles</li>
                  <li className="flex items-center gap-2"><span className="text-[#e99a2e]">✓</span> Partnership and advertising inquiries</li>
                  <li className="flex items-center gap-2"><span className="text-[#e99a2e]">✓</span> Technical issues with the website</li>
                  <li className="flex items-center gap-2"><span className="text-[#e99a2e]">✓</span> General feedback</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
