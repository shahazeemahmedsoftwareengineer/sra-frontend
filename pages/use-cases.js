import { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function UseCases() {
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
        <title>Use Cases — SRA Shield</title>
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        .page-hero{padding:130px 0 70px;text-align:center;background:linear-gradient(160deg,#fff 0%,var(--peach) 60%,#fff 100%)}
        .b1{top:-100px;left:-120px;width:500px;height:500px;background:radial-gradient(circle,rgba(253,240,237,.9),transparent 70%)}
        .b2{top:-60px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(244,239,255,.85),transparent 70%)}
        .use-main{padding:80px 0}
        .industry{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-bottom:100px;padding-bottom:80px;border-bottom:1px solid var(--border)}
        .industry:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
        .industry.flip{direction:rtl}.industry.flip>*{direction:ltr}
        .ind-emoji{font-size:48px;margin-bottom:18px;display:block}
        .ind-title{font-family:'Urbanist',sans-serif;font-size:34px;font-weight:900;color:var(--charcoal);margin-bottom:10px;letter-spacing:-.5px}
        .ind-sub{font-size:15.5px;color:var(--gray);line-height:1.75;margin-bottom:22px}
        .ind-points{display:flex;flex-direction:column;gap:10px;margin-bottom:26px}
        .ip{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--charcoal)}
        .ip-dot{width:22px;height:22px;border-radius:7px;background:var(--purple-l);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-top:1px}
        .ind-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}
        .ind-visual{background:#fff;border:1.5px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--sh-lg)}
        .iv-header{background:var(--charcoal);padding:13px 18px;display:flex;align-items:center;gap:8px}
        .iv-dots{display:flex;gap:5px}.iv-dots span{width:9px;height:9px;border-radius:50%}
        .iv-dots span:nth-child(1){background:#FF5F57}.iv-dots span:nth-child(2){background:#FFBD2E}.iv-dots span:nth-child(3){background:#28C840}
        .iv-label{font-size:11px;color:rgba(255,255,255,.35);font-family:monospace}
        .iv-body{padding:22px;background:#FAFAFA}
        .data-card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px;box-shadow:var(--sh-sm)}
        .dc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--gray);margin-bottom:8px}
        .dc-plain{font-family:monospace;font-size:12.5px;color:var(--charcoal);background:var(--surface);padding:9px 12px;border-radius:8px;line-height:1.7;margin-bottom:10px}
        .dc-arrow{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;color:var(--purple);margin-bottom:10px}
        .dc-enc{font-family:monospace;font-size:11px;color:var(--purple);background:var(--purple-l);padding:9px 12px;border-radius:8px;line-height:1.7;word-break:break-all}
        .dc-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--green);margin-top:8px}
        .dc-bdot{width:5px;height:5px;border-radius:50%;background:var(--green)}
        .breach-cost{padding:70px 0;background:var(--charcoal);text-align:center}
        .cost-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:44px}
        .cg-val{font-family:'Urbanist',sans-serif;font-size:38px;font-weight:900;color:#fff;letter-spacing:-2px;line-height:1;margin-bottom:6px}
        .cg-val span{color:var(--purple)}
        .cg-label{font-size:13px;color:rgba(255,255,255,.4)}
        @media(max-width:900px){
          .industry,.industry.flip{grid-template-columns:1fr;direction:ltr}
          .cost-grid{grid-template-columns:1fr 1fr}
        }
        @media(max-width:600px){.cost-grid{grid-template-columns:1fr}}
      `}} />
      
      {/* HERO */}
      <div className="page-hero">
        <div className="hero-bg">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
        </div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="sec-label fade-up">🎯 Real-World Protection</div>
          <h1 style={{fontSize:'clamp(40px,6vw,64px)',fontWeight:900,color:'var(--charcoal)',marginBottom:'16px',letterSpacing:'-2px'}} className="fade-up d1">See yourself in the data</h1>
          <p style={{fontSize:'17px',color:'var(--gray)',maxWidth:'480px',margin:'0 auto',lineHeight:1.7}} className="fade-up d2">Every industry has data that cannot be compromised. Here's exactly how SRA Shield protects the industries that carry that responsibility.</p>
        </div>
      </div>

      {/* INDUSTRIES */}
      <section className="use-main">
        <div className="container">

          {/* Healthcare */}
          <div className="industry reveal">
            <div>
              <span className="ind-emoji">🏥</span>
              <div className="ind-title">Healthcare</div>
              <p className="ind-sub">Patient records contain the most sensitive personal information on earth. A single breach can expose thousands — destroying trust and triggering HIPAA fines of up to $1.9M per violation.</p>
              <div className="ind-points">
                <div className="ip"><div className="ip-dot">✓</div>Encrypt patient names, DOB, diagnoses before storing</div>
                <div className="ip"><div className="ip-dot">✓</div>HIPAA-ready: zero-knowledge means no BAA required</div>
                <div className="ip"><div className="ip-dot">✓</div>Lab results, prescriptions, imaging reports protected</div>
                <div className="ip"><div className="ip-dot">✓</div>Compliant audit trail with API call logging</div>
              </div>
              <div className="ind-tags">
                <span className="tag">HIPAA</span>
                <span className="tag">HL7 FHIR</span>
                <span className="tag">Patient Records</span>
                <span className="tag">EHR Systems</span>
                <span className="tag">Telemedicine</span>
              </div>
              <Link href="/register" className="btn btn-md btn-dark">Start protecting patient data →</Link>
            </div>
            <div className="ind-visual">
              <div className="iv-header"><div className="iv-dots"><span></span><span></span><span></span></div><div className="iv-label">Patient Data Encryption</div></div>
              <div className="iv-body">
                <div className="data-card">
                  <div className="dc-label">Plain Patient Record</div>
                  <div className="dc-plain">Name: John Doe<br/>DOB: 1985-03-12<br/>Diagnosis: Type 2 Diabetes<br/>Medication: Metformin 500mg</div>
                  <div className="dc-arrow">→ <span>SRA Shield encrypts</span></div>
                  <div className="dc-enc">SRA_ENC_IjIiOiJlbmMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InNyYS1rZXktMDEifQ...</div>
                  <div className="dc-badge"><div className="dc-bdot"></div>HIPAA compliant — zero knowledge</div>
                </div>
              </div>
            </div>
          </div>

          {/* Finance */}
          <div className="industry flip reveal">
            <div>
              <span className="ind-emoji">🏦</span>
              <div className="ind-title">Financial Services</div>
              <p className="ind-sub">KYC documents, account numbers, transaction histories — financial data is a prime target. PCI-DSS requires encryption at rest and in transit. SRA Shield makes this a 30-minute integration.</p>
              <div className="ind-points">
                <div className="ip"><div className="ip-dot">✓</div>Encrypt account numbers, card data before database storage</div>
                <div className="ip"><div className="ip-dot">✓</div>KYC documents encrypted end-to-end</div>
                <div className="ip"><div className="ip-dot">✓</div>PCI-DSS compliant architecture</div>
                <div className="ip"><div className="ip-dot">✓</div>Transaction metadata protected from insider threats</div>
              </div>
              <div className="ind-tags">
                <span className="tag">PCI-DSS</span>
                <span className="tag">KYC</span>
                <span className="tag">AML</span>
                <span className="tag">Open Banking</span>
                <span className="tag">Fintech</span>
              </div>
              <Link href="/register" className="btn btn-md btn-dark">Secure your financial data →</Link>
            </div>
            <div className="ind-visual">
              <div className="iv-header"><div className="iv-dots"><span></span><span></span><span></span></div><div className="iv-label">KYC Document Encryption</div></div>
              <div className="iv-body">
                <div className="data-card">
                  <div className="dc-label">KYC Submission</div>
                  <div className="dc-plain">Account: 4532 7891 2345 6789<br/>IBAN: GB82 WEST 1234 5698 7654 32<br/>NID: 9283-4821-X<br/>Income: $85,000 / year</div>
                  <div className="dc-arrow">→ <span>Encrypted before database storage</span></div>
                  <div className="dc-enc">SRA_ENC_eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI...</div>
                  <div className="dc-badge"><div className="dc-bdot"></div>PCI-DSS compliant storage</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="industry reveal">
            <div>
              <span className="ind-emoji">⚖️</span>
              <div className="ind-title">Legal Firms</div>
              <p className="ind-sub">Attorney-client privilege is sacred. Case files, contracts, settlement figures, and client communications must remain completely private — protected by cryptography, not just policy.</p>
              <div className="ind-points">
                <div className="ip"><div className="ip-dot">✓</div>Case files encrypted before cloud storage</div>
                <div className="ip"><div className="ip-dot">✓</div>Client communications cryptographically sealed</div>
                <div className="ip"><div className="ip-dot">✓</div>Settlement terms protected from insider access</div>
                <div className="ip"><div className="ip-dot">✓</div>GDPR compliant — right-to-erasure via key deletion</div>
              </div>
              <div className="ind-tags">
                <span className="tag">GDPR</span>
                <span className="tag">Attorney-Client Privilege</span>
                <span className="tag">Case Management</span>
                <span className="tag">DMS</span>
              </div>
              <Link href="/register" className="btn btn-md btn-dark">Protect client privilege →</Link>
            </div>
            <div className="ind-visual">
              <div className="iv-header"><div className="iv-dots"><span></span><span></span><span></span></div><div className="iv-label">Legal Document Vault</div></div>
              <div className="iv-body">
                <div className="data-card">
                  <div className="dc-label">Settlement Document</div>
                  <div className="dc-plain">Case: Smith v. Corp Inc<br/>Settlement: $2.4M<br/>Terms: Confidential NDA<br/>Signed: 2026-01-15</div>
                  <div className="dc-arrow">→ <span>Zero-knowledge encryption</span></div>
                  <div className="dc-enc">SRA_ENC_MjAxNi0wMS0xNVQxMjowMDowMFoiLCJleHAiOjE2ODM3MzI0OTAsImlhdCI6MTY4MzY...</div>
                  <div className="dc-badge"><div className="dc-bdot"></div>Privilege protected cryptographically</div>
                </div>
              </div>
            </div>
          </div>

          {/* HR */}
          <div className="industry flip reveal">
            <div>
              <span className="ind-emoji">👥</span>
              <div className="ind-title">HR Platforms</div>
              <p className="ind-sub">Salary data, performance reviews, personal addresses, immigration status — employees trust HR platforms with their most sensitive details. Encrypted storage is no longer optional.</p>
              <div className="ind-points">
                <div className="ip"><div className="ip-dot">✓</div>Encrypt salary and compensation data</div>
                <div className="ip"><div className="ip-dot">✓</div>Performance reviews protected from lateral access</div>
                <div className="ip"><div className="ip-dot">✓</div>National ID, passport data encrypted at field level</div>
                <div className="ip"><div className="ip-dot">✓</div>GDPR: employee data erasure by destroying encryption key</div>
              </div>
              <div className="ind-tags">
                <span className="tag">GDPR</span>
                <span className="tag">HRIS</span>
                <span className="tag">Payroll</span>
                <span className="tag">Employee Records</span>
                <span className="tag">ATS</span>
              </div>
              <Link href="/register" className="btn btn-md btn-dark">Secure your HR data →</Link>
            </div>
            <div className="ind-visual">
              <div className="iv-header"><div className="iv-dots"><span></span><span></span><span></span></div><div className="iv-label">Employee Record Encryption</div></div>
              <div className="iv-body">
                <div className="data-card">
                  <div className="dc-label">Employee Record</div>
                  <div className="dc-plain">Name: Priya Sharma<br/>Salary: ₹24,00,000 p.a.<br/>NID: MH29-38291<br/>Performance: Exceeds (4.6/5)</div>
                  <div className="dc-arrow">→ <span>Field-level encryption</span></div>
                  <div className="dc-enc">SRA_ENC_dXNlcklkIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJQcml5YSBTaGFybWEiLCJpYXQiOjE2ODM...</div>
                  <div className="dc-badge"><div className="dc-bdot"></div>GDPR compliant — erasure by key deletion</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BREACH COST */}
      <section className="breach-cost">
        <div className="container">
          <div className="reveal">
            <div className="sec-label" style={{background:'rgba(139,92,246,.15)',borderColor:'rgba(139,92,246,.2)',color:'var(--purple)',marginBottom:'14px'}}>The Cost of Doing Nothing</div>
            <h2 style={{fontSize:'clamp(28px,4vw,42px)',fontWeight:800,color:'#fff',marginBottom:'8px',letterSpacing:'-.5px'}}>Breaches are more expensive than prevention</h2>
            <p style={{fontSize:'14.5px',color:'rgba(255,255,255,.4)',maxWidth:'420px',margin:'0 auto'}}>At $49/month, SRA Shield costs less per day than a cup of coffee.</p>
          </div>
          <div className="cost-grid">
            <div className="reveal d1"><div className="cg-val">$4.5<span>M</span></div><div className="cg-label">Average data breach cost (IBM, 2024)</div></div>
            <div className="reveal d2"><div className="cg-val">287<span> days</span></div><div className="cg-label">Average time to identify a breach</div></div>
            <div className="reveal d3"><div className="cg-val">$1.9<span>M</span></div><div className="cg-label">Maximum HIPAA fine per violation</div></div>
            <div className="reveal d4"><div className="cg-val">83<span>%</span></div><div className="cg-label">Breaches involving human element (Verizon)</div></div>
          </div>
        </div>
      </section>
    </>
  );
}