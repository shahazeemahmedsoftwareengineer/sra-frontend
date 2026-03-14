 import { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
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
        <title>SRA Shield — Military-Grade Encryption API</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        /* HERO */
        .hero{padding:140px 0 60px;position:relative;overflow:hidden}
        .hero-bg{position:absolute;inset:0;pointer-events:none}
        .b1{top:-120px;left:-180px;width:680px;height:680px;background:radial-gradient(circle,rgba(253,240,237,.85) 0%,transparent 70%)}
        .b2{top:-80px;right:-160px;width:580px;height:580px;background:radial-gradient(circle,rgba(244,239,255,.9) 0%,transparent 70%)}
        .b3{bottom:-60px;left:50%;transform:translateX(-50%);width:900px;height:420px;background:radial-gradient(ellipse,rgba(244,239,255,.5) 0%,transparent 65%)}
        .hero-content{position:relative;z-index:1;text-align:center}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px 6px 6px;border-radius:100px;background:#fff;border:1.5px solid var(--border);box-shadow:var(--sh-sm);margin-bottom:28px}
        .hb-dot{width:26px;height:26px;border-radius:100px;background:var(--purple-l);display:flex;align-items:center;justify-content:center}
        .hb-dot span{width:8px;height:8px;border-radius:50%;background:var(--purple);display:block;animation:pulse 2s ease infinite}
        .hero-badge p{font-size:13px;font-weight:500;color:var(--charcoal)}
        .hero-badge strong{color:var(--purple)}
        .hero h1{font-size:clamp(44px,6.5vw,76px);font-weight:900;color:var(--charcoal);margin-bottom:20px}
        .hero h1 .g{background:linear-gradient(135deg,var(--purple) 0%,var(--blue) 50%,var(--purple) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShift 4s ease infinite}
        .hero-sub{font-size:18px;line-height:1.7;color:var(--gray);max-width:520px;margin:0 auto 36px;font-weight:400}
        .hero-actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:56px}
        /* MOCKUP */
        .mockup-wrap{max-width:900px;margin:0 auto;position:relative}
        .mockup-wrap::before{content:'';position:absolute;bottom:-36px;left:50%;transform:translateX(-50%);width:65%;height:70px;background:radial-gradient(ellipse,rgba(139,92,246,.22) 0%,transparent 70%);filter:blur(20px)}
        .float-card{position:absolute;background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:13px 17px;box-shadow:var(--sh-lg);z-index:2}
        .fc1{left:-72px;top:80px;animation:floatSub 5s ease-in-out -2s infinite}
        .fc2{right:-72px;bottom:90px;animation:floatSub 5s ease-in-out -1s infinite}
        .fc-label{font-size:10px;color:var(--gray);font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
        .fc-val{font-family:'Urbanist',sans-serif;font-size:22px;font-weight:800;color:var(--charcoal)}
        .fc-sub{font-size:10.5px;color:var(--green);font-weight:600;margin-top:2px}
        .fc-icon{font-size:22px;margin-bottom:6px}
        .fc-mono{font-size:11px;font-family:monospace;color:var(--charcoal);font-weight:600}
        .mockup{background:#fff;border:1.5px solid rgba(229,231,235,.9);border-radius:20px;box-shadow:var(--sh-xl),0 0 0 1px rgba(255,255,255,.8) inset;overflow:hidden;animation:float 6s ease-in-out infinite}
        .m-topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:11px 16px;display:flex;align-items:center;gap:10px}
        .m-dots{display:flex;gap:5px}
        .m-dots span{width:10px;height:10px;border-radius:50%}
        .m-dots span:nth-child(1){background:#FF5F57}.m-dots span:nth-child(2){background:#FFBD2E}.m-dots span:nth-child(3){background:#28C840}
        .m-url{flex:1;background:#fff;border:1px solid var(--border);border-radius:6px;padding:4px 12px;font-size:12px;color:var(--gray)}
        .m-body{display:grid;grid-template-columns:210px 1fr;min-height:360px}
        .m-sidebar{background:var(--charcoal);padding:18px 14px;display:flex;flex-direction:column;gap:3px}
        .sb-logo{font-family:'Urbanist',sans-serif;font-size:14px;font-weight:800;color:#fff;padding:0 8px 14px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:6px;display:flex;align-items:center;gap:8px}
        .sb-logo-i{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,var(--purple),var(--blue));display:flex;align-items:center;justify-content:center;font-size:11px}
        .sb-item{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:8px;font-size:12px;color:rgba(255,255,255,.45);cursor:pointer;transition:all .2s}
        .sb-item.on{background:rgba(255,255,255,.1);color:#fff}
        .m-main{padding:22px;background:#FAFAFA}
        .m-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .m-title{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:800;color:var(--charcoal)}
        .m-btn{padding:5px 13px;border-radius:100px;font-size:11px;font-weight:700;color:#fff;background:var(--charcoal);border:none;cursor:pointer}
        .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:14px}
        .sc{background:#fff;border:1px solid var(--border);border-radius:11px;padding:13px;box-shadow:var(--sh-sm)}
        .sl{font-size:9.5px;color:var(--gray);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
        .sv{font-family:'Urbanist',sans-serif;font-size:19px;font-weight:800;color:var(--charcoal)}
        .sc-sub{font-size:9.5px;color:var(--green);font-weight:600;margin-top:2px}
        .sc-sub.d{color:var(--red)}
        .chart{background:#fff;border:1px solid var(--border);border-radius:11px;padding:13px;margin-bottom:11px;box-shadow:var(--sh-sm)}
        .ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .ct{font-size:11px;font-weight:700;color:var(--charcoal)}
        .cl{display:flex;gap:10px}
        .cli{display:flex;align-items:center;gap:4px;font-size:9.5px;color:var(--gray)}
        .cld{width:6px;height:6px;border-radius:50%}
        .bars{display:flex;align-items:flex-end;gap:5px;height:72px}
        .bc{flex:1;display:flex;flex-direction:column;gap:2px;align-items:center;justify-content:flex-end}
        .bar{width:100%;border-radius:3px 3px 0 0}
        .bp{background:var(--purple)}.bb{background:var(--blue)}
        .bx{font-size:8.5px;color:var(--gray);margin-top:3px}
        .keys{display:flex;flex-direction:column;gap:6px}
        .ki{background:#fff;border:1px solid var(--border);border-radius:8px;padding:9px 11px;display:flex;align-items:center;gap:8px;box-shadow:var(--sh-sm)}
        .kic{width:26px;height:26px;border-radius:7px;background:var(--purple-l);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
        .ki-info{flex:1;min-width:0}
        .kn{font-size:10.5px;font-weight:700;color:var(--charcoal)}
        .kh{font-size:9.5px;color:var(--gray);font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        /* TRUST */
        .trust{padding:36px 0 60px;text-align:center}
        .trust p{font-size:11.5px;font-weight:700;color:var(--gray2);text-transform:uppercase;letter-spacing:1.8px;margin-bottom:22px}
        .trust-logos{display:flex;align-items:center;justify-content:center;gap:44px;flex-wrap:wrap}
        .tl{font-family:'Urbanist',sans-serif;font-size:16px;font-weight:800;color:#D1D5DB;letter-spacing:-.3px;transition:color .2s}
        .tl:hover{color:#9CA3AF}
        /* HOW STEPS */
        .how{padding:84px 0;background:linear-gradient(180deg,#fff 0%,var(--peach) 50%,#fff 100%)}
        .how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:52px}
        .step{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:26px;position:relative;overflow:hidden;box-shadow:var(--sh-sm);transition:all .3s cubic-bezier(.22,1,.36,1)}
        .step:hover{transform:translateY(-4px);box-shadow:var(--sh-md);border-color:rgba(139,92,246,.25)}
        .step::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--purple),var(--blue));opacity:0;transition:opacity .3s}
        .step:hover::before{opacity:1}
        .sn{font-family:'Urbanist',sans-serif;font-size:44px;font-weight:900;color:var(--border);line-height:1;margin-bottom:14px;letter-spacing:-2px}
        .si{width:42px;height:42px;border-radius:12px;background:var(--purple-l);display:flex;align-items:center;justify-content:center;font-size:19px;margin-bottom:12px}
        .st{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:700;color:var(--charcoal);margin-bottom:7px}
        .sd{font-size:13px;color:var(--gray);line-height:1.6}
        /* USE CASES */
        .usesec{padding:84px 0;background:linear-gradient(180deg,#fff,var(--lavender) 50%,#fff)}
        .use-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:50px}
        .uc{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:30px;box-shadow:var(--sh-sm);transition:all .3s cubic-bezier(.22,1,.36,1);overflow:hidden;position:relative}
        .uc:hover{transform:translateY(-4px);box-shadow:var(--sh-md)}
        .uc-emoji{font-size:30px;margin-bottom:14px;display:block}
        .uc-title{font-family:'Urbanist',sans-serif;font-size:19px;font-weight:800;color:var(--charcoal);margin-bottom:8px;letter-spacing:-.3px}
        .uc-desc{font-size:13.5px;color:var(--gray);line-height:1.65;margin-bottom:18px}
        .tags{display:flex;flex-wrap:wrap;gap:5px}
        /* STATS */
        .stats{padding:60px 0;background:var(--charcoal)}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center}
        .sv2{font-family:'Urbanist',sans-serif;font-size:46px;font-weight:900;color:#fff;line-height:1;margin-bottom:6px;letter-spacing:-2px}
        .sv2 span{color:var(--purple)}
        .sl2{font-size:13.5px;color:rgba(255,255,255,.45)}
        /* SECURITY */
        .secsec{padding:84px 0}
        .sec-split{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .sec-card{background:var(--charcoal);border-radius:24px;padding:34px;position:relative;overflow:hidden}
        .sec-card::before{content:'';position:absolute;top:-100px;right:-100px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.3) 0%,transparent 70%)}
        .sec-card::after{content:'';position:absolute;bottom:-80px;left:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.2) 0%,transparent 70%)}
        .score-wrap{position:relative;z-index:1;display:flex;align-items:center;gap:22px;margin-bottom:26px}
        .score-circle{width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative}
        .score-circle::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(var(--purple) 356deg,rgba(255,255,255,.1) 0deg)}
        .score-inner{width:76px;height:76px;border-radius:50%;background:var(--charcoal);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:1}
        .score-n{font-family:'Urbanist',sans-serif;font-size:22px;font-weight:900;color:#fff;line-height:1}
        .score-d{font-size:10px;color:rgba(255,255,255,.35)}
        .score-info{position:relative;z-index:1}
        .score-t{font-family:'Urbanist',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:3px}
        .score-s{font-size:12.5px;color:rgba(255,255,255,.45)}
        .sec-feats{position:relative;z-index:1;display:flex;flex-direction:column;gap:9px}
        .sf{display:flex;align-items:center;gap:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);border-radius:11px;padding:11px 14px}
        .sf-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;box-shadow:0 0 7px rgba(52,211,153,.6)}
        .sf-t{font-size:13px;color:rgba(255,255,255,.75)}
        .sf-b{margin-left:auto;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;background:rgba(52,211,153,.12);color:var(--green);white-space:nowrap}
        /* PRICING */
        .pricesec{padding:84px 0;background:linear-gradient(180deg,#fff,var(--peach))}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:50px;align-items:start}
        .pc{background:#fff;border:1.5px solid var(--border);border-radius:22px;padding:30px;box-shadow:var(--sh-sm);transition:all .3s}
        .pc:hover{transform:translateY(-3px);box-shadow:var(--sh-md)}
        .pc.feat{background:var(--charcoal);border-color:transparent;box-shadow:var(--sh-xl);position:relative}
        .feat-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:100px;white-space:nowrap}
        .pn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--gray);margin-bottom:14px}
        .pc.feat .pn{color:rgba(255,255,255,.45)}
        .pr{display:flex;align-items:baseline;gap:3px;margin-bottom:5px}
        .pa{font-family:'Urbanist',sans-serif;font-size:42px;font-weight:900;color:var(--charcoal);letter-spacing:-2px;line-height:1}
        .pc.feat .pa{color:#fff}
        .pper{font-size:14px;color:var(--gray)}
        .pc.feat .pper{color:rgba(255,255,255,.4)}
        .pd{font-size:13px;color:var(--gray);margin-bottom:20px;line-height:1.55}
        .pc.feat .pd{color:rgba(255,255,255,.45)}
        .pdiv{height:1px;background:var(--border);margin-bottom:18px}
        .pc.feat .pdiv{background:rgba(255,255,255,.08)}
        .pfeats{display:flex;flex-direction:column;gap:9px;margin-bottom:24px}
        .pf{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--charcoal);padding-bottom:9px;border-bottom:1px solid var(--border)}
        .pf:last-child{border-bottom:none;padding-bottom:0}
        .pc.feat .pf{color:rgba(255,255,255,.75);border-color:rgba(255,255,255,.07)}
        .pfck{width:19px;height:19px;border-radius:5px;background:#D1FAE5;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
        .pc.feat .pfck{background:rgba(139,92,246,.2)}
        .pb{width:100%;padding:12px;border-radius:100px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .22s;border:1.5px solid var(--border)}
        .pb.dark{background:var(--charcoal);color:#fff;border-color:transparent}
        .pb.dark:hover{background:#111;transform:translateY(-1px)}
        .pb.wh{background:#fff;color:var(--charcoal);border-color:transparent}
        .pb.wh:hover{background:#F5F5F5}
        .pb.ol{background:transparent;color:var(--charcoal)}
        .pb.ol:hover{border-color:var(--charcoal);background:var(--surface)}
        /* TESTIMONIALS */
        .testsec{padding:84px 0}
        .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:50px}
        .tc{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:26px;box-shadow:var(--sh-sm);transition:all .3s}
        .tc:hover{transform:translateY(-3px);box-shadow:var(--sh-md)}
        .stars{color:var(--yellow);font-size:13px;margin-bottom:13px;letter-spacing:2px}
        .tq{font-size:13.5px;color:var(--charcoal);line-height:1.72;margin-bottom:18px;font-style:italic}
        .ta{display:flex;align-items:center;gap:10px}
        .tav{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0}
        .tname{font-size:13px;font-weight:700;color:var(--charcoal)}
        .trole{font-size:11.5px;color:var(--gray)}
        /* CTA */
        .ctasec{padding:80px 0 100px}
        .cta-card{background:var(--charcoal);border-radius:28px;padding:72px;text-align:center;position:relative;overflow:hidden}
        .cta-card::before{content:'';position:absolute;top:-150px;left:-100px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.32) 0%,transparent 70%)}
        .cta-card::after{content:'';position:absolute;bottom:-100px;right:-80px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)}
        .cta-inner{position:relative;z-index:1}
        .cta-title{font-family:'Urbanist',sans-serif;font-size:clamp(34px,5vw,54px);font-weight:900;color:#fff;letter-spacing:-2px;line-height:1.05;margin-bottom:14px}
        .cta-sub{font-size:16.5px;color:rgba(255,255,255,.5);margin-bottom:34px;max-width:420px;margin-left:auto;margin-right:auto}
        .cta-acts{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
        @media(max-width:900px){
          .how-grid,.use-grid,.price-grid,.test-grid,.stats-grid{grid-template-columns:1fr 1fr}
          .sec-split{grid-template-columns:1fr}
          .m-body{grid-template-columns:1fr}.m-sidebar{display:none}
          .float-card{display:none}
          .cta-card{padding:44px 28px}
        }
        @media(max-width:600px){
          .how-grid,.test-grid,.stats-grid{grid-template-columns:1fr}
        }
      `}} />
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
          <div className="blob b3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge fade-up">
              <div className="hb-dot"><span></span></div>
              <p>Security Score <strong>99/100</strong> — Penetration tested &amp; verified</p>
            </div>
            <h1 className="fade-up d1">Military-grade encryption<br/>for your <span className="g">business data</span></h1>
            <p className="hero-sub fade-up d2">Protect your customers' most sensitive data with a single API call. HIPAA-ready, bank-level security. Live in under 30 minutes.</p>
            <div className="hero-actions fade-up d3">
              <Link href="/register" className="btn btn-lg btn-dark">
                Start for free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/how-it-works" className="btn btn-lg btn-outline">See how it works</Link>
            </div>

            <div className="mockup-wrap fade-up d4">
              <div className="float-card fc1">
                <div className="fc-label">API Calls Today</div>
                <div className="fc-val">2,847</div>
                <div className="fc-sub">↑ 23% from yesterday</div>
              </div>
              <div className="float-card fc2">
                <div className="fc-icon">🔒</div>
                <div className="fc-label">Last Encrypted</div>
                <div className="fc-mono">SRA_ENC_a8f3k2...</div>
                <div className="fc-sub">2 seconds ago ✓</div>
              </div>
              <div className="mockup">
                <div className="m-topbar">
                  <div className="m-dots"><span></span><span></span><span></span></div>
                  <div className="m-url">🔒 app.srashield.com/dashboard</div>
                </div>
                <div className="m-body">
                  <div className="m-sidebar">
                    <div className="sb-logo"><div className="sb-logo-i">🛡</div>SRA Shield</div>
                    <div className="sb-item on">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="10" y="1" width="5" height="5" rx="1"/><rect x="1" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1"/></svg>
                      Overview
                    </div>
                    <div className="sb-item">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l2 4h4l-3.3 2.4 1.3 4L8 9 4 11.4l1.3-4L2 5h4z"/></svg>
                      My Keys
                    </div>
                    <div className="sb-item">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1,12 5,7 9,9 15,3"/></svg>
                      API Usage
                    </div>
                    <div className="sb-item">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v4l2.5 2"/></svg>
                      Activity
                    </div>
                  </div>
                  <div className="m-main">
                    <div className="m-head">
                      <div className="m-title">Dashboard Overview</div>
                      <div className="m-btn">+ New Key</div>
                    </div>
                    <div className="sg">
                      <div className="sc"><div className="sl">Total Calls</div><div className="sv">48.2K</div><div className="sc-sub">↑ 18% this month</div></div>
                      <div className="sc"><div className="sl">Keys Active</div><div className="sv">3</div><div className="sc-sub">2 primary</div></div>
                      <div className="sc"><div className="sl">Remaining</div><div className="sv">51.8K</div><div className="sc-sub d">48% used</div></div>
                    </div>
                    <div className="chart">
                      <div className="ch">
                        <div className="ct">API Activity — Last 7 days</div>
                        <div className="cl">
                          <div className="cli"><div className="cld" style={{background:'var(--purple)'}}></div>Encrypt</div>
                          <div className="cli"><div className="cld" style={{background:'var(--blue)'}}></div>Decrypt</div>
                        </div>
                      </div>
                      <div className="bars">
                        <div className="bc"><div className="bar bp" style={{height:'52px'}}></div><div className="bar bb" style={{height:'26px'}}></div><div className="bx">M</div></div>
                        <div className="bc"><div className="bar bp" style={{height:'36px'}}></div><div className="bar bb" style={{height:'18px'}}></div><div className="bx">T</div></div>
                        <div className="bc"><div className="bar bp" style={{height:'66px'}}></div><div className="bar bb" style={{height:'34px'}}></div><div className="bx">W</div></div>
                        <div className="bc"><div className="bar bp" style={{height:'45px'}}></div><div className="bar bb" style={{height:'24px'}}></div><div className="bx">T</div></div>
                        <div className="bc"><div className="bar bp" style={{height:'60px'}}></div><div className="bar bb" style={{height:'38px'}}></div><div className="bx">F</div></div>
                        <div className="bc"><div className="bar bp" style={{height:'28px'}}></div><div className="bar bb" style={{height:'15px'}}></div><div className="bx">S</div></div>
                        <div className="bc"><div className="bar bp" style={{height:'72px'}}></div><div className="bar bb" style={{height:'40px'}}></div><div className="bx">S</div></div>
                      </div>
                    </div>
                    <div className="keys">
                      <div className="ki"><div className="kic">🔑</div><div className="ki-info"><div className="kn">Production Key</div><div className="kh">SRA_KEY_a053b13dfa84f716...</div></div><span className="badge badge-green">Active</span></div>
                      <div className="ki"><div className="kic">🔑</div><div className="ki-info"><div className="kn">Staging Key</div><div className="kh">SRA_KEY_c29f8e4ab103d820...</div></div><span className="badge badge-gray">Staging</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <div className="trust">
        <div className="container">
          <p>Trusted by companies in healthcare, finance &amp; legal</p>
          <div className="trust-logos">
            <div className="tl">HealthCo</div>
            <div className="tl">FinanceHub</div>
            <div className="tl">LegalEdge</div>
            <div className="tl">SecureBank</div>
            <div className="tl">MedVault</div>
            <div className="tl">DataSafe</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS PREVIEW */}
      <section className="how">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">⚡ Simple Integration</div>
            <h2 className="sec-title">Live in under 30 minutes</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>No complex setup. No DevOps required. If you can make an API call, you can protect your data.</p>
          </div>
          <div className="how-grid">
            <div className="step reveal d1"><div className="sn">01</div><div className="si">📝</div><div className="st">Register</div><p className="sd">Create your account in under 2 minutes. No credit card required.</p></div>
            <div className="step reveal d2"><div className="sn">02</div><div className="si">🔑</div><div className="st">Generate Key</div><p className="sd">Your unique encryption key is generated from our proprietary entropy system.</p></div>
            <div className="step reveal d3"><div className="sn">03</div><div className="si">⚡</div><div className="st">Call the API</div><p className="sd">One POST request encrypts any data. Works with any language or framework.</p></div>
            <div className="step reveal d4"><div className="sn">04</div><div className="si">🛡️</div><div className="st">Protected</div><p className="sd">Your data is AES-256 encrypted. Only you can decrypt it with your key.</p></div>
          </div>
          <div style={{textAlign:'center',marginTop:'36px'}} className="reveal">
            <Link href="/how-it-works" className="btn btn-md btn-outline">See full walkthrough →</Link>
          </div>
        </div>
      </section>

      {/* USE CASES PREVIEW */}
      <section className="usesec">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">🎯 Use Cases</div>
            <h2 className="sec-title">Built for industries that<br/>cannot afford a breach</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>One breach costs an average of $4.5 million.</p>
          </div>
          <div className="use-grid">
            <div className="uc reveal d1"><span className="uc-emoji">🏥</span><div className="uc-title">Healthcare</div><p className="uc-desc">Encrypt patient records, test results, prescriptions. HIPAA compliance made simple.</p><div className="tags"><span className="tag">HIPAA Ready</span><span className="tag">Patient Records</span><span className="tag">Lab Results</span></div></div>
            <div className="uc reveal d2"><span className="uc-emoji">🏦</span><div className="uc-title">Financial Services</div><p className="uc-desc">Protect account numbers, KYC documents, credit data. Bank-level encryption, startup-level cost.</p><div className="tags"><span className="tag">KYC Docs</span><span className="tag">PCI Ready</span><span className="tag">Transactions</span></div></div>
            <div className="uc reveal d3"><span className="uc-emoji">⚖️</span><div className="uc-title">Legal Firms</div><p className="uc-desc">Keep client data, contracts, case files completely private. Privilege protected cryptographically.</p><div className="tags"><span className="tag">Case Files</span><span className="tag">Contracts</span><span className="tag">GDPR Ready</span></div></div>
            <div className="uc reveal d4"><span className="uc-emoji">👥</span><div className="uc-title">HR Platforms</div><p className="uc-desc">Secure employee records, salary data, personal information. Build real trust with your workforce.</p><div className="tags"><span className="tag">Employee Data</span><span className="tag">Payroll</span><span className="tag">HR Documents</span></div></div>
          </div>
          <div style={{textAlign:'center',marginTop:'36px'}} className="reveal">
            <Link href="/use-cases" className="btn btn-md btn-outline">Explore all use cases →</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="reveal"><div className="sv2">99<span>/100</span></div><div className="sl2">Security Score</div></div>
            <div className="reveal d1"><div className="sv2">&lt;<span>50ms</span></div><div className="sl2">Response Time</div></div>
            <div className="reveal d2"><div className="sv2">99.9<span>%</span></div><div className="sl2">Uptime SLA</div></div>
            <div className="reveal d3"><div className="sv2">AES<span>-256</span></div><div className="sl2">Encryption Standard</div></div>
          </div>
        </div>
      </div>

      {/* SECURITY PREVIEW */}
      <section className="secsec">
        <div className="container">
          <div className="sec-split">
            <div className="reveal">
              <div className="sec-label">🔐 Enterprise Security</div>
              <h2 className="sec-title">Security you can prove<br/>to your clients</h2>
              <p className="sec-sub" style={{marginBottom:'28px'}}>Scored 99/100 in independent penetration testing. Share our security report with your enterprise clients and close deals faster.</p>
              <div className="check-list" style={{marginBottom:'28px'}}>
                <div className="check-item"><div className="check-icon">✓</div>Zero-knowledge architecture — even we can't read your data</div>
                <div className="check-item"><div className="check-icon">✓</div>Proprietary entropy system — Ethereum blockchain + seismic data</div>
                <div className="check-item"><div className="check-icon">✓</div>All 10 critical security fixes independently verified</div>
                <div className="check-item"><div className="check-icon">✓</div>bcrypt password hashing at cost factor 12</div>
              </div>
              <Link href="/why-sra-shield" className="btn btn-md btn-dark">View full security report →</Link>
            </div>
            <div className="reveal d2">
              <div className="sec-card">
                <div className="score-wrap">
                  <div className="score-circle"><div className="score-inner"><div className="score-n">99</div><div className="score-d">/100</div></div></div>
                  <div className="score-info"><div className="score-t">Security Score</div><div className="score-s">Penetration tested &amp; verified</div></div>
                </div>
                <div className="sec-feats">
                  <div className="sf"><div className="sf-dot"></div><div className="sf-t">AES-256-GCM Encryption</div><div className="sf-b">Active</div></div>
                  <div className="sf"><div className="sf-dot"></div><div className="sf-t">JWT + Refresh Token Auth</div><div className="sf-b">Active</div></div>
                  <div className="sf"><div className="sf-dot"></div><div className="sf-t">Rate Limiting &amp; DDoS Protection</div><div className="sf-b">Active</div></div>
                  <div className="sf"><div className="sf-dot"></div><div className="sf-t">SQL Injection Prevention</div><div className="sf-b">Active</div></div>
                  <div className="sf"><div className="sf-dot"></div><div className="sf-t">CORS &amp; Security Headers</div><div className="sf-b">Active</div></div>
                  <div className="sf"><div className="sf-dot"></div><div className="sf-t">Multi-Source Entropy</div><div className="sf-b">Active</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="pricesec">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">💰 Simple Pricing</div>
            <h2 className="sec-title">Start free. Scale as you grow.</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>No hidden fees. Cancel anytime.</p>
          </div>
          <div className="price-grid">
            <div className="pc reveal d1">
              <div className="pn">Starter</div>
              <div className="pr"><div className="pa">$0</div><div className="pper">/month</div></div>
              <div className="pd">Perfect for developers testing the integration.</div>
              <div className="pdiv"></div>
              <div className="pfeats">
                <div className="pf"><div className="pfck">✓</div>1,000 API calls/month</div>
                <div className="pf"><div className="pfck">✓</div>1 encryption key</div>
                <div className="pf"><div className="pfck">✓</div>Community support</div>
                <div className="pf"><div className="pfck">✓</div>Full API access</div>
              </div>
              <button className="pb ol" onClick={() => window.location.href='/register'}>Get started free →</button>
            </div>
            <div className="pc feat reveal d2">
              <div className="feat-badge">✦ Most Popular</div>
              <div className="pn">Business</div>
              <div className="pr"><div className="pa">$49</div><div className="pper">/month</div></div>
              <div className="pd">Everything your team needs to ship securely.</div>
              <div className="pdiv"></div>
              <div className="pfeats">
                <div className="pf"><div className="pfck">✓</div>100,000 API calls/month</div>
                <div className="pf"><div className="pfck">✓</div>10 encryption keys</div>
                <div className="pf"><div className="pfck">✓</div>Email support (24h SLA)</div>
                <div className="pf"><div className="pfck">✓</div>99.9% uptime SLA</div>
                <div className="pf"><div className="pfck">✓</div>Usage analytics</div>
              </div>
              <button className="pb wh" onClick={() => window.location.href='/register'}>Start Business plan →</button>
            </div>
            <div className="pc reveal d3">
              <div className="pn">Enterprise</div>
              <div className="pr"><div className="pa" style={{fontSize:'28px',letterSpacing:'-.5px'}}>Custom</div></div>
              <div className="pd">For large organizations with specific requirements.</div>
              <div className="pdiv"></div>
              <div className="pfeats">
                <div className="pf"><div className="pfck">✓</div>Unlimited API calls</div>
                <div className="pf"><div className="pfck">✓</div>Unlimited keys</div>
                <div className="pf"><div className="pfck">✓</div>Dedicated support manager</div>
                <div className="pf"><div className="pfck">✓</div>Custom SLA</div>
                <div className="pf"><div className="pfck">✓</div>Security audit report</div>
              </div>
              <button className="pb ol">Contact us →</button>
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:'28px'}} className="reveal">
            <Link href="/pricing" className="btn btn-md btn-outline">View full pricing details →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testsec">
        <div className="container">
          <div style={{textAlign:'center'}} className="reveal">
            <div className="sec-label">❤️ What clients say</div>
            <h2 className="sec-title">Trusted by security-first teams</h2>
          </div>
          <div className="test-grid">
            <div className="tc reveal d1">
              <div className="stars">★★★★★</div>
              <div className="tq">"We integrated SRA Shield in a single afternoon. Our patient data is now fully encrypted and our HIPAA audit passed without a single finding."</div>
              <div className="ta"><div className="tav" style={{background:'linear-gradient(135deg,#8B5CF6,#60A5FA)'}}>R</div><div><div className="tname">Ravi Mehta</div><div className="trole">CTO, HealthCo India</div></div></div>
            </div>
            <div className="tc reveal d2">
              <div className="stars">★★★★★</div>
              <div className="tq">"The security score documentation alone helped us close two enterprise clients who were previously blocking on compliance. Worth every rupee."</div>
              <div className="ta"><div className="tav" style={{background:'linear-gradient(135deg,#34D399,#60A5FA)'}}>S</div><div><div className="tname">Sarah Chen</div><div className="trole">Head of Engineering, FinanceHub</div></div></div>
            </div>
            <div className="tc reveal d3">
              <div className="stars">★★★★★</div>
              <div className="tq">"We tested four encryption services. SRA Shield was the only one with a 99/100 pen test score and docs our developers actually understood."</div>
              <div className="ta"><div className="tav" style={{background:'linear-gradient(135deg,#FB923C,#F87171)'}}>A</div><div><div className="tname">Ahmed Al-Rashid</div><div className="trole">CISO, LegalEdge MENA</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctasec">
        <div className="container">
          <div className="cta-card reveal">
            <div className="cta-inner">
              <h2 className="cta-title">Your data deserves<br/>real protection</h2>
              <p className="cta-sub">Join companies that chose not to gamble with their customers' trust. Start free today.</p>
              <div className="cta-acts">
                <Link href="/register" className="btn btn-lg btn-white">
                  Start for free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/docs" className="btn btn-lg btn-ghost-white">View documentation →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}