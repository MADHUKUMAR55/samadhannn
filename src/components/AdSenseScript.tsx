import Script from 'next/script';

export default function AdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  if (!/^ca-pub-\d+$/.test(publisherId || '')) return null;

  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
