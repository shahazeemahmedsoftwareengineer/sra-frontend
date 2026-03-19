import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const NAV = [
  { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
  { id: 'authentication', label: 'Authentication', icon: '🔐' },
  { id: 'key-generation', label: 'Key Generation', icon: '🔑' },
  { id: 'encryption', label: 'Encrypt & Decrypt', icon: '🔒' },
  { id: 'verify', label: 'Verify Proof', icon: '✅' },
  { id: 'entropy', label: 'Entropy Tiers', icon: '⚡' },
  { id: 'errors', label: 'Error Codes', icon: '⚠️' },
  { id: 'sdks', label: 'SDKs & Examples', icon: '📦' },
];

const BASE = 'https://sra-backend-production.up.railway.app/api/v1';

function CodeBlock({ code, lang = 'bash' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(code); } catch { }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ position: 'relative', margin: '14px 0' }}>
      <div style={{
        background: '#0F0F0F', borderRadius: 12, padding: '18px 20px',
        fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 12.5,
        lineHeight: 1.75, color: '#a8e6a3', overflowX: 'auto',
        border: '1px solid rgba(255,255,255,0.07)'
      }}>
        <div style={{ position: 'absolute', top: 10, right: 12 }}>
          <button onClick={copy} style={{
            background: copied ? '#22c55e22' : 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: copied ? '#22c55e' : 'rgba(255,255,255,0.45)',
            borderRadius: 6, padding: '3px 10px', fontSize: 11,
            cursor: 'pointer', fontFamily: 'Manrope,sans-serif', fontWeight: 600
          }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{code}</pre>
      </div>
    </div>
  );
}

function Tag({ children, color = 'purple' }) {
  const colors = {
    purple: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6', border: 'rgba(139,92,246,0.25)' },
    green:  { bg: 'rgba(34,197,94,0.10)',  text: '#16a34a', border: 'rgba(34,197,94,0.25)' },
    orange: { bg: 'rgba(249,115,22,0.10)', text: '#ea580c', border: 'rgba(249,115,22,0.25)' },
    red:    { bg: 'rgba(239,68,68,0.10)',  text: '#dc2626', border: 'rgba(239,68,68,0.25)' },
    blue:   { bg: 'rgba(59,130,246,0.10)', text: '#2563eb', border: 'rgba(59,130,246,0.25)' },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700,
      fontFamily: 'Manrope,sans-serif', letterSpacing: '0.3px'
    }}>{children}</span>
  );
}

function Method({ method }) {
  const colors = { GET: 'green', POST: 'blue', DELETE: 'red', PUT: 'orange' };
  return <Tag color={colors[method] || 'purple'}>{method}</Tag>;
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 80 }}>
      <h2 style={{
        fontFamily: 'Urbanist,sans-serif', fontSize: 22, fontWeight: 800,
        color: '#1a1a2e', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10
      }}>{title}</h2>
      <div style={{ width: 40, height: 3, background: '#8b5cf6', borderRadius: 4, marginBottom: 22 }} />
      {children}
    </section>
  );
}

function EndpointCard({ method, path, desc, auth = true, body, response, params }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1.5px solid #e8e8ef', borderRadius: 14, marginBottom: 12,
      background: '#fff', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', cursor: 'pointer',
          background: open ? '#faf9ff' : '#fff',
          transition: 'background 0.15s'
        }}
      >
        <Method method={method} />
        <code style={{
          fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 13,
          color: '#1a1a2e', fontWeight: 600, flex: 1
        }}>{BASE}{path}</code>
        {auth && (
          <span style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            🔐 Auth
          </span>
        )}
        <span style={{ color: '#9ca3af', fontSize: 16, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </div>
      {open && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid #f0f0f5' }}>
          <p style={{ color: '#6b7280', fontSize: 13.5, margin: '14px 0 10px', lineHeight: 1.6 }}>{desc}</p>

          {params && (
            <>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parameters</p>
              <div style={{ background: '#f8f8fc', borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8ef', marginBottom: 12 }}>
                {params.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 16, padding: '10px 14px',
                    borderBottom: i < params.length - 1 ? '1px solid #e8e8ef' : 'none',
                    alignItems: 'flex-start'
                  }}>
                    <code style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#8b5cf6', minWidth: 120, fontWeight: 600 }}>{p.name}</code>
                    <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 60 }}>{p.type}</span>
                    <span style={{ fontSize: 12.5, color: '#6b7280', flex: 1 }}>{p.desc}</span>
                    {p.required && <Tag color="red">required</Tag>}
                  </div>
                ))}
              </div>
            </>
          )}

          {body && (
            <>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Request Body</p>
              <CodeBlock code={body} />
            </>
          )}
          {response && (
            <>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Response</p>
              <CodeBlock code={response} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState('getting-started');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id) => {
    setActive(id);
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head><title>Documentation — SRA Shield</title></Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#F5F5F7;color:#1a1a2e}
        :root{
          --charcoal:#1a1a2e;--purple:#8b5cf6;--purple-d:#7c3aed;
          --purple-l:rgba(139,92,246,0.08);--border:#e8e8ef;
          --surface:#fff;--gray:#6b7280;--gray2:#9ca3af;
          --green:#16a34a;--red:#dc2626;
        }
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
        .layout{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
        .sidebar{background:var(--charcoal);position:fixed;top:0;left:0;width:240px;height:100vh;display:flex;flex-direction:column;z-index:100;overflow-y:auto}
        .sb-logo{display:flex;align-items:center;gap:10px;padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,.06)}
        .sb-logo-icon{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#8b5cf6,#60A5FA);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sb-logo-text{font-family:'Urbanist',sans-serif;font-size:16px;font-weight:800;color:#fff}
        .sb-nav{padding:16px 12px;flex:1;display:flex;flex-direction:column;gap:2px}
        .sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:13.5px;font-weight:500;color:rgba(255,255,255,.45);cursor:pointer;transition:all .15s;border:none;background:none;width:100%;text-align:left}
        .sb-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.8)}
        .sb-item.on{background:rgba(139,92,246,.18);color:#a78bfa;font-weight:600}
        .sb-back{display:flex;align-items:center;gap:8px;padding:14px 20px;border-top:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.4);font-size:13px;text-decoration:none;transition:color .15s}
        .sb-back:hover{color:rgba(255,255,255,.8)}
        .main{margin-left:240px;padding:40px 56px 80px;max-width:900px}
        .topbar{background:#fff;border-bottom:1.5px solid var(--border);padding:0 56px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;margin-left:240px}
        .badge-online{display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;padding:5px 13px;border-radius:100px;font-size:12px;font-weight:700}
        .dot-green{width:7px;height:7px;background:#22c55e;border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .btn-upgrade{background:#8b5cf6;color:#fff;border:none;border-radius:9px;padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;text-decoration:none;display:inline-block}
        .btn-upgrade:hover{background:#7c3aed}
        .page-header{margin-top:40px;margin-bottom:40px}
        .page-title{font-family:'Urbanist',sans-serif;font-size:32px;font-weight:900;color:#1a1a2e;margin-bottom:8px}
        .page-sub{color:#6b7280;font-size:15px;line-height:1.6}
        .base-url-bar{background:#0F0F0F;border-radius:12px;padding:14px 20px;display:flex;align-items:center;gap:12px;margin-bottom:36px}
        .base-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.8px;flex-shrink:0}
        .base-val{font-family:'SF Mono','Fira Code',monospace;font-size:13px;color:#a8e6a3;flex:1}
        table{width:100%;border-collapse:collapse;margin:12px 0}
        th{text-align:left;padding:10px 14px;background:#f8f8fc;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;border:1px solid #e8e8ef}
        td{padding:10px 14px;font-size:13.5px;color:#374151;border:1px solid #e8e8ef;vertical-align:top}
        td code{background:#f3f4f6;padding:2px 6px;border-radius:5px;font-family:monospace;font-size:12px;color:#7c3aed}
        p.note{background:rgba(139,92,246,0.07);border-left:3px solid #8b5cf6;padding:12px 16px;border-radius:0 8px 8px 0;font-size:13.5px;color:#374151;margin:14px 0;line-height:1.6}
        p.warn{background:rgba(249,115,22,0.08);border-left:3px solid #f97316;padding:12px 16px;border-radius:0 8px 8px 0;font-size:13.5px;color:#374151;margin:14px 0;line-height:1.6}
        .tb-menu-btn{display:none;background:none;border:none;cursor:pointer;padding:8px}
        @media(max-width:900px){
          .layout{grid-template-columns:1fr}
          .sidebar{transform:translateX(-100%);transition:transform .3s}
          .sidebar.open{transform:translateX(0)}
          .main,.topbar{margin-left:0}
          .main{padding:24px 20px 60px}
          .topbar{padding:0 20px}
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
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '0 12px', marginBottom: 6 }}>API Reference</p>
          {NAV.map(n => (
            <button key={n.id} className={`sb-item${active === n.id ? ' on' : ''}`} onClick={() => scrollTo(n.id)}>
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>

        <Link href="/dashboard" className="sb-back">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 4L6 8l4 4"/>
          </svg>
          Back to Dashboard
        </Link>
      </aside>

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="tb-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#1a1a2e" strokeWidth="1.5">
              <path d="M2 4h12M2 8h12M2 12h12"/>
            </svg>
          </button>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>Documentation</span>
          <span style={{ fontSize: 11, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>v1.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="badge-online">
            <div className="dot-green" />
            API Online
          </div>
          <Link href="/pricing" className="btn-upgrade">Upgrade →</Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        <div className="page-header">
          <h1 className="page-title">SRA Shield API</h1>
          <p className="page-sub">Generate military-grade AES-256 encryption keys from real-world entropy — Bitcoin, Ethereum, and seismic data. Every key has a public verifiable proof.</p>
        </div>

        <div className="base-url-bar">
          <span className="base-label">Base URL</span>
          <span className="base-val">{BASE}</span>
        </div>

        {/* GETTING STARTED */}
        <Section id="getting-started" title="🚀 Getting Started">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            SRA Shield provides two services: <strong>Giveaway Platform</strong> (provably fair winner selection) and <strong>Data Protection</strong> (encryption key generation). All requests require a Bearer token obtained from the auth endpoints.
          </p>
          <p className="note">All API responses follow the format: <code style={{background:'#e8e8ef',padding:'2px 6px',borderRadius:4,fontFamily:'monospace',fontSize:12}}>{"{ success, message, data }"}</code></p>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e', margin: '20px 0 8px' }}>Quick Start in 3 steps:</p>
          <CodeBlock code={`# 1. Register
curl -X POST ${BASE}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@company.com","password":"Pass@1234","name":"Your Name"}'

# 2. Login — copy the token
curl -X POST ${BASE}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@company.com","password":"Pass@1234"}'

# 3. Generate your first encryption key
curl -X POST ${BASE}/shield/keys/generate \\
  -H "Authorization: Bearer YOUR_TOKEN"`} />
        </Section>

        {/* AUTHENTICATION */}
        <Section id="authentication" title="🔐 Authentication">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            SRA uses JWT Bearer tokens. Include the token in every request header. Tokens expire after 30 days.
          </p>
          <div style={{ background: '#f8f8fc', border: '1.5px solid #e8e8ef', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontFamily: 'monospace', fontSize: 13 }}>
            <span style={{ color: '#9ca3af' }}>Authorization:</span>{' '}
            <span style={{ color: '#8b5cf6' }}>Bearer</span>{' '}
            <span style={{ color: '#374151' }}>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
          </div>

          <EndpointCard
            method="POST" path="/auth/register" auth={false}
            desc="Create a new SRA account. Returns a JWT token immediately — no email verification required."
            body={`{
  "email": "you@company.com",
  "password": "Pass@1234",
  "name": "Your Name"
}`}
            response={`{
  "success": true,
  "message": "Created successfully",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": 1,
      "email": "you@company.com",
      "name": "Your Name",
      "plan": "free",
      "isActive": true,
      "createdAt": "2026-03-18T10:00:00"
    }
  }
}`}
          />

          <EndpointCard
            method="POST" path="/auth/login" auth={false}
            desc="Login with existing credentials. Returns a fresh JWT token."
            body={`{
  "email": "you@company.com",
  "password": "Pass@1234"
}`}
            response={`{
  "success": true,
  "message": "Success",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "plan": "starter", ... }
  }
}`}
          />

          <EndpointCard
            method="POST" path="/auth/api-key" auth={true}
            desc="Generate a permanent API key for server-to-server integration. Store this securely — it cannot be retrieved again."
            response={`{
  "success": true,
  "message": "API key generated",
  "data": {
    "apiKey": "sra_live_4729184756291847..."
  }
}`}
          />
        </Section>

        {/* KEY GENERATION */}
        <Section id="key-generation" title="🔑 Key Generation">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Generate AES-256 encryption keys derived from real-world entropy sources. Every key comes with a public proof URL anyone can verify.
          </p>
          <p className="warn">⚠️ Save your key immediately. SRA never stores your encryption keys — they are generated and delivered to you only once.</p>

          <EndpointCard
            method="POST" path="/shield/keys/generate"
            desc="Generate a new AES-256-GCM encryption key from the current entropy pool (Bitcoin + Ethereum + Seismic + Server timing). The key is returned once and never stored."
            body={`{
  "tier": "fast"   // "fast" | "medium" | "full"
}`}
            response={`{
  "success": true,
  "data": {
    "encryptionKey": "a053b13d9f2e4c8b1d7a...",
    "proofCode": "SRA-X7K9M2P4",
    "verifyUrl": "https://sra-backend-production.up.railway.app/api/v1/shield/verify/SRA-X7K9M2P4",
    "entropyTier": "fast",
    "sourcesUsed": ["SERVER_TIMING","CRYPTO_PRICE_BINANCE"],
    "createdAt": "2026-03-18T10:00:00"
  }
}`}
          />
        </Section>

        {/* ENCRYPTION */}
        <Section id="encryption" title="🔒 Encrypt & Decrypt">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Encrypt and decrypt data using your active key. SRA uses AES-256-GCM with a random IV per encryption — the same plaintext produces a different ciphertext every time.
          </p>

          <EndpointCard
            method="POST" path="/shield/encrypt"
            desc="Encrypt a string using your active key. Returns a base64 AES-256-GCM ciphertext with embedded IV."
            body={`{
  "plaintext": "Patient: John Doe, Diagnosis: Hypertension"
}`}
            response={`{
  "success": true,
  "data": {
    "encrypted": "gAAAAABpqILQevj_k3Lj4-mt_2mY8FRhn...",
    "algorithm": "AES-256-GCM"
  }
}`}
          />

          <EndpointCard
            method="POST" path="/shield/decrypt"
            desc="Decrypt a previously encrypted string. The correct key must be active in your account."
            body={`{
  "encrypted": "gAAAAABpqILQevj_k3Lj4-mt_2mY8FRhn..."
}`}
            response={`{
  "success": true,
  "data": {
    "plaintext": "Patient: John Doe, Diagnosis: Hypertension"
  }
}`}
          />
        </Section>

        {/* VERIFY */}
        <Section id="verify" title="✅ Verify Proof">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Every key generation and giveaway draw creates a public proof. Anyone — your clients, auditors, regulators — can verify it without an account.
          </p>

          <EndpointCard
            method="GET" path="/shield/verify/{code}" auth={false}
            desc="Publicly verify a key generation proof. No authentication required. Share this URL with anyone who needs to verify your encryption practices."
            params={[{ name: 'code', type: 'string', desc: 'The proof code returned during key generation (e.g. SRA-X7K9M2P4)', required: true }]}
            response={`{
  "success": true,
  "data": {
    "proofCode": "SRA-X7K9M2P4",
    "entropyTier": "full",
    "sourcesUsed": [
      { "name": "SERVER_TIMING", "value": "5298513042300", "collectedAt": "..." },
      { "name": "CRYPTO_PRICE_BINANCE", "value": "BTCUSDT-68069.98", "collectedAt": "..." },
      { "name": "ETHEREUM_BLOCK", "value": "0x8f3a92b1...", "collectedAt": "..." },
      { "name": "USGS_SEISMIC", "value": "SEISMIC-203365855", "collectedAt": "..." }
    ],
    "seed": "1e93829f06eb23f...",
    "verifiedAt": "2026-03-18T10:00:00",
    "isValid": true
  }
}`}
          />

          <EndpointCard
            method="GET" path="/proof/{code}" auth={false}
            desc="Get the public proof for a completed giveaway draw. Shows winner, entropy sources, seed, and calculation details."
            params={[{ name: 'code', type: 'string', desc: 'Giveaway proof code (e.g. CA78A00029C7FDBD)', required: true }]}
            response={`{
  "success": true,
  "data": {
    "giveawayTitle": "iPhone 16 Pro Giveaway",
    "winnerName": "Ahmed Khan",
    "totalParticipants": 500,
    "winnerPosition": 347,
    "seedGenerated": "29ca3c4c5d4ab4...",
    "sourcesUsed": [...],
    "drawnAt": "2026-03-18T10:00:00",
    "verificationCode": "CA78A00029C7FDBD"
  }
}`}
          />
        </Section>

        {/* ENTROPY TIERS */}
        <Section id="entropy" title="⚡ Entropy Tiers">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Choose your entropy tier based on how much proof you need. Higher tiers wait for more real-world data before generating the key.
          </p>
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Time</th>
                <th>Sources Used</th>
                <th>Use Case</th>
                <th>Plans</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>fast</code></td>
                <td>~1 sec</td>
                <td>Server timing + Bitcoin price</td>
                <td>Apps, real-time, gaming</td>
                <td>All plans</td>
              </tr>
              <tr>
                <td><code>medium</code></td>
                <td>~12 sec</td>
                <td>fast + Ethereum block hash</td>
                <td>Raffles, competitions</td>
                <td>Starter + Pro</td>
              </tr>
              <tr>
                <td><code>full</code></td>
                <td>~60 sec</td>
                <td>medium + USGS seismic data</td>
                <td>Banking, legal, compliance</td>
                <td>Pro only</td>
              </tr>
            </tbody>
          </table>
          <p className="note">💡 The seed is a SHA-512 hash of all collected sources combined with an atomic counter and UUID — guaranteed unique even if 1 billion draws happen simultaneously.</p>
        </Section>

        {/* ERRORS */}
        <Section id="errors" title="⚠️ Error Codes">
          <table>
            <thead>
              <tr><th>HTTP Status</th><th>Code</th><th>Meaning</th><th>Fix</th></tr>
            </thead>
            <tbody>
              {[
                ['400', 'Bad Request', 'Missing or invalid field', 'Check request body'],
                ['401', 'Unauthorized', 'Missing or expired token', 'Login again, get fresh token'],
                ['403', 'Forbidden', 'You don\'t own this resource', 'Check you\'re using the right account'],
                ['404', 'Not Found', 'Resource does not exist', 'Check ID/code is correct'],
                ['429', 'Too Many Requests', 'Rate limit hit (5 req/min auth)', 'Wait 60 seconds, then retry'],
                ['500', 'Server Error', 'Unexpected backend error', 'Check Railway logs, retry'],
              ].map(([status, label, meaning, fix]) => (
                <tr key={status}>
                  <td><Tag color={status === '200' ? 'green' : status.startsWith('4') ? 'orange' : 'red'}>{status}</Tag></td>
                  <td><code>{label}</code></td>
                  <td style={{ color: '#6b7280' }}>{meaning}</td>
                  <td style={{ color: '#6b7280' }}>{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 16 }}>All error responses follow:</p>
          <CodeBlock code={`{
  "success": false,
  "message": "Detailed error message here"
}`} />
        </Section>

        {/* SDKs */}
        <Section id="sdks" title="📦 SDKs & Examples">
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Use SRA from any language. Below are ready-to-copy examples.
          </p>

          {[
            { lang: 'JavaScript / Node.js', code: `const SRA_BASE = '${BASE}';
const TOKEN = 'YOUR_TOKEN';

// Generate key
const res = await fetch(\`\${SRA_BASE}/shield/keys/generate\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${TOKEN}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ tier: 'fast' })
});
const { data } = await res.json();
console.log('Key:', data.encryptionKey);
console.log('Verify:', data.verifyUrl);` },

            { lang: 'Python', code: `import requests

BASE = '${BASE}'
TOKEN = 'YOUR_TOKEN'
HEADERS = {'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json'}

# Generate key
r = requests.post(f'{BASE}/shield/keys/generate', 
                  json={'tier': 'fast'}, headers=HEADERS)
data = r.json()['data']
print('Key:', data['encryptionKey'])
print('Verify:', data['verifyUrl'])` },

            { lang: 'Kotlin / Android', code: `val client = OkHttpClient()
val token = "YOUR_TOKEN"

val body = """{"tier": "fast"}""".toRequestBody("application/json".toMediaType())

val request = Request.Builder()
    .url("${BASE}/shield/keys/generate")
    .addHeader("Authorization", "Bearer \$token")
    .post(body)
    .build()

client.newCall(request).execute().use { response ->
    val json = JSONObject(response.body?.string() ?: "")
    val key = json.getJSONObject("data").getString("encryptionKey")
    println("Key: \$key")
}` },

            { lang: 'cURL', code: `# Register
curl -X POST ${BASE}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"dev@company.com","password":"Pass@1234","name":"Dev"}'

# Generate key (replace TOKEN)  
curl -X POST ${BASE}/shield/keys/generate \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"tier":"full"}'

# Verify proof (public — no auth)
curl ${BASE}/shield/verify/SRA-X7K9M2P4` },
          ].map(({ lang, code }) => (
            <div key={lang} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>{lang}</p>
              <CodeBlock code={code} />
            </div>
          ))}
        </Section>

        <div style={{ borderTop: '1.5px solid #e8e8ef', paddingTop: 32, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>SRA Shield API v1.0 · Last updated March 2026</p>
          <Link href="/pricing" className="btn-upgrade">Upgrade Plan →</Link>
        </div>
      </div>
    </>
  );
}