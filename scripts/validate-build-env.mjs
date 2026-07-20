const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT;
const amplifyUrl = process.env.AWS_APP_ID && process.env.AWS_BRANCH
  ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`
  : null;
const siteUrl = (process.env.SITE_URL || amplifyUrl || 'https://main.d3lco4t2dnqd7w.amplifyapp.com').replace(/\/$/, '');

if (!serviceAccountKey) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY is required for the static export build.');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKey);
} catch {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON.');
  process.exit(1);
}

const requiredFields = ['project_id', 'private_key', 'client_email'];
const missingFields = requiredFields.filter(field => !serviceAccount[field]);

if (missingFields.length > 0) {
  console.error(`FIREBASE_SERVICE_ACCOUNT_KEY is missing: ${missingFields.join(', ')}.`);
  process.exit(1);
}

if (typeof serviceAccount.private_key !== 'string' || !serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY private_key is not a valid service account private key.');
  process.exit(1);
}

if (adsensePublisherId && !/^ca-pub-\d+$/.test(adsensePublisherId)) {
  console.warn('NEXT_PUBLIC_ADSENSE_PUB_ID is not a valid AdSense publisher ID, so ads will not render.');
  console.warn('Use a value like ca-pub-1234567890123456 when your AdSense account provides it.');
}

if (/^ca-pub-\d+$/.test(adsensePublisherId || '') && !/^\d+$/.test(adsenseSlot || '')) {
  console.warn('NEXT_PUBLIC_ADSENSE_AD_SLOT is missing or invalid. Manual ad units will stay hidden; Auto ads can still use the publisher script.');
}

try {
  const url = new URL(siteUrl);
  if (url.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS.');
} catch (error) {
  console.error(`Invalid public site URL "${siteUrl}": ${error.message}`);
  process.exit(1);
}

if (!process.env.SITE_URL) {
  console.warn(`SITE_URL is not explicitly configured. Using ${siteUrl}. Set SITE_URL when the custom domain is connected.`);
}

if (!process.env.CONTACT_EMAIL) {
  console.warn('CONTACT_EMAIL is not configured. Confirm that contact@answerlyy.com is a monitored mailbox before AdSense review.');
}

console.log(`Build environment validated for ${siteUrl}.`);
