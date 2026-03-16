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

/* ── GENERATE KEY MODAL ─────────────────────────────────────────────────── */
function GenKeyModal({ open, onClose, onKeyGenerated }) {
  const [step, setStep]       = useState('confirm'); // confirm | generating | done
  const [keyVal, setKeyVal]   = useState('');
  const [codeVal, setCodeVal] = useState('');
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (!open) { setTimeout(() => { setStep('confirm'); setKeyVal(''); setCodeVal(''); setCopied(false); }, 300); }
  }, [open]);

  const handleGenerate = async () => {
    setStep('generating');
    try {
      const res  = await fetch(`${API}/api/v1/shield/keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ tier: 'fast' }),
      });
      const data = await res.json();
      const key  = data?.data?.encryptionKey || data?.encryptionKey || '';
      const code = data?.data?.verificationCode || data?.verificationCode || '';
      setKeyVal(key || 'error-generating-key');
      setCodeVal(code);
      setStep('done');
      onKeyGenerated && onKeyGenerated(key, code);
    } catch {
      setKeyVal('error-check-connection');
      setStep('done');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(keyVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#fff',borderRadius:20,width:'100%',maxWidth:460,padding:32,boxShadow:'0 24px 60px rgba(0,0,0,.18)',animation:'fadeUp .25s ease'}}>

        {/* CONFIRM STEP */}
        {step === 'confirm' && <>
          <div style={{fontSize:20,fontWeight:800,color:'#1a2035',marginBottom:10,letterSpacing:'-.3px'}}>Generate New Encryption Key</div>
          <p style={{fontSize:13.5,color:'#6b7280',lineHeight:1.65,marginBottom:28}}>
            A new 256-bit key will be generated from our multi-source entropy engine. <strong style={{color:'#1a2035'}}>Save it immediately</strong> — we do not store keys.
          </p>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button onClick={onClose} style={{padding:'10px 22px',borderRadius:100,border:'1.5px solid #e5e7eb',background:'#fff',color:'#6b7280',fontSize:13.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit',transition:'all .15s'}}>
              Cancel
            </button>
            <button onClick={handleGenerate} style={{padding:'10px 24px',borderRadius:100,border:'none',background:'#1a2035',color:'#fff',fontSize:13.5,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 4px 12px rgba(26,32,53,.25)',transition:'all .15s'}}>
              Generate Key →
            </button>
          </div>
        </>}

        {/* GENERATING STEP */}
        {step === 'generating' && <>
          <div style={{fontSize:20,fontWeight:800,color:'#1a2035',marginBottom:10,letterSpacing:'-.3px'}}>Generate New Encryption Key</div>
          <p style={{fontSize:13.5,color:'#6b7280',lineHeight:1.65,marginBottom:28}}>
            A new 256-bit key will be generated from our multi-source entropy engine. <strong style={{color:'#1a2035'}}>Save it immediately</strong> — we do not store keys.
          </p>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button disabled style={{padding:'10px 22px',borderRadius:100,border:'1.5px solid #e5e7eb',background:'#fff',color:'#d1d5db',fontSize:13.5,fontWeight:600,cursor:'not-allowed',fontFamily:'inherit'}}>
              Cancel
            </button>
            <button disabled style={{padding:'10px 24px',borderRadius:100,border:'none',background:'#1a2035',color:'#fff',fontSize:13.5,fontWeight:700,cursor:'not-allowed',fontFamily:'inherit',display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:14,height:14,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite'}}/>
              Generating...
            </button>
          </div>
        </>}

        {/* DONE STEP */}
        {step === 'done' && <>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{width:34,height:34,background:'#eef9f0',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>✓</div>
            <div style={{fontSize:20,fontWeight:800,color:'#1a2035',letterSpacing:'-.3px'}}>Key Generated!</div>
          </div>
          <p style={{fontSize:13,color:'#6b7280',marginBottom:14}}>Copy and store this key securely. It <strong style={{color:'#ea5455'}}>cannot be recovered</strong> once you close this dialog.</p>
          <div style={{background:'#f8f9fb',border:'1.5px solid #ffe0b2',borderRadius:10,padding:'12px 14px',marginBottom:8}}>
            <div style={{fontSize:9.5,fontWeight:700,color:'#ff9f43',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6}}>Encryption Key</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:'#1a2035',wordBreak:'break-all',lineHeight:1.7}}>{keyVal}</div>
          </div>
          {codeVal && (
            <div style={{fontSize:12,color:'#6b7280',marginBottom:16}}>Verification code: <span style={{color:'#6c5ce7',fontWeight:600,fontFamily:'monospace'}}>{codeVal}</span></div>
          )}
          <div style={{background:'#fff8ec',border:'1px solid #ffe0b2',borderRadius:8,padding:'9px 12px',fontSize:12,color:'#92400e',marginBottom:20}}>
            ⚠️ Store this in a password manager or secrets vault. SRA Shield does not retain your keys.
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button onClick={onClose} style={{padding:'10px 22px',borderRadius:100,border:'1.5px solid #e5e7eb',background:'#fff',color:'#6b7280',fontSize:13.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
              Close
            </button>
            <button onClick={handleCopy} style={{padding:'10px 24px',borderRadius:100,border:'none',background: copied ? '#28c76f' : '#1a2035',color:'#fff',fontSize:13.5,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'background .2s'}}>
              {copied ? '✓ Copied!' : 'Copy Key'}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ── MAIN DASHBOARD ──────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [user, setUser]             = useState(null);
  const [mounted, setMounted]       = useState(false);
  const [activeNav, setActiveNav]   = useState('overview');
  const [keys, setKeys]             = useState([{ id: 1, label: 'Key 1', status: 'Active', created: 'Mar 10', value: '' }]);
  const [modalOpen, setModalOpen]   = useState(false);
  const [encInput, setEncInput]     = useState('');
  const [decInput, setDecInput]     = useState('');
  const [encResult, setEncResult]   = useState('');
  const [decResult, setDecResult]   = useState('');
  const [encLoading, setEncLoading] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [apiCalls, setApiCalls]     = useState(0);
  const [copied, setCopied]         = useState(null);
  const [activity, setActivity]     = useState([]);

  useEffect(() => { setUser(getUser()); setMounted(true); }, []);
  if (!mounted) return null;

  const addActivity = (icon, title, sub) => {
    const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    setActivity(prev => [{ icon, title, sub, time, id: Date.now() }, ...prev].slice(0, 20));
  };

  const handleKeyGenerated = (key, code) => {
    setKeys(prev => [...prev, { id: Date.now(), label: `Key ${prev.length + 1}`, status: 'Active', created: 'Today', value: key, code }]);
    setApiCalls(c => c + 1);
    addActivity('🔑', 'New key generated', code || 'Key stored securely');
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
      const result = data?.data?.encrypted || data?.encrypted || 'Encryption failed';
      setEncResult(result);
      setApiCalls(c => c + 1);
      addActivity('🔒', 'Data encrypted', encInput.slice(0, 30) + (encInput.length > 30 ? '…' : ''));
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
      const result = data?.data?.plaintext || data?.plaintext || 'Decryption failed';
      setDecResult(result);
      setApiCalls(c => c + 1);
      addActivity('🔓', 'Data decrypted', 'Plaintext recovered successfully');
    } catch { setDecResult('Error — check connection'); }
    setDecLoading(false);
  };

  const handleDeleteKey = (id) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    addActivity('🗑', 'Key deleted', 'Key removed from account');
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

  const C = {
    sidebarBg:'#1a2035', sidebarBorder:'#243050',
    navActive:'#2d3f6e', navActiveTxt:'#6c9bff', navTxt:'#8896b3',
    pageBg:'#f4f6fb', cardBg:'#fff8ec', cardBorder:'#ffe0b2',
    cardShadow:'0 1px 6px rgba(255,159,67,.1)',
    titleTxt:'#1a2035', bodyTxt:'#4a5568', mutedTxt:'#a0aec0',
    purple:'#6c5ce7', purpleLight:'#f0eeff', purpleBorder:'#d6ceff',
    green:'#28c76f', greenBg:'#eef9f0', greenBdr:'#b8f0c8',
    red:'#ea5455', redBg:'#fff0f0', redBdr:'#ffc0c0',
    amber:'#ff9f43', amberBg:'#fff8ec', amberBdr:'#ffe0b2',
    topBg:'#ffffff', topBorder:'#e8edf5',
  };

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
        @keyframes glowdot{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fadeUp{animation:fadeUp .3s ease forwards}
        .nav-btn:hover{background:rgba(255,255,255,.07)!important;color:#c5d0e8!important}
        .gen-btn:hover{background:${C.purple}!important;color:#fff!important;border-color:${C.purple}!important}
        .del-btn:hover{background:#ffe0e0!important}
        .copy-btn:hover{background:${C.purpleLight}!important}
        .enc-btn:hover{opacity:.86!important}
        .dec-btn:hover{border-color:${C.purple}!important;color:${C.purple}!important}
        .qa-btn:hover{background:${C.purpleLight}!important;border-color:${C.purpleBorder}!important;color:${C.purple}!important}
        textarea:focus{border-color:${C.purple}!important;outline:none;box-shadow:0 0 0 3px ${C.purpleLight}}
        .plan-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(108,92,231,.18)!important}
        .doc-block:hover{border-color:${C.purpleBorder}!important;background:${C.purpleLight}!important}
      `}</style>

      <GenKeyModal open={modalOpen} onClose={() => setModalOpen(false)} onKeyGenerated={handleKeyGenerated} />

      <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
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
                fontSize:13.5,fontWeight: activeNav===n.id ? 600 : 400,transition:'all .15s',textAlign:'left',
                borderLeft: activeNav===n.id ? `3px solid ${C.navActiveTxt}` : '3px solid transparent',marginBottom:3,
              }}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</button>
            ))}

            <div style={{fontSize:9.5,fontWeight:700,color:'#3d5080',letterSpacing:'.1em',padding:'0 6px',margin:'18px 0 6px'}}>ACCOUNT</div>
            {[{id:'docs',icon:'☰',label:'Documentation'},{id:'upgrade',icon:'↑',label:'Upgrade Plan'}].map(n=>(
              <button key={n.id} className="nav-btn" onClick={() => setActiveNav(n.id)} style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:9,border:'none',
                background: activeNav===n.id ? C.navActive : 'transparent',
                color: activeNav===n.id ? C.navActiveTxt : C.navTxt,
                fontSize:13.5,fontWeight: activeNav===n.id ? 600 : 400,transition:'all .15s',textAlign:'left',
                borderLeft: activeNav===n.id ? `3px solid ${C.navActiveTxt}` : '3px solid transparent',marginBottom:3,
              }}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</button>
            ))}
          </div>

          <div style={{padding:'12px 12px',borderTop:`1px solid ${C.sidebarBorder}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#6c5ce7,#0984e3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>{userName[0].toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11.5,fontWeight:500,color:'#c5d0e8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail||userName}</div>
              <div style={{fontSize:10,color:'#4a6080',marginTop:1,textTransform:'capitalize'}}>{userPlan} plan</div>
            </div>
            <button onClick={signOut} title="Sign out" style={{background:'none',border:'none',color:'#4a6080',fontSize:15,padding:4,borderRadius:6,transition:'color .15s',flexShrink:0}}>⇥</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
          {/* Topbar */}
          <div style={{background:C.topBg,borderBottom:`1px solid ${C.topBorder}`,padding:'0 28px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:C.titleTxt,letterSpacing:'-.3px'}}>
                {[...navMain,{id:'docs',label:'Documentation'},{id:'upgrade',label:'Upgrade Plan'}].find(n=>n.id===activeNav)?.label||'Overview'}
              </div>
              <div style={{fontSize:12,color:C.mutedTxt,marginTop:1}}>Welcome back, {userName}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:6,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:100,padding:'5px 13px',fontSize:12,fontWeight:600,color:C.green}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.green,animation:'glowdot 2s ease infinite'}}/>API Online
              </div>
              <button onClick={() => setActiveNav('upgrade')} style={{background:'linear-gradient(135deg,#6c5ce7,#4338ca)',color:'#fff',border:'none',borderRadius:9,padding:'8px 18px',fontSize:13,fontWeight:600,boxShadow:'0 4px 12px rgba(108,92,231,.3)'}}>Upgrade →</button>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:'auto',padding:24,background:C.pageBg}}>

            {/* ── OVERVIEW ── */}
            {activeNav==='overview' && (
              <div className="fadeUp">
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:18}}>
                  {[
                    {label:'Total API Calls', value:apiCalls,       sub:'This session',        icon:'⚡'},
                    {label:'Keys Active',     value:keys.filter(k=>k.status==='Active').length, sub:'Encryption keys', icon:'⚿'},
                    {label:'Calls Remaining', value:1000-apiCalls,  sub:'Of 1,000 this month',  icon:'◈'},
                  ].map((s,i)=>(
                    <div key={i} style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:'20px 22px',boxShadow:C.cardShadow}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.bodyTxt,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.label}</div>
                        <div style={{width:36,height:36,background:'rgba(255,255,255,.8)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,boxShadow:'0 2px 6px rgba(255,159,67,.15)'}}>{s.icon}</div>
                      </div>
                      <div style={{fontSize:40,fontWeight:800,color:C.titleTxt,letterSpacing:-2,lineHeight:1}}>{s.value}</div>
                      <div style={{fontSize:12,color:C.bodyTxt,marginTop:6,fontWeight:500}}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:16,marginBottom:18}}>
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
                      <button className="gen-btn" onClick={() => setModalOpen(true)} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:10,color:C.purple,fontSize:13,fontWeight:600,transition:'all .15s',textAlign:'left'}}><span>⚿</span>Generate Key</button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}><span>🔒</span>Encrypt Data</button>
                      <button className="qa-btn" onClick={()=>setActiveNav('encrypt')} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#f8f9fb',border:`1px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:13,fontWeight:500,transition:'all .15s',textAlign:'left'}}><span>🔓</span>Decrypt Data</button>
                    </div>
                  </div>
                </div>

                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Active Keys</div>
                    <button className="gen-btn" onClick={() => setModalOpen(true)} style={{background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:8,padding:'7px 15px',fontSize:12,fontWeight:600,color:C.purple,transition:'all .15s'}}>+ Generate Key</button>
                  </div>
                  {keys.map((k,i)=>(
                    <div key={k.id} style={{display:'flex',alignItems:'center',gap:13,padding:'13px 0',borderBottom:i<keys.length-1?`1px solid ${C.cardBorder}`:'none'}}>
                      <div style={{width:36,height:36,background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>⚿</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13.5,fontWeight:600,color:C.titleTxt}}>{k.label}</div>
                        <div style={{fontSize:11,color:C.mutedTxt,fontFamily:'DM Mono,monospace',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{k.value?k.value.slice(0,44)+'…':'Key hidden for security'}</div>
                      </div>
                      <span style={{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBdr}`,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:100,flexShrink:0}}>{k.status}</span>
                      <span style={{fontSize:12,color:C.mutedTxt,flexShrink:0}}>{k.created}</span>
                      <button className="del-btn" onClick={() => handleDeleteKey(k.id)} style={{background:C.redBg,border:`1px solid ${C.redBdr}`,color:C.red,borderRadius:8,padding:'5px 12px',fontSize:12,fontWeight:600,transition:'all .15s',flexShrink:0}}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MY KEYS ── */}
            {activeNav==='keys' && (
              <div className="fadeUp" style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Encryption Keys</div>
                  <button className="gen-btn" onClick={() => setModalOpen(true)} style={{background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:8,padding:'7px 15px',fontSize:12,fontWeight:600,color:C.purple,transition:'all .15s'}}>+ Generate Key</button>
                </div>
                {keys.map((k,i)=>(
                  <div key={k.id} style={{background:'#fffdf7',border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:'16px 18px',marginBottom:i<keys.length-1?10:0}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:k.value?10:0,flexWrap:'wrap'}}>
                          <span style={{fontSize:16}}>⚿</span>
                          <span style={{fontSize:14,fontWeight:600,color:C.titleTxt}}>{k.label}</span>
                          <span style={{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBdr}`,fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:100}}>{k.status}</span>
                          <span style={{fontSize:11.5,color:C.mutedTxt}}>{k.created}</span>
                        </div>
                        {k.value&&<div style={{background:'#fff',border:`1px solid ${C.purpleBorder}`,borderRadius:8,padding:'10px 12px',fontFamily:'DM Mono,monospace',fontSize:11,color:C.purple,wordBreak:'break-all',lineHeight:1.7}}>{k.value}</div>}
                        {k.code&&<div style={{fontSize:12,color:C.bodyTxt,marginTop:8}}>Verification: <span style={{color:C.purple,fontWeight:600}}>{k.code}</span></div>}
                      </div>
                      <div style={{display:'flex',gap:8,flexShrink:0}}>
                        {k.value&&<button className="copy-btn" onClick={()=>copyText(k.value,k.id)} style={{background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:7,padding:'6px 13px',fontSize:12,fontWeight:600,color:C.purple,transition:'all .15s'}}>{copied===k.id?'✓ Copied':'Copy'}</button>}
                        <button className="del-btn" onClick={() => handleDeleteKey(k.id)} style={{background:C.redBg,border:`1px solid ${C.redBdr}`,color:C.red,borderRadius:7,padding:'6px 13px',fontSize:12,fontWeight:600,transition:'all .15s'}}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── ENCRYPT / DECRYPT ── */}
            {activeNav==='encrypt' && (
              <div className="fadeUp" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                    <div style={{width:36,height:36,background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🔒</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Encrypt Data</div>
                  </div>
                  <textarea rows={6} value={encInput} onChange={e=>setEncInput(e.target.value)} placeholder="Enter plaintext to encrypt…"
                    style={{width:'100%',background:'#fffdf7',border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:'12px 14px',fontSize:12.5,color:C.titleTxt,resize:'vertical',lineHeight:1.7,transition:'all .2s'}}/>
                  <button className="enc-btn" onClick={handleEncrypt} disabled={encLoading} style={{width:'100%',marginTop:12,padding:'12px 0',background:'linear-gradient(135deg,#6c5ce7,#4338ca)',border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:600,transition:'all .15s',opacity:encLoading?.7:1,boxShadow:'0 4px 14px rgba(108,92,231,.3)'}}>{encLoading?'Encrypting…':'Encrypt →'}</button>
                  {encResult&&(
                    <div style={{marginTop:14,background:'#fffdf7',border:`1px solid ${C.purpleBorder}`,borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.purple,textTransform:'uppercase',letterSpacing:'.07em'}}>Encrypted Output</div>
                        <button className="copy-btn" onClick={()=>copyText(encResult,'enc')} style={{background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:600,color:C.purple,transition:'all .15s'}}>{copied==='enc'?'✓':'Copy'}</button>
                      </div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:C.purple,wordBreak:'break-all',lineHeight:1.65}}>{encResult}</div>
                    </div>
                  )}
                </div>

                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                    <div style={{width:36,height:36,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🔓</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.titleTxt}}>Decrypt Data</div>
                  </div>
                  <textarea rows={6} value={decInput} onChange={e=>setDecInput(e.target.value)} placeholder="Paste encrypted string here…"
                    style={{width:'100%',background:'#fffdf7',border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:'12px 14px',fontSize:12.5,color:C.titleTxt,resize:'vertical',lineHeight:1.7,transition:'all .2s'}}/>
                  <button className="dec-btn" onClick={handleDecrypt} disabled={decLoading} style={{width:'100%',marginTop:12,padding:'12px 0',background:'#fff',border:`1.5px solid ${C.cardBorder}`,borderRadius:10,color:C.bodyTxt,fontSize:14,fontWeight:600,transition:'all .15s',opacity:decLoading?.7:1}}>{decLoading?'Decrypting…':'Decrypt →'}</button>
                  {decResult&&(
                    <div style={{marginTop:14,background:C.greenBg,border:`1px solid ${C.greenBdr}`,borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.green,textTransform:'uppercase',letterSpacing:'.07em'}}>Decrypted Output</div>
                        <button className="copy-btn" onClick={()=>copyText(decResult,'dec')} style={{background:'rgba(40,199,111,.12)',border:`1px solid ${C.greenBdr}`,borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:600,color:C.green,transition:'all .15s'}}>{copied==='dec'?'✓':'Copy'}</button>
                      </div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:'#1a7a45',wordBreak:'break-all',lineHeight:1.65}}>{decResult}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ACTIVITY ── */}
            {activeNav==='activity' && (
              <div className="fadeUp" style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                <div style={{fontSize:14,fontWeight:700,color:C.titleTxt,marginBottom:18}}>Recent Activity</div>
                {activity.length === 0 ? (
                  <div style={{textAlign:'center',padding:'48px 0',color:C.mutedTxt}}>
                    <div style={{fontSize:36,marginBottom:12}}>↗</div>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>No activity yet</div>
                    <div style={{fontSize:13}}>Generate keys or encrypt data to see activity here.</div>
                  </div>
                ) : activity.map((a,i)=>(
                  <div key={a.id} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:i<activity.length-1?`1px solid ${C.cardBorder}`:'none'}}>
                    <div style={{width:36,height:36,background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{a.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13.5,fontWeight:600,color:C.titleTxt}}>{a.title}</div>
                      <div style={{fontSize:12,color:C.mutedTxt,marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.sub}</div>
                    </div>
                    <div style={{fontSize:12,color:C.mutedTxt,flexShrink:0}}>{a.time}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── DOCUMENTATION ── */}
            {activeNav==='docs' && (
              <div className="fadeUp">
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.titleTxt,marginBottom:4}}>SRA Shield API Documentation</div>
                  <div style={{fontSize:13,color:C.mutedTxt}}>Everything you need to integrate SRA Shield into your application.</div>
                </div>

                {/* Quick start */}
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow,marginBottom:16}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.titleTxt,marginBottom:16}}>🚀 Quick Start</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                    {[
                      {step:'01',title:'Register',desc:'Create your account and get your API credentials.'},
                      {step:'02',title:'Generate Key',desc:'Generate a 256-bit encryption key from our entropy engine.'},
                      {step:'03',title:'Encrypt',desc:'Make a POST request to encrypt any sensitive data.'},
                    ].map(s=>(
                      <div key={s.step} className="doc-block" style={{background:'#fffdf7',border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:'16px 18px',transition:'all .2s'}}>
                        <div style={{fontSize:22,fontWeight:900,color:C.amber,marginBottom:8,letterSpacing:-1}}>{s.step}</div>
                        <div style={{fontSize:13.5,fontWeight:700,color:C.titleTxt,marginBottom:6}}>{s.title}</div>
                        <div style={{fontSize:12.5,color:C.bodyTxt,lineHeight:1.6}}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endpoints */}
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow,marginBottom:16}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.titleTxt,marginBottom:16}}>📡 API Endpoints</div>
                  {[
                    {method:'POST',path:'/api/v1/auth/register',desc:'Register a new account',auth:false},
                    {method:'POST',path:'/api/v1/auth/login',desc:'Login and receive JWT token',auth:false},
                    {method:'POST',path:'/api/v1/shield/keys/generate',desc:'Generate a new encryption key',auth:true},
                    {method:'POST',path:'/api/v1/shield/encrypt',desc:'Encrypt plaintext data',auth:true},
                    {method:'POST',path:'/api/v1/shield/decrypt',desc:'Decrypt encrypted data',auth:true},
                    {method:'GET', path:'/api/v1/shield/verify/{code}',desc:'Verify a key by verification code',auth:false},
                    {method:'GET', path:'/api/v1/shield/keys/audit',desc:'Get audit log of key operations',auth:true},
                    {method:'POST',path:'/api/v1/shield/keys/rotate',desc:'Rotate to a new encryption key',auth:true},
                  ].map((e,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'11px 0',borderBottom:i<7?`1px solid ${C.cardBorder}`:'none'}}>
                      <span style={{background: e.method==='POST'?C.purpleLight:'#eef4ff',color: e.method==='POST'?C.purple:'#0984e3',border:`1px solid ${e.method==='POST'?C.purpleBorder:'#c2d8f8'}`,borderRadius:6,padding:'3px 9px',fontSize:11,fontWeight:700,flexShrink:0,minWidth:46,textAlign:'center'}}>{e.method}</span>
                      <code style={{fontFamily:'DM Mono,monospace',fontSize:12,color:C.titleTxt,flex:1}}>{e.path}</code>
                      <span style={{fontSize:12.5,color:C.bodyTxt,flex:1}}>{e.desc}</span>
                      <span style={{background: e.auth?C.amberBg:'#f0fff4',color: e.auth?C.amber:C.green,border:`1px solid ${e.auth?C.amberBdr:C.greenBdr}`,fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:100,flexShrink:0}}>{e.auth?'Auth':'Public'}</span>
                    </div>
                  ))}
                </div>

                {/* Code example */}
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.titleTxt,marginBottom:16}}>💻 Code Example</div>
                  <div style={{background:'#1a2035',borderRadius:10,padding:'18px 20px',fontFamily:'DM Mono,monospace',fontSize:12,lineHeight:1.9,color:'#c5d0e8',overflowX:'auto'}}>
                    <div style={{color:'#6c9bff'}}>// 1. Login to get token</div>
                    <div><span style={{color:'#ff9f43'}}>const</span> login = <span style={{color:'#ff9f43'}}>await</span> fetch(<span style={{color:'#28c76f'}}>'{API}/api/v1/auth/login'</span>, {'{'}</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#ff9f43'}}>method</span>: <span style={{color:'#28c76f'}}>'POST'</span>,</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#ff9f43'}}>body</span>: JSON.stringify({'{'} email, password {'}'})</div>
                    <div>{'}'});</div>
                    <div style={{marginTop:12,color:'#6c9bff'}}>// 2. Generate encryption key</div>
                    <div><span style={{color:'#ff9f43'}}>const</span> keyRes = <span style={{color:'#ff9f43'}}>await</span> fetch(<span style={{color:'#28c76f'}}>'{API}/api/v1/shield/keys/generate'</span>, {'{'}</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#ff9f43'}}>method</span>: <span style={{color:'#28c76f'}}>'POST'</span>,</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#ff9f43'}}>headers</span>: {'{'} <span style={{color:'#28c76f'}}>'Authorization'</span>: <span style={{color:'#28c76f'}}>`Bearer ${'{'}token{'}'}`</span> {'}'}</div>
                    <div>{'}'});</div>
                    <div style={{marginTop:12,color:'#6c9bff'}}>// 3. Encrypt data</div>
                    <div><span style={{color:'#ff9f43'}}>const</span> enc = <span style={{color:'#ff9f43'}}>await</span> fetch(<span style={{color:'#28c76f'}}>'{API}/api/v1/shield/encrypt'</span>, {'{'}</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#ff9f43'}}>method</span>: <span style={{color:'#28c76f'}}>'POST'</span>,</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#ff9f43'}}>body</span>: JSON.stringify({'{'} <span style={{color:'#ff9f43'}}>plaintext</span>: <span style={{color:'#28c76f'}}>'sensitive data'</span> {'}'})</div>
                    <div>{'}'});</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── UPGRADE PLAN ── */}
            {activeNav==='upgrade' && (
              <div className="fadeUp">
                <div style={{textAlign:'center',marginBottom:28}}>
                  <div style={{fontSize:22,fontWeight:800,color:C.titleTxt,letterSpacing:'-.4px',marginBottom:8}}>Choose Your Plan</div>
                  <div style={{fontSize:14,color:C.mutedTxt}}>Scale your encryption needs. Upgrade or downgrade anytime.</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,maxWidth:860,margin:'0 auto'}}>
                  {[
                    {
                      name:'Starter', price:'$0', period:'/month',
                      desc:'Perfect for developers testing the integration.',
                      color:C.green, colorLight:C.greenBg, colorBdr:C.greenBdr,
                      features:['1,000 API calls/month','1 encryption key','Community support','Full API access'],
                      cta:'Current Plan', current: userPlan==='free'||userPlan==='Starter',
                    },
                    {
                      name:'Business', price:'$49', period:'/month',
                      desc:'Everything your team needs to ship securely.',
                      color:C.purple, colorLight:C.purpleLight, colorBdr:C.purpleBorder,
                      features:['100,000 API calls/month','10 encryption keys','Email support (24h SLA)','99.9% uptime SLA','Usage analytics'],
                      cta:'Upgrade Now', badge:'Most Popular', current: userPlan==='pro',
                    },
                    {
                      name:'Enterprise', price:'Custom', period:'',
                      desc:'For large organizations with specific requirements.',
                      color:C.amber, colorLight:C.amberBg, colorBdr:C.amberBdr,
                      features:['Unlimited API calls','Unlimited keys','Dedicated support manager','Custom SLA','Security audit report'],
                      cta:'Contact Us', current:false,
                    },
                  ].map((p,i)=>(
                    <div key={i} className="plan-card" style={{
                      background:C.cardBg,border:`2px solid ${p.current||i===1?p.colorBdr:C.cardBorder}`,
                      borderRadius:16,padding:'26px 22px',
                      boxShadow: i===1 ? `0 4px 20px rgba(108,92,231,.15)` : C.cardShadow,
                      position:'relative',transition:'all .25s',cursor:'default'
                    }}>
                      {p.badge&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:C.purple,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 14px',borderRadius:100,whiteSpace:'nowrap',boxShadow:'0 4px 10px rgba(108,92,231,.3)'}}>✦ {p.badge}</div>}
                      <div style={{marginBottom:16}}>
                        <div style={{fontSize:13,fontWeight:700,color:p.color,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6}}>{p.name}</div>
                        <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                          <span style={{fontSize:36,fontWeight:900,color:C.titleTxt,letterSpacing:-2}}>{p.price}</span>
                          <span style={{fontSize:13,color:C.mutedTxt}}>{p.period}</span>
                        </div>
                        <div style={{fontSize:12.5,color:C.bodyTxt,marginTop:8,lineHeight:1.55}}>{p.desc}</div>
                      </div>
                      <div style={{borderTop:`1px solid ${C.cardBorder}`,paddingTop:16,marginBottom:20}}>
                        {p.features.map((f,fi)=>(
                          <div key={fi} style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
                            <span style={{color:p.color,fontSize:13,fontWeight:700,flexShrink:0}}>✓</span>
                            <span style={{fontSize:13,color:C.bodyTxt}}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <button style={{
                        width:'100%',padding:'11px 0',borderRadius:100,
                        background: p.current ? '#f4f6fb' : i===1 ? `linear-gradient(135deg,${p.color},#4338ca)` : p.colorLight,
                        border: p.current ? `1.5px solid ${C.cardBorder}` : i===1 ? 'none' : `1.5px solid ${p.colorBdr}`,
                        color: p.current ? C.mutedTxt : i===1 ? '#fff' : p.color,
                        fontSize:13.5,fontWeight:700,cursor: p.current ? 'default' : 'pointer',
                        boxShadow: i===1 && !p.current ? '0 4px 12px rgba(108,92,231,.3)' : 'none',
                        fontFamily:'inherit',
                      }}>{p.cta}</button>
                    </div>
                  ))}
                </div>

                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:22,boxShadow:C.cardShadow,maxWidth:860,margin:'20px auto 0'}}>
                  <div style={{fontSize:13.5,fontWeight:700,color:C.titleTxt,marginBottom:12}}>All plans include</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                    {['AES-256 Encryption','Multi-source entropy','Public key verification','DPDP Act compliant'].map((f,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:C.bodyTxt}}>
                        <span style={{color:C.green,fontWeight:700}}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}