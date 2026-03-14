import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.07)' : 'none';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
              <path d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z" fill="white" fillOpacity=".4"/>
            </svg>
          </div>
          <span className="nav-logo-text">SRA <span>Shield</span></span>
        </Link>

        <ul className="nav-links">
          <li><Link href="/how-it-works" className={path === '/how-it-works' ? 'active' : ''}>How it works</Link></li>
          <li><Link href="/use-cases" className={path === '/use-cases' ? 'active' : ''}>Use cases</Link></li>
          <li><Link href="/why-sra-shield" className={path === '/why-sra-shield' ? 'active' : ''}>Why us</Link></li>
          <li><Link href="/about" className={path === '/about' ? 'active' : ''}>About</Link></li>
          <li><Link href="/docs" className={path === '/docs' ? 'active' : ''}>Docs</Link></li>
          <li><Link href="/pricing" className={path === '/pricing' ? 'active' : ''}>Pricing</Link></li>
        </ul>

        <div className="nav-actions">
          <Link href="/login" className="btn btn-md btn-outline">Sign in</Link>
          <Link href="/register" className="btn btn-md btn-dark">
            Get started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 4l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}