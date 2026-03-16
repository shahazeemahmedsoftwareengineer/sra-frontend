import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Pages that use their own full-screen layout (no shared footer)
  const noFooterPages = ['/dashboard'];

  // Auth pages use a special nav (no full nav links)
  const authPages = ['/login', '/register'];

  const isAuthPage = authPages.includes(router.pathname);
  const isNoFooter = noFooterPages.includes(router.pathname);

  if (isAuthPage) {
    return (
      <>
        <AuthNav />
        <Component {...pageProps} />
      </>
    );
  }

  if (isNoFooter) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

// Minimal nav for login/register pages — matches the HTML exactly
function AuthNav() {
  const router = useRouter();
  const isLogin = router.pathname === '/login';
 
  return (
    <nav>
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
            </svg>
          </div>
          <span className="nav-logo-text">SRA <span>Shield</span></span>
        </a>
        <div style={{flex: 1}}></div>
        <div className="nav-actions">
          {isLogin ? (
            <>
              <span style={{fontSize:'13.5px', color:'var(--gray)'}}>No account?</span>
              <a href="/register" className="btn btn-md btn-dark">Sign up free →</a>
            </>
          ) : (
            <>
              <span style={{fontSize:'13.5px', color:'var(--gray)'}}>Have an account?</span>
              <a href="/login" className="btn btn-md btn-outline">Sign in</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}