import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function About() {
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
      <Head><title>About — SRA Shield</title></Head>

      <style dangerouslySetInnerHTML={{__html:`
        .page-hero{padding:130px 0 70px;text-align:center;background:linear-gradient(160deg,var(--lavender) 0%,#fff 60%,var(--peach) 100%);position:relative;overflow:hidden}
        .b1{top:-80px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(244,239,255,.9),transparent 70%)}
        .b2{top:-40px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(253,240,237,.8),transparent 70%)}
        .mission-section{padding:80px 0}
        .mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-bottom:80px}
        .mission-card{background:var(--charcoal);border-radius:28px;padding:48px;position:relative;overflow:hidden}
        .mission-card::before{content:'';position:absolute;top:-100px;right:-80px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.3) 0%,transparent 70%)}
        .mission-card::after{content:'';position:absolute;bottom:-80px;left:-60px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.2) 0%,transparent 70%)}
        .mission-inner{position:relative;z-index:1}
        .mission-stat{margin-bottom:28px}
        .ms-val{font-family:'Urbanist',sans-serif;font-size:56px;font-weight:900;color:#fff;line-height:1;letter-spacing:-3px}
        .ms-val span{color:var(--purple)}
        .ms-label{font-size:14px;color:rgba(255,255,255,.4);margin-top:4px}
        .mission-divider{height:1px;background:rgba(255,255,255,.08);margin:22px 0}
        .values-section{padding:0 0 80px}
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
        .value-card{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:28px;box-shadow:var(--sh-sm);transition:all .3s}
        .value-card:hover{transform:translateY(-4px);box-shadow:var(--sh-md);border-color:rgba(139,92,246,.2)}
        .vc-icon{font-size:28px;margin-bottom:16px}
        .vc-title{font-family:'Urbanist',sans-serif;font-size:18px;font-weight:800;color:var(--charcoal);margin-bottom:8px;letter-spacing:-.3px}
        .vc-desc{font-size:13.5px;color:var(--gray);line-height:1.7}
        .story-section{padding:80px 0;background:linear-gradient(180deg,#fff,var(--peach) 60%,#fff)}
        .story-inner{max-width:720px;margin:0 auto;text-align:center}
        .story-text{font-size:17px;color:var(--gray);line-height:1.85;margin-bottom:24px}
        .story-text strong{color:var(--charcoal)}
        .team-section{padding:0 0 80px}
        .team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
        .team-card{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:28px;box-shadow:var(--sh-sm);text-align:center;transition:all .3s}
        .team-card:hover{transform:translateY(-4px);box-shadow:var(--sh-md)}
        .team-avatar{width:72px;height:72px;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#fff;font-family:'Urbanist',sans-serif}
        .team-name{font-family:'Urbanist',sans-serif;font-size:17px;font-weight:800;color:var(--charcoal);margin-bottom:4px}
        .team-role{font-size:13px;color:var(--purple);font-weight:600;margin-bottom:10px}
        .team-bio{font-size:13px;color:var(--gray);line-height:1.65}
        .cta-section{padding:0 0 100px}
        .cta-card{background:var(--charcoal);border-radius:28px;padding:72px;text-align:center;position:relative;overflow:hidden}
        .cta-card::before{content:'';position:absolute;top:-150px;left:-100px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.32) 0%,transparent 70%)}
        .cta-card::after{content:'';position:absolute;bottom:-100px;right:-80px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)}
        @media(max-width:900px){
          .mission-grid{grid-template-columns:1fr}
          .values-grid,.team-grid{grid-template-columns:1fr 1fr}
          .cta-card{padding:44px 28px}
        }
        @media(max-width:600px){
          .values-grid,.team-grid{grid-template-columns:1fr}
        }
      `}} />

      {/* HERO */}
      <div className="page-hero">
        <div className="hero-bg">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
        </div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="sec-label fade-up">🛡️ Our Mission</div>
          <h1 style={{fontSize:'clamp(40px,6vw,64px)',fontWeight:900,color:'var(--charcoal)',marginBottom:'16px',letterSpacing:'-2px'}} className="fade-up d1">
            Making enterprise security<br/>accessible to everyone
          </h1>
          <p style={{fontSize:'17px',color:'var(--gray)',maxWidth:'500px',margin:'0 auto',lineHeight:1.7}} className="fade-up d2">
            We believe every company — from a two-person startup to a Fortune 500 — deserves military-grade data protection without the complexity or cost.
          </p>
        </div>
      </div>

      {/* MISSION + STATS */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="reveal">
              <div className="sec-label">📖 Why We Exist</div>
              <h2 className="sec-title">Data breaches shouldn't be inevitable</h2>
              <p className="sec-sub" style={{marginBottom:'24px'}}>
                Every day, companies store sensitive customer data in plaintext databases — one SQL injection away from disaster. The tools to prevent this existed, but they were complex, expensive, and built for enterprises with dedicated security teams.
              </p>
              <p style={{fontSize:'15px',color:'var(--gray)',lineHeight:1.75,marginBottom:'28px'}}>
                We built SRA Shield to change that. <strong style={{color:'var(--charcoal)'}}>One API call. Thirty minutes. Military-grade protection.</strong> No PhD in cryptography required.
              </p>
              <div className="check-list">
                <div className="check-item"><div className="check-icon">✓</div>Founded with a security-first philosophy</div>
                <div className="check-item"><div className="check-icon">✓</div>99/100 independent penetration test score</div>
                <div className="check-item"><div className="check-icon">✓</div>Zero-knowledge by design — we can't read your data</div>
                <div className="check-item"><div className="check-icon">✓</div>Built by engineers who've seen breaches firsthand</div>
              </div>
            </div>
            <div className="mission-card reveal d2">
              <div className="mission-inner">
                <div className="mission-stat">
                  <div className="ms-val">99<span>/100</span></div>
                  <div className="ms-label">Independent security pen test score</div>
                </div>
                <div className="mission-divider"></div>
                <div className="mission-stat">
                  <div className="ms-val">&lt;<span>50ms</span></div>
                  <div className="ms-label">Average API response time</div>
                </div>
                <div className="mission-divider"></div>
                <div className="mission-stat">
                  <div className="ms-val">AES<span>-256</span></div>
                  <div className="ms-label">Military-grade encryption standard</div>
                </div>
                <div className="mission-divider"></div>
                <div className="mission-stat" style={{marginBottom:0}}>
                  <div className="ms-val">99.9<span>%</span></div>
                  <div className="ms-label">Uptime SLA on paid plans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">💡 Our Values</div>
            <h2 className="sec-title">What we stand for</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>Every decision we make is guided by these principles.</p>
          </div>
          <div className="values-grid">
            <div className="value-card reveal d1">
              <div className="vc-icon">🔐</div>
              <div className="vc-title">Security First</div>
              <p className="vc-desc">Security is never an afterthought. Every feature, every API endpoint, every line of code is reviewed through a security lens before it ships.</p>
            </div>
            <div className="value-card reveal d2">
              <div className="vc-icon">👁️</div>
              <div className="vc-title">Radical Transparency</div>
              <p className="vc-desc">We publish our pen test scores. We document every vulnerability we fixed. If you trust us with your customers' data, you deserve to know exactly how we protect it.</p>
            </div>
            <div className="value-card reveal d3">
              <div className="vc-icon">⚡</div>
              <div className="vc-title">Developer Simplicity</div>
              <p className="vc-desc">Enterprise security shouldn't require enterprise complexity. If it takes more than 30 minutes to integrate, we've failed. We obsess over developer experience.</p>
            </div>
            <div className="value-card reveal d1">
              <div className="vc-icon">🌍</div>
              <div className="vc-title">Zero Knowledge</div>
              <p className="vc-desc">We built the system so that even we cannot access your data. This isn't a policy — it's a cryptographic guarantee baked into the architecture.</p>
            </div>
            <div className="value-card reveal d2">
              <div className="vc-icon">📈</div>
              <div className="vc-title">Accessible Pricing</div>
              <p className="vc-desc">A two-person startup and a 500-person company face the same threats. We price our service so that protecting customer data is never a budget decision.</p>
            </div>
            <div className="value-card reveal d3">
              <div className="vc-icon">🤝</div>
              <div className="vc-title">Customer Trust</div>
              <p className="vc-desc">We succeed when our customers pass their compliance audits and close their enterprise deals. Your security credibility is our success metric.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="story-section">
        <div className="container">
          <div className="story-inner reveal">
            <div className="sec-label" style={{justifyContent:'center'}}>📜 Our Story</div>
            <h2 className="sec-title" style={{fontSize:'clamp(28px,4vw,40px)'}}>Built after seeing too many breaches</h2>
            <p className="story-text">
              SRA Shield was born from frustration. Our founders spent years building software for healthcare and financial companies — watching the same story repeat itself. <strong>Sensitive customer data sitting in plaintext databases.</strong> Teams knowing they should encrypt it but finding every existing solution too complex, too expensive, or too unreliable.
            </p>
            <p className="story-text">
              The breaking point came when a client's database was breached. <strong>Thousands of patient records exposed.</strong> The data that caused the breach had never been encrypted — not because anyone was negligent, but because the team didn't have the time or expertise to implement it correctly.
            </p>
            <p className="story-text">
              We spent six months building what we wished had existed: a single API that any developer could integrate in an afternoon, backed by the same encryption standard used by the US military, with a security score we could prove to any enterprise compliance officer.
            </p>
            <p className="story-text" style={{marginBottom:0}}>
              <strong>That's SRA Shield.</strong> One API call. Real protection. No excuses left.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">👥 The Team</div>
            <h2 className="sec-title">Built by security engineers</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>People who've seen what happens when data isn't protected.</p>
          </div>
          <div className="team-grid">
            <div className="team-card reveal d1">
              <div className="team-avatar" style={{background:'linear-gradient(135deg,#8B5CF6,#60A5FA)'}}>S</div>
              <div className="team-name">Shahazeem Ahmed</div>
              <div className="team-role">Founder & CEO</div>
              <p className="team-bio">Full-stack engineer with deep experience in backend security, Kotlin, and API design. Built SRA Shield from the ground up after witnessing firsthand the cost of unencrypted data.</p>
            </div>
            <div className="team-card reveal d2">
              <div className="team-avatar" style={{background:'linear-gradient(135deg,#34D399,#60A5FA)'}}>A</div>
              <div className="team-name">Security Advisor</div>
              <div className="team-role">Head of Security</div>
              <p className="team-bio">Conducted the independent penetration test that took SRA Shield from 67/100 to 99/100. Oversees all security architecture decisions and compliance documentation.</p>
            </div>
            <div className="team-card reveal d3">
              <div className="team-avatar" style={{background:'linear-gradient(135deg,#FB923C,#F87171)'}}>E</div>
              <div className="team-name">Entropy Engineer</div>
              <div className="team-role">Cryptography Lead</div>
              <p className="team-bio">Designed the multi-source entropy engine that combines Ethereum blockchain data, USGS seismic feeds, and hardware noise to generate truly unpredictable encryption keys.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card reveal">
            <div style={{position:'absolute',top:'-150px',left:'-100px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,.32) 0%,transparent 70%)'}}></div>
            <div style={{position:'absolute',bottom:'-100px',right:'-80px',width:'340px',height:'340px',borderRadius:'50%',background:'radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)'}}></div>
            <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
              <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'clamp(34px,5vw,54px)',fontWeight:900,color:'#fff',letterSpacing:'-2px',lineHeight:1.05,marginBottom:'14px'}}>
                Join us in making<br/>data breaches history
              </h2>
              <p style={{fontSize:'16.5px',color:'rgba(255,255,255,.5)',marginBottom:'34px',maxWidth:'420px',marginLeft:'auto',marginRight:'auto'}}>
                Start protecting your customers' data today. Free to start, no credit card required.
              </p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',flexWrap:'wrap'}}>
                <Link href="/register" className="btn btn-lg btn-white">
                  Start for free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/why-sra-shield" className="btn btn-lg btn-ghost-white">View security report →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}