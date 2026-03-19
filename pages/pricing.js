import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ─── Plan config (must match lib/planLimits.ts) ───────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    badge: null,
    color: '#f97316',
    bgLight: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.2)',
    description: 'Get started and test the platform.',
    priceId: null,
    limits: {
      apiCalls: '1,000 / month',
      giveaways: '3 / month',
      entriesPerGiveaway: '50 per giveaway',
      entropy: '2 sources (Server + BTC)',
      entropyTier: 'Fast only',
      proof: 'Public proof page',
      watermark: 'SRA watermark on proof',
      csv: false,
      support: 'Community support',
      keyRotation: false,
      customWatermark: false,
    },
    features: [
      { label: '1,000 API calls / month', ok: true },
      { label: '3 giveaways / month', ok: true },
      { label: '50 entries per giveaway', ok: true },
      { label: '2 entropy sources (BTC + Server)', ok: true },
      { label: 'Public proof page', ok: true },
      { label: 'SRA watermark on proof', ok: false, note: 'cannot remove' },
      { label: 'CSV export', ok: false },
      { label: 'Ethereum blockchain source', ok: false },
      { label: 'USGS seismic source', ok: false },
      { label: 'Key rotation', ok: false },
    ],
    cta: 'Current Plan',
    ctaDisabled: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    badge: 'Most Popular',
    color: '#8b5cf6',
    bgLight: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.25)',
    description: 'For creators and small brands running regular giveaways.',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_starter',
    limits: {
      apiCalls: '50,000 / month',
      giveaways: '10 / month',
      entriesPerGiveaway: '500 per giveaway',
      entropy: '3 sources (+ Ethereum)',
      entropyTier: 'Fast + Medium',
      proof: 'Public proof page',
      watermark: 'No SRA watermark',
      csv: true,
      support: 'Email support',
      keyRotation: false,
      customWatermark: false,
    },
    features: [
      { label: '50,000 API calls / month', ok: true },
      { label: '10 giveaways / month', ok: true },
      { label: '500 entries per giveaway', ok: true },
      { label: '3 entropy sources (+ Ethereum)', ok: true },
      { label: 'Public proof page', ok: true },
      { label: 'No SRA watermark', ok: true },
      { label: 'CSV export', ok: true },
      { label: 'Fast + Medium entropy tiers', ok: true },
      { label: 'USGS seismic source', ok: false },
      { label: 'Custom watermark', ok: false },
    ],
    cta: 'Upgrade to Starter',
    ctaDisabled: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    badge: 'Full Power',
    color: '#10b981',
    bgLight: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.25)',
    description: 'Unlimited everything. All entropy. Custom branding.',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    limits: {
      apiCalls: 'Unlimited',
      giveaways: 'Unlimited',
      entriesPerGiveaway: 'Unlimited',
      entropy: 'All 4 sources',
      entropyTier: 'Fast + Medium + Full',
      proof: 'Public proof page',
      watermark: 'Custom watermark',
      csv: true,
      support: 'Priority support',
      keyRotation: true,
      customWatermark: true,
    },
    features: [
      { label: 'Unlimited API calls', ok: true },
      { label: 'Unlimited giveaways', ok: true },
      { label: 'Unlimited entries', ok: true },
      { label: 'All 4 entropy sources', ok: true },
      { label: 'Fast + Medium + Full tiers', ok: true },
      { label: 'No SRA watermark', ok: true },
      { label: 'Custom watermark (your brand)', ok: true },
      { label: 'CSV export (select all)', ok: true },
      { label: 'Auto key rotation', ok: true },
      { label: 'Priority support', ok: true },
    ],
    cta: 'Upgrade to Pro',
    ctaDisabled: false,
  },
];

function Check({ ok, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: ok ? '#d1fae5' : '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 900,
        color: ok ? '#059669' : '#d1d5db'
      }}>
        {ok ? '✓' : '✗'}
      </span>
      <span style={{ fontSize: 13.5, color: ok ? '#374151' : '#9ca3af', flex: 1, lineHeight: 1.45 }}>
        {note && !ok ? <><s style={{color:'#d1d5db'}}>{note}</s></> : null}
        {!note ? (ok ? <strong style={{fontWeight:600}}>{}</strong> : null) : null}
        {/* just render the label */}
      </span>
    </div>
  );
}

// Simple feature row
function FeatureRow({ label, ok }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: ok ? '#d1fae5' : '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 900, color: ok ? '#059669' : '#9ca3af'
      }}>
        {ok ? '✓' : '✗'}
      </div>
      <span style={{ fontSize: 13.5, color: ok ? '#1f2937' : '#9ca3af', flex: 1, lineHeight: 1.4, fontWeight: ok ? 500 : 400 }}>
        {label}
      </span>
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user email from localStorage
  const email = typeof window !== 'undefined'
    ? (() => { try { return JSON.parse(localStorage.getItem('sra_user') || '{}').email || 'user@example.com'; } catch { return 'user@example.com'; } })()
    : 'user@example.com';

  const currentPlan = typeof window !== 'undefined'
    ? (() => { try { return JSON.parse(localStorage.getItem('sra_user') || '{}').plan || 'free'; } catch { return 'free'; } })()
    : 'free';

  const handleUpgrade = async (plan) => {
    if (!plan.priceId || plan.id === currentPlan) return;
    setLoading(plan.id);
    try {
      const token = localStorage.getItem('sra_token') || '';
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priceId: plan.priceId, email, planName: plan.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Checkout failed. Please try again.');
    } catch (e) {
      alert('Network error. Please try again.');
    }
    setLoading(null);
  };

  return (
    <>
      <Head><title>Upgrade Plan — SRA Shield</title></Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#F5F5F7;color:#1a1a2e}
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@600;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap');
        .layout{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
        .sidebar{background:#1a1a2e;position:fixed;top:0;left:0;width:240px;height:100vh;display:flex;flex-direction:column;z-index:100;overflow-y:auto}
        .sb-logo{display:flex;align-items:center;gap:10px;padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,.06)}
        .sb-logo-icon{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#8b5cf6,#60A5FA);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sb-logo-text{font-family:'Urbanist',sans-serif;font-size:16px;font-weight:800;color:#fff}
        .sb-nav{padding:16px 12px;flex:1;display:flex;flex-direction:column;gap:2px}
        .sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:13.5px;font-weight:500;color:rgba(255,255,255,.45);cursor:pointer;transition:all .15s;border:none;background:none;width:100%;text-align:left;text-decoration:none}
        .sb-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.8)}
        .sb-item.active{background:rgba(139,92,246,.18);color:#a78bfa;font-weight:600}
        .sb-footer{margin-top:auto;padding:14px 12px;border-top:1px solid rgba(255,255,255,.06)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:rgba(255,255,255,.05);margin-bottom:6px}
        .sb-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#60A5FA);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0}
        .sb-uname{font-size:12px;color:rgba(255,255,255,.8);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px}
        .sb-plan-label{font-size:10.5px;color:rgba(255,255,255,.35);text-transform:capitalize}
        .topbar{background:#fff;border-bottom:1.5px solid #e8e8ef;padding:0 40px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;margin-left:240px}
        .main{margin-left:240px;padding:40px 40px 80px}
        .badge-online{display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;padding:5px 13px;border-radius:100px;font-size:12px;font-weight:700}
        .dot-green{width:7px;height:7px;background:#22c55e;border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
        .plan-card{background:#fff;border-radius:20px;padding:28px;border:2px solid #e8e8ef;position:relative;transition:all .2s;display:flex;flex-direction:column}
        .plan-card:hover{box-shadow:0 8px 32px rgba(0,0,0,0.09);transform:translateY(-2px)}
        .plan-card.featured{border-color:#8b5cf6;box-shadow:0 4px 24px rgba(139,92,246,0.12)}
        .plan-card.current-plan{border-color:#e8e8ef}
        .plan-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 14px;border-radius:100px;font-size:11px;font-weight:800;letter-spacing:0.3px}
        .plan-name{font-family:'Urbanist',sans-serif;font-size:22px;font-weight:900;margin-bottom:6px}
        .plan-price{font-family:'Urbanist',sans-serif;font-size:38px;font-weight:900;line-height:1;margin-bottom:4px}
        .plan-period{font-size:13px;color:#9ca3af;font-weight:500}
        .plan-desc{font-size:13px;color:#6b7280;line-height:1.55;margin:14px 0 20px;min-height:36px}
        .plan-divider{height:1px;background:#f0f0f5;margin:16px 0}
        .plan-features{flex:1;margin-bottom:22px}
        .plan-btn{width:100%;padding:12px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;border:none;transition:all .2s;font-family:'Manrope',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px}
        .plan-btn:disabled{opacity:0.55;cursor:not-allowed}
        .compare-table{width:100%;border-collapse:collapse;margin-top:40px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.05);border:1.5px solid #e8e8ef}
        .compare-table th{text-align:center;padding:14px 20px;background:#f8f8fc;font-size:13px;font-weight:700;color:#374151;border-bottom:1.5px solid #e8e8ef}
        .compare-table th:first-child{text-align:left;color:#9ca3af;font-weight:600;font-size:12px}
        .compare-table td{padding:13px 20px;font-size:13.5px;border-bottom:1px solid #f0f0f5;text-align:center;color:#374151}
        .compare-table td:first-child{text-align:left;font-weight:600;color:#6b7280}
        .compare-table tr:last-child td{border-bottom:none}
        .compare-table tr:hover td{background:#faf9ff}
        .ck{color:#059669;font-size:16px;font-weight:900}
        .cx{color:#d1d5db;font-size:16px}
        .faq-item{background:#fff;border:1.5px solid #e8e8ef;border-radius:14px;margin-bottom:10px;overflow:hidden}
        .faq-q{width:100%;text-align:left;padding:16px 20px;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:600;color:#1a1a2e;font-family:'Manrope',sans-serif;transition:background .15s}
        .faq-q:hover{background:#faf9ff}
        .faq-a{padding:0 20px 16px;font-size:13.5px;color:#6b7280;line-height:1.65}
        .tb-menu-btn{display:none;background:none;border:none;cursor:pointer;padding:8px}
        @media(max-width:1100px){.plans-grid{grid-template-columns:1fr 1fr;gap:16px}}
        @media(max-width:900px){
          .layout{grid-template-columns:1fr}
          .sidebar{transform:translateX(-100%);transition:transform .3s}
          .sidebar.open{transform:translateX(0)}
          .main,.topbar{margin-left:0}
          .main{padding:24px 16px 60px}
          .topbar{padding:0 16px}
          .plans-grid{grid-template-columns:1fr}
          .tb-menu-btn{display:block}
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
            </svg>
          </div>
          <span className="sb-logo-text">SRA Shield</span>
        </div>

        <div className="sb-nav">
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '0 12px', marginBottom: 6 }}>Main</p>
          {[
            { href: '/dashboard', label: 'Overview', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="10" y="1" width="5" height="5" rx="1"/><rect x="1" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1"/></svg> },
            { href: '/dashboard', label: 'My Keys',  icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="8" r="4"/><path d="M10 8h5M13 6v4"/></svg> },
            { href: '/dashboard', label: 'Encrypt / Decrypt', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/></svg> },
            { href: '/dashboard', label: 'Activity',  icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1,12 5,7 9,9 15,3"/></svg> },
          ].map(n => (
            <Link key={n.label} href={n.href} className="sb-item">
              {n.icon}{n.label}
            </Link>
          ))}

          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '12px 12px 6px', marginTop: 8 }}>Account</p>
          <Link href="/docs" className="sb-item">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2h8l4 4v8H2z"/><path d="M10 2v4h4"/><path d="M5 9h6M5 11.5h4"/></svg>
            Documentation
          </Link>
          <Link href="/pricing" className="sb-item active">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="4" width="13" height="9" rx="1.5"/><path d="M5 4V3a2 2 0 014 0v1"/><path d="M7 9a1 1 0 100-2 1 1 0 000 2z"/></svg>
            Upgrade Plan
          </Link>
        </div>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{email.charAt(0).toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div className="sb-uname">{email}</div>
              <div className="sb-plan-label">{currentPlan} plan</div>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('sra_token'); localStorage.removeItem('sra_user'); router.push('/login'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10, border: 'none', background: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 13, fontFamily: 'Manrope,sans-serif', width: '100%' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 5l4 3-4 3M14 8H6"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="tb-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#1a1a2e" strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h12"/></svg>
          </button>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>Upgrade Plan</span>
        </div>
        <div className="badge-online">
          <div className="dot-green" />
          API Online
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 8px' }}>
          <h1 style={{ fontFamily: 'Urbanist,sans-serif', fontSize: 30, fontWeight: 900, color: '#1a1a2e', marginBottom: 10 }}>
            Choose your plan
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14.5, lineHeight: 1.65 }}>
            Upgrade anytime. Cancel anytime. All paid plans include a 7-day refund window if you're not satisfied.
          </p>
        </div>

        {/* Current plan banner */}
        {currentPlan !== 'free' && (
          <div style={{
            background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.2)',
            borderRadius: 12, padding: '12px 20px', margin: '24px auto 0', maxWidth: 560,
            display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center'
          }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#7c3aed' }}>
              You're on the <strong style={{ textTransform: 'capitalize' }}>{currentPlan}</strong> plan. Limits reset on the 18th of each month.
            </span>
          </div>
        )}

        {/* PLAN CARDS */}
        <div className="plans-grid">
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.id;
            const isPopular = plan.badge === 'Most Popular';
            return (
              <div
                key={plan.id}
                className={`plan-card${isPopular ? ' featured' : ''}`}
                style={{
                  borderColor: isCurrent ? plan.color : isPopular ? '#8b5cf6' : '#e8e8ef',
                  background: isCurrent ? plan.bgLight : '#fff',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="plan-badge" style={{
                    background: isPopular ? '#8b5cf6' : plan.color,
                    color: '#fff'
                  }}>
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div className="plan-badge" style={{ background: plan.color, color: '#fff' }}>
                    ✓ Current Plan
                  </div>
                )}

                {/* Name + Price */}
                <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                  <span className="plan-price" style={{ color: '#1a1a2e' }}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="plan-period">/month</span>}
                </div>
                <p className="plan-desc">{plan.description}</p>

                {/* Key limits chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {[
                    { label: plan.limits.apiCalls, icon: '⚡' },
                    { label: plan.limits.giveaways, icon: '🎁' },
                    { label: plan.limits.entriesPerGiveaway, icon: '👥' },
                  ].map((chip, i) => (
                    <span key={i} style={{
                      background: plan.bgLight, border: `1px solid ${plan.border}`,
                      color: plan.color, borderRadius: 8, padding: '4px 10px',
                      fontSize: 11.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      {chip.icon} {chip.label}
                    </span>
                  ))}
                </div>

                <div className="plan-divider" />

                {/* Features */}
                <div className="plan-features">
                  {plan.features.map((f, i) => (
                    <FeatureRow key={i} label={f.label} ok={f.ok} />
                  ))}
                </div>

                {/* CTA */}
                <button
                  className="plan-btn"
                  disabled={isCurrent || loading === plan.id}
                  onClick={() => handleUpgrade(plan)}
                  style={{
                    background: isCurrent ? '#f3f4f6' : plan.id === 'pro' ? '#10b981' : plan.id === 'starter' ? '#8b5cf6' : '#f3f4f6',
                    color: isCurrent ? '#9ca3af' : '#fff',
                    boxShadow: (!isCurrent && plan.id !== 'free') ? `0 4px 14px ${plan.color}33` : 'none'
                  }}
                >
                  {loading === plan.id ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Redirecting...
                    </>
                  ) : isCurrent ? '✓ Current Plan' : plan.cta}
                </button>

                {!isCurrent && plan.price > 0 && (
                  <p style={{ textAlign: 'center', fontSize: 11.5, color: '#9ca3af', marginTop: 10 }}>
                    7-day refund · Cancel anytime
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* COMPARISON TABLE */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{ fontFamily: 'Urbanist,sans-serif', fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, textAlign: 'center' }}>
            Full Comparison
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 13.5, textAlign: 'center', marginBottom: 24 }}>Everything, side by side.</p>
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '34%' }}>Feature</th>
                <th style={{ color: '#f97316' }}>Free</th>
                <th style={{ color: '#8b5cf6' }}>⭐ Starter</th>
                <th style={{ color: '#10b981' }}>⚡ Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['API Calls / month', '1,000', '50,000', 'Unlimited'],
                ['Giveaways / month', '3', '10', 'Unlimited'],
                ['Entries per giveaway', '50', '500', 'Unlimited'],
                ['Entropy sources', '2 (BTC + Server)', '3 (+ Ethereum)', '4 (+ Seismic)'],
                ['Entropy tiers', 'Fast only', 'Fast + Medium', 'All tiers'],
                ['Public proof page', '✓', '✓', '✓'],
                ['SRA watermark', 'Always on', 'Removed', 'Removed'],
                ['Custom watermark', '✗', '✗', '✓'],
                ['CSV export', '✗', '✓', '✓'],
                ['Auto key rotation', '✗', '✗', '✓'],
                ['Support', 'Community', 'Email', 'Priority'],
                ['Price', 'Free', '$9 / mo', '$29 / mo'],
              ].map(([feature, free, starter, pro]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  {[free, starter, pro].map((val, i) => (
                    <td key={i}>
                      {val === '✓' ? <span className="ck">✓</span> :
                       val === '✗' ? <span className="cx">—</span> :
                       <span style={{ fontSize: 13, fontWeight: val.includes('Unlimited') || val.includes('Priority') ? 700 : 400, color: val.includes('Unlimited') ? '#059669' : '#374151' }}>{val}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 60, maxWidth: 680, margin: '60px auto 0' }}>
          <h2 style={{ fontFamily: 'Urbanist,sans-serif', fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 24, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          {[
            {
              q: 'Can I cancel my subscription anytime?',
              a: 'Yes. You can cancel from this page or by emailing support. Your plan stays active until the end of the current billing period, then reverts to Free.'
            },
            {
              q: 'What happens when I hit my monthly limit?',
              a: 'API calls stop working until the limit resets on your monthly renewal date. Giveaways created before the limit are not affected — only new ones are blocked.'
            },
            {
              q: 'Is the 7-day refund guaranteed?',
              a: 'Yes. If you upgrade and are not satisfied within 7 days, email us and we will refund 100% — no questions asked.'
            },
            {
              q: 'What is the difference between entropy tiers?',
              a: 'Fast (1 sec) uses Bitcoin + Server timing. Medium (12 sec) adds an Ethereum block hash for blockchain proof. Full (60 sec) adds USGS seismic data for maximum verifiable randomness — best for banking and legal use cases.'
            },
            {
              q: 'Can I switch plans mid-month?',
              a: 'Yes. Upgrading takes effect immediately and Stripe prorates the charge. Downgrading takes effect at the next renewal date.'
            },
          ].map((faq, i) => {
            const [open, setOpen] = useState(false);
            return (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpen(o => !o)}>
                  {faq.q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
                    <path d="M4 6l4 4 4-4"/>
                  </svg>
                </button>
                {open && <div className="faq-a">{faq.a}</div>}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 60, padding: '40px', background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(16,185,129,0.06) 100%)', borderRadius: 20, border: '1.5px solid rgba(139,92,246,0.15)' }}>
          <h3 style={{ fontFamily: 'Urbanist,sans-serif', fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 10 }}>
            Still have questions?
          </h3>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
            Our team responds within 24 hours. Or check the documentation for technical details.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/docs" style={{
              background: '#1a1a2e', color: '#fff', borderRadius: 10,
              padding: '10px 24px', fontWeight: 700, fontSize: 14, textDecoration: 'none'
            }}>
              Read Docs →
            </Link>
            <a href="mailto:support@srashield.com" style={{
              background: '#fff', color: '#8b5cf6', border: '1.5px solid #8b5cf6',
              borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, textDecoration: 'none'
            }}>
              Contact Support
            </a>
          </div>
        </div>

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </>
  );
}