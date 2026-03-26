'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://sra-backend-production.up.railway.app';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sra_token');
}
function getUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('sra_user') || 'null'); } catch { return null; }
}

// ── USAGE CARD ───────────────────────────────────────────────────────────────
function UsageCard({ usage }) {
  if (!usage) return null;

  const isUnlimited = usage.callsLimit === -1;
  const pct         = isUnlimited ? 0 : Math.min(100, usage.percentUsed);

  const barColor = usage.warningLevel === 'exceeded' ? '#ef4444'
                 : usage.warningLevel === 'critical'  ? '#f97316'
                 : usage.warningLevel === 'warning'   ? '#eab308'
                 : '#28c76f';

  const planLabel = usage.planName === 'business' ? 'Business'
                  : usage.planName === 'enterprise' ? 'Enterprise'
                  : usage.planName === 'starter' ? 'Starter'
                  : 'Free';

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Today'];
  const maxH = Math.max(...usage.dailyHistory, 1);

  return (
    <div style={{background:'#fff8ec',border:'1px solid #ffe0b2',borderRadius:14,padding:22,boxShadow:'0 1px 6px rgba(255,159,67,.1)',marginBottom:16}}>
      {usage.warningLevel === 'exceeded' && (
        <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>🚨</span>
          <div>
            <div style={{fontWeight:700,color:'#dc2626',fontSize:13}}>Plan limit reached — API calls blocked</div>
            <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>Upgrade immediately to restore service.</div>
          </div>
          <button onClick={()=>document.dispatchEvent(new CustomEvent('sra-upgrade'))} style={{marginLeft:'auto',background:'#dc2626',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Upgrade Now →</button>
        </div>
      )}
      {usage.warningLevel === 'critical' && (
        <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>
            <div style={{fontWeight:700,color:'#ea580c',fontSize:13}}>Only {usage.callsRemaining.toLocaleString()} calls remaining!</div>
            <div style={{color:'#f97316',fontSize:12,marginTop:2}}>Your app will stop working at 100%. Upgrade now.</div>
          </div>
          <button onClick={()=>document.dispatchEvent(new CustomEvent('sra-upgrade'))} style={{marginLeft:'auto',background:'#ea580c',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Upgrade Now →</button>
        </div>
      )}
      {usage.warningLevel === 'warning' && (
        <div style={{background:'#fefce8',border:'1px solid #fef08a',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>⚡</span>
          <div>
            <div style={{fontWeight:700,color:'#ca8a04',fontSize:13}}>80% of plan used</div>
            <div style={{color:'#eab308',fontSize:12,marginTop:2}}>Consider upgrading before you run out.</div>
          </div>
          <button onClick={()=>document.dispatchEvent(new CustomEvent('sra-upgrade'))} style={{marginLeft:'auto',background:'#ca8a04',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Upgrade Plan →</button>
        </div>
      )}

      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18,flexWrap:'wrap',gap:10}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#1a2035'}}>Monthly Usage</div>
          <div style={{fontSize:12,color:'#a0aec0',marginTop:2}}>Resets in {usage.daysUntilReset} days · {usage.resetDate}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{background:'#fff3e0',border:'1px solid #ffe0b2',borderRadius:100,padding:'4px 12px',fontSize:11,fontWeight:700,color:'#ff9f43'}}>
            {planLabel} Plan
          </span>
        </div>
      </div>

      <div style={{marginBottom:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8}}>
          <div style={{fontSize:28,fontWeight:800,color:'#1a2035',letterSpacing:-1,lineHeight:1}}>
            {usage.callsUsed.toLocaleString()}
            <span style={{fontSize:14,fontWeight:500,color:'#a0aec0',marginLeft:6}}>
              / {isUnlimited ? '∞' : usage.callsLimit.toLocaleString()} calls
            </span>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:barColor}}>
            {isUnlimited ? 'Unlimited' : `${pct.toFixed(1)}% used`}
          </div>
        </div>
        <div style={{height:10,background:'#f1f5f9',borderRadius:100,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:100,width:`${isUnlimited ? 0 : pct}%`,background:barColor,transition:'width .6s ease',minWidth: usage.callsUsed > 0 ? 6 : 0}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
          <div style={{fontSize:11,color:'#a0aec0'}}>0</div>
          <div style={{fontSize:11,color:barColor,fontWeight:600}}>
            {isUnlimited ? 'Unlimited' : `${usage.callsRemaining.toLocaleString()} remaining`}
          </div>
          <div style={{fontSize:11,color:'#a0aec0'}}>{isUnlimited ? '∞' : usage.callsLimit.toLocaleString()}</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
        {[
          {label:'Today',      value: usage.todayCalls},
          {label:'This Month', value: usage.callsUsed},
          {label:'Remaining',  value: isUnlimited ? '∞' : usage.callsRemaining},
        ].map((s,i) => (
          <div key={i} style={{background:'#fff',border:'1px solid #ffe0b2',borderRadius:10,padding:'12px 14px',textAlign:'center'}}>
            <div style={{fontSize:20,fontWeight:800,color:'#1a2035',letterSpacing:-0.5}}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
            <div style={{fontSize:11,color:'#a0aec0',marginTop:3,fontWeight:500}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{fontSize:12,fontWeight:600,color:'#4a5568',marginBottom:10}}>Last 7 Days</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:6,height:60}}>
          {usage.dailyHistory.map((v,i) => (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div style={{width:'100%',borderRadius:'4px 4px 0 0',height: v === 0 ? 3 : `${Math.max(8,(v/maxH)*50)}px`,background: i === 6 ? '#ff9f43' : '#ffe0b2',transition:'height .3s ease'}}/>
              <div style={{fontSize:9,color:'#a0aec0',fontWeight:500}}>{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DOCS PANEL — full docs.js content ────────────────────────────────────────
function DocsPanel() {
  const [activeLang, setActiveLang] = useState('js');

  return (
    <div className="fadeUp">
      <style>{`
        .dp-layout{display:grid;grid-template-columns:230px 1fr;gap:0;min-height:600px}
        .dp-sidebar{position:sticky;top:0;background:#fff;border:1px solid #e5e7eb;border-radius:14px 0 0 14px;padding:22px 0;overflow-y:auto;max-height:calc(100vh - 120px)}
        .dp-section{margin-bottom:20px;padding:0 16px}
        .dp-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#9ca3af;margin-bottom:8px}
        .dp-links{display:flex;flex-direction:column;gap:2px}
        .dp-link{display:block;padding:6px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#6b7280;text-decoration:none;transition:all .2s;cursor:pointer}
        .dp-link:hover{background:#f3f4f6;color:#1a1a1a}
        .dp-link.on{background:#ede9fe;color:#8b5cf6;font-weight:600}
        .dp-content{background:#fff;border:1px solid #e5e7eb;border-radius:0 14px 14px 0;border-left:none;padding:36px 40px;overflow-y:auto}
        .dp-doc-section{margin-bottom:56px;padding-bottom:48px;border-bottom:1px solid #e5e7eb}
        .dp-doc-section:last-child{border-bottom:none}
        .dp-endpoint{display:flex;align-items:center;gap:10px;background:#1a1a1a;border-radius:10px;padding:12px 16px;margin:16px 0;font-family:'DM Mono',monospace}
        .dp-ep-method{font-size:10px;font-weight:700;padding:2px 8px;border-radius:5px}
        .dp-ep-post{background:rgba(139,92,246,.2);color:#8b5cf6}
        .dp-ep-get{background:rgba(52,211,153,.2);color:#34d399}
        .dp-ep-path{font-size:12.5px;color:rgba(255,255,255,.7)}
        .dp-ep-copy{margin-left:auto;font-size:11px;color:rgba(255,255,255,.25);cursor:pointer;padding:3px 9px;border-radius:5px;border:1px solid rgba(255,255,255,.1);background:none;font-family:inherit}
        .dp-ep-copy:hover{color:rgba(255,255,255,.6)}
        .dp-param-table{width:100%;border-collapse:collapse;font-size:13px;margin:14px 0}
        .dp-param-table th{text-align:left;padding:9px 13px;background:#f3f4f6;font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.6px}
        .dp-param-table td{padding:10px 13px;border-bottom:1px solid #e5e7eb;vertical-align:top}
        .dp-param-table tr:last-child td{border-bottom:none}
        .dp-p-name{font-family:'DM Mono',monospace;font-size:12px;color:#1a1a1a}
        .dp-p-type{font-size:11px;padding:2px 7px;border-radius:4px;background:#f3f4f6;color:#6b7280;font-family:monospace}
        .dp-p-req{font-size:10.5px;padding:2px 7px;border-radius:100px;background:#fef3c7;color:#d97706;font-weight:600}
        .dp-p-opt{font-size:10.5px;padding:2px 7px;border-radius:100px;background:#f3f4f6;color:#6b7280;font-weight:600}
        .dp-p-desc{color:#6b7280;font-size:12.5px;line-height:1.55}
        .dp-resp-block{background:#0f0f0f;border-radius:12px;overflow:hidden;margin:14px 0}
        .dp-rb-top{background:#1a1a1a;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.05)}
        .dp-rb-dots{display:flex;gap:4px}
        .dp-rb-dots span{width:7px;height:7px;border-radius:50%}
        .dp-rb-dots span:nth-child(1){background:#FF5F57}.dp-rb-dots span:nth-child(2){background:#FFBD2E}.dp-rb-dots span:nth-child(3){background:#28C840}
        .dp-rb-label{font-size:10.5px;color:rgba(255,255,255,.3);font-family:monospace}
        .dp-rb-status{margin-left:auto;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:100px;background:rgba(52,211,153,.12);color:#34d399;font-family:monospace}
        .dp-rb-body{padding:18px}
        .dp-lang-tabs{display:flex;gap:4px;margin-bottom:0}
        .dp-lang-tab{padding:6px 13px;border-radius:7px 7px 0 0;font-size:12px;font-weight:600;color:#6b7280;cursor:pointer;background:#f3f4f6;border:1.5px solid #e5e7eb;border-bottom:none;transition:all .2s}
        .dp-lang-tab.on{background:#0f0f0f;color:rgba(255,255,255,.75);border-color:#0f0f0f}
        .dp-note-box{display:flex;gap:12px;background:#ede9fe;border:1.5px solid rgba(139,92,246,.2);border-radius:10px;padding:14px;margin:14px 0;font-size:13px;color:#1a1a1a;line-height:1.6}
        .dp-warn-box{display:flex;gap:12px;background:#fef3c7;border:1.5px solid #fde68a;border-radius:10px;padding:14px;margin:14px 0;font-size:13px;color:#1a1a1a;line-height:1.6}
        .dp-inline-code{background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px}
        @media(max-width:860px){.dp-layout{grid-template-columns:1fr}.dp-sidebar{display:none}.dp-content{border-radius:14px;border-left:1px solid #e5e7eb}}
      `}</style>

      <div className="dp-layout">
        {/* SIDEBAR */}
        <aside className="dp-sidebar">
          <div className="dp-section">
            <div className="dp-title">Getting Started</div>
            <div className="dp-links">
              <a href="#dp-quickstart" className="dp-link on">Quick Start</a>
              <a href="#dp-auth" className="dp-link">Authentication</a>
              <a href="#dp-base-url" className="dp-link">Base URL</a>
            </div>
          </div>
          <div className="dp-section">
            <div className="dp-title">API Reference</div>
            <div className="dp-links">
              <a href="#dp-register" className="dp-link">Register</a>
              <a href="#dp-login" className="dp-link">Login</a>
              <a href="#dp-generate-key" className="dp-link">Generate Key</a>
              <a href="#dp-encrypt" className="dp-link">Encrypt</a>
              <a href="#dp-decrypt" className="dp-link">Decrypt</a>
            </div>
          </div>
          <div className="dp-section">
            <div className="dp-title">Code Examples</div>
            <div className="dp-links">
              <a href="#dp-code" className="dp-link">JavaScript</a>
              <a href="#dp-code" className="dp-link">Python</a>
              <a href="#dp-code" className="dp-link">PHP</a>
              <a href="#dp-code" className="dp-link">Java</a>
            </div>
          </div>
          <div className="dp-section">
            <div className="dp-title">Errors</div>
            <div className="dp-links">
              <a href="#dp-errors" className="dp-link">Error Codes</a>
              <a href="#dp-rate-limits" className="dp-link">Rate Limits</a>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dp-content">

          <div style={{marginBottom:32}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 13px',borderRadius:100,background:'#ede9fe',border:'1px solid rgba(139,92,246,.2)',fontSize:12,fontWeight:700,color:'#8b5cf6',marginBottom:12}}>📚 API Reference</div>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:32,fontWeight:800,color:'#1a2035',letterSpacing:'-1px',marginBottom:8}}>Documentation</h1>
            <p style={{fontSize:14,color:'#4a5568',lineHeight:1.7}}>Everything you need to integrate SRA Shield into your application. Full REST API, code examples in 4 languages, and a 30-minute quickstart guide.</p>
          </div>

          {/* ── TWO KEYS CALLOUT — most important concept ── */}
          <div style={{background:'#fef9ec',border:'1.5px solid #fde68a',borderRadius:14,padding:'16px 20px',marginBottom:32,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div>
              <div style={{fontSize:11.5,fontWeight:700,color:'#d97706',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8}}>⚡ Read this before integrating — SRA uses two different "keys"</div>
              <div style={{fontSize:13,color:'#92400e',lineHeight:1.7}}>There are <strong>two completely different things</strong> called keys in this system. Confusing them is the #1 developer mistake. They are NOT interchangeable.</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{background:'#fff',border:'1px solid #fde68a',borderRadius:9,padding:'10px 14px'}}>
                <div style={{fontSize:12,fontWeight:700,color:'#0984e3',marginBottom:3}}>1. Bearer Token — proves WHO you are</div>
                <div style={{fontSize:12,color:'#4a5568',lineHeight:1.5}}>From <code style={{background:'#f3f4f6',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:11}}>/auth/login</code> → goes in <code style={{background:'#f3f4f6',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:11}}>Authorization: Bearer …</code> header on every call</div>
              </div>
              <div style={{background:'#fff',border:'1px solid #fde68a',borderRadius:9,padding:'10px 14px'}}>
                <div style={{fontSize:12,fontWeight:700,color:'#6c5ce7',marginBottom:3}}>2. Encryption Key — LOCKS and UNLOCKS your data</div>
                <div style={{fontSize:12,color:'#4a5568',lineHeight:1.5}}>From <code style={{background:'#f3f4f6',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:11}}>/shield/keys/generate</code> → store in <strong>your own</strong> .env — SRA never stores this</div>
              </div>
            </div>
          </div>

          {/* BASE URL */}
          <div className="dp-doc-section" id="dp-base-url">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:10,letterSpacing:'-.2px'}}>Base URL</h2>
            <div className="dp-endpoint">
              <div className="dp-ep-path">https://sra-backend-production.up.railway.app</div>
              <button className="dp-ep-copy" onClick={() => navigator.clipboard.writeText('https://sra-backend-production.up.railway.app')}>copy</button>
            </div>
            <p style={{fontSize:13,color:'#4a5568'}}>All API endpoints are prefixed with <span className="dp-inline-code">/api/v1</span>. All requests and responses use JSON.</p>
          </div>

          {/* QUICKSTART */}
          <div className="dp-doc-section" id="dp-quickstart">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:10,letterSpacing:'-.2px'}}>Quick Start</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:14,lineHeight:1.7}}>Get from zero to encrypted data in 4 steps:</p>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">4-step quickstart</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.9,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`# Step 1 — Register
POST /api/v1/auth/register
{"email":"you@company.com","password":"YourPassword123!"}

# Step 2 — Login to get JWT
POST /api/v1/auth/login
{"email":"you@company.com","password":"YourPassword123!"}
# → save data.token as TOKEN

# Step 3 — Generate key
POST /api/v1/shield/keys/generate  (Bearer TOKEN)
# → save data.encryptionKey

# Step 4 — Encrypt anything
POST /api/v1/shield/encrypt  (Bearer TOKEN)
{"plaintext":"Your sensitive data here"}
# → get data.encrypted → store it safely`}</pre>
              </div>
            </div>
          </div>

          {/* AUTH */}
          <div className="dp-doc-section" id="dp-auth">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:10,letterSpacing:'-.2px'}}>Authentication</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:12,lineHeight:1.7}}>All <span className="dp-inline-code">/shield/*</span> endpoints require a Bearer token in the Authorization header.</p>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">Authorization header</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.8)',margin:0}}>{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</pre>
              </div>
            </div>
            <div className="dp-note-box"><span style={{flexShrink:0,fontSize:16}}>💡</span><div>Tokens are valid for 30 days. Request a new token using your email/password login.</div></div>
          </div>

          {/* REGISTER */}
          <div className="dp-doc-section" id="dp-register">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:4,letterSpacing:'-.2px'}}>Register</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:12}}>Create a new account.</p>
            <div className="dp-endpoint"><div className="dp-ep-method dp-ep-post">POST</div><div className="dp-ep-path">/api/v1/auth/register</div></div>
            <table className="dp-param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="dp-p-name">name</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">Full name</td></tr>
                <tr><td><span className="dp-p-name">email</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">Valid email address</td></tr>
                <tr><td><span className="dp-p-name">password</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">Min 8 chars, 1 uppercase, 1 number</td></tr>
              </tbody>
            </table>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">Response</div><div className="dp-rb-status">201 Created</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.8,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "userId": "uuid-here",
    "email": "you@company.com"
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* LOGIN */}
          <div className="dp-doc-section" id="dp-login">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:4,letterSpacing:'-.2px'}}>Login</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:12}}>Authenticate and receive a JWT token.</p>
            <div className="dp-endpoint"><div className="dp-ep-method dp-ep-post">POST</div><div className="dp-ep-path">/api/v1/auth/login</div></div>
            <table className="dp-param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="dp-p-name">email</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">Registered email address</td></tr>
                <tr><td><span className="dp-p-name">password</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">Account password</td></tr>
              </tbody>
            </table>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">Response</div><div className="dp-rb-status">200 OK</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.8,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "uuid-here",
    "email": "you@company.com"
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* GENERATE KEY */}
          <div className="dp-doc-section" id="dp-generate-key">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:4,letterSpacing:'-.2px'}}>Generate Encryption Key</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:12}}>Generate a new 256-bit encryption key from the multi-source entropy engine.</p>
            <div className="dp-endpoint"><div className="dp-ep-method dp-ep-post">POST</div><div className="dp-ep-path">/api/v1/shield/keys/generate</div></div>
            <p style={{fontSize:13,color:'#4a5568',margin:'8px 0'}}>No body required. Authenticated via Bearer token.</p>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">Response</div><div className="dp-rb-status">200 OK</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.8,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`{
  "status": "success",
  "data": {
    "encryptionKey": "a053b13dfa84f7164da57602c9586b32889185a0...",
    "verificationCode": "SRA-K-KQ4T47M6",
    "verifyUrl": "https://sra.com/shield/verify/SRA-K-KQ4T47M6"
  }
}`}</pre>
              </div>
            </div>
            <div className="dp-warn-box"><span style={{flexShrink:0,fontSize:16}}>⚠️</span><div><strong>Store this key securely.</strong> SRA Shield does not store your encryption key. If you lose it, your encrypted data cannot be recovered.</div></div>
          </div>

          {/* ENCRYPT */}
          <div className="dp-doc-section" id="dp-encrypt">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:4,letterSpacing:'-.2px'}}>Encrypt</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:12}}>Encrypt any plaintext string using AES-256-GCM.</p>
            <div className="dp-endpoint"><div className="dp-ep-method dp-ep-post">POST</div><div className="dp-ep-path">/api/v1/shield/encrypt</div></div>
            <table className="dp-param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="dp-p-name">plaintext</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">The data to encrypt. Any string value.</td></tr>
              </tbody>
            </table>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">Response</div><div className="dp-rb-status">200 OK</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.8,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`{
  "status": "success",
  "data": {
    "encrypted": "SRA_ENC_IjIiOiJlbmMiLCJ0eXAiOiJKV1Qi...",
    "algorithm": "AES-256-GCM"
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* DECRYPT */}
          <div className="dp-doc-section" id="dp-decrypt">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:4,letterSpacing:'-.2px'}}>Decrypt</h2>
            <p style={{fontSize:13,color:'#4a5568',marginBottom:12}}>Decrypt an encrypted SRA Shield string back to plaintext.</p>
            <div className="dp-endpoint"><div className="dp-ep-method dp-ep-post">POST</div><div className="dp-ep-path">/api/v1/shield/decrypt</div></div>
            <table className="dp-param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="dp-p-name">encrypted</span></td><td><span className="dp-p-type">string</span></td><td><span className="dp-p-req">Required</span></td><td className="dp-p-desc">The encrypted string returned from /encrypt</td></tr>
              </tbody>
            </table>
            <div className="dp-resp-block">
              <div className="dp-rb-top"><div className="dp-rb-dots"><span/><span/><span/></div><div className="dp-rb-label">Response</div><div className="dp-rb-status">200 OK</div></div>
              <div className="dp-rb-body">
                <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.8,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`{
  "status": "success",
  "data": {
    "plaintext": "Your sensitive data here",
    "algorithm": "AES-256-GCM",
    "verified": true
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* CODE EXAMPLES */}
          <div className="dp-doc-section" id="dp-code">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:12,letterSpacing:'-.2px'}}>Code Examples</h2>
            <div className="dp-lang-tabs">
              {[['js','JavaScript'],['py','Python'],['php','PHP'],['java','Java']].map(([id,label]) => (
                <div key={id} className={`dp-lang-tab${activeLang===id?' on':''}`} onClick={()=>setActiveLang(id)}>{label}</div>
              ))}
            </div>
            <div className="dp-resp-block" style={{borderRadius:'0 12px 12px 12px',marginTop:0}}>
              <div className="dp-rb-body">
                {activeLang==='js' && <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.9,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`// SRA Shield — Full JavaScript Example
const BASE = 'https://sra-backend-production.up.railway.app/api/v1';

async function sraShield() {
  // 1. Login
  const login = await fetch(\`\${BASE}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'you@company.com', password: 'YourPass123!' })
  });
  const { data: { token } } = await login.json();
  const headers = { Authorization: \`Bearer \${token}\`, 'Content-Type': 'application/json' };

  // 2. Generate key  ⚠️ Save this!
  const keyRes = await fetch(\`\${BASE}/shield/keys/generate\`, { method: 'POST', headers });
  const { data: { encryptionKey } } = await keyRes.json();
  console.log('Key:', encryptionKey);

  // 3. Encrypt
  const encRes = await fetch(\`\${BASE}/shield/encrypt\`, {
    method: 'POST', headers,
    body: JSON.stringify({ plaintext: 'Patient: John Doe, DOB: 1985-03-12' })
  });
  const { data: { encrypted } } = await encRes.json();

  // 4. Decrypt
  const decRes = await fetch(\`\${BASE}/shield/decrypt\`, {
    method: 'POST', headers,
    body: JSON.stringify({ encrypted })
  });
  const { data: { plaintext } } = await decRes.json();
  console.log('Decrypted:', plaintext);
}`}</pre>}
                {activeLang==='py' && <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.9,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`# SRA Shield — Full Python Example
import requests

BASE = 'https://sra-backend-production.up.railway.app/api/v1'

# 1. Login
r = requests.post(f'{BASE}/auth/login',
    json={'email': 'you@company.com', 'password': 'YourPass123!'})
token = r.json()['data']['token']
headers = {'Authorization': f'Bearer {token}'}

# 2. Generate key  ⚠️ Save this!
key_res = requests.post(f'{BASE}/shield/keys/generate', headers=headers)
encryption_key = key_res.json()['data']['encryptionKey']
print(f'Key: {encryption_key}')

# 3. Encrypt
enc = requests.post(f'{BASE}/shield/encrypt', headers=headers,
    json={'plaintext': 'Patient: John Doe, DOB: 1985-03-12'})
encrypted = enc.json()['data']['encrypted']

# 4. Decrypt
dec = requests.post(f'{BASE}/shield/decrypt', headers=headers,
    json={'encrypted': encrypted})
print(dec.json()['data']['plaintext'])`}</pre>}
                {activeLang==='php' && <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.9,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`<?php // SRA Shield — PHP Example
$BASE = 'https://sra-backend-production.up.railway.app/api/v1';

function sra_post($path, $data, $token = null) {
    $ch = curl_init($GLOBALS['BASE'] . $path);
    $headers = ['Content-Type: application/json'];
    if ($token) $headers[] = 'Authorization: Bearer ' . $token;
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => $headers]);
    return json_decode(curl_exec($ch), true);
}

// 1. Login
$login = sra_post('/auth/login', ['email'=> 'you@company.com','password'=> 'YourPass123!']);
$token = $login['data']['token'];

// 2. Generate key  ⚠️ Save this!
$key = sra_post('/shield/keys/generate', [], $token);
$encryptionKey = $key['data']['encryptionKey'];

// 3. Encrypt
$enc = sra_post('/shield/encrypt', ['plaintext'=> 'Patient: John Doe'], $token);
$encrypted = $enc['data']['encrypted'];

// 4. Decrypt
$dec = sra_post('/shield/decrypt', ['encrypted'=> $encrypted], $token);
echo $dec['data']['plaintext'];`}</pre>}
                {activeLang==='java' && <pre style={{fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.9,color:'rgba(255,255,255,.8)',margin:0,whiteSpace:'pre-wrap'}}>{`// SRA Shield — Java Example (java.net.http)
import java.net.http.*;
import java.net.URI;

String BASE = "https://sra-backend-production.up.railway.app/api/v1";
var client = HttpClient.newHttpClient();

// 1. Login
var loginReq = HttpRequest.newBuilder()
    .uri(URI.create(BASE + "/auth/login"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"email\":\"you@company.com\",\"password\":\"YourPass123!\"}"))
    .build();
var loginBody = client.send(loginReq, HttpResponse.BodyHandlers.ofString()).body();
// parse JSON to get token...

// 2. Encrypt (with token)
var encReq = HttpRequest.newBuilder()
    .uri(URI.create(BASE + "/shield/encrypt"))
    .header("Authorization", "Bearer " + token)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"plaintext\":\"Patient: John Doe\"}"))
    .build();
var encrypted = client.send(encReq, HttpResponse.BodyHandlers.ofString()).body();`}</pre>}
              </div>
            </div>
          </div>

          {/* ERROR CODES */}
          <div className="dp-doc-section" id="dp-errors">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:12,letterSpacing:'-.2px'}}>Error Codes</h2>
            <table className="dp-param-table">
              <thead><tr><th>Code</th><th>Meaning</th><th>Resolution</th></tr></thead>
              <tbody>
                <tr><td><span className="dp-p-name">400</span></td><td className="dp-p-desc">Bad Request — missing or invalid fields</td><td className="dp-p-desc">Check request body matches schema</td></tr>
                <tr><td><span className="dp-p-name">401</span></td><td className="dp-p-desc">Unauthorized — missing or invalid token</td><td className="dp-p-desc">Re-login to get a fresh JWT</td></tr>
                <tr><td><span className="dp-p-name">403</span></td><td className="dp-p-desc">Forbidden — insufficient permissions</td><td className="dp-p-desc">Use correct account credentials</td></tr>
                <tr><td><span className="dp-p-name">429</span></td><td className="dp-p-desc">Rate limit exceeded</td><td className="dp-p-desc">Slow down requests; see rate limits below</td></tr>
                <tr><td><span className="dp-p-name">500</span></td><td className="dp-p-desc">Internal server error</td><td className="dp-p-desc">Retry; contact support if persists</td></tr>
              </tbody>
            </table>
          </div>

          {/* RATE LIMITS */}
          <div className="dp-doc-section" id="dp-rate-limits">
            <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:'#1a2035',marginBottom:12,letterSpacing:'-.2px'}}>Rate Limits</h2>
            <table className="dp-param-table">
              <thead><tr><th>Plan</th><th>Requests/minute</th><th>Requests/month</th></tr></thead>
              <tbody>
                <tr><td className="dp-p-desc">Starter (Free)</td><td className="dp-p-desc">60</td><td className="dp-p-desc">1,000</td></tr>
                <tr><td className="dp-p-desc">Business</td><td className="dp-p-desc">300</td><td className="dp-p-desc">100,000</td></tr>
                <tr><td className="dp-p-desc">Enterprise</td><td className="dp-p-desc">Unlimited</td><td className="dp-p-desc">Unlimited</td></tr>
              </tbody>
            </table>
            <div className="dp-note-box"><span style={{flexShrink:0,fontSize:16}}>💡</span><div>Rate limit headers are included in every response: <span className="dp-inline-code">X-RateLimit-Limit</span>, <span className="dp-inline-code">X-RateLimit-Remaining</span>, and <span className="dp-inline-code">X-RateLimit-Reset</span>.</div></div>
          </div>

        </main>
      </div>
    </div>
  );
}

// ── UPGRADE PANEL — full pricing.js content ───────────────────────────────────
function UpgradePanel({ userPlan }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="fadeUp">
      <style>{`
        .up-toggle-wrap{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:40px}
        .up-toggle-label{font-size:14px;font-weight:600;color:#a0aec0}
        .up-toggle-label.on{color:#1a2035}
        .up-toggle{width:46px;height:25px;border-radius:100px;background:#1a2035;position:relative;cursor:pointer;transition:background .2s;border:none;outline:none}
        .up-toggle-knob{position:absolute;top:3px;left:3px;width:19px;height:19px;border-radius:50%;background:#fff;transition:transform .2s;pointer-events:none}
        .up-toggle.annual .up-toggle-knob{transform:translateX(21px)}
        .up-save-tag{background:#ede9fe;color:#8b5cf6;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px}
        .up-price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:48px}
        .up-pc{background:#fff;border:1.5px solid #e5e7eb;border-radius:22px;padding:28px;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all .3s;position:relative;display:flex;flex-direction:column}
        .up-pc:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
        .up-pc.feat{background:#1a2035;border-color:transparent;box-shadow:0 8px 28px rgba(26,32,53,.2)}
        .up-feat-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);white-space:nowrap;background:linear-gradient(135deg,#8b5cf6,#60a5fa);color:#fff;font-size:10.5px;font-weight:700;padding:4px 14px;border-radius:100px}
        .up-pn{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#a0aec0;margin-bottom:14px}
        .up-pc.feat .up-pn{color:rgba(255,255,255,.4)}
        .up-pr{display:flex;align-items:baseline;gap:2px;margin-bottom:4px}
        .up-pa{font-family:'DM Sans',sans-serif;font-size:44px;font-weight:900;color:#1a2035;letter-spacing:-2px;line-height:1}
        .up-pc.feat .up-pa{color:#fff}
        .up-pper{font-size:13px;color:#a0aec0}
        .up-pc.feat .up-pper{color:rgba(255,255,255,.35)}
        .up-pd{font-size:13px;color:#6b7280;margin:10px 0 20px;line-height:1.6}
        .up-pc.feat .up-pd{color:rgba(255,255,255,.45)}
        .up-pb{width:100%;padding:12px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:700;cursor:pointer;transition:all .22s;border:none}
        .up-pb.dark{background:#1a2035;color:#fff}.up-pb.dark:hover{background:#111}
        .up-pb.wh{background:#fff;color:#1a2035}.up-pb.wh:hover{background:#f5f5f5}
        .up-pb.ol{background:transparent;color:#1a2035;border:1.5px solid #e5e7eb}.up-pb.ol:hover{border-color:#1a2035}
        .up-pdiv{height:1px;background:#e5e7eb;margin:20px 0}.up-pc.feat .up-pdiv{background:rgba(255,255,255,.08)}
        .up-pf{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#1a2035;padding:10px 0;border-bottom:1px solid #e5e7eb}
        .up-pf:last-child{border-bottom:none}
        .up-pc.feat .up-pf{color:rgba(255,255,255,.7);border-color:rgba(255,255,255,.07)}
        .up-pfck{width:18px;height:18px;border-radius:5px;background:#d1fae5;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;margin-top:1px}
        .up-pc.feat .up-pfck{background:rgba(139,92,246,.25)}
        .up-pfx{width:18px;height:18px;border-radius:5px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;margin-top:1px;color:#d1d5db}
        .up-compare{background:#fff;border:1.5px solid #e5e7eb;border-radius:18px;overflow:hidden;margin-bottom:48px}
        .up-cf-head{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;padding:14px 22px;background:#f9fafb;border-bottom:1px solid #e5e7eb}
        .up-cfh{font-size:11px;font-weight:700;color:#a0aec0;text-align:center;text-transform:uppercase;letter-spacing:.6px}
        .up-cfh:first-child{text-align:left}
        .up-cfh.hl{color:#1a2035}
        .up-cf-row{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;padding:12px 22px;border-bottom:1px solid #e5e7eb;transition:background .15s}
        .up-cf-row:last-child{border-bottom:none}.up-cf-row:hover{background:#f9fafb}
        .up-cf-feat{font-size:13px;color:#1a2035;font-weight:500}
        .up-cf-val{text-align:center;font-size:13px;font-weight:600;color:#a0aec0}
        .up-cf-val.y{color:#28c76f}.up-cf-val.n{color:rgba(200,200,200,.6)}
        .up-cf-group{padding:10px 22px;background:#f3f4f6;border-bottom:1px solid #e5e7eb}
        .up-cfg-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af}
        .up-faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:32px}
        .up-faq-item{background:#fff;border:1.5px solid #e5e7eb;border-radius:14px;padding:20px}
        .up-fq{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;color:#1a2035;margin-bottom:7px}
        .up-fa{font-size:12.5px;color:#6b7280;line-height:1.65}
        @media(max-width:860px){.up-price-grid,.up-faq-grid{grid-template-columns:1fr}.up-cf-head,.up-cf-row{grid-template-columns:2fr 1fr 1fr}}
      `}</style>

      {/* Header */}
      <div style={{textAlign:'center',marginBottom:24}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:100,padding:'6px 16px',fontSize:12,fontWeight:700,color:'#6c5ce7',marginBottom:14}}>
          ⚡ Upgrade Your Plan
        </div>
        <div style={{fontSize:28,fontWeight:800,color:'#1a2035',letterSpacing:'-1px',marginBottom:8}}>Start free. Scale without surprises.</div>
        <p style={{fontSize:14,color:'#a0aec0',maxWidth:460,margin:'0 auto',lineHeight:1.6}}>No hidden fees. No per-request traps. Simple, flat monthly pricing. <strong style={{color:'#1a2035'}}>Don't trust us — verify us.</strong></p>
      </div>

      {/* Payment notice */}
      <div style={{background:'#fff7ed',border:'1.5px solid #fed7aa',borderRadius:14,padding:'14px 20px',marginBottom:28,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
        <span style={{fontSize:22,flexShrink:0}}>💳</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:'#c2410c',marginBottom:3}}>Online checkout coming soon</div>
          <div style={{fontSize:12.5,color:'#9a3412',lineHeight:1.6}}>
            To upgrade right now, click <strong>"Upgrade to Business →"</strong> below — it opens a pre-filled email to our team.
            We'll manually activate your plan within <strong>2 hours</strong> and send a payment link. Enterprise? Contact us directly.
          </div>
        </div>
        <button onClick={()=>window.open('mailto:hello@srashield.com?subject=Upgrade%20to%20Business%20Plan&body=Hi%20SRA%20Shield%20team%2C%0A%0AI%20want%20to%20upgrade%20to%20Business%20plan%20(%2449%2Fmonth).%0A%0AAccount%20email%3A%20%5Byour%20registered%20email%5D%0A%0APlease%20send%20me%20the%20payment%20link.%0A%0AThank%20you.')}
          style={{background:'#ea580c',color:'#fff',border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
          Email Us to Upgrade →
        </button>
      </div>

      {/* Toggle */}
      <div className="up-toggle-wrap">
        <span className={`up-toggle-label${!annual?' on':''}`}>Monthly</span>
        <button className={`up-toggle${annual?' annual':''}`} onClick={()=>setAnnual(!annual)}>
          <div className="up-toggle-knob"/>
        </button>
        <span className={`up-toggle-label${annual?' on':''}`}>Annual</span>
        <span className="up-save-tag">Save 20%</span>
      </div>

      {/* Pricing cards */}
      <div className="up-price-grid">
        {/* Starter */}
        <div className="up-pc">
          <div className="up-pn">Starter</div>
          <div className="up-pr"><div className="up-pa">$0</div><div className="up-pper">/month</div></div>
          <p className="up-pd">For developers building and testing their integration.</p>
          <button className="up-pb ol" style={{cursor:'default',opacity:.7}} disabled>✓ Your Current Plan</button>
          <div className="up-pdiv"/>
          <div>
            {['1,000 API calls / month','1 encryption key','AES-256-GCM encryption','Full API access','Community support'].map(f=>(
              <div key={f} className="up-pf"><div className="up-pfck">✓</div><span>{f}</span></div>
            ))}
            {['Usage analytics','Priority support'].map(f=>(
              <div key={f} className="up-pf"><div className="up-pfx">×</div><span style={{color:'#a0aec0'}}>{f}</span></div>
            ))}
          </div>
        </div>

        {/* Business — featured */}
        <div className="up-pc feat">
          <div className="up-feat-badge">✦ Most Popular</div>
          <div className="up-pn">Business</div>
          <div className="up-pr"><div className="up-pa">{annual?'$39':'$49'}</div><div className="up-pper">/month</div></div>
          <p className="up-pd">Everything a growing team needs to ship securely.</p>
          <button className="up-pb wh" onClick={()=>window.open('mailto:hello@srashield.com?subject=Upgrade%20to%20Business%20Plan&body=Hi%20SRA%20Shield%20team%2C%0A%0AI%20would%20like%20to%20upgrade%20my%20account%20to%20the%20Business%20plan%20(%2449%2Fmonth).%0A%0AAccount%20email%3A%20%5Byour%20email%5D%0A%0APlease%20send%20me%20the%20payment%20link.%0A%0AThank%20you.')}>Upgrade to Business →</button>
          <div className="up-pdiv"/>
          <div>
            {['100,000 API calls / month','10 encryption keys','AES-256-GCM encryption','Usage analytics dashboard','Email support (24h SLA)','99.9% uptime SLA','Security compliance docs'].map(f=>(
              <div key={f} className="up-pf"><div className="up-pfck">✓</div><span>{f}</span></div>
            ))}
          </div>
        </div>

        {/* Enterprise */}
        <div className="up-pc">
          <div className="up-pn">Enterprise</div>
          <div className="up-pr"><div className="up-pa" style={{fontSize:'30px',letterSpacing:'-1px'}}>Custom</div></div>
          <p className="up-pd">For organizations with specific compliance, scale, or SLA requirements.</p>
          <button className="up-pb dark" onClick={()=>window.open('mailto:hello@srashield.com')}>Contact us</button>
          <div className="up-pdiv"/>
          <div>
            {['Unlimited API calls','Unlimited keys','Dedicated support manager','Custom SLA + uptime guarantee','Full pen test security report','Private deployment option','Invoice billing'].map(f=>(
              <div key={f} className="up-pf"><div className="up-pfck">✓</div><span>{f}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Compare table */}
      <div style={{textAlign:'center',marginBottom:20}}>
        <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:800,color:'#1a2035',letterSpacing:'-.5px'}}>Compare all plans</h2>
      </div>
      <div className="up-compare">
        <div className="up-cf-head">
          <div className="up-cfh">Feature</div>
          <div className="up-cfh">Starter</div>
          <div className="up-cfh hl">Business</div>
          <div className="up-cfh">Enterprise</div>
        </div>
        <div className="up-cf-group"><div className="up-cfg-label">Usage</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">API calls / month</div><div className="up-cf-val">1,000</div><div className="up-cf-val y">100,000</div><div className="up-cf-val">Unlimited</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Encryption keys</div><div className="up-cf-val">1</div><div className="up-cf-val y">10</div><div className="up-cf-val">Unlimited</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Requests per minute</div><div className="up-cf-val">60</div><div className="up-cf-val y">300</div><div className="up-cf-val">Unlimited</div></div>
        <div className="up-cf-group"><div className="up-cfg-label">Security</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">AES-256-GCM Encryption</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Multi-source entropy keys</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Zero-knowledge architecture</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Pen test security report</div><div className="up-cf-val n">—</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-group"><div className="up-cfg-label">Support</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Community support</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Email support (24h SLA)</div><div className="up-cf-val n">—</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Dedicated support manager</div><div className="up-cf-val n">—</div><div className="up-cf-val n">—</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-group"><div className="up-cfg-label">Compliance</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">HIPAA compliance docs</div><div className="up-cf-val n">—</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">99.9% uptime SLA</div><div className="up-cf-val n">—</div><div className="up-cf-val y">✓</div><div className="up-cf-val y">✓</div></div>
        <div className="up-cf-row"><div className="up-cf-feat">Invoice billing</div><div className="up-cf-val n">—</div><div className="up-cf-val n">—</div><div className="up-cf-val y">✓</div></div>
      </div>

      {/* FAQ */}
      <div style={{textAlign:'center',marginBottom:8}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 13px',borderRadius:100,background:'#ede9fe',border:'1px solid rgba(139,92,246,.2)',fontSize:12,fontWeight:700,color:'#8b5cf6',marginBottom:10}}>❓ FAQ</div>
        <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:800,color:'#1a2035',letterSpacing:'-.5px'}}>Common questions</h2>
      </div>
      <div className="up-faq-grid">
        {[
          ['Do I need a credit card to start?','No. The Starter plan is completely free with no credit card required. Upgrade only when you need more calls.'],
          ['What happens if I exceed my plan limits?','API calls return a 429 error after the limit. We\'ll email you before you hit the limit so you can upgrade without interruption.'],
          ['Can I cancel anytime?','Yes. No long-term contracts. Cancel or downgrade from your account settings. You keep access until the end of your billing period.'],
          ['Is my data stored on SRA Shield servers?','Never. Your plaintext is processed in memory and immediately discarded. We cannot access your data — zero-knowledge by design.'],
          ['Does pricing include VAT/GST?','Prices shown are exclusive of taxes. Applicable VAT/GST will be calculated at checkout based on your billing address.'],
          ['Is there a discount for annual billing?','Yes. Annual billing saves you 20% — equivalent to getting 2.4 months free compared to monthly billing.'],
        ].map(([q,a])=>(
          <div key={q} className="up-faq-item">
            <div className="up-fq">{q}</div>
            <div className="up-fa">{a}</div>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{marginTop:32,background:'#1a2035',borderRadius:16,padding:'24px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:4}}>Need Enterprise or a custom quote?</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.45)'}}>Talk to us directly and we'll build a plan that fits.</div>
        </div>
        <button onClick={()=>window.open('mailto:hello@srashield.com')} style={{background:'linear-gradient(135deg,#6c5ce7,#4338ca)',color:'#fff',border:'none',borderRadius:10,padding:'11px 22px',fontSize:13.5,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 14px rgba(108,92,231,.35)',whiteSpace:'nowrap'}}>
          Contact Sales →
        </button>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser]             = useState(null);
  const [mounted, setMounted]       = useState(false);
  const [activeNav, setActiveNav]   = useState('overview');
  const [keys, setKeys]             = useState([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [encInput, setEncInput]     = useState('');
  const [decInput, setDecInput]     = useState('');
  const [encResult, setEncResult]   = useState('');
  const [decResult, setDecResult]   = useState('');
  const [encLoading, setEncLoading] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [copied, setCopied]         = useState(null);
  const [usage, setUsage]               = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [activity, setActivity]         = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setMounted(true);
    fetchUsage();
    fetchActivity();
    fetchKeys();
    // Allow UsageCard banners to trigger upgrade nav
    const handler = () => setActiveNav('upgrade');
    document.addEventListener('sra-upgrade', handler);
    return () => document.removeEventListener('sra-upgrade', handler);
  }, []);

  const fetchKeys = async () => {
    setKeysLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/shield/keys/audit`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data?.data?.keys) {
        setKeys(data.data.keys.map((k, i) => ({
          id:      k.id,
          label:   `Key ${i + 1}`,
          status:  'Active',
          created: k.createdAt
            ? new Date(k.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Unknown',
          value:   '',   // zero-knowledge: backend never returns actual key after generation
          code:    k.verificationCode || '',
        })));
      }
    } catch (e) { console.error(e); }
    setKeysLoading(false);
  };

  const fetchUsage = async () => {
    setUsageLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/shield/usage`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data?.data) setUsage(data.data);
    } catch (e) { console.error(e); }
    setUsageLoading(false);
  };

  const fetchActivity = async () => {
    setActivityLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/shield/activity`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data?.data) setActivity(data.data);
    } catch (e) { console.error(e); }
    setActivityLoading(false);
  };

  if (!mounted) return null;

  const handleGenKey = async () => {
    setGenLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/shield/keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ tier: 'fast' }),
      });
      const data = await res.json();
      const key  = data?.data?.encryptionKey || data?.encryptionKey || '';
      const code = data?.data?.verificationCode || data?.verificationCode || '';
      if (key) {
        // Show the new key value temporarily (only time it's ever visible — zero knowledge)
        // Then refresh the full list from backend so it persists correctly
        setKeys(prev => {
          const newIndex = prev.length + 1;
          return [...prev, {
            id:      Date.now(),
            label:   `Key ${newIndex}`,
            status:  'Active',
            created: 'Today',
            value:   key,   // shown ONCE right now — user must copy immediately
            code,
            isNew:   true,  // flag to show "copy now" warning
          }];
        });
        await fetchUsage();
        await fetchActivity();
        // Refresh keys list from backend after 3 seconds
        // (keeps new key visible with value for 3s, then replaces with backend list)
        setTimeout(() => fetchKeys(), 3000);
      } else {
        alert('Key generation failed. Please try again.');
      }
    } catch (e) { console.error(e); }
    setGenLoading(false);
  };

  const handleEncrypt = async () => {
    if (!encInput.trim()) return;
    setEncLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/shield/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ plaintext: encInput }),
      });
      const data = await res.json();
      setEncResult(data?.data?.encrypted || data?.encrypted || 'Encryption failed');
      await fetchUsage();
      await fetchActivity();
    } catch { setEncResult('Error — check connection'); }
    setEncLoading(false);
  };

  const handleDecrypt = async () => {
    if (!decInput.trim()) return;
    setDecLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/shield/decrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ encrypted: decInput }),
      });
      const data = await res.json();
      setDecResult(data?.data?.plaintext || data?.plaintext || 'Decryption failed');
      await fetchUsage();
      await fetchActivity();
    } catch { setDecResult('Error — check connection'); }
    setDecLoading(false);
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const signOut = () => { localStorage.clear(); window.location.href = '/login'; };

  const userName  = user?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userPlan  = user?.plan  || 'Starter';

  const navMain = [
    { id: 'overview', icon: '▦', label: 'Overview' },
    { id: 'keys',     icon: '⚿', label: 'Enc. Keys' },
    { id: 'encrypt',  icon: '⊕', label: 'Encrypt / Decrypt' },
    { id: 'activity', icon: '↗', label: 'Activity' },
  ];
  const navAccount = [
    { id: 'docs',    icon: '☰', label: 'Documentation' },
    { id: 'upgrade', icon: '↑', label: 'Upgrade Plan'  },
  ];
  const allNav = [...navMain, ...navAccount];

  const C = {
    sidebarBg:'#1a2035', sidebarBorder:'#243050',
    navActive:'#2d3f6e', navActiveTxt:'#6c9bff', navTxt:'#8896b3',
    pageBg:'#f4f6fb', cardBg:'#fff8ec', cardBorder:'#ffe0b2',
    cardShadow:'0 1px 6px rgba(255,159,67,.1)',
    titleTxt:'#1a2035', bodyTxt:'#4a5568', mutedTxt:'#a0aec0',
    purple:'#6c5ce7', purpleLight:'#f0eeff', purpleBorder:'#d6ceff',
    green:'#28c76f', greenBg:'#eef9f0', greenBdr:'#b8f0c8',
    red:'#ea5455', redBg:'#fff0f0', redBdr:'#ffc0c0',
    topBg:'#ffffff', topBorder:'#e8edf5',
  };

  const days    = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const encData = [3,5,4,7,6,4,5];
  const decData = [1,2,1,3,2,1,2];

  return (
    <>
      <Head><title>Dashboard — SRA Shield</title></Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%}
        body{font-family:'DM Sans',sans-serif;background:${C.pageBg};color:${C.titleTxt};-webkit-font-smoothing:antialiased}
        button{font-family:'DM Sans',sans-serif;cursor:pointer}
        textarea{font-family:'DM Mono',monospace}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d0d8e8;border-radius:4px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes glow{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fadeUp{animation:fadeUp .3s ease forwards}
        .nav-btn:hover{background:rgba(255,255,255,.07)!important;color:#c5d0e8!important}
        .gen-btn:hover{background:${C.purple}!important;color:#fff!important;border-color:${C.purple}!important}
        .del-btn:hover{background:${C.redBg}!important}
        .copy-btn:hover{background:${C.purpleLight}!important}
        .enc-btn:hover{opacity:.88!important}
        .dec-btn:hover{border-color:${C.purple}!important;color:${C.purple}!important}
        .qa-btn:hover{background:${C.purpleLight}!important;border-color:${C.purpleBorder}!important;color:${C.purple}!important}
        textarea:focus{border-color:${C.purple}!important;outline:none;box-shadow:0 0 0 3px ${C.purpleLight}}
      `}</style>

      <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside style={{width:220,flexShrink:0,background:C.sidebarBg,borderRight:`1px solid ${C.sidebarBorder}`,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
          <div style={{padding:'20px 16px 16px',borderBottom:`1px solid ${C.sidebarBorder}`,flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:34,height:34,background:'linear-gradient(135deg,#6c5ce7,#4338ca)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0,boxShadow:'0 4px 12px rgba(108,92,231,.4)'}}>🛡</div>
              <div>
                <div style={{fontWeight:700,fontSize:14.5,color:'#f0f4ff',letterSpacing:'-.2px'}}>SRA Shield</div>
                <div style={{fontSize:9.5,color:'#6c9bff',fontWeight:700,letterSpacing:'.1em'}}>BETA</div>
              </div>
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:'14px 10px'}}>
            <div style={{fontSize:9.5,fontWeight:700,color:'#3d5080',letterSpacing:'.1em',padding:'0 6px',marginBottom:6}}>MAIN</div>
            {navMain.map(n => (
              <button key={n.id} className="nav-btn" onClick={() => setActiveNav(n.id)} style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:9,border:'none',
                background: activeNav===n.id ? C.navActive : 'transparent',
                color: activeNav===n.id ? C.navActiveTxt : C.navTxt,
                fontSize:13.5,fontWeight: activeNav===n.id ? 600 : 400,
                transition:'all .15s',textAlign:'left',
                borderLeft: activeNav===n.id ? `3px solid ${C.navActiveTxt}` : '3px solid transparent',marginBottom:3,
              }}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</button>
            ))}

            <div style={{fontSize:9.5,fontWeight:700,color:'#3d5080',letterSpacing:'.1em',padding:'0 6px',margin:'18px 0 6px'}}>ACCOUNT</div>
            {navAccount.map(n => (
              <button key={n.id} className="nav-btn" onClick={() => setActiveNav(n.id)} style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:9,border:'none',
                background: activeNav===n.id ? C.navActive : 'transparent',
                color: activeNav===n.id ? C.navActiveTxt : C.navTxt,
                fontSize:13.5,fontWeight: activeNav===n.id ? 600 : 400,
                transition:'all .15s',textAlign:'left',
                borderLeft: activeNav===n.id ? `3px solid ${C.navActiveTxt}` : '3px solid transparent',marginBottom:3,
              }}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</button>
            ))}
          </div>

          <div style={{padding:'12px 12px',borderTop:`1px solid ${C.sidebarBorder}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#6c5ce7,#0984e3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>{userName[0].toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11.5,fontWeight:500,color:'#c5d0e8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail||userName}</div>
              <div style={{fontSize:10,color:'#4a6080',marginTop:1,textTransform:'capitalize'}}>{userPlan} plan</div>
            </div>
            <button onClick={signOut} title="Sign out" style={{background:'none',border:'none',color:'#4a6080',fontSize:15,padding:4,borderRadius:6,flexShrink:0}}>⇥</button>
          </div>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
          {/* Topbar */}
          <div style={{background:C.topBg,borderBottom:`1px solid ${C.topBorder}`,padding:'0 28px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:C.titleTxt,letterSpacing:'-.3px'}}>{allNav.find(n=>n.id===activeNav)?.label||'Overview'}</div>
              <div style={{fontSize:12,color:C.mutedTxt,marginTop:1}}>Welcome back, {userName}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:6,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:100,padding:'5px 13px',fontSize:12,fontWeight:600,color:C.green}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.green,animation:'glow 2s ease infinite'}}/>API Online
              </div>
              <button onClick={() => setActiveNav('upgrade')} style={{background:'linear-gradient(135deg,#6c5ce7,#4338ca)',color:'#fff',border:'none',borderRadius:9,padding:'8px 18px',fontSize:13,fontWeight:600,boxShadow:'0 4px 12px rgba(108,92,231,.3)'}}>Upgrade →</button>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:'auto',padding:24,background:C.pageBg}}>

            {/* ── OVERVIEW ──────────────────────────────────────────────── */}
            {activeNav==='overview' && (
              <div className="fadeUp">
                {usageLoading ? (
                  <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:24,marginBottom:16,textAlign:'center',color:C.mutedTxt,fontSize:13}}>Loading usage data…</div>
                ) : (
                  <UsageCard usage={usage} />
                )}

                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
                  {[
                    {label:'Calls Used',     value: usage?.callsUsed ?? 0,       sub:'This month',         icon:'⚡', bg:'#fff3e0', bdr:'#ffe0b2'},
                    {label:'Enc. Keys Active', value: keys.filter(k=>k.status==='Active').length, sub:'AES-256 encryption keys', icon:'⚿', bg:'#eef9f0', bdr:'#b8f0c8'},                    {label:'Days to Reset',  value: usage?.daysUntilReset ?? 30,  sub: usage?.resetDate ?? '', icon:'📅', bg:'#eef4ff', bdr:'#c2d8f8'},
                  ].map((s,i)=>(
                    <div key={i} style={{background:s.bg,border:`1px solid ${s.bdr}`,borderRadius:14,padding:'20px 22px',boxShadow:C.cardShadow}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.bodyTxt,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.label}</div>
                        <div style={{width:36,height:36,background:'rgba(255,255,255,.7)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,boxShadow:'0 2px 6px rgba(0,0,0,.06)'}}>{s.icon}</div>
                      </div>
                      <div style={{fontSize:38,fontWeight:800,color:C.titleTxt,letterSpacing:-2,lineHeight:1}}>{typeof s.value==='number'?s.value.toLocaleString():s.value}</div>
                      <div style={{fontSize:12,color:C.bodyTxt,marginTop:6,fontWeight:500}}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* ── TWO KEYS EXPLAINED ─────────────────────────────────── */}
                <div style={{background:'#eef4ff',border:'1.5px solid #c2d8f8',borderRadius:14,padding:'16px 20px',marginBottom:16,display:'flex',gap:16,flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:260}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#0984e3',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8}}>🔑 Two Different Things — Read This Once</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      <div style={{background:'#fff',border:'1px solid #c2d8f8',borderRadius:10,padding:'12px 14px'}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#0984e3',marginBottom:4}}>1. Bearer Token (API Auth)</div>
                        <div style={{fontSize:11.5,color:'#4a5568',lineHeight:1.6,marginBottom:8}}>Proves <strong>who you are</strong> to SRA Shield. Goes in every API call header.</div>
                        <div style={{background:'#1a2035',borderRadius:7,padding:'8px 10px',fontFamily:'DM Mono,monospace',fontSize:10,color:'rgba(255,255,255,.7)',wordBreak:'break-all',lineHeight:1.6}}>
                          Authorization: Bearer {getToken() ? getToken().slice(0,28)+'…' : 'eyJhbGci...'}
                        </div>
                        <button onClick={()=>{navigator.clipboard.writeText(getToken()||'');setCopied('bearer');setTimeout(()=>setCopied(null),2000);}} style={{marginTop:8,background:'#eef4ff',border:'1px solid #c2d8f8',borderRadius:6,padding:'4px 12px',fontSize:11,fontWeight:600,color:'#0984e3',cursor:'pointer',width:'100%'}}>
                          {copied==='bearer'?'✓ Copied':'Copy Bearer Token'}
                        </button>
                      </div>
                      <div style={{background:'#fff',border:'1px solid #d6ceff',borderRadius:10,padding:'12px 14px'}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#6c5ce7',marginBottom:4}}>2. Encryption Key (AES-256)</div>
                        <div style={{fontSize:11.5,color:'#4a5568',lineHeight:1.6,marginBottom:8}}><strong>Locks/unlocks your data.</strong> Store this in YOUR own database or .env file. SRA never stores it.</div>
                        <div style={{background:'#1a2035',borderRadius:7,padding:'8px 10px',fontFamily:'DM Mono,monospace',fontSize:10,color:'rgba(255,255,255,.7)',lineHeight:1.6}}>
                          SRA_ENC_KEY=a053b13dfa84…<br/>Store in your .env
                        </div>
                        <button onClick={()=>setActiveNav('keys')} style={{marginTop:8,background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:6,padding:'4px 12px',fontSize:11,fontWeight:600,color:'#6c5ce7',cursor:'pointer',width:'100%'}}>
                          View My Enc. Keys →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:16,marginBottom:16}}>
                  <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>API Activity — Last 7 Days</div>
                      <div style={{display:'flex',alignItems:'center',gap:14,fontSize:12,color:C.mutedTxt}}>
                        <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:8,height:8,borderRadius:'50%',background:'#6c5ce7',display:'inline-block'}}/>Encrypt</span>
                        <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:8,height:8,borderRadius:'50%',background:'#0984e3',display:'inline-block'}}/>Decrypt</span>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'flex-end',height:120}}>
                      {days.map((d,i)=>(
                        <div key={d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                          <div style={{display:'flex',gap:4,alignItems:'flex-end',height:96}}>
                            <div style={{width:10,background:'#6c5ce7',borderRadius:'4px 4px 0 0',height:`${(encData[i]/8)*96}px`,opacity:.85}}/>
                            <div style={{width:10,background:'#0984e3',borderRadius:'4px 4px 0 0',height:`${(decData[i]/8)*96}px`,opacity:.85}}/>
                          </div>
                          <div style={{fontSize:11,color:C.mutedTxt,fontWeight:500}}>{d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt,marginBottom:16}}>Quick Actions</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:10,color:'#6c5ce7',fontSize:13,fontWeight:600,transition:'all .15s',textAlign:'left',opacity:genLoading?.6:1}}>
                        <span>⚿</span>{genLoading?'Generating…':'Generate Enc. Key'}
                      </button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}>
                        <span>🔒</span>Encrypt Data
                      </button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}>
                        <span>🔓</span>Decrypt Data
                      </button>
                      <button className="qa-btn" onClick={()=>setActiveNav('docs')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}>
                        <span>📚</span>View Docs
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Active Encryption Keys</div>
                    <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:8,padding:'7px 15px',fontSize:12,fontWeight:600,color:'#6c5ce7',transition:'all .15s',opacity:genLoading?.6:1}}>
                      {genLoading?'⏳ Generating…':'+ Generate Enc. Key'}
                    </button>
                  </div>
                  {keys.map((k,i)=>(
                    <div key={k.id} style={{display:'flex',alignItems:'center',gap:13,padding:'13px 0',borderBottom:i<keys.length-1?`1px solid ${C.cardBorder}`:'none'}}>
                      <div style={{width:36,height:36,background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>⚿</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13.5,fontWeight:600,color:C.titleTxt}}>{k.label}</div>
                        <div style={{fontSize:11,color:C.mutedTxt,fontFamily:'DM Mono,monospace',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{k.value?k.value.slice(0,44)+'…':'Key hidden for security'}</div>
                      </div>
                      <span style={{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBdr}`,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:100,flexShrink:0}}>{k.status}</span>
                      <span style={{fontSize:12,color:C.mutedTxt,flexShrink:0}}>{k.created}</span>
                      <button className="del-btn" style={{background:C.redBg,border:`1px solid ${C.redBdr}`,color:C.red,borderRadius:8,padding:'5px 12px',fontSize:12,fontWeight:600,transition:'all .15s',flexShrink:0}}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MY KEYS ───────────────────────────────────────────────── */}
            {activeNav==='keys' && (
              <div className="fadeUp">
                {/* What is an encryption key banner */}
                <div style={{background:'#f0eeff',border:'1.5px solid #d6ceff',borderRadius:12,padding:'14px 18px',marginBottom:16,display:'flex',gap:12,alignItems:'flex-start'}}>
                  <span style={{fontSize:20,flexShrink:0}}>⚿</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#6c5ce7',marginBottom:4}}>These are your AES-256-GCM Encryption Keys — not your API token</div>
                    <div style={{fontSize:12.5,color:'#4a5568',lineHeight:1.65}}>
                      These keys <strong>encrypt and decrypt your data</strong>. Store them in your own database or <code style={{background:'#e8e4ff',padding:'1px 5px',borderRadius:4,fontFamily:'monospace'}}>SRA_ENC_KEY</code> environment variable.
                      SRA Shield <strong>never stores</strong> these — if you lose one, that data is unrecoverable.
                      <span style={{display:'block',marginTop:6,color:'#0984e3'}}>
                        🔐 Your <strong>Bearer Token</strong> (for API authentication) is separate — find it on the Overview page.
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{background:'#fff8ec',border:`1px solid #ffe0b2`,borderRadius:14,padding:22,boxShadow:'0 1px 6px rgba(255,159,67,.1)'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:'#1a2035'}}>Encryption Keys</div>
                      <div style={{fontSize:11.5,color:'#a0aec0',marginTop:2}}>
                        {keysLoading ? 'Loading…' : `${keys.length} key${keys.length !== 1 ? 's' : ''} in your account`}
                      </div>
                    </div>
                    <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:8,padding:'7px 15px',fontSize:12,fontWeight:600,color:'#6c5ce7',transition:'all .15s'}}>
                      {genLoading?'⏳ Generating…':'+ Generate Enc. Key'}
                    </button>
                  </div>

                  {/* Loading state */}
                  {keysLoading && (
                    <div style={{textAlign:'center',padding:'32px 0',color:'#a0aec0',fontSize:13}}>
                      Loading your keys…
                    </div>
                  )}

                  {/* No keys yet */}
                  {!keysLoading && keys.length === 0 && (
                    <div style={{textAlign:'center',padding:'32px 0'}}>
                      <div style={{fontSize:32,marginBottom:12}}>⚿</div>
                      <div style={{fontSize:14,fontWeight:600,color:'#1a2035',marginBottom:6}}>No encryption keys yet</div>
                      <div style={{fontSize:13,color:'#a0aec0',marginBottom:16}}>Generate your first key to start encrypting data.</div>
                      <button className="gen-btn" onClick={handleGenKey} disabled={genLoading}
                        style={{background:'linear-gradient(135deg,#6c5ce7,#4338ca)',border:'none',borderRadius:10,padding:'11px 22px',fontSize:13,fontWeight:600,color:'#fff',cursor:'pointer'}}>
                        {genLoading?'⏳ Generating…':'Generate First Key →'}
                      </button>
                    </div>
                  )}

                  {/* Keys list */}
                  {!keysLoading && keys.map((k,i)=>(
                    <div key={k.id} style={{background:'#f8f9fb',border:`1px solid ${k.isNew ? '#d6ceff' : C.cardBorder}`,borderRadius:12,padding:'16px 18px',marginBottom:i<keys.length-1?10:0,
                      boxShadow: k.isNew ? '0 0 0 2px rgba(108,92,231,.2)' : 'none'}}>

                      {/* "Copy now" warning for newly generated key */}
                      {k.isNew && k.value && (
                        <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:9,padding:'10px 14px',marginBottom:12,display:'flex',alignItems:'flex-start',gap:10}}>
                          <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
                          <div>
                            <div style={{fontSize:12.5,fontWeight:700,color:'#ea580c',marginBottom:2}}>Copy this key RIGHT NOW — it will never be shown again</div>
                            <div style={{fontSize:12,color:'#9a3412',lineHeight:1.5}}>SRA Shield uses zero-knowledge architecture. After you leave this page or refresh, the actual key value disappears forever. Store it in your <code style={{background:'#fef3c7',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:11}}>SRA_ENC_KEY</code> environment variable immediately.</div>
                          </div>
                        </div>
                      )}

                      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:k.value?10:6,flexWrap:'wrap'}}>
                            <span style={{fontSize:16}}>⚿</span>
                            <span style={{fontSize:14,fontWeight:600,color:C.titleTxt}}>{k.label}</span>
                            <span style={{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBdr}`,fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:100}}>{k.status}</span>
                            <span style={{fontSize:11.5,color:C.mutedTxt}}>{k.created}</span>
                            {k.isNew && <span style={{background:'#f0eeff',color:'#6c5ce7',border:'1px solid #d6ceff',fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:100}}>NEW</span>}
                          </div>

                          {/* Actual key value — shown only right after generation */}
                          {k.value ? (
                            <div style={{background:'#fff',border:'1.5px solid #d6ceff',borderRadius:8,padding:'10px 12px',fontFamily:'DM Mono,monospace',fontSize:11,color:'#6c5ce7',wordBreak:'break-all',lineHeight:1.7,marginBottom:8}}>
                              {k.value}
                            </div>
                          ) : (
                            <div style={{background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:8,padding:'8px 12px',fontSize:11.5,color:'#9ca3af',marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
                              <span>🔒</span>
                              <span>Key value hidden — zero-knowledge architecture. Copy it when first generated.</span>
                            </div>
                          )}

                          {/* Verification code */}
                          {k.code && (
                            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                              <span style={{fontSize:11.5,color:C.bodyTxt,fontWeight:500}}>Verification:</span>
                              <a href={`/shield/verify/${k.code}`} target="_blank" rel="noopener noreferrer"
                                style={{color:'#6c5ce7',fontWeight:700,fontSize:12,fontFamily:'DM Mono,monospace',textDecoration:'none',background:'#f0eeff',padding:'3px 10px',borderRadius:6,border:'1px solid #d6ceff'}}>
                                {k.code}
                              </a>
                              <span style={{fontSize:11,color:'#a0aec0'}}>← share with compliance team</span>
                            </div>
                          )}
                        </div>

                        <div style={{display:'flex',flexDirection:'column',gap:7,flexShrink:0}}>
                          {k.value && (
                            <button className="copy-btn" onClick={()=>copyText(k.value, k.id)}
                              style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:7,padding:'7px 14px',fontSize:12,fontWeight:700,color:'#6c5ce7',transition:'all .15s'}}>
                              {copied===k.id ? '✓ Copied!' : 'Copy Key'}
                            </button>
                          )}
                          {k.code && (
                            <button className="copy-btn" onClick={()=>copyText(k.code, `code-${k.id}`)}
                              style={{background:'#f8f9fb',border:'1px solid #e5e7eb',borderRadius:7,padding:'7px 14px',fontSize:12,fontWeight:600,color:'#4a5568',transition:'all .15s'}}>
                              {copied===`code-${k.id}` ? '✓ Copied!' : 'Copy Code'}
                            </button>
                          )}
                          <button className="del-btn"
                            style={{background:C.redBg,border:`1px solid ${C.redBdr}`,color:C.red,borderRadius:7,padding:'7px 14px',fontSize:12,fontWeight:600,transition:'all .15s'}}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ENCRYPT / DECRYPT ─────────────────────────────────────── */}
            {activeNav==='encrypt' && (
              <div className="fadeUp" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                    <div style={{width:36,height:36,background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🔒</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Encrypt Data</div>
                  </div>
                  <textarea rows={6} value={encInput} onChange={e=>setEncInput(e.target.value)} placeholder="Enter plaintext to encrypt…"
                    style={{width:'100%',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:'12px 14px',fontSize:12.5,color:C.titleTxt,resize:'vertical',lineHeight:1.7,transition:'all .2s'}}/>
                  <button className="enc-btn" onClick={handleEncrypt} disabled={encLoading} style={{width:'100%',marginTop:12,padding:'12px 0',background:'linear-gradient(135deg,#6c5ce7,#4338ca)',border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:600,transition:'all .15s',opacity:encLoading?.7:1,boxShadow:'0 4px 14px rgba(108,92,231,.3)'}}>
                    {encLoading?'Encrypting…':'Encrypt →'}
                  </button>
                  {encResult&&(
                    <div style={{marginTop:14,background:'#f8f9fb',border:'1px solid #d6ceff',borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{fontSize:10,fontWeight:700,color:'#6c5ce7',textTransform:'uppercase',letterSpacing:'.07em'}}>Encrypted Output</div>
                        <button className="copy-btn" onClick={()=>copyText(encResult,'enc')} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:600,color:'#6c5ce7',transition:'all .15s'}}>{copied==='enc'?'✓':'Copy'}</button>
                      </div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:'#6c5ce7',wordBreak:'break-all',lineHeight:1.65}}>{encResult}</div>
                    </div>
                  )}
                </div>
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                    <div style={{width:36,height:36,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🔓</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Decrypt Data</div>
                  </div>
                  <textarea rows={6} value={decInput} onChange={e=>setDecInput(e.target.value)} placeholder="Paste encrypted string here…"
                    style={{width:'100%',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:'12px 14px',fontSize:12.5,color:C.titleTxt,resize:'vertical',lineHeight:1.7}}/>
                  <button className="dec-btn" onClick={handleDecrypt} disabled={decLoading} style={{width:'100%',marginTop:12,padding:'12px 0',background:'#fff',border:`1.5px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:14,fontWeight:600,transition:'all .15s',opacity:decLoading?.7:1}}>
                    {decLoading?'Decrypting…':'Decrypt →'}
                  </button>
                  {decResult&&(
                    <div style={{marginTop:14,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.green,textTransform:'uppercase',letterSpacing:'.07em'}}>Decrypted Output</div>
                        <button className="copy-btn" onClick={()=>copyText(decResult,'dec')} style={{background:'rgba(40,199,111,.1)',border:`1px solid ${C.greenBdr}`,borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:600,color:C.green,transition:'all .15s'}}>{copied==='dec'?'✓':'Copy'}</button>
                      </div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:'#1a7a45',wordBreak:'break-all',lineHeight:1.65}}>{decResult}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ACTIVITY ──────────────────────────────────────────────── */}
            {activeNav==='activity' && (
              <div className="fadeUp">
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
                  {[
                    {label:'Total Calls',  value: activity?.totalCalls ?? 0,  icon:'⚡', bg:'#fff3e0', bdr:'#ffe0b2'},
                    {label:'Today',        value: activity?.todayCalls ?? 0,  icon:'📅', bg:'#eef9f0', bdr:'#b8f0c8'},
                    {label:'This Month',   value: usage?.callsUsed ?? 0,      icon:'📊', bg:'#eef4ff', bdr:'#c2d8f8'},
                  ].map((s,i)=>(
                    <div key={i} style={{background:s.bg,border:`1px solid ${s.bdr}`,borderRadius:14,padding:'20px 22px',boxShadow:C.cardShadow}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.bodyTxt,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.label}</div>
                        <div style={{width:36,height:36,background:'rgba(255,255,255,.7)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{s.icon}</div>
                      </div>
                      <div style={{fontSize:38,fontWeight:800,color:C.titleTxt,letterSpacing:-2,lineHeight:1}}>{s.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>API Call History</div>
                    <button onClick={fetchActivity} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:8,padding:'6px 14px',fontSize:12,fontWeight:600,color:'#6c5ce7',cursor:'pointer'}}>↻ Refresh</button>
                  </div>
                  {activityLoading ? (
                    <div style={{textAlign:'center',padding:'40px 0',color:C.mutedTxt,fontSize:13}}>Loading activity…</div>
                  ) : !activity || activity.entries.length === 0 ? (
                    <div style={{textAlign:'center',padding:'40px 0'}}>
                      <div style={{fontSize:36,marginBottom:12}}>↗</div>
                      <div style={{fontSize:14,fontWeight:600,color:C.bodyTxt,marginBottom:6}}>No activity yet</div>
                      <div style={{fontSize:13,color:C.mutedTxt}}>Start encrypting or generating keys to see activity here.</div>
                    </div>
                  ) : (
                    <div>
                      {activity.entries.map((entry, i) => (
                        <div key={entry.id} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 0',borderBottom: i < activity.entries.length-1 ? `1px solid ${C.cardBorder}` : 'none'}}>
                          <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background: entry.action==='ENCRYPT' ? '#f0eeff' : entry.action==='DECRYPT' ? '#eef9f0' : '#fff3e0',border: `1px solid ${entry.action==='ENCRYPT' ? '#d6ceff' : entry.action==='DECRYPT' ? '#b8f0c8' : '#ffe0b2'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>{entry.icon}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13.5,fontWeight:600,color:C.titleTxt}}>{entry.label}</div>
                            {entry.details && <div style={{fontSize:11.5,color:C.mutedTxt,marginTop:2,fontFamily:'DM Mono,monospace'}}>{entry.details}</div>}
                          </div>
                          <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:100,flexShrink:0,background: entry.status==='SUCCESS' ? C.greenBg : C.redBg,color: entry.status==='SUCCESS' ? C.green : C.red,border: `1px solid ${entry.status==='SUCCESS' ? C.greenBdr : C.redBdr}`}}>{entry.status}</span>
                          <div style={{fontSize:11.5,color:C.mutedTxt,flexShrink:0,textAlign:'right',minWidth:80}}>
                            {new Date(entry.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                            <div style={{fontSize:10,marginTop:1}}>{new Date(entry.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── DOCUMENTATION ─────────────────────────────────────────── */}
            {activeNav==='docs' && <DocsPanel />}

            {/* ── UPGRADE PLAN ──────────────────────────────────────────── */}
            {activeNav==='upgrade' && <UpgradePanel userPlan={userPlan} />}

          </div>
        </div>
      </div>
    </>
  );
}