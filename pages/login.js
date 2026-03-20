import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://sra-backend-production.up.railway.app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') doLogin();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [email, password]);

  async function doLogin() {
    setError('');
    setSuccess(false);
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.data?.token) {
        localStorage.setItem('sra_token', data.data.token);
        localStorage.setItem('sra_user', JSON.stringify(data.data.user));
        setSuccess(true);
        setTimeout(() => { window.location.href = '/dashboard'; }, 800);
      } else {
        setError(data.message || 'Invalid email or password.');
        setLoading(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign In — SRA Shield</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        body{background:linear-gradient(135deg,var(--lavender) 0%,#fff 50%,var(--peach) 100%);min-height:100vh}
        .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:80px 20px}
        .auth-card{background:#fff;border:1.5px solid var(--border);border-radius:26px;padding:44px;width:100%;max-width:440px;box-shadow:var(--sh-xl)}
        .auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:30px}
        .auth-logo-icon{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#8B5CF6,#1A1A1A);display:flex;align-items:center;justify-content:center}
        .auth-logo-text{font-family:'Urbanist',sans-serif;font-size:18px;font-weight:800;color:var(--charcoal)}
        .auth-logo-text span{color:var(--purple)}
        .auth-title{font-family:'Urbanist',sans-serif;font-size:26px;font-weight:800;color:var(--charcoal);margin-bottom:6px;letter-spacing:-.5px}
        .auth-sub{font-size:14px;color:var(--gray);margin-bottom:28px;line-height:1.5}
        .form-group{margin-bottom:16px}
        label{display:block;font-size:12px;font-weight:700;color:var(--charcoal);margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px}
        .auth-input{width:100%;padding:12px 15px;border:1.5px solid var(--border);border-radius:12px;font-size:14px;font-family:'Manrope',sans-serif;color:var(--charcoal);background:#fff;outline:none;transition:border-color .2s,box-shadow .2s}
        .auth-input:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(139,92,246,.1)}
        .form-footer{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
        .remember{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--gray)}
        .remember input{width:15px;height:15px;accent-color:var(--purple)}
        .forgot{font-size:13px;color:var(--purple);text-decoration:none;font-weight:500}
        .forgot:hover{text-decoration:underline}
        .submit-btn{width:100%;padding:13px;border-radius:100px;background:var(--charcoal);color:#fff;border:none;font-family:'Manrope',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .22s;display:flex;align-items:center;justify-content:center;gap:8px}
        .submit-btn:hover{background:#111;transform:translateY(-1px);box-shadow:0 4px 16px rgba(26,26,26,.2)}
        .submit-btn.loading{opacity:.7;pointer-events:none}
        .divider{display:flex;align-items:center;gap:12px;margin:22px 0;font-size:12.5px;color:var(--gray2)}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
        .auth-switch{text-align:center;font-size:13.5px;color:var(--gray)}
        .auth-switch a{color:var(--purple);font-weight:600;text-decoration:none}
        .auth-switch a:hover{text-decoration:underline}
        .error-msg{background:#FEE2E2;border:1px solid #FECACA;border-radius:10px;padding:11px 14px;font-size:13px;color:#DC2626;margin-bottom:16px}
        .success-msg{background:#D1FAE5;border:1px solid #A7F3D0;border-radius:10px;padding:11px 14px;font-size:13px;color:#059669;margin-bottom:16px}
      `}} />
      
      <div className="auth-wrap">
        <div className="auth-card fade-up">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
              </svg>
            </div>
            <span className="auth-logo-text">SRA <span>Shield</span></span>
          </div>

          <div className="auth-title">Welcome back</div>
          <p className="auth-sub">Sign in to your account to access the dashboard.</p>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">Login successful! Redirecting...</div>}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              className="auth-input"
              type="email"
              id="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="auth-input"
              type="password"
              id="password"
              placeholder="••••••••••"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="form-footer">
            <label className="remember">
              <input type="checkbox" defaultChecked/> Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button className={`submit-btn${loading ? ' loading' : ''}`} onClick={doLogin}>
            {loading ? 'Signing in...' : (
              <>
                Sign in
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>

          <div className="divider">or</div>

          <div className="auth-switch">
            Don't have an account? <Link href="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </>
  );
}