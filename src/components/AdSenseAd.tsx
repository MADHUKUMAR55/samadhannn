"use client";
import React, { useEffect, useRef } from 'react';

export default function AdSenseAd({
  slot = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT,
  style = { display: 'block' },
  format = "auto",
  responsive = "true"
}: {
  slot?: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: string;
}) {
  const adRef = useRef<HTMLModElement>(null);
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const hasValidPublisherId = /^ca-pub-\d+$/.test(pubId || '');
  const hasValidSlot = /^\d+$/.test(slot || '');

  useEffect(() => {
    if (!hasValidPublisherId || !hasValidSlot) return;
    try {
      if (adRef.current && adRef.current.children.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense initialization error:', err);
    }
  }, [hasValidPublisherId, hasValidSlot]);

  if (!hasValidPublisherId || !hasValidSlot) return null;

  return (
    <div className="my-8 min-h-[250px] w-full" aria-label="Advertisement">
      <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-gray-400">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ ...style, minHeight: '250px', width: '100%' }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        ref={adRef}
      ></ins>
    </div>
  );
}
