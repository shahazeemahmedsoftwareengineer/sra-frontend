import { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function HowItWorks() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) el.classList.add('on');
      }, { threshold: .1, rootMargin: '0px 0px -30px 0px' }).observe(el);
    });
  }, []);

  return (
    <>
      <Head>
        <title>How It Works — SRA Shield</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        .page-hero{padding:130px 0 70px;text-align:center;position:relative;overflow:hidden;background:linear-gradient(160deg,#fff 0%,var(--peach) 60%,var(--lavender) 100%)}
        .b1{top:-100px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(253,240,237,.9) 0%,transparent 70%)}
        .b2{top:-60px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(244,239,255,.9) 0%,transparent 70%)}
        .steps-section{padding:80px 0}
        .step-row{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;margin-bottom:100px}
        .step-row.rev{direction:rtl}.step-row.rev>*{direction:ltr}
        .step-number{font-family:'Urbanist',sans-serif;font-size:100px;font-weight:900;color:var(--border);line-height:1;letter-spacing:-6px;margin-bottom:-10px}
        .step-icon-lg{width:64px;height:64px;border-radius:18px;background:var(--purple-l);border:1.5px solid rgba(139,92,246,.15);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:18px}
        .step-title{font-family:'Urbanist',sans-serif;font-size:32px;font-weight:800;color:var(--charcoal);margin-bottom:12px;letter-spacing:-.5px}
        .step-desc{font-size:15.5px;color:var(--gray);line-height:1.75;margin-bottom:20px}
        .step-visual{background:#fff;border:1.5px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--sh-lg)}
        .sv-header{background:var(--charcoal);padding:14px 18px;display:flex;align-items:center;gap:9px}
        .sv-dots{display:flex;gap:5px}
        .sv-dots span{width:9px;height:9px;border-radius:50%}
        .sv-dots span:nth-child(1){background:#FF5F57}.sv-dots span:nth-child(2){background:#FFBD2E}.sv-dots span:nth-child(3){background:#28C840}
        .sv-label{font-size:11.5px;color:rgba(255,255,255,.4);font-family:monospace}
        .sv-body{padding:22px;background:#0F0F0F}
        pre.s{font-family:'SF Mono','Fira Code',monospace;font-size:12.5px;line-height:1.9;color:rgba(255,255,255,.8)}
        .sv-ui{padding:22px;background:#FAFAFA}
        .form-row{margin-bottom:14px}
        .fl{font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .fi{width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:10px;font-size:13px;background:#fff;color:var(--charcoal);outline:none;font-family:'Manrope',sans-serif}
        .fb{width:100%;padding:11px;border-radius:100px;background:var(--charcoal);color:#fff;border:none;font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;cursor:pointer}
        .key-display{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:18px}
        .kd-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--gray);margin-bottom:8px}
        .kd-val{font-family:'SF Mono','Fira Code',monospace;font-size:11.5px;color:var(--charcoal);word-break:break-all;background:var(--surface);padding:10px 12px;border-radius:8px;line-height:1.7}
        .kd-badge{display:inline-flex;align-items:center;gap:5px;margin-top:10px;font-size:11px;font-weight:600;color:var(--green)}
        .kd-dot{width:6px;height:6px;border-radius:50%;background:var(--green)}
        .enc-result{background:#0F0F0F;border-radius:12px;padding:16px;margin-top:16px}
        .er-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .er-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.4)}
        .er-ok{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--green)}
        .er-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s ease infinite}
        .er-val{font-family:'SF Mono','Fira Code',monospace;font-size:11px;color:var(--purple);line-height:1.7;word-break:break-all}
        .arrow-conn{display:flex;justify-content:center;align-items:center;gap:12px;margin:20px 0;font-size:12px;color:var(--gray);font-weight:600}
        .arrow-line{flex:1;height:1px;background:var(--border)}
        .tech-section{padding:80px 0;background:var(--charcoal)}
        .tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
        .tech-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:26px;transition:all .3s}
        .tech-card:hover{background:rgba(255,255,255,.07);transform:translateY(-3px)}
        .tc-icon{font-size:26px;margin-bottom:14px}
        .tc-title{font-family:'Urbanist',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:8px;letter-spacing:-.3px}
        .tc-desc{font-size:13px;color:rgba(255,255,255,.45);line-height:1.65}
        .cta-card{background:var(--charcoal);border-radius:28px;padding:72px;text-align:center;position:relative;overflow:hidden}
        @media(max-width:900px){
          .step-row,.step-row.rev{grid-template-columns:1fr;direction:ltr}
          .tech-grid{grid-template-columns:1fr}
          .cta-card{padding:44px 28px}
        }
      `}} />
      
      {/* HERO */}
      <div className="page-hero">
        <div className="hero-bg">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
        </div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="sec-label fade-up">⚡ Simple by Design</div>
          <h1 style={{fontSize:'clamp(40px,6vw,68px)',fontWeight:900,color:'var(--charcoal)',marginBottom:'16px',letterSpacing:'-2px'}} className="fade-up d1">From zero to encrypted<br/>in 30 minutes</h1>
          <p style={{fontSize:'17px',color:'var(--gray)',maxWidth:'480px',margin:'0 auto',lineHeight:1.7}} className="fade-up d2">No PhD in cryptography required. No infrastructure to manage. Just one API call between your data and enterprise-grade protection.</p>
        </div>
      </div>

      {/* STEPS */}
      <section className="steps-section">
        <div className="container">

          {/* Step 1 */}
          <div className="step-row reveal">
            <div>
              <div className="step-number">01</div>
              <div className="step-icon-lg">📝</div>
              <div className="step-title">Create your account</div>
              <p className="step-desc">Register in under 2 minutes. No credit card. No complex onboarding. You get immediate access to your dashboard and 1,000 free API calls.</p>
              <div className="check-list">
                <div className="check-item"><div className="check-icon">✓</div>Email + password — no OAuth complexity</div>
                <div className="check-item"><div className="check-icon">✓</div>JWT token issued on first login</div>
                <div className="check-item"><div className="check-icon">✓</div>Instant dashboard access</div>
              </div>
            </div>
            <div className="step-visual">
              <div className="sv-header"><div className="sv-dots"><span></span><span></span><span></span></div><div className="sv-label">register.srashield.com</div></div>
              <div className="sv-ui">
                <div style={{fontFamily:"'Urbanist',sans-serif",fontSize:'18px',fontWeight:800,color:'var(--charcoal)',marginBottom:'20px'}}>Create your account</div>
                <div className="form-row"><div className="fl">Email address</div><input className="fi" type="email" defaultValue="you@company.com" readOnly/></div>
                <div className="form-row"><div className="fl">Password</div><input className="fi" type="password" defaultValue="••••••••••" readOnly/></div>
                <div style={{marginBottom:'14px'}}><button className="fb">Create account →</button></div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'12px'}}>
                  <div style={{flex:1,height:'1px',background:'var(--border)'}}></div>
                  <div style={{fontSize:'11px',color:'var(--gray)'}}>or</div>
                  <div style={{flex:1,height:'1px',background:'var(--border)'}}></div>
                </div>
                <div style={{textAlign:'center',fontSize:'12px',color:'var(--gray)'}}>Already have an account? <Link href="/login" style={{color:'var(--purple)',fontWeight:600}}>Sign in</Link></div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-row rev reveal">
            <div>
              <div className="step-number">02</div>
              <div className="step-icon-lg">🔑</div>
              <div className="step-title">Generate your encryption key</div>
              <p className="step-desc">One click. Our proprietary entropy engine generates a cryptographically random key using multiple unpredictable sources — including Ethereum blockchain transactions and seismic data.</p>
              <div className="check-list">
                <div className="check-item"><div className="check-icon">✓</div>256-bit key from multi-source entropy</div>
                <div className="check-item"><div className="check-icon">✓</div>Only you hold the key</div>
                <div className="check-item"><div className="check-icon">✓</div>Generate up to 10 keys on Business plan</div>
              </div>
            </div>
            <div className="step-visual">
              <div className="sv-header"><div className="sv-dots"><span></span><span></span><span></span></div><div className="sv-label">POST /api/v1/shield/keys/generate</div></div>
              <div className="sv-body">
                <pre className="s"><span className="c-c">{'// Generate your encryption key'}</span>{'\n'}<span className="c-k">const</span>{' response = '}<span className="c-k">await</span>{' fetch('}<span className="c-s">{'\'api/v1/shield/keys/generate\''}</span>{', {\n  method: '}<span className="c-s">{'\'POST\''}</span>{',\n  headers: \{'}<span className="c-s">{' Authorization'}</span>{': '}<span className="c-n">{'`Bearer ${token}`'}</span>{' \}\n});\n\n'}<span className="c-c">{'// Response'}</span>{'\n{\n  '}<span className="c-s">{'"status"'}</span>{': '}<span className="c-s">{'"success"'}</span>{',\n  '}<span className="c-s">{'"data"'}</span>{': \{\n    '}<span className="c-s">{'"encryptionKey"'}</span>{': '}<span className="c-m">{'"a053b13dfa84f716..."'}</span>{'\n  \}\n}'}</pre>
              </div>
              <div className="sv-ui" style={{padding:'16px 20px'}}>
                <div className="key-display">
                  <div className="kd-label">Your Encryption Key</div>
                  <div className="kd-val">a053b13dfa84f7164da57602c9586b32889185a0772e7de23836c791</div>
                  <div className="kd-badge"><div className="kd-dot"></div>Active &amp; ready to use</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-row reveal">
            <div>
              <div className="step-number">03</div>
              <div className="step-icon-lg">⚡</div>
              <div className="step-title">Encrypt with one API call</div>
              <p className="step-desc">Send any text — patient records, financial data, legal documents — and get back an AES-256-GCM encrypted string. Under 50ms. Works with Python, JavaScript, PHP, Java, or any HTTP client.</p>
              <div className="check-list">
                <div className="check-item"><div className="check-icon">✓</div>POST /api/v1/shield/encrypt</div>
                <div className="check-item"><div className="check-icon">✓</div>AES-256-GCM algorithm</div>
                <div className="check-item"><div className="check-icon">✓</div>Average response: &lt;50ms</div>
              </div>
            </div>
            <div className="step-visual">
              <div className="sv-header"><div className="sv-dots"><span></span><span></span><span></span></div><div className="sv-label">POST /api/v1/shield/encrypt</div></div>
              <div className="sv-body">
                <pre className="s"><span className="c-c">{'// Encrypt sensitive data'}</span>{'\n'}<span className="c-k">const</span>{' result = '}<span className="c-k">await</span>{' fetch('}<span className="c-s">{'\'api/v1/shield/encrypt\''}</span>{', {\n  method: '}<span className="c-s">{'\'POST\''}</span>{',\n  headers: \{\n    '}<span className="c-s">{'\'Authorization\''}</span>{': '}<span className="c-n">{'`Bearer ${token}`'}</span>{',\n    '}<span className="c-s">{'\'Content-Type\''}</span>{': '}<span className="c-s">{'\'application/json\''}</span>{'\n  \},\n  body: JSON.stringify(\{\n    '}<span className="c-s">{'plaintext'}</span>{': '}<span className="c-m">{'"Patient: John Doe, DOB: 1985-03-12"'}</span>{'\n  \})\n});'}</pre>
              </div>
              <div className="sv-ui" style={{padding:'16px 20px'}}>
                <div className="arrow-conn"><div className="arrow-line"></div><span>Response</span><div className="arrow-line"></div></div>
                <div className="enc-result">
                  <div className="er-top"><div className="er-label">Encrypted Output</div><div className="er-ok"><div className="er-dot"></div>200 OK</div></div>
                  <div className="er-val">SRA_ENC_IjIiOiJlbmMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InN...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="step-row rev reveal">
            <div>
              <div className="step-number">04</div>
              <div className="step-icon-lg">🔓</div>
              <div className="step-title">Decrypt when you need it</div>
              <p className="step-desc">Pass the encrypted string back to the decrypt endpoint anytime. Only requests authenticated with your JWT can decrypt. The data was never readable to anyone else — including us.</p>
              <div className="check-list">
                <div className="check-item"><div className="check-icon">✓</div>Zero-knowledge — we never see your plaintext</div>
                <div className="check-item"><div className="check-icon">✓</div>JWT-authenticated decryption only</div>
                <div className="check-item"><div className="check-icon">✓</div>Original data returned exactly</div>
              </div>
            </div>
            <div className="step-visual">
              <div className="sv-header"><div className="sv-dots"><span></span><span></span><span></span></div><div className="sv-label">POST /api/v1/shield/decrypt</div></div>
              <div className="sv-body">
                <pre className="s"><span className="c-c">{'// Decrypt your data'}</span>{'\n'}<span className="c-k">const</span>{' plain = '}<span className="c-k">await</span>{' fetch('}<span className="c-s">{'\'api/v1/shield/decrypt\''}</span>{', {\n  method: '}<span className="c-s">{'\'POST\''}</span>{',\n  headers: \{\n    '}<span className="c-s">{'\'Authorization\''}</span>{': '}<span className="c-n">{'`Bearer ${token}`'}</span>{',\n    '}<span className="c-s">{'\'Content-Type\''}</span>{': '}<span className="c-s">{'\'application/json\''}</span>{'\n  \},\n  body: JSON.stringify(\{\n    '}<span className="c-s">{'encrypted'}</span>{': '}<span className="c-m">{'"SRA_ENC_IjIiOiJlbmMiLCJ0..."'}</span>{'\n  \})\n});\n\n'}<span className="c-c">{'// Result'}</span>{'\n{\n  '}<span className="c-s">{'"data"'}</span>{': \{\n    '}<span className="c-s">{'"plaintext"'}</span>{': '}<span className="c-m">{'"Patient: John Doe, DOB: 1985-03-12"'}</span>{'\n  \}\n}'}</pre>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TECH DETAILS */}
      <section className="tech-section">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label" style={{background:'rgba(139,92,246,.15)',borderColor:'rgba(139,92,246,.2)',color:'var(--purple)'}}>🔬 Under the Hood</div>
            <h2 style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:800,color:'#fff',marginBottom:'12px',letterSpacing:'-.5px'}}>What makes it military-grade</h2>
            <p style={{fontSize:'15px',color:'rgba(255,255,255,.45)',maxWidth:'440px',margin:'0 auto'}}>Every layer of the stack is hardened.</p>
          </div>
          <div className="tech-grid">
            <div className="tech-card reveal d1">
              <div className="tc-icon">🔐</div>
              <div className="tc-title">AES-256-GCM</div>
              <p className="tc-desc">The same standard used by the US military and NSA for classified data. Galois/Counter Mode provides both encryption and authentication.</p>
            </div>
            <div className="tech-card reveal d2">
              <div className="tc-icon">🎲</div>
              <div className="tc-title">Multi-Source Entropy</div>
              <p className="tc-desc">Keys are generated using Ethereum blockchain transactions, USGS seismic feeds, system entropy, and cryptographic random — making them truly unpredictable.</p>
            </div>
            <div className="tech-card reveal d3">
              <div className="tc-icon">🎫</div>
              <div className="tc-title">JWT Authentication</div>
              <p className="tc-desc">Every API call requires a signed JWT. Tokens expire after 30 days. Refresh tokens rotate on every use to prevent replay attacks.</p>
            </div>
            <div className="tech-card reveal d1">
              <div className="tc-icon">🛡️</div>
              <div className="tc-title">Zero-Knowledge Design</div>
              <p className="tc-desc">We process your data in memory only. Nothing is stored. Not even our engineers can see your plaintext — cryptographically impossible.</p>
            </div>
            <div className="tech-card reveal d2">
              <div className="tc-icon">⚡</div>
              <div className="tc-title">Rate Limiting</div>
              <p className="tc-desc">IP-based and account-based rate limiting prevents brute force and DDoS attacks. Sliding window algorithm with automatic backoff.</p>
            </div>
            <div className="tech-card reveal d3">
              <div className="tc-icon">🔒</div>
              <div className="tc-title">bcrypt Passwords</div>
              <p className="tc-desc">User passwords are hashed with bcrypt at cost factor 12. Even if the database were stolen, passwords remain computationally infeasible to crack.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 0',background:'#fff'}}>
        <div className="container">
          <div className="cta-card reveal">
            <div style={{position:'absolute',top:'-150px',left:'-100px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,.3) 0%,transparent 70%)'}}></div>
            <div style={{position:'relative',zIndex:1}}>
              <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'clamp(32px,5vw,50px)',fontWeight:900,color:'#fff',letterSpacing:'-2px',marginBottom:'12px'}}>Ready to start?</h2>
              <p style={{fontSize:'16px',color:'rgba(255,255,255,.5)',marginBottom:'30px',maxWidth:'380px',marginLeft:'auto',marginRight:'auto'}}>Takes 30 minutes. Protects forever.</p>
              <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
                <Link href="/register" className="btn btn-lg btn-white">Get started free →</Link>
                <Link href="/docs" className="btn btn-lg btn-ghost-white">Read the docs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}