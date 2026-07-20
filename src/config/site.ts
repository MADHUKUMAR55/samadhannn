const amplifyUrl = process.env.AWS_APP_ID && process.env.AWS_BRANCH
  ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`
  : null;

const siteUrl = (process.env.SITE_URL || amplifyUrl || 'https://main.d3lco4t2dnqd7w.amplifyapp.com')
  .replace(/\/$/, '');

// Site configuration - all site-specific values in one place.
export const siteConfig = {
  name: 'Samadhannn',
  domain: new URL(siteUrl).hostname,
  url: siteUrl,
  siteId: process.env.SITE_ID || 'samadhannn', // matches Firestore `site` field
  description: 'Thoughtful, practical guides that turn everyday questions into clear next steps.',
  tagline: 'Clear answers. Practical solutions.',
  email: process.env.CONTACT_EMAIL || 'hello@samadhannn.com',
  editorialTeam: {
    name: 'Samadhannn Editorial Team',
    url: `${siteUrl}/editorial-policy/`,
  },
  defaultImage: `${siteUrl}/og-image.svg`,
  policyLastUpdated: 'July 16, 2026',
  colors: {
    primary: '#0f5c49',
    primaryHover: '#0a4638',
    primaryLight: '#dcece5',
    primaryBg: '#f1f7f3',
  },
  categories: [
    { name: 'Technology', slug: 'technology' },
    { name: 'Health', slug: 'health' },
    { name: 'Business', slug: 'business' },
  ],
  social: {
    xHandle: process.env.NEXT_PUBLIC_X_HANDLE || '',
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  },
};
