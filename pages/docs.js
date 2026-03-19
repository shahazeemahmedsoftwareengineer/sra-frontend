import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Docs() {
  const [activeLang, setActiveLang] = useState('js');

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.07)' : 'none';
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Documentation — SRA Shield API</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        body{background:#FAFAFA}
        .docs-layout{display:grid;grid-template-columns:260px 1fr;min-height:100vh;padding-top:64px}
        .docs-sidebar{position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto;background:#fff;border-right:1px solid var(--border);padding:28px 0}
        .ds-section{margin-bottom:22px;padding:0 18px}
        .ds-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--gray2);margin-bottom:9px}
        .ds-links{display:flex;flex-direction:column;gap:2px}
        .ds-link{display:block;padding:7px 11px;border-radius:9px;font-size:13.5px;font-weight:500;color:var(--gray);text-decoration:none;transition:all .2s}
        .ds-link:hover{background:var(--surface);color:var(--charcoal)}
        .ds-link.on{background:var(--purple-l);color:var(--purple);font-weight:600}
        .docs-content{padding:48px 56px;max-width:820px}
        .doc-section{margin-bottom:72px;padding-bottom:60px;border-bottom:1px solid var(--border)}
        .doc-section:last-child{border-bottom:none}
        .ds-badge{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.3px;margin-right:7px}
        .get{background:#ECFDF5;color:#059669}.post{background:var(--purple-l);color:var(--purple)}.del{background:#FEE2E2;color:#DC2626}
        .endpoint{display:flex;align-items:center;gap:10px;background:var(--charcoal);border-radius:12px;padding:13px 18px;margin:18px 0;font-family:'SF Mono','Fira Code',monospace}
        .ep-method{font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:6px}
        .ep-m-post{background:rgba(139,92,246,.2);color:var(--purple)}
        .ep-m-get{background:rgba(52,211,153,.2);color:var(--green)}
        .ep-path{font-size:13px;color:rgba(255,255,255,.7)}
        .ep-copy{margin-left:auto;font-size:11px;color:rgba(255,255,255,.25);cursor:pointer;padding:3px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.1);transition:all .2s;background:none}
        .ep-copy:hover{color:rgba(255,255,255,.6)}
        .param-table{width:100%;border-collapse:collapse;font-size:13.5px;margin:16px 0}
        .param-table th{text-align:left;padding:10px 14px;background:var(--surface);font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:.6px}
        .param-table td{padding:11px 14px;border-bottom:1px solid var(--border);vertical-align:top}
        .param-table tr:last-child td{border-bottom:none}
        .p-name{font-family:'SF Mono','Fira Code',monospace;font-size:12.5px;color:var(--charcoal)}
        .p-type{font-size:11.5px;padding:2px 8px;border-radius:5px;background:var(--surface);color:var(--gray);font-family:monospace}
        .p-req{font-size:11px;padding:2px 7px;border-radius:100px;background:#FEF3C7;color:#D97706;font-weight:600}
        .p-opt{font-size:11px;padding:2px 7px;border-radius:100px;background:var(--surface);color:var(--gray);font-weight:600}
        .p-desc{color:var(--gray);font-size:13px;line-height:1.55}
        .resp-block{background:#0F0F0F;border-radius:14px;overflow:hidden;margin:16px 0}
        .rb-top{background:#1A1A1A;padding:9px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.05)}
        .rb-dots{display:flex;gap:4px}
        .rb-dots span{width:8px;height:8px;border-radius:50%}
        .rb-dots span:nth-child(1){background:#FF5F57}.rb-dots span:nth-child(2){background:#FFBD2E}.rb-dots span:nth-child(3){background:#28C840}
        .rb-label{font-size:11px;color:rgba(255,255,255,.3);font-family:monospace}
        .rb-status{margin-left:auto;font-size:11px;font-weight:700;padding:2px 9px;border-radius:100px;background:rgba(52,211,153,.12);color:var(--green);font-family:monospace}
        .rb-body{padding:20px}
        .lang-tabs{display:flex;gap:4px;margin-bottom:0}
        .lang-tab{padding:7px 14px;border-radius:8px 8px 0 0;font-size:12.5px;font-weight:600;color:var(--gray);cursor:pointer;background:var(--surface);border:1.5px solid var(--border);border-bottom:none;transition:all .2s}
        .lang-tab.on{background:#0F0F0F;color:rgba(255,255,255,.75);border-color:#0F0F0F}
        .code-panel{display:none}.code-panel.on{display:block}
        .note-box{display:flex;gap:12px;background:var(--purple-l);border:1.5px solid rgba(139,92,246,.2);border-radius:12px;padding:16px;margin:16px 0;font-size:13.5px;color:var(--charcoal);line-height:1.6}
        .note-icon{flex-shrink:0;font-size:17px;margin-top:1px}
        .warn-box{display:flex;gap:12px;background:#FEF3C7;border:1.5px solid #FDE68A;border-radius:12px;padding:16px;margin:16px 0;font-size:13.5px;color:var(--charcoal);line-height:1.6}
        .inline-code{background:var(--surface);padding:2px 6px;border-radius:5px;font-family:monospace;font-size:12.5px}
        @media(max-width:900px){.docs-layout{grid-template-columns:1fr}.docs-sidebar{display:none}.docs-content{padding:28px 20px}}
      `}} />

      <div className="docs-layout">

        {/* SIDEBAR */}
        <aside className="docs-sidebar">
          <div className="ds-section">
            <div className="ds-title">Getting Started</div>
            <div className="ds-links">
              <a href="#quickstart" className="ds-link on">Quick Start</a>
              <a href="#auth" className="ds-link">Authentication</a>
              <a href="#base-url" className="ds-link">Base URL</a>
            </div>
          </div>
          <div className="ds-section">
            <div className="ds-title">API Reference</div>
            <div className="ds-links">
              <a href="#register" className="ds-link">Register</a>
              <a href="#login" className="ds-link">Login</a>
              <a href="#generate-key" className="ds-link">Generate Key</a>
              <a href="#encrypt" className="ds-link">Encrypt</a>
              <a href="#decrypt" className="ds-link">Decrypt</a>
            </div>
          </div>
          <div className="ds-section">
            <div className="ds-title">Code Examples</div>
            <div className="ds-links">
              <a href="#js" className="ds-link">JavaScript</a>
              <a href="#python" className="ds-link">Python</a>
              <a href="#php" className="ds-link">PHP</a>
              <a href="#java" className="ds-link">Java</a>
            </div>
          </div>
          <div className="ds-section">
            <div className="ds-title">Errors</div>
            <div className="ds-links">
              <a href="#errors" className="ds-link">Error Codes</a>
              <a href="#rate-limits" className="ds-link">Rate Limits</a>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="docs-content">

          <div style={{marginBottom:'40px'}}>
            <div className="sec-label">📚 API Reference</div>
            <h1 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'40px',fontWeight:900,color:'var(--charcoal)',letterSpacing:'-1.5px',marginBottom:'10px'}}>Documentation</h1>
            <p style={{fontSize:'15.5px',color:'var(--gray)',lineHeight:1.7}}>Everything you need to integrate SRA Shield into your application. The full REST API, code examples in 4 languages, and a 30-minute quickstart guide.</p>
          </div>

          {/* BASE URL */}
          <div className="doc-section" id="base-url">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'12px',letterSpacing:'-.3px'}}>Base URL</h2>
            <div className="endpoint">
              <div className="ep-path">https://sra-backend-production.up.railway.app</div>
              <button className="ep-copy" onClick={() => navigator.clipboard.writeText('https://sra-backend-production.up.railway.app')}>copy</button>
            </div>
            <p style={{fontSize:'13.5px',color:'var(--gray)'}}>All API endpoints are prefixed with <span className="inline-code">/api/v1</span>. All requests and responses use JSON.</p>
          </div>

          {/* QUICKSTART */}
          <div className="doc-section" id="quickstart">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'12px',letterSpacing:'-.3px'}}>Quick Start</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'16px',lineHeight:1.7}}>Get from zero to encrypted data in 4 steps:</p>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">4-step quickstart</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.9,color:'rgba(255,255,255,.8)'}}>
                  <span className="c-c"># Step 1 — Register{'\n'}</span>
                  <span className="c-k">POST</span>{' /api/v1/auth/register\n'}
                  <span className="c-s">{'{"email":"you@company.com","password":"YourPassword123!"}'}</span>
                  {'\n\n'}<span className="c-c"># Step 2 — Login to get JWT{'\n'}</span>
                  <span className="c-k">POST</span>{' /api/v1/auth/login\n'}
                  <span className="c-s">{'{"email":"you@company.com","password":"YourPassword123!"}'}</span>
                  {'\n'}<span className="c-c"># → save data.token as TOKEN{'\n\n'}</span>
                  <span className="c-c"># Step 3 — Generate key{'\n'}</span>
                  <span className="c-k">POST</span>{' /api/v1/shield/keys/generate  '}<span className="c-c">(Bearer TOKEN){'\n'}</span>
                  <span className="c-c"># → save data.encryptionKey{'\n\n'}</span>
                  <span className="c-c"># Step 4 — Encrypt anything{'\n'}</span>
                  <span className="c-k">POST</span>{' /api/v1/shield/encrypt  '}<span className="c-c">(Bearer TOKEN){'\n'}</span>
                  <span className="c-s">{'{"plaintext":"Your sensitive data here"}'}</span>
                  {'\n'}<span className="c-c"># → get data.encrypted → store it safely</span>
                </pre>
              </div>
            </div>
          </div>

          {/* AUTH */}
          <div className="doc-section" id="auth">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'12px',letterSpacing:'-.3px'}}>Authentication</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'14px',lineHeight:1.7}}>All <span className="inline-code">/shield/*</span> endpoints require a Bearer token in the Authorization header.</p>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">Authorization header</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',color:'rgba(255,255,255,.8)'}}>
                  <span className="c-s">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
                </pre>
              </div>
            </div>
            <div className="note-box"><div className="note-icon">💡</div><div>Tokens are valid for 30 days. Request a new token using your email/password login.</div></div>
          </div>

          {/* REGISTER */}
          <div className="doc-section" id="register">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'4px',letterSpacing:'-.3px'}}>Register</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'14px'}}>Create a new account.</p>
            <div className="endpoint"><div className="ep-method ep-m-post">POST</div><div className="ep-path">/api/v1/auth/register</div></div>
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="p-name">email</span></td><td><span className="p-type">string</span></td><td><span className="p-req">Required</span></td><td className="p-desc">Valid email address</td></tr>
                <tr><td><span className="p-name">password</span></td><td><span className="p-type">string</span></td><td><span className="p-req">Required</span></td><td className="p-desc">Min 8 chars, 1 uppercase, 1 number</td></tr>
              </tbody>
            </table>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">Response</div><div className="rb-status">201 Created</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.8,color:'rgba(255,255,255,.8)'}}>
                  {'{\n  '}<span className="c-s">"status"</span>{': '}<span className="c-m">"success"</span>{',\n  '}<span className="c-s">"message"</span>{': '}<span className="c-m">"User registered successfully"</span>{',\n  '}<span className="c-s">"data"</span>{':{' +'\n    '}<span className="c-s">"userId"</span>{': '}<span className="c-m">"uuid-here"</span>{',\n    '}<span className="c-s">"email"</span>{': '}<span className="c-m">"you@company.com"</span>{'\n  }\n}'}
                </pre>
              </div>
            </div>
          </div>

          {/* LOGIN */}
          <div className="doc-section" id="login">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'4px',letterSpacing:'-.3px'}}>Login</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'14px'}}>Authenticate and receive a JWT token.</p>
            <div className="endpoint"><div className="ep-method ep-m-post">POST</div><div className="ep-path">/api/v1/auth/login</div></div>
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="p-name">email</span></td><td><span className="p-type">string</span></td><td><span className="p-req">Required</span></td><td className="p-desc">Registered email address</td></tr>
                <tr><td><span className="p-name">password</span></td><td><span className="p-type">string</span></td><td><span className="p-req">Required</span></td><td className="p-desc">Account password</td></tr>
              </tbody>
            </table>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">Response</div><div className="rb-status">200 OK</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.8,color:'rgba(255,255,255,.8)'}}>
                  {'{\n  '}<span className="c-s">"status"</span>{': '}<span className="c-m">"success"</span>{',\n  '}<span className="c-s">"data"</span>{':{'+'\n    '}<span className="c-s">"token"</span>{': '}<span className="c-m">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</span>{',\n    '}<span className="c-s">"userId"</span>{': '}<span className="c-m">"uuid-here"</span>{',\n    '}<span className="c-s">"email"</span>{': '}<span className="c-m">"you@company.com"</span>{'\n  }\n}'}
                </pre>
              </div>
            </div>
          </div>

          {/* GENERATE KEY */}
          <div className="doc-section" id="generate-key">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'4px',letterSpacing:'-.3px'}}>Generate Encryption Key</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'14px'}}>Generate a new 256-bit encryption key from the multi-source entropy engine.</p>
            <div className="endpoint"><div className="ep-method ep-m-post">POST</div><div className="ep-path">/api/v1/shield/keys/generate</div></div>
            <p style={{fontSize:'13px',color:'var(--gray)',margin:'10px 0'}}>No body required. Authenticated via Bearer token.</p>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">Response</div><div className="rb-status">200 OK</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.8,color:'rgba(255,255,255,.8)'}}>
                  {'{\n  '}<span className="c-s">"status"</span>{': '}<span className="c-m">"success"</span>{',\n  '}<span className="c-s">"data"</span>{':{'+'\n    '}<span className="c-s">"encryptionKey"</span>{': '}<span className="c-m">"a053b13dfa84f7164da57602c9586b32889185a0..."</span>{'\n  }\n}'}
                </pre>
              </div>
            </div>
            <div className="warn-box"><div className="note-icon">⚠️</div><div><strong>Store this key securely.</strong> SRA Shield does not store your encryption key. If you lose it, your encrypted data cannot be recovered.</div></div>
          </div>

          {/* ENCRYPT */}
          <div className="doc-section" id="encrypt">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'4px',letterSpacing:'-.3px'}}>Encrypt</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'14px'}}>Encrypt any plaintext string using AES-256-GCM.</p>
            <div className="endpoint"><div className="ep-method ep-m-post">POST</div><div className="ep-path">/api/v1/shield/encrypt</div></div>
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="p-name">plaintext</span></td><td><span className="p-type">string</span></td><td><span className="p-req">Required</span></td><td className="p-desc">The data to encrypt. Any string value.</td></tr>
              </tbody>
            </table>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">Response</div><div className="rb-status">200 OK</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.8,color:'rgba(255,255,255,.8)'}}>
                  {'{\n  '}<span className="c-s">"status"</span>{': '}<span className="c-m">"success"</span>{',\n  '}<span className="c-s">"data"</span>{':{'+'\n    '}<span className="c-s">"encrypted"</span>{': '}<span className="c-m">"SRA_ENC_IjIiOiJlbmMiLCJ0eXAiOiJKV1Qi..."</span>{'\n  }\n}'}
                </pre>
              </div>
            </div>
          </div>

          {/* DECRYPT */}
          <div className="doc-section" id="decrypt">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'4px',letterSpacing:'-.3px'}}>Decrypt</h2>
            <p style={{fontSize:'13.5px',color:'var(--gray)',marginBottom:'14px'}}>Decrypt an encrypted SRA Shield string back to plaintext.</p>
            <div className="endpoint"><div className="ep-method ep-m-post">POST</div><div className="ep-path">/api/v1/shield/decrypt</div></div>
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><span className="p-name">encrypted</span></td><td><span className="p-type">string</span></td><td><span className="p-req">Required</span></td><td className="p-desc">The encrypted string returned from /encrypt</td></tr>
              </tbody>
            </table>
            <div className="resp-block">
              <div className="rb-top"><div className="rb-dots"><span></span><span></span><span></span></div><div className="rb-label">Response</div><div className="rb-status">200 OK</div></div>
              <div className="rb-body">
                <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.8,color:'rgba(255,255,255,.8)'}}>
                  {'{\n  '}<span className="c-s">"status"</span>{': '}<span className="c-m">"success"</span>{',\n  '}<span className="c-s">"data"</span>{':{'+'\n    '}<span className="c-s">"plaintext"</span>{': '}<span className="c-m">"Your sensitive data here"</span>{'\n  }\n}'}
                </pre>
              </div>
            </div>
          </div>

          {/* CODE EXAMPLES */}
          <div className="doc-section" id="js">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'14px',letterSpacing:'-.3px'}}>Code Examples</h2>
            <div className="lang-tabs">
              {['js','py','php','java'].map(lang => (
                <div key={lang} className={`lang-tab${activeLang === lang ? ' on' : ''}`} onClick={() => setActiveLang(lang)}>
                  {lang === 'js' ? 'JavaScript' : lang === 'py' ? 'Python' : lang === 'php' ? 'PHP' : 'Java'}
                </div>
              ))}
            </div>
            <div className="resp-block" style={{borderRadius:'0 14px 14px 14px',marginTop:0}}>
              <div className="rb-body">

                {activeLang === 'js' && (
                  <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.9,color:'rgba(255,255,255,.8)'}}>
                    <span className="c-c">{'// SRA Shield — Full JavaScript Example\n'}</span>
                    <span className="c-k">const</span>{' BASE = '}<span className="c-s">{'\'https://sra-backend-production.up.railway.app/api/v1\''}</span>{';\n\n'}
                    <span className="c-k">async function</span>{' '}<span className="c-n">sraShield</span>{'() {\n  '}<span className="c-c">{'// 1. Login\n  '}</span>
                    <span className="c-k">const</span>{' login = '}<span className="c-k">await</span>{' fetch('}<span className="c-n">{'`${BASE}/auth/login`'}</span>{', {\n    method: '}<span className="c-s">{'\'POST\''}</span>{',\n    headers: { '}<span className="c-s">{'\'Content-Type\''}</span>{': '}<span className="c-s">{'\'application/json\''}</span>{' },\n    body: JSON.stringify({ email: '}<span className="c-s">{'\'you@company.com\''}</span>{', password: '}<span className="c-s">{'\'YourPass123!\''}</span>{' })\n  });\n  '}<span className="c-k">const</span>{' { data: { token } } = '}<span className="c-k">await</span>{' login.json();\n  '}<span className="c-k">const</span>{' headers = { Authorization: '}<span className="c-n">{'`Bearer ${token}`'}</span>{', '}<span className="c-s">{'\'Content-Type\''}</span>{': '}<span className="c-s">{'\'application/json\''}</span>{' };\n\n  '}<span className="c-c">{'// 2. Generate key\n  '}</span>
                    <span className="c-k">const</span>{' keyRes = '}<span className="c-k">await</span>{' fetch('}<span className="c-n">{'`${BASE}/shield/keys/generate`'}</span>{', { method: '}<span className="c-s">{'\'POST\''}</span>{', headers });\n  '}<span className="c-k">const</span>{' { data: { encryptionKey } } = '}<span className="c-k">await</span>{' keyRes.json();\n  console.log('}<span className="c-m">{'\'Key:\''}</span>{', encryptionKey); '}<span className="c-c">{'// ⚠️ Save this!\n\n  '}</span>
                    <span className="c-c">{'// 3. Encrypt\n  '}</span>
                    <span className="c-k">const</span>{' encRes = '}<span className="c-k">await</span>{' fetch('}<span className="c-n">{'`${BASE}/shield/encrypt`'}</span>{', {\n    method: '}<span className="c-s">{'\'POST\''}</span>{', headers,\n    body: JSON.stringify({ plaintext: '}<span className="c-s">{'\'Patient: John Doe, DOB: 1985-03-12\''}</span>{' })\n  });\n  '}<span className="c-k">const</span>{' { data: { encrypted } } = '}<span className="c-k">await</span>{' encRes.json();\n\n  '}<span className="c-c">{'// 4. Decrypt\n  '}</span>
                    <span className="c-k">const</span>{' decRes = '}<span className="c-k">await</span>{' fetch('}<span className="c-n">{'`${BASE}/shield/decrypt`'}</span>{', {\n    method: '}<span className="c-s">{'\'POST\''}</span>{', headers,\n    body: JSON.stringify({ encrypted })\n  });\n  '}<span className="c-k">const</span>{' { data: { plaintext } } = '}<span className="c-k">await</span>{' decRes.json();\n  console.log('}<span className="c-m">{'\'Decrypted:\''}</span>{', plaintext);\n}'}
                  </pre>
                )}

                {activeLang === 'py' && (
                  <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.9,color:'rgba(255,255,255,.8)'}}>
                    <span className="c-c">{'# SRA Shield — Full Python Example\n'}</span>
                    <span className="c-k">import</span>{' requests\n\nBASE = '}<span className="c-s">{'\'https://sra-backend-production.up.railway.app/api/v1\''}</span>{'\n\n'}<span className="c-c">{'# 1. Login\n'}</span>
                    {'r = requests.post(f'}<span className="c-s">{'"{BASE}/auth/login"'}</span>{', json={'}<span className="c-s">{'\'email\''}</span>{': '}<span className="c-s">{'\'you@company.com\''}</span>{', '}<span className="c-s">{'\'password\''}</span>{': '}<span className="c-s">{'\'YourPass123!\''}</span>{'}\n'}
                    {'token = r.json()['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'token\''}</span>{']\nheaders = {'}<span className="c-s">{'\'Authorization\''}</span>{': f'}<span className="c-s">{'\'Bearer {token}\''}</span>{'}\n\n'}<span className="c-c">{'# 2. Generate key\n'}</span>
                    {'key_res = requests.post(f'}<span className="c-s">{'"{BASE}/shield/keys/generate"'}</span>{', headers=headers)\nencryption_key = key_res.json()['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'encryptionKey\''}</span>{']\nprint(f'}<span className="c-m">{'\'Key: {encryption_key}\''}</span>{')'}<span className="c-c">{'  # ⚠️ Save this!\n\n'}</span>
                    <span className="c-c">{'# 3. Encrypt\n'}</span>
                    {'enc = requests.post(f'}<span className="c-s">{'"{BASE}/shield/encrypt"'}</span>{', headers=headers,\n    json={'}<span className="c-s">{'\'plaintext\''}</span>{': '}<span className="c-s">{'\'Patient: John Doe, DOB: 1985-03-12\''}</span>{'}\n'}
                    {'encrypted = enc.json()['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'encrypted\''}</span>{']\n\n'}<span className="c-c">{'# 4. Decrypt\n'}</span>
                    {'dec = requests.post(f'}<span className="c-s">{'"{BASE}/shield/decrypt"'}</span>{', headers=headers, json={'}<span className="c-s">{'\'encrypted\''}</span>{': encrypted})\nprint(dec.json()['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'plaintext\''}</span>{'])'}
                  </pre>
                )}

                {activeLang === 'php' && (
                  <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.9,color:'rgba(255,255,255,.8)'}}>
                    <span className="c-c">{'<?php // SRA Shield — PHP Example\n'}</span>
                    <span className="c-k">function</span>{' '}<span className="c-n">sra_post</span>{'($path, $data, $token = null) {\n    $ch = curl_init('}<span className="c-s">{'\'https://sra-backend-production.up.railway.app/api/v1\''}</span>{' . $path);\n    $headers = ['}<span className="c-s">{'\'Content-Type: application/json\''}</span>{'];\n    '}<span className="c-k">if</span>{' ($token) $headers[] = '}<span className="c-s">{'\'Authorization: Bearer \''}</span>{' . $token;\n    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true,\n        CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($data),\n        CURLOPT_HTTPHEADER => $headers]);\n    '}<span className="c-k">return</span>{' json_decode(curl_exec($ch), true);\n}\n\n'}<span className="c-c">{'// 1. Login\n'}</span>
                    {'$login = sra_post('}<span className="c-s">{'\'auth/login\''}</span>{', ['}<span className="c-s">{'\'email\''}</span>{'=> '}<span className="c-s">{'\'you@company.com\''}</span>{','}<span className="c-s">{'\'password\''}</span>{'=> '}<span className="c-s">{'\'YourPass123!\''}</span>{']);\n$token = $login['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'token\''}</span>{'];\n\n'}<span className="c-c">{'// 2. Generate key\n'}</span>
                    {'$key = sra_post('}<span className="c-s">{'\'shield/keys/generate\''}</span>{', [], $token);\n$encryptionKey = $key['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'encryptionKey\''}</span>{'];'}<span className="c-c">{'  // ⚠️ Save!\n\n'}</span>
                    <span className="c-c">{'// 3. Encrypt\n'}</span>
                    {'$enc = sra_post('}<span className="c-s">{'\'shield/encrypt\''}</span>{', ['}<span className="c-s">{'\'plaintext\''}</span>{'=> '}<span className="c-s">{'\'Patient: John Doe\''}</span>{'], $token);\n$encrypted = $enc['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'encrypted\''}</span>{'];\n\n'}<span className="c-c">{'// 4. Decrypt\n'}</span>
                    {'$dec = sra_post('}<span className="c-s">{'\'shield/decrypt\''}</span>{', ['}<span className="c-s">{'\'encrypted\''}</span>{'=> $encrypted], $token);\necho $dec['}<span className="c-s">{'\'data\''}</span>{']['}<span className="c-s">{'\'plaintext\''}</span>{'];'}
                  </pre>
                )}

                {activeLang === 'java' && (
                  <pre style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:'12.5px',lineHeight:1.9,color:'rgba(255,255,255,.8)'}}>
                    <span className="c-c">{'// SRA Shield — Java Example (java.net.http)\n'}</span>
                    <span className="c-k">import</span>{' java.net.http.*;\n'}<span className="c-k">import</span>{' java.net.URI;\n\n'}<span className="c-k">String</span>{' BASE = '}<span className="c-s">{'"https://sra-backend-production.up.railway.app/api/v1"'}</span>{';\n'}<span className="c-k">var</span>{' client = HttpClient.newHttpClient();\n\n'}<span className="c-c">{'// 1. Login\n'}</span>
                    <span className="c-k">var</span>{' loginReq = HttpRequest.newBuilder()\n    .uri(URI.create(BASE + '}<span className="c-s">{'"/auth/login"'}</span>{'))\n    .header('}<span className="c-s">{'"Content-Type"'}</span>{', '}<span className="c-s">{'"application/json"'}</span>{')\n    .POST(HttpRequest.BodyPublishers.ofString(\n        '}<span className="c-s">{'"{\"email\":\"you@company.com\",\"password\":\"YourPass123!\"}"'}</span>{'))\n    .build();\n'}<span className="c-k">var</span>{' loginBody = client.send(loginReq, HttpResponse.BodyHandlers.ofString()).body();\n'}<span className="c-c">{'// parse JSON to get token...\n\n'}</span>
                    <span className="c-c">{'// 2. Encrypt (with token)\n'}</span>
                    <span className="c-k">var</span>{' encReq = HttpRequest.newBuilder()\n    .uri(URI.create(BASE + '}<span className="c-s">{'"/shield/encrypt"'}</span>{'))\n    .header('}<span className="c-s">{'"Authorization"'}</span>{', '}<span className="c-s">{'"Bearer "'}</span>{' + token)\n    .header('}<span className="c-s">{'"Content-Type"'}</span>{', '}<span className="c-s">{'"application/json"'}</span>{')\n    .POST(HttpRequest.BodyPublishers.ofString(\n        '}<span className="c-s">{'"{\"plaintext\":\"Patient: John Doe\"}"'}</span>{'))\n    .build();\n'}<span className="c-k">var</span>{' encrypted = client.send(encReq, HttpResponse.BodyHandlers.ofString()).body();'}
                  </pre>
                )}

              </div>
            </div>
          </div>

          {/* ERROR CODES */}
          <div className="doc-section" id="errors">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'14px',letterSpacing:'-.3px'}}>Error Codes</h2>
            <table className="param-table">
              <thead><tr><th>Code</th><th>Meaning</th><th>Resolution</th></tr></thead>
              <tbody>
                <tr><td><span className="p-name">400</span></td><td className="p-desc">Bad Request — missing or invalid fields</td><td className="p-desc">Check request body matches schema</td></tr>
                <tr><td><span className="p-name">401</span></td><td className="p-desc">Unauthorized — missing or invalid token</td><td className="p-desc">Re-login to get a fresh JWT</td></tr>
                <tr><td><span className="p-name">403</span></td><td className="p-desc">Forbidden — insufficient permissions</td><td className="p-desc">Use correct account credentials</td></tr>
                <tr><td><span className="p-name">429</span></td><td className="p-desc">Rate limit exceeded</td><td className="p-desc">Slow down requests; see rate limits below</td></tr>
                <tr><td><span className="p-name">500</span></td><td className="p-desc">Internal server error</td><td className="p-desc">Retry; contact support if persists</td></tr>
              </tbody>
            </table>
          </div>

          {/* RATE LIMITS */}
          <div className="doc-section" id="rate-limits">
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'22px',fontWeight:800,color:'var(--charcoal)',marginBottom:'14px',letterSpacing:'-.3px'}}>Rate Limits</h2>
            <table className="param-table">
              <thead><tr><th>Plan</th><th>Requests/minute</th><th>Requests/month</th></tr></thead>
              <tbody>
                <tr><td className="p-desc">Starter (Free)</td><td className="p-desc">60</td><td className="p-desc">1,000</td></tr>
                <tr><td className="p-desc">Business</td><td className="p-desc">300</td><td className="p-desc">100,000</td></tr>
                <tr><td className="p-desc">Enterprise</td><td className="p-desc">Unlimited</td><td className="p-desc">Unlimited</td></tr>
              </tbody>
            </table>
            <div className="note-box"><div className="note-icon">💡</div><div>Rate limit headers are included in every response: <span className="inline-code">X-RateLimit-Limit</span>, <span className="inline-code">X-RateLimit-Remaining</span>, and <span className="inline-code">X-RateLimit-Reset</span>.</div></div>
          </div>

        </main>
      </div>
    </>
  );
}