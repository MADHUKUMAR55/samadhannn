import { siteConfig } from '../config/site';

export default function BrandLogo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  const wordmark = inverse ? 'text-[#fffaf0]' : 'text-[#17312a]';
  const subline = inverse ? 'text-[#c9d9d2]' : 'text-[#8a6a37]';

  return (
    <span className="flex items-center gap-3">
      <svg className="h-11 w-11 shrink-0" viewBox="0 0 48 48" role="img" aria-label="Samadhannn logo">
        <rect width="48" height="48" rx="15" fill="#0f5c49" />
        <path
          d="M32.7 14.7c-2.4-1.9-5.6-2.8-8.8-2.4-4.7.5-7.8 3.2-7.8 6.8 0 4 3.5 5.4 8 6.1 4.8.7 7.2 2 7.2 5.2 0 3.4-3.2 5.9-7.6 6.2-3.5.3-7-.9-9.5-3.2"
          fill="none"
          stroke="#fffaf0"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle cx="35.5" cy="11.5" r="4" fill="#e99a2e" />
      </svg>
      {!compact && (
        <span>
          <span className={`font-display block text-2xl font-bold leading-none ${wordmark}`}>{siteConfig.name}</span>
          <span className={`mt-1 block text-[9px] font-bold uppercase tracking-[0.19em] ${subline}`}>
            Answers that move you forward
          </span>
        </span>
      )}
    </span>
  );
}
