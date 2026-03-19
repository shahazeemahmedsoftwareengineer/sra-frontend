import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

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
        <title>Pricing — SRA Shield</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        .page-hero{padding:130px 0 70px;text-align:center;background:linear-gradient(160deg,#fff 0%,var(--peach) 60%,#fff 100%)}
        .b1{top:-100px;left:-120px;width:500px;height:500px;background:radial-gradient(circle,rgba(253,240,237,.9),transparent 70%)}
        .b2{top:-60px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(244,239,255,.85),transparent 70%)}
        .pricing-main{padding:60px 0 80px}
        .toggle-wrap{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:50px}
        .toggle-label{font-size:14px;font-weight:600;color:var(--gray)}
        .toggle-label.on{color:var(--charcoal)}
        .toggle{width:46px;height:25px;border-radius:100px;background:var(--charcoal);position:relative;cursor:pointer;transition:background .2s;border:none;outline:none}
        .toggle-knob{position:absolute;top:3px;left:3px;width:19px;height:19px;border-radius:50%;background:#fff;transition:transform .2s}
        .toggle.annual .toggle-knob{transform:translateX(21px)}
        .save-tag{background:var(--purple-l);color:var(--purple);font-size:11px;font-weight:700;padding:2px 8px;border-radius:100px}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start;margin-bottom:60px}
        .pc{background:#fff;border:1.5px solid var(--border);border-radius:24px;padding:32px;box-shadow:var(--sh-sm);transition:all .3s}
        .pc:hover{transform:translateY(-3px);box-shadow:var(--sh-md)}
        .pc.feat{background:var(--charcoal);border-color:transparent;box-shadow:var(--sh-xl);position:relative}
        .feat-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);white-space:nowrap;background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:100px}
        .pn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--gray);margin-bottom:16px}
        .pc.feat .pn{color:rgba(255,255,255,.4)}
        .pr{display:flex;align-items:baseline;gap:2px;margin-bottom:4px}
        .pa{font-family:'Urbanist',sans-serif;font-size:48px;font-weight:900;color:var(--charcoal);letter-spacing:-3px;line-height:1}
        .pc.feat .pa{color:#fff}
        .pper{font-size:14px;color:var(--gray)}
        .pc.feat .pper{color:rgba(255,255,255,.35)}
        .pd{font-size:13.5px;color:var(--gray);margin:12px 0 22px;line-height:1.6}
        .pc.feat .pd{color:rgba(255,255,255,.45)}
        .pb{width:100%;padding:13px;border-radius:100px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .22s;border:none}
        .pb.dark{background:var(--charcoal);color:#fff}.pb.dark:hover{background:#111}
        .pb.wh{background:#fff;color:var(--charcoal)}.pb.wh:hover{background:#f5f5f5}
        .pb.ol{background:transparent;color:var(--charcoal);border:1.5px solid var(--border)}.pb.ol:hover{border-color:var(--charcoal)}
        .pdiv{height:1px;background:var(--border);margin:22px 0}.pc.feat .pdiv{background:rgba(255,255,255,.08)}
        .pfeats{display:flex;flex-direction:column;gap:0}
        .pf{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--charcoal);padding:11px 0;border-bottom:1px solid var(--border)}
        .pf:last-child{border-bottom:none}
        .pc.feat .pf{color:rgba(255,255,255,.7);border-color:rgba(255,255,255,.07)}
        .pfck{width:20px;height:20px;border-radius:6px;background:#D1FAE5;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-top:1px}
        .pc.feat .pfck{background:rgba(139,92,246,.2)}
        .pfx{width:20px;height:20px;border-radius:6px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-top:1px;color:var(--gray2)}
        .compare-full{background:#fff;border:1.5px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--sh-sm);margin-bottom:60px}
        .cf-head{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;padding:16px 24px;background:var(--surface);border-bottom:1px solid var(--border)}
        .cfh{font-size:12px;font-weight:700;color:var(--gray);text-align:center;text-transform:uppercase;letter-spacing:.6px}
        .cfh:first-child{text-align:left}
        .cfh.hl{color:var(--charcoal)}
        .cf-row{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;padding:13px 24px;border-bottom:1px solid var(--border);transition:background .15s}
        .cf-row:last-child{border-bottom:none}.cf-row:hover{background:var(--surface)}
        .cf-feat{font-size:13.5px;color:var(--charcoal);font-weight:500}
        .cf-val{text-align:center;font-size:13px;font-weight:600;color:var(--gray)}
        .cf-val.y{color:var(--green)}.cf-val.n{color:rgba(180,180,180,.6)}
        .cf-group{padding:11px 24px;background:var(--surface);border-bottom:1px solid var(--border)}
        .cfg-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--gray2)}
        .faq-sec{padding:0 0 80px}
        .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
        .faq-item{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--sh-sm)}
        .fq{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:700;color:var(--charcoal);margin-bottom:8px}
        .fa{font-size:13.5px;color:var(--gray);line-height:1.65}
        @media(max-width:900px){
          .price-grid,.faq-grid{grid-template-columns:1fr}
          .cf-head,.cf-row{grid-template-columns:2fr 1fr 1fr}
        }
      `}} />
      
      {/* HERO */}
      <div className="page-hero">
        <div className="hero-bg">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
        </div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="sec-label fade-up">💰 Transparent Pricing</div>
          <h1 style={{fontSize:'clamp(40px,6vw,64px)',fontWeight:900,color:'var(--charcoal)',marginBottom:'16px',letterSpacing:'-2px'}} className="fade-up d1">Start free.<br/>Scale without surprises.</h1>
          <p style={{fontSize:'17px',color:'var(--gray)',maxWidth:'440px',margin:'0 auto',lineHeight:1.7}} className="fade-up d2">No hidden fees. No per-request traps. Simple, flat monthly pricing.</p>
        </div>
      </div>

      <section className="pricing-main">
        <div className="container">

          {/* BILLING TOGGLE */}
          <div className="toggle-wrap reveal">
            <span className={`toggle-label${!annual ? ' on' : ''}`}>Monthly</span>
            <button className={`toggle${annual ? ' annual' : ''}`} onClick={() => setAnnual(!annual)}>
              <div className="toggle-knob"></div>
            </button>
            <span className={`toggle-label${annual ? ' on' : ''}`}>Annual</span>
            <span className="save-tag">Save 20%</span>
          </div>

          {/* PRICING CARDS */}
          <div className="price-grid">
            <div className="pc reveal d1">
              <div className="pn">Starter</div>
              <div className="pr"><div className="pa">$0</div><div className="pper">/month</div></div>
              <p className="pd">For developers building and testing their integration.</p>
              <button className="pb ol" onClick={() => window.location.href='/register'}>Get started free</button>
              <div className="pdiv"></div>
              <div className="pfeats">
                <div className="pf"><div className="pfck">✓</div><span>1,000 API calls / month</span></div>
                <div className="pf"><div className="pfck">✓</div><span>1 encryption key</span></div>
                <div className="pf"><div className="pfck">✓</div><span>AES-256-GCM encryption</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Full API access</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Community support</span></div>
                <div className="pf"><div className="pfx">×</div><span style={{color:'var(--gray)'}}>Usage analytics</span></div>
                <div className="pf"><div className="pfx">×</div><span style={{color:'var(--gray)'}}>Priority support</span></div>
              </div>
            </div>

            <div className="pc feat reveal d2">
              <div className="feat-badge">✦ Most Popular</div>
              <div className="pn">Business</div>
              <div className="pr">
                <div className="pa">{annual ? '$39' : '$49'}</div>
                <div className="pper">/month</div>
              </div>
              <p className="pd">Everything a growing team needs to ship securely.</p>
              <button className="pb wh" onClick={() => window.location.href='/register'}>Start Business plan</button>
              <div className="pdiv"></div>
              <div className="pfeats">
                <div className="pf"><div className="pfck">✓</div><span>100,000 API calls / month</span></div>
                <div className="pf"><div className="pfck">✓</div><span>10 encryption keys</span></div>
                <div className="pf"><div className="pfck">✓</div><span>AES-256-GCM encryption</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Usage analytics dashboard</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Email support (24h SLA)</span></div>
                <div className="pf"><div className="pfck">✓</div><span>99.9% uptime SLA</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Security compliance docs</span></div>
              </div>
            </div>

            <div className="pc reveal d3">
              <div className="pn">Enterprise</div>
              <div className="pr"><div className="pa" style={{fontSize:'32px',letterSpacing:'-1px'}}>Custom</div></div>
              <p className="pd">For organizations with specific compliance, scale, or SLA requirements.</p>
              <button className="pb dark" onClick={() => window.location.href='mailto:hello@srashield.com'}>Contact us</button>
              <div className="pdiv"></div>
              <div className="pfeats">
                <div className="pf"><div className="pfck">✓</div><span>Unlimited API calls</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Unlimited keys</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Dedicated support manager</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Custom SLA + uptime guarantee</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Full pen test security report</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Private deployment option</span></div>
                <div className="pf"><div className="pfck">✓</div><span>Invoice billing</span></div>
              </div>
            </div>
          </div>

          {/* FULL COMPARE TABLE */}
          <div style={{textAlign:'center',marginBottom:'30px'}} className="reveal">
            <h2 className="sec-title" style={{fontSize:'28px'}}>Compare all plans</h2>
          </div>
          <div className="compare-full reveal">
            <div className="cf-head">
              <div className="cfh">Feature</div>
              <div className="cfh">Starter</div>
              <div className="cfh hl">Business</div>
              <div className="cfh">Enterprise</div>
            </div>
            <div className="cf-group"><div className="cfg-label">Usage</div></div>
            <div className="cf-row"><div className="cf-feat">API calls / month</div><div className="cf-val">1,000</div><div className="cf-val y">100,000</div><div className="cf-val">Unlimited</div></div>
            <div className="cf-row"><div className="cf-feat">Encryption keys</div><div className="cf-val">1</div><div className="cf-val y">10</div><div className="cf-val">Unlimited</div></div>
            <div className="cf-row"><div className="cf-feat">Requests per minute</div><div className="cf-val">60</div><div className="cf-val y">300</div><div className="cf-val">Unlimited</div></div>
            <div className="cf-group"><div className="cfg-label">Security</div></div>
            <div className="cf-row"><div className="cf-feat">AES-256-GCM Encryption</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">Multi-source entropy keys</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">Zero-knowledge architecture</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">Pen test security report</div><div className="cf-val n">—</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-group"><div className="cfg-label">Support</div></div>
            <div className="cf-row"><div className="cf-feat">Community support</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">Email support (24h SLA)</div><div className="cf-val n">—</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">Dedicated support manager</div><div className="cf-val n">—</div><div className="cf-val n">—</div><div className="cf-val y">✓</div></div>
            <div className="cf-group"><div className="cfg-label">Compliance</div></div>
            <div className="cf-row"><div className="cf-feat">HIPAA compliance docs</div><div className="cf-val n">—</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">99.9% uptime SLA</div><div className="cf-val n">—</div><div className="cf-val y">✓</div><div className="cf-val y">✓</div></div>
            <div className="cf-row"><div className="cf-feat">Invoice billing</div><div className="cf-val n">—</div><div className="cf-val n">—</div><div className="cf-val y">✓</div></div>
          </div>

          {/* FAQ */}
          <div className="faq-sec reveal">
            <div style={{textAlign:'center',marginBottom:'36px'}}>
              <div className="sec-label">❓ FAQ</div>
              <h2 className="sec-title">Common questions</h2>
            </div>
            <div className="faq-grid">
              <div className="faq-item">
                <div className="fq">Do I need a credit card to start?</div>
                <div className="fa">No. The Starter plan is completely free with no credit card required. Upgrade only when you need more calls.</div>
              </div>
              <div className="faq-item">
                <div className="fq">What happens if I exceed my plan limits?</div>
                <div className="fa">API calls return a 429 error after the limit. We'll email you before you hit the limit so you can upgrade without interruption.</div>
              </div>
              <div className="faq-item">
                <div className="fq">Can I cancel anytime?</div>
                <div className="fa">Yes. No long-term contracts. Cancel or downgrade from your account settings. You keep access until the end of your billing period.</div>
              </div>
              <div className="faq-item">
                <div className="fq">Is my data stored on SRA Shield servers?</div>
                <div className="fa">Never. Your plaintext is processed in memory and immediately discarded. We cannot access your data — zero-knowledge by design.</div>
              </div>
              <div className="faq-item">
                <div className="fq">Does pricing include VAT/GST?</div>
                <div className="fa">Prices shown are exclusive of taxes. Applicable VAT/GST will be calculated at checkout based on your billing address.</div>
              </div>
              <div className="faq-item">
                <div className="fq">Is there a discount for annual billing?</div>
                <div className="fa">Yes. Annual billing saves you 20% — equivalent to getting 2.4 months free compared to monthly billing.</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}