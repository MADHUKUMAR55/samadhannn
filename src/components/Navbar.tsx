import Link from 'next/link';
import { siteConfig } from '../config/site';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  activePage?: 'home' | 'about' | 'contact';
  selectedCategory?: string;
  currentPage?: number;
  searchTerm?: string;
  showSearch?: boolean;
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  const linkClass = (page: string) =>
    activePage === page
      ? 'font-semibold text-[#0f5c49] border-b-2 border-[#e99a2e] pb-1'
      : 'font-semibold text-[#40534d] hover:text-[#0f5c49] transition-colors';

  return (
    <header>
      <nav className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 py-4 border-b border-[#dfd8c9] bg-[#fffdf8] gap-3 md:gap-0" aria-label="Main navigation">
        <div className="flex items-center gap-2 justify-between md:justify-start">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label={`${siteConfig.name} Home`}>
            <BrandLogo />
          </Link>
        </div>
        <div className="flex gap-4 md:gap-8 items-center justify-between md:justify-start" role="navigation">
          <Link href="/" className={linkClass('home')}>Home</Link>
          <Link href="/about" className={linkClass('about')}>About us</Link>
          <Link href="/contact" className={linkClass('contact')}>Contact us</Link>
        </div>
      </nav>
    </header>
  );
}
