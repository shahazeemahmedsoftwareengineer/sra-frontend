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
      {/* Warning banner */}
      {usage.warningLevel === 'exceeded' && (
        <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>🚨</span>
          <div>
            <div style={{fontWeight:700,color:'#dc2626',fontSize:13}}>Plan limit reached — API calls blocked</div>
            <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>Upgrade immediately to restore service.</div>
          </div>
          <button style={{marginLeft:'auto',background:'#dc2626',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Upgrade Now →</button>
        </div>
      )}
      {usage.warningLevel === 'critical' && (
        <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>
            <div style={{fontWeight:700,color:'#ea580c',fontSize:13}}>Only {usage.callsRemaining.toLocaleString()} calls remaining!</div>
            <div style={{color:'#f97316',fontSize:12,marginTop:2}}>Your app will stop working at 100%. Upgrade now.</div>
          </div>
          <button style={{marginLeft:'auto',background:'#ea580c',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Upgrade Now →</button>
        </div>
      )}
      {usage.warningLevel === 'warning' && (
        <div style={{background:'#fefce8',border:'1px solid #fef08a',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18}}>⚡</span>
          <div>
            <div style={{fontWeight:700,color:'#ca8a04',fontSize:13}}>80% of plan used</div>
            <div style={{color:'#eab308',fontSize:12,marginTop:2}}>Consider upgrading before you run out.</div>
          </div>
          <button style={{marginLeft:'auto',background:'#ca8a04',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Upgrade Plan →</button>
        </div>
      )}

      {/* Header */}
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

      {/* Progress bar */}
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
          <div style={{
            height:'100%',borderRadius:100,
            width:`${isUnlimited ? 0 : pct}%`,
            background:barColor,
            transition:'width .6s ease',
            minWidth: usage.callsUsed > 0 ? 6 : 0
          }}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
          <div style={{fontSize:11,color:'#a0aec0'}}>0</div>
          <div style={{fontSize:11,color:barColor,fontWeight:600}}>
            {isUnlimited ? 'Unlimited' : `${usage.callsRemaining.toLocaleString()} remaining`}
          </div>
          <div style={{fontSize:11,color:'#a0aec0'}}>{isUnlimited ? '∞' : usage.callsLimit.toLocaleString()}</div>
        </div>
      </div>

      {/* Stats row */}
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

      {/* 7-day chart */}
      <div>
        <div style={{fontSize:12,fontWeight:600,color:'#4a5568',marginBottom:10}}>Last 7 Days</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:6,height:60}}>
          {usage.dailyHistory.map((v,i) => (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div style={{
                width:'100%',borderRadius:'4px 4px 0 0',
                height: v === 0 ? 3 : `${Math.max(8,(v/maxH)*50)}px`,
                background: i === 6 ? '#ff9f43' : '#ffe0b2',
                transition:'height .3s ease'
              }}/>
              <div style={{fontSize:9,color:'#a0aec0',fontWeight:500}}>{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser]             = useState(null);
  const [mounted, setMounted]       = useState(false);
  const [activeNav, setActiveNav]   = useState('overview');
  const [keys, setKeys]             = useState([{ id: 1, label: 'Key 1', status: 'Active', created: 'Mar 10', value: '' }]);
  const [genLoading, setGenLoading] = useState(false);
  const [encInput, setEncInput]     = useState('');
  const [decInput, setDecInput]     = useState('');
  const [encResult, setEncResult]   = useState('');
  const [decResult, setDecResult]   = useState('');
  const [encLoading, setEncLoading] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [copied, setCopied]         = useState(null);
  const [usage, setUsage]           = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setMounted(true);
    fetchUsage();
  }, []);

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
        setKeys(prev => [...prev, { id: Date.now(), label: `Key ${prev.length + 1}`, status: 'Active', created: 'Today', value: key, code }]);
        await fetchUsage();
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
    { id: 'keys',     icon: '⚿', label: 'My Keys' },
    { id: 'encrypt',  icon: '⊕', label: 'Encrypt / Decrypt' },
    { id: 'activity', icon: '↗', label: 'Activity' },
  ];

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

        {/* SIDEBAR */}
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
            {[{icon:'☰',label:'Documentation'},{icon:'↑',label:'Upgrade Plan'}].map(n=>(
              <button key={n.label} className="nav-btn" style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:9,border:'none',background:'transparent',color:C.navTxt,fontSize:13.5,borderLeft:'3px solid transparent',transition:'all .15s',textAlign:'left',marginBottom:3}}>
                <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              </button>
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

        {/* MAIN */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
          {/* Topbar */}
          <div style={{background:C.topBg,borderBottom:`1px solid ${C.topBorder}`,padding:'0 28px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:C.titleTxt,letterSpacing:'-.3px'}}>{navMain.find(n=>n.id===activeNav)?.label||'Overview'}</div>
              <div style={{fontSize:12,color:C.mutedTxt,marginTop:1}}>Welcome back, {userName}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:6,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:100,padding:'5px 13px',fontSize:12,fontWeight:600,color:C.green}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.green,animation:'glow 2s ease infinite'}}/>API Online
              </div>
              <button style={{background:'linear-gradient(135deg,#6c5ce7,#4338ca)',color:'#fff',border:'none',borderRadius:9,padding:'8px 18px',fontSize:13,fontWeight:600,boxShadow:'0 4px 12px rgba(108,92,231,.3)'}}>Upgrade →</button>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:'auto',padding:24,background:C.pageBg}}>

            {/* OVERVIEW */}
            {activeNav==='overview' && (
              <div className="fadeUp">
                {/* Usage Card — real data */}
                {usageLoading ? (
                  <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:24,marginBottom:16,textAlign:'center',color:C.mutedTxt,fontSize:13}}>Loading usage data…</div>
                ) : (
                  <UsageCard usage={usage} />
                )}

                {/* Stats */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
                  {[
                    {label:'Calls Used',     value: usage?.callsUsed ?? 0,       sub:'This month',         icon:'⚡', bg:'#fff3e0', bdr:'#ffe0b2'},
                    {label:'Keys Active',    value: keys.filter(k=>k.status==='Active').length, sub:'Encryption keys', icon:'⚿', bg:'#eef9f0', bdr:'#b8f0c8'},
                    {label:'Days to Reset',  value: usage?.daysUntilReset ?? 30,  sub: usage?.resetDate ?? '', icon:'📅', bg:'#eef4ff', bdr:'#c2d8f8'},
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

                {/* Chart + Quick Actions */}
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
                        <span>⚿</span>{genLoading?'Generating…':'Generate Key'}
                      </button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}>
                        <span>🔒</span>Encrypt Data
                      </button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}>
                        <span>🔓</span>Decrypt Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Keys */}
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Active Keys</div>
                    <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:8,padding:'7px 15px',fontSize:12,fontWeight:600,color:'#6c5ce7',transition:'all .15s',opacity:genLoading?.6:1}}>
                      {genLoading?'⏳ Generating…':'+ Generate Key'}
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

            {/* MY KEYS */}
            {activeNav==='keys' && (
              <div className="fadeUp" style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Encryption Keys</div>
                  <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:8,padding:'7px 15px',fontSize:12,fontWeight:600,color:'#6c5ce7',transition:'all .15s'}}>
                    {genLoading?'⏳ Generating…':'+ Generate Key'}
                  </button>
                </div>
                {keys.map((k,i)=>(
                  <div key={k.id} style={{background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:'16px 18px',marginBottom:i<keys.length-1?10:0}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:k.value?10:0,flexWrap:'wrap'}}>
                          <span style={{fontSize:16}}>⚿</span>
                          <span style={{fontSize:14,fontWeight:600,color:C.titleTxt}}>{k.label}</span>
                          <span style={{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBdr}`,fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:100}}>{k.status}</span>
                          <span style={{fontSize:11.5,color:C.mutedTxt}}>{k.created}</span>
                        </div>
                        {k.value&&<div style={{background:'#fff',border:'1px solid #d6ceff',borderRadius:8,padding:'10px 12px',fontFamily:'DM Mono,monospace',fontSize:11,color:'#6c5ce7',wordBreak:'break-all',lineHeight:1.7}}>{k.value}</div>}
                        {k.code&&<div style={{fontSize:12,color:C.bodyTxt,marginTop:8}}>Verification: <span style={{color:'#6c5ce7',fontWeight:600}}>{k.code}</span></div>}
                      </div>
                      <div style={{display:'flex',gap:8,flexShrink:0}}>
                        {k.value&&<button className="copy-btn" onClick={()=>copyText(k.value,k.id)} style={{background:'#f0eeff',border:'1px solid #d6ceff',borderRadius:7,padding:'6px 13px',fontSize:12,fontWeight:600,color:'#6c5ce7',transition:'all .15s'}}>{copied===k.id?'✓ Copied':'Copy'}</button>}
                        <button className="del-btn" style={{background:C.redBg,border:`1px solid ${C.redBdr}`,color:C.red,borderRadius:7,padding:'6px 13px',fontSize:12,fontWeight:600,transition:'all .15s'}}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ENCRYPT / DECRYPT */}
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

            {/* ACTIVITY */}
            {activeNav==='activity' && (
              <div className="fadeUp" style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:'60px 40px',textAlign:'center',boxShadow:C.cardShadow}}>
                <div style={{fontSize:40,marginBottom:14}}>↗</div>
                <div style={{fontSize:15,fontWeight:600,color:C.bodyTxt,marginBottom:6}}>No activity yet</div>
                <div style={{fontSize:13,color:C.mutedTxt}}>Start encrypting or generating keys to see activity here.</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}