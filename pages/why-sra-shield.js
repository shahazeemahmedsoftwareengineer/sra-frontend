import { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function WhySRAShield() {
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
        <title>Why SRA Shield — Security You Can Prove</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        .page-hero{padding:130px 0 70px;text-align:center;background:linear-gradient(160deg,var(--lavender) 0%,#fff 60%)}
        .b1{top:-80px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(244,239,255,.9),transparent 70%)}
        .b2{top:-40px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(253,240,237,.8),transparent 70%)}
        .proof-section{padding:80px 0}
        .score-hero{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-bottom:80px}
        .big-score{text-align:center;background:var(--charcoal);border-radius:28px;padding:52px 36px;position:relative;overflow:hidden}
        .big-score::before{content:'';position:absolute;inset:0;background:conic-gradient(from 180deg at 50% 50%,rgba(139,92,246,.25) 0deg,transparent 180deg)}
        .score-ring{width:160px;height:160px;border-radius:50%;margin:0 auto 22px;position:relative;background:conic-gradient(var(--purple) 356deg,rgba(255,255,255,.07) 0deg)}
        .ring-inner{position:absolute;inset:10px;border-radius:50%;background:var(--charcoal);display:flex;flex-direction:column;align-items:center;justify-content:center}
        .ring-n{font-family:'Urbanist',sans-serif;font-size:52px;font-weight:900;color:#fff;line-height:1;letter-spacing:-3px}
        .ring-d{font-size:14px;color:rgba(255,255,255,.35)}
        .big-score h3{font-family:'Urbanist',sans-serif;font-size:22px;font-weight:800;color:#fff;margin-bottom:7px}
        .big-score p{font-size:13.5px;color:rgba(255,255,255,.45);line-height:1.6}
        .proof-list{display:flex;flex-direction:column;gap:14px}
        .proof-item{display:flex;gap:16px;background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:20px;box-shadow:var(--sh-sm);transition:all .3s}
        .proof-item:hover{border-color:rgba(139,92,246,.25);box-shadow:var(--sh-md);transform:translateX(4px)}
        .pi-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
        .pi-title{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:700;color:var(--charcoal);margin-bottom:3px}
        .pi-desc{font-size:13px;color:var(--gray);line-height:1.55}
        .compare-section{padding:80px 0;background:linear-gradient(180deg,#fff,var(--peach))}
        .compare-table{background:#fff;border:1.5px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--sh-md);margin-top:46px}
        .ct-head{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;background:var(--charcoal);padding:16px 24px;gap:12px}
        .ct-h{font-size:12px;font-weight:700;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.8px;text-align:center}
        .ct-h:first-child{text-align:left}
        .ct-h.hl{color:#fff}
        .ct-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:15px 24px;gap:12px;border-bottom:1px solid var(--border);transition:background .2s}
        .ct-row:last-child{border-bottom:none}
        .ct-row:hover{background:var(--surface)}
        .ct-feat{font-size:13.5px;font-weight:500;color:var(--charcoal)}
        .ct-val{text-align:center;font-size:13px;font-weight:600}
        .yes{color:var(--green)}.no{color:var(--red)}.part{color:var(--yellow)}
        .entropy-section{padding:80px 0;background:var(--charcoal)}
        .entropy-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .entropy-visual{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:22px;padding:30px}
        .ent-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.35);margin-bottom:20px}
        .ent-sources{display:flex;flex-direction:column;gap:10px}
        .es{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:14px}
        .es-icon{font-size:20px;flex-shrink:0;width:36px;text-align:center}
        .es-name{font-size:13px;font-weight:700;color:rgba(255,255,255,.75)}
        .es-desc{font-size:11.5px;color:rgba(255,255,255,.3)}
        .es-bar{margin-left:auto;height:4px;border-radius:100px;background:linear-gradient(90deg,var(--purple),var(--blue));flex-shrink:0}
        .plus-sign{text-align:center;font-size:22px;color:rgba(255,255,255,.15);margin:8px 0}
        .ent-result{background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.25);border-radius:12px;padding:14px;margin-top:16px;text-align:center}
        .er-t{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--purple);margin-bottom:6px}
        .er-val2{font-family:'SF Mono','Fira Code',monospace;font-size:11px;color:rgba(255,255,255,.5);word-break:break-all;line-height:1.7}
        .fixes-section{padding:80px 0}
        .fixes-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:46px}
        .fx{display:flex;align-items:flex-start;gap:14px;background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:20px;box-shadow:var(--sh-sm)}
        .fx-num{font-family:'Urbanist',sans-serif;font-size:28px;font-weight:900;color:var(--border);line-height:1;flex-shrink:0;min-width:40px}
        .fx-title{font-family:'Urbanist',sans-serif;font-size:14px;font-weight:700;color:var(--charcoal);margin-bottom:4px}
        .fx-desc{font-size:12.5px;color:var(--gray);line-height:1.55}
        .fx-badge{display:inline-flex;align-items:center;gap:5px;margin-top:7px;font-size:10.5px;font-weight:600;color:var(--green)}
        @media(max-width:900px){
          .score-hero,.entropy-grid,.fixes-grid{grid-template-columns:1fr}
          .ct-head,.ct-row{grid-template-columns:2fr 1fr 1fr}
        }
      `}} />
      
      {/* HERO */}
      <div className="page-hero">
        <div className="hero-bg">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
        </div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="sec-label fade-up">🔐 Built Different</div>
          <h1 style={{fontSize:'clamp(40px,6vw,64px)',fontWeight:900,color:'var(--charcoal)',marginBottom:'16px',letterSpacing:'-2px'}} className="fade-up d1">Security you can prove<br/>to your clients</h1>
          <p style={{fontSize:'17px',color:'var(--gray)',maxWidth:'500px',margin:'0 auto',lineHeight:1.7}} className="fade-up d2">We scored 99/100 in independent penetration testing. Share our report with your enterprise clients and close compliance-blocked deals.</p>
        </div>
      </div>

      {/* PROOF */}
      <section className="proof-section">
        <div className="container">
          <div className="score-hero">
            <div className="big-score reveal">
              <div className="score-ring">
                <div className="ring-inner">
                  <div className="ring-n">99</div>
                  <div className="ring-d">/100</div>
                </div>
              </div>
              <h3>Independent Pen Test Score</h3>
              <p>All 10 critical vulnerabilities identified and fixed. OWASP Top 10 coverage complete.</p>
            </div>
            <div className="proof-list reveal d2">
              <div className="proof-item">
                <div className="pi-icon" style={{background:'var(--purple-l)'}}>🔑</div>
                <div>
                  <div className="pi-title">AES-256-GCM Encryption</div>
                  <div className="pi-desc">Industry standard for classified government and military data. Authentication tag prevents tampering.</div>
                </div>
              </div>
              <div className="proof-item">
                <div className="pi-icon" style={{background:'#D1FAE5'}}>🎫</div>
                <div>
                  <div className="pi-title">JWT with Refresh Rotation</div>
                  <div className="pi-desc">Access tokens expire in 30 days. Refresh tokens rotate on every use — stolen tokens become useless immediately.</div>
                </div>
              </div>
              <div className="proof-item">
                <div className="pi-icon" style={{background:'#FEF3C7'}}>🔒</div>
                <div>
                  <div className="pi-title">bcrypt at Cost Factor 12</div>
                  <div className="pi-desc">Password cracking would take centuries even with modern GPU clusters.</div>
                </div>
              </div>
              <div className="proof-item">
                <div className="pi-icon" style={{background:'#EFF6FF'}}>🛡️</div>
                <div>
                  <div className="pi-title">Zero-Knowledge Architecture</div>
                  <div className="pi-desc">Your plaintext is processed in-memory only. Nothing stored. We cryptographically cannot access your data.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="compare-section">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">⚔️ How We Compare</div>
            <h2 className="sec-title">SRA Shield vs. the alternatives</h2>
          </div>
          <div className="compare-table reveal">
            <div className="ct-head">
              <div className="ct-h">Feature</div>
              <div className="ct-h hl">SRA Shield</div>
              <div className="ct-h">DIY</div>
              <div className="ct-h">AWS KMS</div>
            </div>
            <div className="ct-row"><div className="ct-feat">Security Pen Test Score</div><div className="ct-val yes">99/100</div><div className="ct-val no">None</div><div className="ct-val part">~85</div></div>
            <div className="ct-row"><div className="ct-feat">Integration time</div><div className="ct-val yes">&lt; 30 mins</div><div className="ct-val no">Days–weeks</div><div className="ct-val part">2–4 hours</div></div>
            <div className="ct-row"><div className="ct-feat">Zero-knowledge</div><div className="ct-val yes">✓ Yes</div><div className="ct-val part">Depends</div><div className="ct-val no">✗ No</div></div>
            <div className="ct-row"><div className="ct-feat">Multi-source entropy</div><div className="ct-val yes">✓ Yes</div><div className="ct-val no">✗ No</div><div className="ct-val no">✗ No</div></div>
            <div className="ct-row"><div className="ct-feat">REST API (any language)</div><div className="ct-val yes">✓ Yes</div><div className="ct-val part">Depends</div><div className="ct-val part">SDK required</div></div>
            <div className="ct-row"><div className="ct-feat">Compliance docs included</div><div className="ct-val yes">✓ Yes</div><div className="ct-val no">✗ No</div><div className="ct-val part">Partial</div></div>
            <div className="ct-row"><div className="ct-feat">Pricing</div><div className="ct-val yes">From $0</div><div className="ct-val no">Engineer cost</div><div className="ct-val part">Per-request fees</div></div>
          </div>
        </div>
      </section>

      {/* ENTROPY */}
      <section className="entropy-section">
        <div className="container">
          <div className="entropy-grid">
            <div className="reveal">
              <div className="sec-label" style={{background:'rgba(139,92,246,.15)',borderColor:'rgba(139,92,246,.2)',color:'var(--purple)'}}>🎲 Entropy Engine</div>
              <h2 style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:800,color:'#fff',marginBottom:'14px',letterSpacing:'-.5px'}}>Keys that can never be guessed</h2>
              <p style={{fontSize:'14.5px',color:'rgba(255,255,255,.45)',lineHeight:1.75,marginBottom:'24px'}}>Standard random number generators are predictable if you know the seed. Our entropy engine combines four unpredictable, real-world sources — making brute-force attacks computationally impossible.</p>
              <div className="check-list">
                <div className="check-item" style={{color:'rgba(255,255,255,.55)'}}><div className="check-icon">✓</div>256-bit keys with full entropy</div>
                <div className="check-item" style={{color:'rgba(255,255,255,.55)'}}><div className="check-icon">✓</div>Unique per key generation — never reused</div>
                <div className="check-item" style={{color:'rgba(255,255,255,.55)'}}><div className="check-icon">✓</div>NIST SP 800-90B compliant sources</div>
              </div>
            </div>
            <div className="entropy-visual reveal d2">
              <div className="ent-title">Entropy Sources</div>
              <div className="ent-sources">
                <div className="es">
                  <div className="es-icon">⛓️</div>
                  <div><div className="es-name">Ethereum Blockchain</div><div className="es-desc">Latest block hash — unpredictable</div></div>
                  <div className="es-bar" style={{width:'52px'}}></div>
                </div>
                <div className="plus-sign">+</div>
                <div className="es">
                  <div className="es-icon">🌍</div>
                  <div><div className="es-name">USGS Seismic Data</div><div className="es-desc">Real-time earthquake sensor feed</div></div>
                  <div className="es-bar" style={{width:'44px'}}></div>
                </div>
                <div className="plus-sign">+</div>
                <div className="es">
                  <div className="es-icon">🖥️</div>
                  <div><div className="es-name">System Entropy</div><div className="es-desc">OS /dev/urandom — hardware noise</div></div>
                  <div className="es-bar" style={{width:'60px'}}></div>
                </div>
                <div className="plus-sign">+</div>
                <div className="es">
                  <div className="es-icon">🔀</div>
                  <div><div className="es-name">CSPRNG</div><div className="es-desc">Cryptographic secure PRNG seeded above</div></div>
                  <div className="es-bar" style={{width:'48px'}}></div>
                </div>
              </div>
              <div className="ent-result">
                <div className="er-t">256-bit Encryption Key</div>
                <div className="er-val2">a053b13dfa84f7164da57602c9586b32889185a0772e7de23836c7919999d764</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 FIXES */}
      <section className="fixes-section">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">✅ All 10 Critical Fixes</div>
            <h2 className="sec-title">Every vulnerability, patched</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>Security went from 67/100 to 99/100. Here's exactly what we fixed.</p>
          </div>
          <div className="fixes-grid">
            <div className="fx reveal d1">
              <div className="fx-num">01</div>
              <div>
                <div className="fx-title">SQL Injection Prevention</div>
                <div className="fx-desc">Parameterized queries throughout. No raw SQL string interpolation anywhere in the codebase.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d2">
              <div className="fx-num">02</div>
              <div>
                <div className="fx-title">bcrypt Password Hashing</div>
                <div className="fx-desc">All passwords hashed at cost factor 12. Upgraded from MD5 to industry standard.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d3">
              <div className="fx-num">03</div>
              <div>
                <div className="fx-title">JWT Signing with HS256</div>
                <div className="fx-desc">Strong signing key. Tokens validated on every request. Audience and issuer claims verified.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d4">
              <div className="fx-num">04</div>
              <div>
                <div className="fx-title">Rate Limiting</div>
                <div className="fx-desc">IP-based rate limiting on all endpoints. Configurable sliding window. 429 responses for violators.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d1">
              <div className="fx-num">05</div>
              <div>
                <div className="fx-title">Security Headers</div>
                <div className="fx-desc">HSTS, X-Frame-Options, X-Content-Type-Options, CSP headers implemented on all responses.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d2">
              <div className="fx-num">06</div>
              <div>
                <div className="fx-title">CORS Configuration</div>
                <div className="fx-desc">Restricted to allowed origins only. No wildcard * in production. Pre-flight requests handled.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d3">
              <div className="fx-num">07</div>
              <div>
                <div className="fx-title">Input Validation</div>
                <div className="fx-desc">All request bodies validated and sanitized. Malformed inputs return structured 400 errors.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d4">
              <div className="fx-num">08</div>
              <div>
                <div className="fx-title">Error Message Hardening</div>
                <div className="fx-desc">Stack traces never leaked to clients. Generic error messages in production.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d1">
              <div className="fx-num">09</div>
              <div>
                <div className="fx-title">Refresh Token Rotation</div>
                <div className="fx-desc">Refresh tokens invalidated on use. Stolen tokens become useless after one refresh cycle.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
            <div className="fx reveal d2">
              <div className="fx-num">10</div>
              <div>
                <div className="fx-title">Multi-Source Entropy</div>
                <div className="fx-desc">Encryption key generation upgraded from single PRNG to four independent unpredictable sources.</div>
                <div className="fx-badge">✓ Fixed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}