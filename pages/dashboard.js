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
  const [apiCalls, setApiCalls]     = useState(0);
  const [copied, setCopied]         = useState(null);

  useEffect(() => { setUser(getUser()); setMounted(true); }, []);
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
        setApiCalls(c => c + 1);
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
      setApiCalls(c => c + 1);
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
      setApiCalls(c => c + 1);
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
        body{font-family:'DM Sans',sans-serif;background:#0d0d14;color:#e2e8f0;-webkit-font-smoothing:antialiased}
        button{font-family:'DM Sans',sans-serif;cursor:pointer}
        textarea{font-family:'DM Mono',monospace}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1e1e30;border-radius:4px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes glow{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fadeUp{animation:fadeUp .3s ease forwards}
        .nav-btn:hover{background:rgba(255,255,255,.05)!important;color:#cbd5e1!important}
        .qa-btn:hover{background:#1a1a2e!important;border-color:#3730a3!important}
        .gen-btn:hover{background:rgba(124,58,237,.3)!important}
        .del-btn:hover{background:rgba(239,68,68,.15)!important}
        .copy-btn:hover{background:rgba(124,58,237,.2)!important}
        .enc-btn:hover{opacity:.88!important}
        .dec-btn:hover{border-color:#7c3aed!important;color:#a78bfa!important}
        textarea:focus{border-color:#7c3aed!important;outline:none}
      `}</style>

      <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width:220,flexShrink:0,background:'#08080f',
          borderRight:'1px solid #161625',
          display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'
        }}>
          <div style={{padding:'20px 14px 16px',borderBottom:'1px solid #161625',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{
                width:32,height:32,background:'linear-gradient(135deg,#7c3aed,#4338ca)',
                borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:15,flexShrink:0,boxShadow:'0 0 12px rgba(124,58,237,.4)'
              }}>🛡</div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:'#f1f5f9',letterSpacing:'-.2px'}}>SRA Shield</div>
                <div style={{fontSize:9.5,color:'#7c3aed',fontWeight:700,letterSpacing:'.1em'}}>BETA</div>
              </div>
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:'14px 8px'}}>
            <div style={{fontSize:9.5,fontWeight:700,color:'#2d2d45',letterSpacing:'.1em',padding:'0 8px',marginBottom:6}}>MAIN</div>
            {navMain.map(n => (
              <button key={n.id} className="nav-btn" onClick={() => setActiveNav(n.id)} style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',
                padding:'9px 10px',borderRadius:8,border:'none',
                background: activeNav===n.id ? 'rgba(124,58,237,.18)' : 'transparent',
                color: activeNav===n.id ? '#a78bfa' : '#4a4a6a',
                fontSize:13.5,fontWeight: activeNav===n.id ? 600 : 400,
                transition:'all .15s',textAlign:'left',
                borderLeft: activeNav===n.id ? '2px solid #7c3aed' : '2px solid transparent',
                marginBottom:2,
              }}>
                <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              </button>
            ))}

            <div style={{fontSize:9.5,fontWeight:700,color:'#2d2d45',letterSpacing:'.1em',padding:'0 8px',margin:'18px 0 6px'}}>ACCOUNT</div>
            {[{icon:'☰',label:'Documentation'},{icon:'↑',label:'Upgrade Plan'}].map(n=>(
              <button key={n.label} className="nav-btn" style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',
                padding:'9px 10px',borderRadius:8,border:'none',
                background:'transparent',color:'#4a4a6a',
                fontSize:13.5,borderLeft:'2px solid transparent',
                transition:'all .15s',textAlign:'left',marginBottom:2,
              }}>
                <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>

          <div style={{padding:'12px 10px',borderTop:'1px solid #161625',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{
              width:30,height:30,borderRadius:'50%',flexShrink:0,
              background:'linear-gradient(135deg,#7c3aed,#06b6d4)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,fontWeight:700,color:'#fff'
            }}>{userName[0].toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11.5,fontWeight:500,color:'#94a3b8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail||userName}</div>
              <div style={{fontSize:10,color:'#3d3d5c',marginTop:1,textTransform:'capitalize'}}>{userPlan} plan</div>
            </div>
            <button onClick={signOut} title="Sign out" style={{
              background:'none',border:'none',color:'#3d3d5c',
              fontSize:15,padding:4,borderRadius:6,transition:'color .15s',flexShrink:0
            }}>⇥</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>

          {/* Topbar */}
          <div style={{
            background:'#08080f',borderBottom:'1px solid #161625',
            padding:'0 28px',height:58,display:'flex',alignItems:'center',
            justifyContent:'space-between',flexShrink:0
          }}>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:'#f1f5f9',letterSpacing:'-.3px'}}>
                {navMain.find(n=>n.id===activeNav)?.label||'Overview'}
              </div>
              <div style={{fontSize:12,color:'#3d3d5c',marginTop:1}}>Welcome back, {userName}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{
                display:'flex',alignItems:'center',gap:6,
                background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.18)',
                borderRadius:100,padding:'5px 12px',fontSize:11.5,fontWeight:600,color:'#4ade80'
              }}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',animation:'glow 2s ease infinite'}}/>
                API Online
              </div>
              <button style={{
                background:'linear-gradient(135deg,#7c3aed,#4338ca)',color:'#fff',
                border:'none',borderRadius:8,padding:'8px 16px',
                fontSize:13,fontWeight:600,boxShadow:'0 0 16px rgba(124,58,237,.3)'
              }}>Upgrade →</button>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:'auto',padding:24}}>

            {/* ── OVERVIEW ── */}
            {activeNav==='overview' && (
              <div className="fadeUp">
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
                  {[
                    {label:'Total API Calls', value:apiCalls,       sub:'This session',        icon:'⚡',c:'rgba(251,191,36,.15)'},
                    {label:'Keys Active',     value:keys.filter(k=>k.status==='Active').length, sub:'Encryption keys', icon:'⚿',c:'rgba(124,58,237,.15)'},
                    {label:'Calls Remaining', value:1000-apiCalls,  sub:'Of 1,000 this month',  icon:'◈',c:'rgba(6,182,212,.15)'},
                  ].map((s,i)=>(
                    <div key={i} style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:'20px 22px'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                        <div style={{fontSize:10.5,fontWeight:700,color:'#3d3d5c',textTransform:'uppercase',letterSpacing:'.07em'}}>{s.label}</div>
                        <div style={{width:32,height:32,background:s.c,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>{s.icon}</div>
                      </div>
                      <div style={{fontSize:40,fontWeight:800,color:'#f1f5f9',letterSpacing:-2,lineHeight:1}}>{s.value}</div>
                      <div style={{fontSize:12,color:'#3d3d5c',marginTop:6}}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 256px',gap:14,marginBottom:16}}>
                  <div style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:22}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
                      <div style={{fontSize:13.5,fontWeight:700,color:'#f1f5f9'}}>API Activity — Last 7 Days</div>
                      <div style={{display:'flex',alignItems:'center',gap:12,fontSize:11.5,color:'#3d3d5c'}}>
                        <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:7,height:7,borderRadius:'50%',background:'#7c3aed',display:'inline-block'}}/>Encrypt</span>
                        <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:7,height:7,borderRadius:'50%',background:'#0891b2',display:'inline-block'}}/>Decrypt</span>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'flex-end',height:110}}>
                      {days.map((d,i)=>(
                        <div key={d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:7}}>
                          <div style={{display:'flex',gap:3,alignItems:'flex-end',height:88}}>
                            <div style={{width:9,background:'#7c3aed',borderRadius:'3px 3px 0 0',height:`${(encData[i]/8)*88}px`}}/>
                            <div style={{width:9,background:'#0891b2',borderRadius:'3px 3px 0 0',height:`${(decData[i]/8)*88}px`}}/>
                          </div>
                          <div style={{fontSize:10,color:'#2d2d45',fontWeight:500}}>{d}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:22}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:'#f1f5f9',marginBottom:16}}>Quick Actions</div>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{
                        display:'flex',alignItems:'center',gap:10,padding:'11px 13px',
                        background:'rgba(124,58,237,.12)',border:'1px solid rgba(124,58,237,.25)',
                        borderRadius:10,color:'#a78bfa',fontSize:13,fontWeight:500,
                        transition:'all .15s',textAlign:'left',opacity:genLoading?.6:1
                      }}><span>⚿</span>{genLoading?'Generating…':'Generate Key'}</button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{
                        display:'flex',alignItems:'center',gap:10,padding:'11px 13px',
                        background:'rgba(255,255,255,.03)',border:'1px solid #161625',
                        borderRadius:10,color:'#4a4a6a',fontSize:13,fontWeight:500,
                        transition:'all .15s',textAlign:'left'
                      }}><span>🔒</span>Encrypt Data</button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{
                        display:'flex',alignItems:'center',gap:10,padding:'11px 13px',
                        background:'rgba(255,255,255,.03)',border:'1px solid #161625',
                        borderRadius:10,color:'#4a4a6a',fontSize:13,fontWeight:500,
                        transition:'all .15s',textAlign:'left'
                      }}><span>🔓</span>Decrypt Data</button>
                    </div>
                  </div>
                </div>

                <div style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:22}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:'#f1f5f9'}}>Active Keys</div>
                    <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{
                      background:'rgba(124,58,237,.12)',border:'1px solid rgba(124,58,237,.25)',
                      borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:600,color:'#a78bfa',
                      transition:'all .15s',opacity:genLoading?.6:1
                    }}>{genLoading?'⏳ Generating…':'+ Generate Key'}</button>
                  </div>
                  {keys.map((k,i)=>(
                    <div key={k.id} style={{
                      display:'flex',alignItems:'center',gap:12,padding:'13px 0',
                      borderBottom:i<keys.length-1?'1px solid #111120':'none'
                    }}>
                      <div style={{width:32,height:32,background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.18)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>⚿</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0'}}>{k.label}</div>
                        <div style={{fontSize:10.5,color:'#2d2d45',fontFamily:'DM Mono,monospace',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {k.value?k.value.slice(0,42)+'…':'Key hidden for security'}
                        </div>
                      </div>
                      <span style={{background:'rgba(34,197,94,.08)',color:'#4ade80',border:'1px solid rgba(34,197,94,.18)',fontSize:10.5,fontWeight:700,padding:'3px 9px',borderRadius:100,flexShrink:0}}>{k.status}</span>
                      <span style={{fontSize:11.5,color:'#2d2d45',flexShrink:0}}>{k.created}</span>
                      <button className="del-btn" style={{background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.18)',color:'#f87171',borderRadius:7,padding:'5px 11px',fontSize:12,fontWeight:600,transition:'all .15s',flexShrink:0}}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MY KEYS ── */}
            {activeNav==='keys' && (
              <div className="fadeUp" style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:22}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                  <div style={{fontSize:13.5,fontWeight:700,color:'#f1f5f9'}}>Encryption Keys</div>
                  <button className="gen-btn" onClick={handleGenKey} disabled={genLoading} style={{
                    background:'rgba(124,58,237,.12)',border:'1px solid rgba(124,58,237,.25)',
                    borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:600,color:'#a78bfa',transition:'all .15s'
                  }}>{genLoading?'⏳ Generating…':'+ Generate Key'}</button>
                </div>
                {keys.map((k,i)=>(
                  <div key={k.id} style={{background:'#08080f',border:'1px solid #111120',borderRadius:12,padding:'16px 18px',marginBottom:i<keys.length-1?10:0}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:k.value?10:0,flexWrap:'wrap'}}>
                          <span style={{fontSize:15}}>⚿</span>
                          <span style={{fontSize:13.5,fontWeight:600,color:'#e2e8f0'}}>{k.label}</span>
                          <span style={{background:'rgba(34,197,94,.08)',color:'#4ade80',border:'1px solid rgba(34,197,94,.18)',fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:100}}>{k.status}</span>
                          <span style={{fontSize:11,color:'#2d2d45'}}>{k.created}</span>
                        </div>
                        {k.value&&(
                          <div style={{background:'#040408',border:'1px solid #111120',borderRadius:8,padding:'10px 12px',fontFamily:'DM Mono,monospace',fontSize:10.5,color:'#7c3aed',wordBreak:'break-all',lineHeight:1.7}}>{k.value}</div>
                        )}
                        {k.code&&<div style={{fontSize:11.5,color:'#3d3d5c',marginTop:8}}>Verification: <span style={{color:'#7c3aed'}}>{k.code}</span></div>}
                      </div>
                      <div style={{display:'flex',gap:8,flexShrink:0}}>
                        {k.value&&<button className="copy-btn" onClick={()=>copyText(k.value,k.id)} style={{background:'rgba(124,58,237,.08)',border:'1px solid rgba(124,58,237,.2)',borderRadius:7,padding:'6px 12px',fontSize:12,fontWeight:600,color:'#a78bfa',transition:'all .15s'}}>{copied===k.id?'✓ Copied':'Copy'}</button>}
                        <button className="del-btn" style={{background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.18)',color:'#f87171',borderRadius:7,padding:'6px 12px',fontSize:12,fontWeight:600,transition:'all .15s'}}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── ENCRYPT / DECRYPT ── */}
            {activeNav==='encrypt' && (
              <div className="fadeUp" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:22}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                    <div style={{width:34,height:34,background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.18)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔒</div>
                    <div style={{fontSize:14,fontWeight:700,color:'#f1f5f9'}}>Encrypt Data</div>
                  </div>
                  <textarea rows={6} value={encInput} onChange={e=>setEncInput(e.target.value)}
                    placeholder="Enter plaintext to encrypt…"
                    style={{width:'100%',background:'#08080f',border:'1px solid #161625',borderRadius:10,padding:'12px 14px',fontSize:12,color:'#e2e8f0',resize:'vertical',lineHeight:1.7,transition:'border .15s'}}
                  />
                  <button className="enc-btn" onClick={handleEncrypt} disabled={encLoading} style={{
                    width:'100%',marginTop:12,padding:'11px 0',
                    background:'linear-gradient(135deg,#7c3aed,#4338ca)',
                    border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:600,
                    transition:'all .15s',opacity:encLoading?.7:1,
                    boxShadow:'0 0 20px rgba(124,58,237,.25)'
                  }}>{encLoading?'Encrypting…':'Encrypt →'}</button>
                  {encResult&&(
                    <div style={{marginTop:14,background:'#08080f',border:'1px solid rgba(124,58,237,.2)',borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{fontSize:9.5,fontWeight:700,color:'#7c3aed',textTransform:'uppercase',letterSpacing:'.07em'}}>Encrypted Output</div>
                        <button className="copy-btn" onClick={()=>copyText(encResult,'enc')} style={{background:'rgba(124,58,237,.08)',border:'1px solid rgba(124,58,237,.2)',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:600,color:'#a78bfa',transition:'all .15s'}}>{copied==='enc'?'✓':'Copy'}</button>
                      </div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:10.5,color:'#a78bfa',wordBreak:'break-all',lineHeight:1.65}}>{encResult}</div>
                    </div>
                  )}
                </div>

                <div style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:22}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                    <div style={{width:34,height:34,background:'rgba(6,182,212,.08)',border:'1px solid rgba(6,182,212,.18)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔓</div>
                    <div style={{fontSize:14,fontWeight:700,color:'#f1f5f9'}}>Decrypt Data</div>
                  </div>
                  <textarea rows={6} value={decInput} onChange={e=>setDecInput(e.target.value)}
                    placeholder="Paste encrypted string here…"
                    style={{width:'100%',background:'#08080f',border:'1px solid #161625',borderRadius:10,padding:'12px 14px',fontSize:12,color:'#e2e8f0',resize:'vertical',lineHeight:1.7,transition:'border .15s'}}
                  />
                  <button className="dec-btn" onClick={handleDecrypt} disabled={decLoading} style={{
                    width:'100%',marginTop:12,padding:'11px 0',background:'transparent',
                    border:'1.5px solid #1e1e30',borderRadius:10,color:'#64748b',
                    fontSize:13,fontWeight:600,transition:'all .15s',opacity:decLoading?.7:1
                  }}>{decLoading?'Decrypting…':'Decrypt →'}</button>
                  {decResult&&(
                    <div style={{marginTop:14,background:'rgba(34,197,94,.04)',border:'1px solid rgba(34,197,94,.18)',borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{fontSize:9.5,fontWeight:700,color:'#4ade80',textTransform:'uppercase',letterSpacing:'.07em'}}>Decrypted Output</div>
                        <button className="copy-btn" onClick={()=>copyText(decResult,'dec')} style={{background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.18)',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:600,color:'#4ade80',transition:'all .15s'}}>{copied==='dec'?'✓':'Copy'}</button>
                      </div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:10.5,color:'#4ade80',wordBreak:'break-all',lineHeight:1.65}}>{decResult}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ACTIVITY ── */}
            {activeNav==='activity' && (
              <div className="fadeUp" style={{background:'#0d0d1a',border:'1px solid #161625',borderRadius:14,padding:'60px 40px',textAlign:'center'}}>
                <div style={{fontSize:36,marginBottom:14,opacity:.3}}>↗</div>
                <div style={{fontSize:15,fontWeight:600,color:'#3d3d5c',marginBottom:6}}>No activity yet</div>
                <div style={{fontSize:13,color:'#2a2a3d'}}>Start encrypting or generating keys to see activity here.</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}