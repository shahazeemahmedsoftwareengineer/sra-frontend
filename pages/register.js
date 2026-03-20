import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://sra-backend-production.up.railway.app';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'Enter a password', color: 'var(--gray)' });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') doRegister();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [name, email, password, confirm, terms]);

  function checkStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const colors = ['#F87171', '#FB923C', '#FDE047', '#34D399'];
    const labels = ['Too short', 'Weak', 'Good', 'Strong'];
    setStrength({
      score,
      label: pw.length === 0 ? 'Enter a password' : (labels[score - 1] || 'Too short'),
      color: pw.length === 0 ? 'var(--gray)' : (colors[score - 1] || '#F87171')
    });
    setPassword(pw);
  }

  function getBarColor(index) {
    if (strength.score === 0 || index >= strength.score) return 'var(--border)';
    const colors = ['#F87171', '#FB923C', '#FDE047', '#34D399'];
    return colors[strength.score - 1];
  }

  async function doRegister() {
    setError('');
    setSuccess(false);
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain an uppercase letter and a number.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!terms) {
      setError('Please accept the Terms of Service.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
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
        <title>Create Account — SRA Shield</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        body{background:linear-gradient(135deg,var(--peach) 0%,#fff 50%,var(--lavender) 100%);min-height:100vh}
        .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:80px 20px}
        .auth-card{background:#fff;border:1.5px solid var(--border);border-radius:26px;padding:44px;width:100%;max-width:460px;box-shadow:var(--sh-xl)}
        .auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:28px}
        .auth-logo-icon{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#8B5CF6,#1A1A1A);display:flex;align-items:center;justify-content:center}
        .auth-logo-text{font-family:'Urbanist',sans-serif;font-size:18px;font-weight:800;color:var(--charcoal)}
        .auth-logo-text span{color:var(--purple)}
        .auth-title{font-family:'Urbanist',sans-serif;font-size:26px;font-weight:800;color:var(--charcoal);margin-bottom:6px;letter-spacing:-.5px}
        .auth-sub{font-size:14px;color:var(--gray);margin-bottom:26px;line-height:1.5}
        .free-tag{display:inline-flex;align-items:center;gap:6px;background:var(--purple-l);border:1px solid rgba(139,92,246,.2);border-radius:100px;padding:4px 12px;font-size:12px;font-weight:700;color:var(--purple);margin-bottom:22px}
        .form-group{margin-bottom:14px}
        label{display:block;font-size:12px;font-weight:700;color:var(--charcoal);margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px}
        .auth-input{width:100%;padding:12px 15px;border:1.5px solid var(--border);border-radius:12px;font-size:14px;font-family:'Manrope',sans-serif;color:var(--charcoal);background:#fff;outline:none;transition:border-color .2s,box-shadow .2s}
        .auth-input:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(139,92,246,.1)}
        .pw-strength{display:flex;gap:4px;margin-top:7px}
        .ps-bar{flex:1;height:3px;border-radius:100px;transition:background .3s}
        .ps-label{font-size:11px;margin-top:4px}
        .terms-row{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--gray);margin:16px 0}
        .terms-row input{width:15px;height:15px;accent-color:var(--purple);margin-top:1px;flex-shrink:0}
        .terms-row a{color:var(--purple);text-decoration:none}
        .terms-row a:hover{text-decoration:underline}
        .submit-btn{width:100%;padding:13px;border-radius:100px;background:var(--charcoal);color:#fff;border:none;font-family:'Manrope',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .22s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px}
        .submit-btn:hover{background:#111;transform:translateY(-1px);box-shadow:0 4px 16px rgba(26,26,26,.2)}
        .submit-btn.loading{opacity:.7;pointer-events:none}
        .auth-switch{text-align:center;font-size:13.5px;color:var(--gray)}
        .auth-switch a{color:var(--purple);font-weight:600;text-decoration:none}
        .auth-switch a:hover{text-decoration:underline}
        .perks{display:flex;flex-direction:column;gap:7px;margin-bottom:22px}
        .perk{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--charcoal)}
        .perk-icon{width:20px;height:20px;border-radius:6px;background:#D1FAE5;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
        .error-msg{background:#FEE2E2;border:1px solid #FECACA;border-radius:10px;padding:11px 14px;font-size:13px;color:#DC2626;margin-bottom:14px}
        .success-msg{background:#D1FAE5;border:1px solid #A7F3D0;border-radius:10px;padding:11px 14px;font-size:13px;color:#059669;margin-bottom:14px}
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

          <div className="auth-title">Create your account</div>
          <p className="auth-sub">Start protecting your data in under 30 minutes.</p>
          <div className="free-tag">✦ Free to start — no credit card required</div>

          <div className="perks">
            <div className="perk"><div className="perk-icon">✓</div>1,000 free API calls immediately</div>
            <div className="perk"><div className="perk-icon">✓</div>1 encryption key generated for you</div>
            <div className="perk"><div className="perk-icon">✓</div>AES-256-GCM encryption from day one</div>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">Account created! Redirecting to your dashboard...</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              className="auth-input"
              type="text"
              id="name"
              placeholder="Full name"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

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
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              value={password}
              onChange={e => checkStrength(e.target.value)}
            />
            <div className="pw-strength">
              <div className="ps-bar" style={{background: getBarColor(0)}}></div>
              <div className="ps-bar" style={{background: getBarColor(1)}}></div>
              <div className="ps-bar" style={{background: getBarColor(2)}}></div>
              <div className="ps-bar" style={{background: getBarColor(3)}}></div>
            </div>
            <div className="ps-label" style={{color: strength.color}}>{strength.label}</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm password</label>
            <input
              className="auth-input"
              type="password"
              id="confirm"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          <div className="terms-row">
            <input
              type="checkbox"
              id="terms-check"
              checked={terms}
              onChange={e => setTerms(e.target.checked)}
            />
            <span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>
          </div>

          <button className={`submit-btn${loading ? ' loading' : ''}`} onClick={doRegister}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <div className="auth-switch">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>

        </div>
      </div>
    </>
  );
}