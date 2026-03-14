import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const BASE = 'https://sra-backend-production.up.railway.app/api/v1';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('user@email.com');
  const [storedKeys, setStoredKeys] = useState([]);
  const [encCount, setEncCount] = useState(0);
  const [decCount, setDecCount] = useState(0);
  const [activity, setActivity] = useState([]);
  const [encInput, setEncInput] = useState('');
  const [decInput, setDecInput] = useState('');
  const [encResult, setEncResult] = useState('');
  const [decResult, setDecResult] = useState('');
  const [encResultVisible, setEncResultVisible] = useState(false);
  const [decResultVisible, setDecResultVisible] = useState(false);
  const [decAgainVal, setDecAgainVal] = useState('');
  const [showDecAgain, setShowDecAgain] = useState(false);
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genKeyVal, setGenKeyVal] = useState('');
  const [genDone, setGenDone] = useState(false);
  const tokenRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem('sra_token');
    const savedEmail = sessionStorage.getItem('sra_email') || 'user@email.com';
    if (!token) { window.location.href = '/login'; return; }
    tokenRef.current = token;
    setEmail(savedEmail);
    const keys = JSON.parse(localStorage.getItem('sra_keys') || '[]');
    setStoredKeys(keys);
  }, []);

  async function apiFetch(endpoint, options = {}) {
    const token = tokenRef.current;
    const res = await fetch(`${BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) { alert('Session expired. Please sign in again.'); logout(); }
      throw new Error(data.message || `Error ${res.status}`);
    }
    return data;
  }

  function logout() {
    sessionStorage.removeItem('sra_token');
    sessionStorage.removeItem('sra_email');
    window.location.href = '/login';
  }

  function addActivity(type, title, sub) {
    const icons = { encrypt: '🔒', decrypt: '🔓', 'key-gen': '🔑', 'key-delete': '🗑️' };
    const colors = { encrypt: 'background:var(--purple-l)', decrypt: 'background:#D1FAE5', 'key-gen': 'background:#EFF6FF', 'key-delete': 'background:#FEE2E2' };
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivity(prev => [{ type, title, sub, time: now, icon: icons[type], color: colors[type] }, ...prev].slice(0, 20));
  }

  async function generateKey() {
    setGenLoading(true);
    try {
      const data = await apiFetch('/shield/keys/generate');
      const key = data.data?.encryptionKey;
      setGenKeyVal(key);
      setGenDone(true);
      const newKeys = [...storedKeys, { value: key, name: `Key ${storedKeys.length + 1}`, created: new Date().toISOString() }];
      setStoredKeys(newKeys);
      localStorage.setItem('sra_keys', JSON.stringify(newKeys));
      addActivity('key-gen', 'Key generated', 'New encryption key created');
    } catch (e) {
      alert(e.message || 'Failed to generate key.');
    }
    setGenLoading(false);
  }

  function deleteKey(index) {
    if (!confirm('Delete this key? Encrypted data using this key cannot be recovered.')) return;
    const newKeys = storedKeys.filter((_, i) => i !== index);
    setStoredKeys(newKeys);
    localStorage.setItem('sra_keys', JSON.stringify(newKeys));
    addActivity('key-delete', 'Key deleted', 'Encryption key removed');
  }

  async function doEncrypt() {
    if (!encInput.trim()) return;
    setEncResult('Encrypting...');
    setEncResultVisible(true);
    try {
      const data = await apiFetch('/shield/encrypt', { body: { plaintext: encInput.trim() } });
      const encrypted = data.data?.encrypted;
      setEncResult(encrypted);
      setDecAgainVal(encrypted);
      setShowDecAgain(true);
      setEncCount(c => c + 1);
      addActivity('encrypt', 'Data encrypted', `${encInput.trim().substring(0, 30)}${encInput.trim().length > 30 ? '...' : ''}`);
    } catch (e) {
      setEncResult(`Error: ${e.message || 'Encryption failed'}`);
    }
  }

  async function doDecrypt() {
    if (!decInput.trim()) return;
    setDecResult('Decrypting...');
    setDecResultVisible(true);
    try {
      const data = await apiFetch('/shield/decrypt', { body: { encrypted: decInput.trim() } });
      setDecResult(data.data?.plaintext);
      setDecCount(c => c + 1);
      addActivity('decrypt', 'Data decrypted', 'Encrypted string decrypted');
    } catch (e) {
      setDecResult(`Error: ${e.message || 'Decryption failed'}`);
    }
  }

  function doDecryptAgain() {
    setActiveTab('encrypt');
    setDecInput(decAgainVal);
  }

  async function copyText(text, btnId) {
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.getElementById(btnId);
      if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); }
    } catch {}
  }

  function closeGenModal() {
    setGenModalOpen(false);
    setGenDone(false);
    setGenKeyVal('');
    setGenLoading(false);
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="10" y="1" width="5" height="5" rx="1"/><rect x="1" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1"/></svg> },
    { key: 'keys', label: 'My Keys', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="8" r="4"/><path d="M10 8h5M13 6v4"/></svg> },
    { key: 'encrypt', label: 'Encrypt / Decrypt', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/></svg> },
    { key: 'activity', label: 'Activity', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1,12 5,7 9,9 15,3"/></svg> },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const enc = [12, 8, 22, 15, 28, 6, 18];
  const dec = [6, 4, 11, 8, 14, 3, 9];
  const maxVal = Math.max(...enc);

  const KeysList = ({ keys, onDelete }) => {
    if (keys.length === 0) return <div className="empty-keys">No keys yet. Generate your first key to start encrypting.</div>;
    return keys.map((k, i) => (
      <div className="key-item" key={i}>
        <div className="ki-icon">🔑</div>
        <div className="ki-info">
          <div className="ki-name">{k.name || `Key ${i + 1}`}</div>
          <div className="ki-hash">{k.value}</div>
        </div>
        <span className="badge badge-green" style={{flexShrink:0}}>Active</span>
        <button className="ki-del" onClick={() => onDelete(i)}>Delete</button>
      </div>
    ));
  };

  return (
    <>
      <Head><title>Dashboard — SRA Shield</title></Head>

      <style>{`
        body{background:#F5F5F7;overflow-x:hidden}
        .app{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
        .sidebar{background:var(--charcoal);position:fixed;top:0;left:0;width:240px;height:100vh;display:flex;flex-direction:column;z-index:100;overflow-y:auto}
        .sb-logo{display:flex;align-items:center;gap:10px;padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,.06)}
        .sb-logo-icon{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--purple),#60A5FA);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sb-logo-text{font-family:'Urbanist',sans-serif;font-size:16px;font-weight:800;color:#fff}
        .sb-section{padding:14px 12px 8px}
        .sb-sect-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,.25);padding:0 8px;margin-bottom:5px}
        .sb-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;font-size:13.5px;font-weight:500;color:rgba(255,255,255,.45);cursor:pointer;transition:all .2s;text-decoration:none;margin-bottom:1px;border:none;background:none;width:100%;text-align:left}
        .sb-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.7)}
        .sb-item.on{background:rgba(255,255,255,.1);color:#fff}
        .sb-item svg{flex-shrink:0;opacity:.6}.sb-item.on svg{opacity:1}
        .sb-footer{margin-top:auto;padding:14px 12px;border-top:1px solid rgba(255,255,255,.06)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:rgba(255,255,255,.05);margin-bottom:6px}
        .sb-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--blue));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0}
        .sb-uname{font-size:12.5px;font-weight:600;color:rgba(255,255,255,.8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .sb-plan{font-size:10.5px;color:rgba(255,255,255,.3)}
        .sb-logout{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;font-size:12.5px;color:rgba(255,255,255,.3);cursor:pointer;transition:all .2s;border:none;background:none;width:100%}
        .sb-logout:hover{color:rgba(255,255,255,.6);background:rgba(255,255,255,.04)}
        .main{margin-left:240px;min-height:100vh}
        .topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;height:58px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:50}
        .tb-menu-btn{display:none;background:none;border:none;padding:0;cursor:pointer;color:var(--charcoal)}
        .tb-title{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:800;color:var(--charcoal);flex:1}
        .tb-right{display:flex;align-items:center;gap:10px}
        .tb-badge{display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;color:var(--green);background:#D1FAE5;padding:4px 10px;border-radius:100px}
        .tb-bdot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s ease infinite}
        .content{padding:28px}
        .sidebar-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99}
        .sidebar-backdrop.show{display:block}
        .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
        .stat-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:22px;box-shadow:var(--sh-sm)}
        .sc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
        .sc-label{font-size:11.5px;font-weight:600;color:var(--gray);text-transform:uppercase;letter-spacing:.5px}
        .sc-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px}
        .sc-val{font-family:'Urbanist',sans-serif;font-size:30px;font-weight:900;color:var(--charcoal);line-height:1;letter-spacing:-1px}
        .sc-sub{font-size:12px;color:var(--gray);margin-top:4px}
        .chart-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:22px;margin-bottom:22px;box-shadow:var(--sh-sm)}
        .chart-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .chart-title{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:800;color:var(--charcoal)}
        .chart-legend{display:flex;gap:14px}
        .legend-item{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--gray);font-weight:500}
        .legend-dot{width:8px;height:8px;border-radius:50%}
        .bar-chart{display:flex;align-items:flex-end;gap:6px;height:140px;padding:0 4px}
        .bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;justify-content:flex-end}
        .bar-enc{border-radius:5px 5px 0 0;background:var(--purple);width:100%}
        .bar-dec{border-radius:5px 5px 0 0;background:var(--blue);width:100%}
        .bar-label{font-size:9.5px;color:var(--gray);margin-top:5px}
        .keys-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:22px;box-shadow:var(--sh-sm)}
        .kc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .kc-title{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:800;color:var(--charcoal)}
        .key-list{display:flex;flex-direction:column;gap:10px}
        .key-item{display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:12px;transition:all .2s}
        .key-item:hover{border-color:rgba(139,92,246,.25);background:var(--purple-l)}
        .ki-icon{width:36px;height:36px;border-radius:10px;background:var(--purple-l);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .ki-info{flex:1;min-width:0}
        .ki-name{font-size:13.5px;font-weight:700;color:var(--charcoal)}
        .ki-hash{font-size:11.5px;font-family:monospace;color:var(--gray);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}
        .ki-del{padding:5px 12px;border-radius:100px;font-size:11.5px;font-weight:600;color:var(--red);background:#FEE2E2;border:none;cursor:pointer;transition:all .2s}
        .ki-del:hover{background:#FECACA}
        .empty-keys{text-align:center;padding:40px 20px;color:var(--gray);font-size:14px}
        .enc-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:22px;box-shadow:var(--sh-sm);margin-bottom:14px}
        .enc-title{font-family:'Urbanist',sans-serif;font-size:15px;font-weight:800;color:var(--charcoal);margin-bottom:14px}
        .enc-textarea{width:100%;padding:13px;border:1.5px solid var(--border);border-radius:12px;font-size:13px;font-family:'Manrope',sans-serif;color:var(--charcoal);resize:vertical;min-height:100px;outline:none;transition:border-color .2s}
        .enc-textarea:focus{border-color:var(--purple)}
        .enc-actions{display:flex;gap:8px;margin-top:10px}
        .enc-btn{padding:9px 20px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .22s;font-family:'Manrope',sans-serif}
        .enc-btn.primary{background:var(--charcoal);color:#fff}.enc-btn.primary:hover{background:#111}
        .enc-btn.secondary{background:var(--purple);color:#fff}.enc-btn.secondary:hover{background:var(--purple-d)}
        .result-box{background:#0F0F0F;border-radius:12px;padding:15px;margin-top:12px}
        .res-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
        .res-label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.35);font-weight:700}
        .res-copy{font-size:11px;color:rgba(255,255,255,.4);cursor:pointer;padding:2px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.1);transition:all .2s;background:none}
        .res-copy:hover{color:rgba(255,255,255,.8)}
        .res-val{font-family:'SF Mono','Fira Code',monospace;font-size:11.5px;color:var(--purple);word-break:break-all;line-height:1.7}
        .res-val.plain{color:var(--green)}
        .activity-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:22px;box-shadow:var(--sh-sm)}
        .activity-list{display:flex;flex-direction:column;gap:0}
        .activity-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
        .activity-item:last-child{border-bottom:none}
        .act-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
        .act-info{flex:1}
        .act-text{font-size:13px;color:var(--charcoal)}
        .act-sub{font-size:11px;color:var(--gray);margin-top:2px}
        .act-time{font-size:11.5px;color:var(--gray2)}
        .modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
        .modal-bg.show{display:flex}
        .modal{background:#fff;border-radius:22px;padding:32px;width:90%;max-width:480px;box-shadow:var(--sh-xl)}
        .modal-title{font-family:'Urbanist',sans-serif;font-size:20px;font-weight:800;color:var(--charcoal);margin-bottom:8px}
        .modal-sub{font-size:13.5px;color:var(--gray);margin-bottom:22px;line-height:1.6}
        .modal-actions{display:flex;gap:8px;margin-top:22px;justify-content:flex-end}
        .key-result-box{background:#0F0F0F;border-radius:12px;padding:16px;margin-top:14px}
        .kr-label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.3);font-weight:700;margin-bottom:8px}
        .kr-val{font-family:'SF Mono','Fira Code',monospace;font-size:12px;color:var(--green);word-break:break-all;line-height:1.7}
        .kr-warn{display:flex;gap:8px;background:#FEF3C7;border-radius:9px;padding:11px 13px;margin-top:12px;font-size:12.5px;color:#92400E;line-height:1.55}
        @media(max-width:900px){
          .app{grid-template-columns:1fr}
          .sidebar{transform:translateX(-100%);transition:transform .3s ease-in-out}
          .sidebar.open{transform:translateX(0)}
          .main{margin-left:0}
          .stat-grid{grid-template-columns:1fr 1fr}
          .tb-menu-btn{display:block}
          .topbar{padding:0 20px}
          .content{padding:20px}
        }
        @media(max-width:600px){.stat-grid{grid-template-columns:1fr}}
      `}} />

      <div className="app">

        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" fill="white" fillOpacity=".9"/>
              </svg>
            </div>
            <span className="sb-logo-text">SRA Shield</span>
          </div>

          <div className="sb-section">
            <div className="sb-sect-label">Main</div>
            {tabs.map(t => (
              <button key={t.key} className={`sb-item${activeTab === t.key ? ' on' : ''}`} onClick={() => { setActiveTab(t.key); setSidebarOpen(false); }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          <div className="sb-section">
            <div className="sb-sect-label">Account</div>
            <Link href="/docs" className="sb-item">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2h8l4 4v8H2z"/><path d="M10 2v4h4"/><path d="M5 9h6M5 11.5h4"/></svg>
              Documentation
            </Link>
            <Link href="/pricing" className="sb-item">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="4" width="13" height="9" rx="1.5"/><path d="M5 4V3a2 2 0 014 0v1"/><path d="M7 9a1 1 0 100-2 1 1 0 000 2z"/></svg>
              Upgrade Plan
            </Link>
          </div>

          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-avatar">{email.charAt(0).toUpperCase()}</div>
              <div>
                <div className="sb-uname">{email}</div>
                <div className="sb-plan">Starter plan</div>
              </div>
            </div>
            <button className="sb-logout" onClick={logout}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 5l4 3-4 3M14 8H6"/></svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* BACKDROP */}
        <div className={`sidebar-backdrop${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)}></div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <button className="tb-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h12"/></svg>
            </button>
            <div className="tb-title">
              {activeTab === 'overview' ? 'Overview' : activeTab === 'keys' ? 'My Keys' : activeTab === 'encrypt' ? 'Encrypt / Decrypt' : 'Activity'}
            </div>
            <div className="tb-right">
              <div className="tb-badge"><div className="tb-bdot"></div>API Online</div>
              <Link href="/pricing" className="btn btn-sm btn-dark">Upgrade →</Link>
            </div>
          </div>

          <div className="content">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div className="stat-grid">
                  <div className="stat-card">
                    <div className="sc-top"><div className="sc-label">Total API Calls</div><div className="sc-icon" style={{background:'var(--purple-l)'}}>⚡</div></div>
                    <div className="sc-val">{encCount + decCount}</div>
                    <div className="sc-sub">This session</div>
                  </div>
                  <div className="stat-card">
                    <div className="sc-top"><div className="sc-label">Keys Active</div><div className="sc-icon" style={{background:'#D1FAE5'}}>🔑</div></div>
                    <div className="sc-val">{storedKeys.length}</div>
                    <div className="sc-sub">Encryption keys</div>
                  </div>
                  <div className="stat-card">
                    <div className="sc-top"><div className="sc-label">Calls Remaining</div><div className="sc-icon" style={{background:'#EFF6FF'}}>📊</div></div>
                    <div className="sc-val">{Math.max(0, 1000 - encCount - decCount)}</div>
                    <div className="sc-sub">Of 1,000 this month</div>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-head">
                    <div className="chart-title">API Activity — Last 7 Days</div>
                    <div className="chart-legend">
                      <div className="legend-item"><div className="legend-dot" style={{background:'var(--purple)'}}></div>Encrypt</div>
                      <div className="legend-item"><div className="legend-dot" style={{background:'var(--blue)'}}></div>Decrypt</div>
                    </div>
                  </div>
                  <div className="bar-chart">
                    {days.map((d, i) => (
                      <div className="bar-group" key={d}>
                        <div className="bar-enc" style={{height:`${Math.round(enc[i] / maxVal * 110) + 10}px`}}></div>
                        <div className="bar-dec" style={{height:`${Math.round(dec[i] / maxVal * 60) + 5}px`}}></div>
                        <div className="bar-label">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="keys-card">
                  <div className="kc-head">
                    <div className="kc-title">Active Keys</div>
                    <button className="btn btn-sm btn-dark" onClick={() => setGenModalOpen(true)}>+ Generate Key</button>
                  </div>
                  <div className="key-list">
                    <KeysList keys={storedKeys} onDelete={deleteKey} />
                  </div>
                </div>
              </div>
            )}

            {/* KEYS TAB */}
            {activeTab === 'keys' && (
              <div className="keys-card">
                <div className="kc-head">
                  <div className="kc-title">My Encryption Keys</div>
                  <button className="btn btn-sm btn-dark" onClick={() => setGenModalOpen(true)}>+ Generate Key</button>
                </div>
                <div className="key-list">
                  <KeysList keys={storedKeys} onDelete={deleteKey} />
                </div>
              </div>
            )}

            {/* ENCRYPT/DECRYPT TAB */}
            {activeTab === 'encrypt' && (
              <div>
                <div className="enc-card">
                  <div className="enc-title">🔒 Encrypt Data</div>
                  <textarea
                    className="enc-textarea"
                    placeholder={"Enter the text you want to encrypt...\n\nExample: Patient: John Doe, DOB: 1985-03-12"}
                    value={encInput}
                    onChange={e => setEncInput(e.target.value)}
                  />
                  <div className="enc-actions">
                    <button className="enc-btn primary" onClick={doEncrypt}>Encrypt →</button>
                    {showDecAgain && (
                      <button className="enc-btn secondary" onClick={doDecryptAgain}>Decrypt back</button>
                    )}
                  </div>
                  {encResultVisible && (
                    <div className="result-box">
                      <div className="res-top">
                        <div className="res-label">Encrypted Output</div>
                        <button id="enc-copy-btn" className="res-copy" onClick={() => copyText(encResult, 'enc-copy-btn')}>Copy</button>
                      </div>
                      <div className="res-val">{encResult}</div>
                    </div>
                  )}
                </div>

                <div className="enc-card">
                  <div className="enc-title">🔓 Decrypt Data</div>
                  <textarea
                    className="enc-textarea"
                    placeholder={"Paste encrypted SRA Shield string here...\n\nExample: SRA_ENC_IjIiOiJlbmMiLCJ0..."}
                    value={decInput}
                    onChange={e => setDecInput(e.target.value)}
                  />
                  <div className="enc-actions">
                    <button className="enc-btn primary" onClick={doDecrypt}>Decrypt →</button>
                  </div>
                  {decResultVisible && (
                    <div className="result-box">
                      <div className="res-top">
                        <div className="res-label">Decrypted Output</div>
                        <button id="dec-copy-btn" className="res-copy" onClick={() => copyText(decResult, 'dec-copy-btn')}>Copy</button>
                      </div>
                      <div className="res-val plain">{decResult}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ACTIVITY TAB */}
            {activeTab === 'activity' && (
              <div className="activity-card">
                <div className="kc-head" style={{marginBottom:'14px'}}>
                  <div className="kc-title">Recent Activity</div>
                  <span className="badge badge-green">Live</span>
                </div>
                <div className="activity-list">
                  {activity.length === 0 ? (
                    <div style={{textAlign:'center',padding:'40px 20px',color:'var(--gray)'}}>No activity yet. Start encrypting!</div>
                  ) : activity.map((a, i) => (
                    <div className="activity-item" key={i}>
                      <div className="act-icon" style={{...(a.color ? Object.fromEntries([a.color.split(':')]) : {})}}>{a.icon}</div>
                      <div className="act-info">
                        <div className="act-text">{a.title}</div>
                        <div className="act-sub">{a.sub}</div>
                      </div>
                      <div className="act-time">{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* GENERATE KEY MODAL */}
      <div className={`modal-bg${genModalOpen ? ' show' : ''}`}>
        <div className="modal">
          <div className="modal-title">Generate New Encryption Key</div>
          <p className="modal-sub">A new 256-bit key will be generated from our multi-source entropy engine. <strong>Save it immediately</strong> — we do not store keys.</p>
          {genDone && genKeyVal && (
            <div>
              <div className="key-result-box">
                <div className="kr-label">Your Encryption Key</div>
                <div className="kr-val">{genKeyVal}</div>
              </div>
              <div className="kr-warn">
                ⚠️ <span><strong>Copy and store this key securely.</strong> SRA Shield cannot recover it if lost. Store in a password manager or secrets vault.</span>
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-md btn-outline" onClick={closeGenModal}>
              {genDone ? 'Close' : 'Cancel'}
            </button>
            {!genDone && (
              <button className="btn btn-md btn-dark" onClick={generateKey} disabled={genLoading}>
                {genLoading ? 'Generating...' : 'Generate Key →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
 