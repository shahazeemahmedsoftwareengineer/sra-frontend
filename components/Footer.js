import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
              </svg>
            </div>
            <span className="footer-logo-text">SRA Shield</span>
          </Link>
          <p className="footer-tagline">Military-grade encryption as a service. Protect your customers' data with a single API call.</p>
        </div>

        <div>
          <div className="footer-col-title">Product</div>
          <ul className="footer-links">
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/use-cases">Use cases</Link></li>
            <li><Link href="/why-sra-shield">Security</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Developers</div>
          <ul className="footer-links">
            <li><Link href="/docs">Documentation</Link></li>
            <li><Link href="/docs#register">API Reference</Link></li>
            <li><Link href="/docs#js">Code Examples</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 SRA Shield. All rights reserved.</div>
        <div className="footer-badges">
          <span className="footer-badge">AES-256</span>
          <span className="footer-badge">HIPAA Ready</span>
          <span className="footer-badge">99/100 Security</span>
          <span className="footer-badge">99.9% Uptime</span>
        </div>
      </div>
    </footer>
  );
}