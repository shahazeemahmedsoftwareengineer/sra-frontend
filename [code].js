import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://sra-backend-production.up.railway.app';

export default function VerifyPage() {
  const router = useRouter();
  const { code } = router.query;

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!code) return;
    fetch(`${API}/api/v1/shield/verify/${code}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setData(res.data);
        else setError('Verification code not found. It may be invalid or expired.');
      })
      .catch(() => setError('Could not connect to SRA Shield servers. Please try again.'))
      .finally(() => setLoading(false));
  }, [code]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const cleanBTC = (raw) => {
    // "BTCUSDT-65618.00" → "$65,618.00"
    if (!raw) return '—';
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? raw : `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const shortHash = (h) => h ? h.slice(0, 12) + '...' : '—';

  // ── entropy sources config ───────────────────────────────────────────────
  const getSources = (d) => [
    {
      icon: '₿',
      iconBg: '#fff7ed',
      iconColor: '#f59e0b',
      label: 'Bitcoin Price',
      sublabel: 'Live market price at moment of generation',
      value: cleanBTC(d?.btcPrice),
      raw: d?.btcPrice,
      verifyUrl: 'https://coinmarketcap.com/currencies/bitcoin/historical-data/',
      verifyLabel: 'Verify on CoinMarketCap →',
      desc: 'Bitcoin\'s price is determined by millions of traders globally. Impossible to predict to the cent in advance.',
    },
    {
      icon: 'Ξ',
      iconBg: '#f0eeff',
      iconColor: '#6c5ce7',
      label: 'Ethereum Block Hash',
      sublabel: 'Latest block hash at moment of generation',
      value: shortHash(d?.ethBlockHash),
      raw: d?.ethBlockHash,
      verifyUrl: d?.ethBlockHash ? `https://etherscan.io/search?q=${d.ethBlockHash}` : 'https://etherscan.io',
      verifyLabel: 'Verify on Etherscan →',
      desc: 'Each Ethereum block hash is computed from millions of transactions. Cryptographically unpredictable.',
    },
    {
      icon: '🌍',
      iconBg: '#eef9f0',
      iconColor: '#28c76f',
      label: 'USGS Seismic Data',
      sublabel: 'Real-time earthquake sensor reading',
      value: d?.seismicData || '—',
      raw: d?.seismicData,
      verifyUrl: 'https://earthquake.usgs.gov/earthquakes/map/',
      verifyLabel: 'Verify on USGS →',
      desc: 'Seismic activity from the US Geological Survey. Earth\'s crust moves in patterns no computer can predict.',
    },
    {
      icon: '⏱',
      iconBg: '#eef4ff',
      iconColor: '#0984e3',
      label: 'Server Timing',
      sublabel: 'High-precision server nanosecond timestamp',
      value: d?.serverTiming ? `${Number(d.serverTiming).toLocaleString()} ns` : '—',
      raw: d?.serverTiming,
      verifyUrl: null,
      verifyLabel: null,
      desc: 'Sub-millisecond server process timing. Captures hardware-level noise impossible to reproduce exactly.',
    },
  ];

  return (
    <>
      <Head>
        <title>
          {loading ? 'Verifying…' : error ? 'Invalid Code' : `Verified — ${code}`} · SRA Shield
        </title>
        <meta name="description" content="SRA Shield entropy proof verification. Independently verify that an encryption key was generated from real-world unpredictable sources." />
      </Head>

      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#FAFAFA;color:#1A1A1A;-webkit-font-smoothing:antialiased}
        .vpage{min-height:100vh;padding-top:64px}

        /* ── NAV ── */
        .vnav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;
          background:rgba(255,255,255,.92);backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(229,231,235,.7)}
        .vnav-inner{max-width:1160px;margin:0 auto;padding:0 28px;height:64px;
          display:flex;align-items:center;justify-content:space-between}
        .vnav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .vnav-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#8B5CF6,#1A1A1A);
          display:flex;align-items:center;justify-content:center}
        .vnav-text{font-family:'Urbanist',sans-serif;font-size:17px;font-weight:800;color:#1A1A1A;letter-spacing:-.5px}
        .vnav-text span{color:#8B5CF6}
        .vnav-badge{font-size:11px;padding:3px 10px;border-radius:100px;
          background:#D1FAE5;color:#059669;font-weight:700;border:1px solid #A7F3D0}

        /* ── HERO ── */
        .v-hero{padding:56px 28px 32px;text-align:center;max-width:680px;margin:0 auto}

        /* ── CARDS ── */
        .v-container{max-width:860px;margin:0 auto;padding:0 28px 80px}
        .v-status-card{border-radius:22px;padding:32px 36px;margin-bottom:28px;
          display:flex;align-items:flex-start;gap:20px}
        .v-status-card.ok{background:#ECFDF5;border:2px solid #6EE7B7}
        .v-status-card.err{background:#FEF2F2;border:2px solid #FECACA}
        .v-status-card.loading{background:#F8F9FB;border:2px solid #E5E7EB}
        .v-status-icon{width:52px;height:52px;border-radius:16px;
          display:flex;align-items:center;justify-content:center;
          font-size:26px;flex-shrink:0}
        .v-status-icon.ok{background:#D1FAE5}
        .v-status-icon.err{background:#FEE2E2}
        .v-status-title{font-family:'Urbanist',sans-serif;font-size:22px;font-weight:800;letter-spacing:-.3px;margin-bottom:4px}
        .v-status-title.ok{color:#059669}
        .v-status-title.err{color:#DC2626}
        .v-status-sub{font-size:14px;color:#6B7280;line-height:1.6}

        /* ── CODE DISPLAY ── */
        .v-code-row{display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
        .v-code{font-family:'SF Mono','Fira Code',monospace;font-size:15px;font-weight:700;
          color:#059669;background:#fff;border:1.5px solid #6EE7B7;
          padding:7px 16px;border-radius:10px;letter-spacing:.5px}
        .v-timestamp{font-size:13px;color:#6B7280;background:#fff;
          border:1px solid #E5E7EB;padding:5px 12px;border-radius:8px}

        /* ── SECTION ── */
        .v-section-title{font-family:'Urbanist',sans-serif;font-size:13px;font-weight:700;
          text-transform:uppercase;letter-spacing:1.2px;color:#9CA3AF;margin-bottom:16px}

        /* ── ENTROPY SOURCES ── */
        .v-sources{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px}
        .v-source{background:#fff;border:1.5px solid #E5E7EB;border-radius:18px;padding:22px;
          box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all .2s}
        .v-source:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.07)}
        .v-src-header{display:flex;align-items:center;gap:12px;margin-bottom:14px}
        .v-src-icon{width:40px;height:40px;border-radius:12px;
          display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0}
        .v-src-label{font-family:'Urbanist',sans-serif;font-size:14px;font-weight:800;color:#1A1A1A}
        .v-src-sub{font-size:11.5px;color:#9CA3AF;margin-top:1px}
        .v-src-value{font-family:'SF Mono','Fira Code',monospace;font-size:13px;font-weight:700;
          color:#1A1A1A;background:#F9FAFB;border:1px solid #E5E7EB;
          border-radius:9px;padding:10px 14px;margin-bottom:10px;word-break:break-all;line-height:1.5}
        .v-src-desc{font-size:12px;color:#6B7280;line-height:1.6;margin-bottom:10px}
        .v-src-link{display:inline-flex;align-items:center;gap:5px;font-size:12px;
          font-weight:600;color:#8B5CF6;text-decoration:none;transition:color .2s}
        .v-src-link:hover{color:#6D28D9;text-decoration:underline}
        .v-src-badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;
          font-weight:700;padding:2px 8px;border-radius:100px;
          background:#D1FAE5;color:#059669;border:1px solid #A7F3D0}

        /* ── ALGORITHM CARD ── */
        .v-algo{background:linear-gradient(135deg,#1A2035,#2D3F6E);border-radius:20px;
          padding:28px 32px;margin-bottom:28px;color:#fff}
        .v-algo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
        .v-algo-item{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;padding:16px}
        .v-algo-label{font-size:10.5px;font-weight:700;text-transform:uppercase;
          letter-spacing:.8px;color:rgba(255,255,255,.4);margin-bottom:6px}
        .v-algo-value{font-family:'SF Mono','Fira Code',monospace;font-size:13px;
          font-weight:700;color:#fff}

        /* ── WHAT THIS PROVES ── */
        .v-proves{background:#fff;border:1.5px solid #E5E7EB;border-radius:18px;
          padding:26px;margin-bottom:28px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
        .v-proves-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
        .v-prove-item{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:#4A5568;line-height:1.6}
        .v-prove-check{width:22px;height:22px;border-radius:7px;background:#D1FAE5;
          display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:1px}

        /* ── HOW TO VERIFY ── */
        .v-howto{background:#FDF4FF;border:1.5px solid rgba(139,92,246,.2);
          border-radius:18px;padding:24px;margin-bottom:28px}
        .v-step{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
        .v-step:last-child{margin-bottom:0}
        .v-step-num{width:28px;height:28px;border-radius:8px;background:#8B5CF6;
          color:#fff;font-size:12px;font-weight:800;display:flex;
          align-items:center;justify-content:center;flex-shrink:0}
        .v-step-text{font-size:13.5px;color:#4A5568;line-height:1.65;padding-top:3px}
        .v-step-text strong{color:#1A1A1A}

        /* ── CTA ── */
        .v-cta{background:var(--charcoal,#1A1A1A);border-radius:20px;padding:32px;
          text-align:center;color:#fff}

        /* ── ERROR ── */
        .v-error-actions{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}

        /* ── LOADING ── */
        .v-spinner{width:40px;height:40px;border:3px solid #E5E7EB;
          border-top-color:#8B5CF6;border-radius:50%;
          animation:vspin .8s linear infinite;margin:0 auto 16px}
        @keyframes vspin{to{transform:rotate(360deg)}}

        /* ── RESPONSIVE ── */
        @media(max-width:700px){
          .v-sources,.v-proves-grid,.v-algo-grid{grid-template-columns:1fr}
          .v-status-card{flex-direction:column;gap:14px}
          .v-container{padding:0 16px 60px}
          .v-hero{padding:40px 16px 24px}
        }
      `}} />

      {/* ── NAV ── */}
      <nav className="vnav">
        <div className="vnav-inner">
          <Link href="/" className="vnav-logo">
            <div className="vnav-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
                <path d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z" fill="white" fillOpacity=".4"/>
              </svg>
            </div>
            <span className="vnav-text">SRA <span>Shield</span></span>
          </Link>
          <div className="vnav-badge">🔍 Entropy Proof Verification</div>
        </div>
      </nav>

      <div className="vpage">

        {/* ── HERO ── */}
        <div className="v-hero">
          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 14px',
            borderRadius:100,background:'#EDE9FE',border:'1px solid rgba(139,92,246,.25)',
            fontSize:12,fontWeight:700,color:'#7C3AED',marginBottom:16}}>
            🔐 Cryptographic Proof Verification
          </div>
          <h1 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'clamp(28px,5vw,40px)',
            fontWeight:900,color:'#1A1A1A',letterSpacing:'-1.5px',marginBottom:12}}>
            Don't trust us. Verify us.
          </h1>
          <p style={{fontSize:15,color:'#6B7280',lineHeight:1.75,maxWidth:520,margin:'0 auto'}}>
            This page proves that the encryption key linked to this verification code was generated
            from <strong style={{color:'#1A1A1A'}}>real, unpredictable, independently verifiable</strong> entropy
            sources — not random numbers made up by software.
          </p>
        </div>

        <div className="v-container">

          {/* ── LOADING ── */}
          {loading && (
            <div className="v-status-card loading" style={{justifyContent:'center',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'48px'}}>
              <div className="v-spinner"/>
              <div style={{fontFamily:"'Urbanist',sans-serif",fontSize:18,fontWeight:700,color:'#6B7280'}}>
                Verifying proof…
              </div>
              <div style={{fontSize:13,color:'#9CA3AF',marginTop:6}}>
                Checking code <code style={{background:'#F3F4F6',padding:'2px 7px',borderRadius:5,fontFamily:'monospace'}}>{code}</code> against SRA Shield records
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {!loading && error && (
            <div className="v-status-card err">
              <div className="v-status-icon err">❌</div>
              <div style={{flex:1}}>
                <div className="v-status-title err">Verification Failed</div>
                <div className="v-status-sub">{error}</div>
                <div className="v-code-row">
                  <code style={{fontFamily:'monospace',fontSize:13,background:'#FEE2E2',
                    padding:'5px 12px',borderRadius:8,color:'#DC2626'}}>
                    {code}
                  </code>
                </div>
                <div className="v-error-actions">
                  <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,
                    background:'#1A1A1A',color:'#fff',padding:'9px 18px',borderRadius:100,
                    fontSize:13,fontWeight:600,textDecoration:'none'}}>
                    ← Back to SRA Shield
                  </Link>
                  <Link href="/docs" style={{display:'inline-flex',alignItems:'center',gap:6,
                    background:'#F3F4F6',color:'#1A1A1A',padding:'9px 18px',borderRadius:100,
                    fontSize:13,fontWeight:600,textDecoration:'none'}}>
                    View Documentation
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {!loading && !error && data && (
            <>
              {/* Status Card */}
              <div className="v-status-card ok">
                <div className="v-status-icon ok">✅</div>
                <div style={{flex:1}}>
                  <div className="v-status-title ok">Entropy Proof Verified</div>
                  <div className="v-status-sub">
                    This verification code exists in the SRA Shield database and is linked to a real key generation event.
                    All entropy sources below can be independently verified against public records.
                  </div>
                  <div className="v-code-row">
                    <div className="v-code">{data.verificationCode || code}</div>
                    <div className="v-timestamp">🕐 {formatDate(data.createdAt)}</div>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,
                      fontWeight:700,padding:'4px 11px',borderRadius:100,
                      background:'#D1FAE5',color:'#059669',border:'1px solid #A7F3D0'}}>
                      ✓ VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Entropy Sources */}
              <div className="v-section-title">🎲 Entropy Sources Used</div>
              <div className="v-sources">
                {getSources(data).map((src, i) => (
                  <div key={i} className="v-source">
                    <div className="v-src-header">
                      <div className="v-src-icon" style={{background:src.iconBg,color:src.iconColor}}>
                        {src.icon}
                      </div>
                      <div>
                        <div className="v-src-label">{src.label}</div>
                        <div className="v-src-sub">{src.sublabel}</div>
                      </div>
                    </div>
                    <div className="v-src-value">{src.value}</div>
                    <div className="v-src-desc">{src.desc}</div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                      <span className="v-src-badge">✓ Captured at generation</span>
                      {src.verifyUrl && (
                        <a href={src.verifyUrl} target="_blank" rel="noopener noreferrer" className="v-src-link">
                          {src.verifyLabel}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Algorithm Info */}
              <div className="v-section-title">🔒 Encryption Details</div>
              <div className="v-algo">
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                  <div style={{width:42,height:42,background:'rgba(139,92,246,.25)',borderRadius:12,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>🛡</div>
                  <div>
                    <div style={{fontFamily:"'Urbanist',sans-serif",fontSize:18,fontWeight:800,letterSpacing:'-.3px'}}>
                      AES-256-GCM Encryption
                    </div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:2}}>
                      Military-grade authenticated encryption standard
                    </div>
                  </div>
                </div>
                <div className="v-algo-grid">
                  {[
                    {label:'Algorithm',   value:'AES-256-GCM'},
                    {label:'Key Length',  value:'256 bits'},
                    {label:'Key Space',   value:'2²⁵⁶ possibilities'},
                    {label:'IV Length',   value:'96 bits (12 bytes)'},
                    {label:'Auth Tag',    value:'128 bits (16 bytes)'},
                    {label:'Standard',    value:'NIST FIPS 197'},
                  ].map((item, i) => (
                    <div key={i} className="v-algo-item">
                      <div className="v-algo-label">{item.label}</div>
                      <div className="v-algo-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What This Proves */}
              <div className="v-section-title">✅ What This Proof Confirms</div>
              <div className="v-proves">
                <div style={{fontSize:14,color:'#6B7280',lineHeight:1.7,marginBottom:16}}>
                  This verification confirms the following facts about the encryption key associated with code{' '}
                  <code style={{background:'#F3F4F6',padding:'2px 7px',borderRadius:5,fontFamily:'monospace',fontSize:12}}>
                    {data.verificationCode || code}
                  </code>:
                </div>
                <div className="v-proves-grid">
                  {[
                    'The key was generated on a specific recorded date and time.',
                    'Bitcoin\'s live price at that exact moment was captured and recorded.',
                    'An Ethereum blockchain block hash was included in the entropy pool.',
                    'Real seismic sensor data from USGS was included.',
                    'High-precision server timing added hardware-level randomness.',
                    'All four sources were mixed using SHA-512 hashing.',
                    'The resulting key is unique — this combination never happened before.',
                    'SRA Shield never stored the actual encryption key — zero knowledge.',
                  ].map((text, i) => (
                    <div key={i} className="v-prove-item">
                      <div className="v-prove-check">✓</div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Independently Verify */}
              <div className="v-section-title">🔍 How to Independently Verify</div>
              <div className="v-howto">
                <div style={{fontSize:14,color:'#6B7280',marginBottom:18,lineHeight:1.65}}>
                  You don't have to trust SRA Shield. Every entropy source can be checked against
                  independent public records:
                </div>
                {[
                  {
                    step:'1',
                    text: <><strong style={{color:'#1A1A1A'}}>Check the Bitcoin price</strong> — visit CoinMarketCap or CoinGecko historical data. Search for the date above and confirm the BTC price matches <strong style={{color:'#1A1A1A'}}>{cleanBTC(data.btcPrice)}</strong>.</>
                  },
                  {
                    step:'2',
                    text: <><strong style={{color:'#1A1A1A'}}>Check the Ethereum block</strong> — visit Etherscan.io and search for block hash <strong style={{color:'#1A1A1A',fontFamily:'monospace',fontSize:12}}>{data.ethBlockHash}</strong>. Confirm it exists and was mined around the timestamp above.</>
                  },
                  {
                    step:'3',
                    text: <><strong style={{color:'#1A1A1A'}}>Check the seismic data</strong> — visit USGS Earthquake Hazards Program (earthquake.usgs.gov). Search for <strong style={{color:'#1A1A1A'}}>{data.seismicData}</strong> near the recorded date.</>
                  },
                  {
                    step:'4',
                    text: <><strong style={{color:'#1A1A1A'}}>Conclude</strong> — if all three match public records at that timestamp, the entropy was real, unpredictable, and drawn from sources SRA Shield had no control over. The key generated from this entropy is cryptographically secure.</>
                  },
                ].map((item, i) => (
                  <div key={i} className="v-step">
                    <div className="v-step-num">{item.step}</div>
                    <div className="v-step-text">{item.text}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="v-cta">
                <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:'rgba(255,255,255,.4)',
                  textTransform:'uppercase',marginBottom:12}}>
                  Powered by SRA Shield
                </div>
                <div style={{fontFamily:"'Urbanist',sans-serif",fontSize:22,fontWeight:800,
                  marginBottom:8,letterSpacing:'-.3px'}}>
                  Protect your data with the same system
                </div>
                <div style={{fontSize:14,color:'rgba(255,255,255,.5)',marginBottom:24,lineHeight:1.6}}>
                  Your customers deserve encryption they can verify. Start free — no credit card required.
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                  <Link href="/register" style={{background:'#fff',color:'#1A1A1A',padding:'12px 26px',
                    borderRadius:100,fontSize:14,fontWeight:700,textDecoration:'none',
                    boxShadow:'0 4px 14px rgba(0,0,0,.2)'}}>
                    Start for free →
                  </Link>
                  <Link href="/docs" style={{background:'rgba(255,255,255,.1)',color:'#fff',
                    padding:'12px 26px',borderRadius:100,fontSize:14,fontWeight:600,
                    textDecoration:'none',border:'1px solid rgba(255,255,255,.15)'}}>
                    View Documentation
                  </Link>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}