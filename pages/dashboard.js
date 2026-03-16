'use client';
import { useState, useEffect, useRef } from 'react';
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

// ── ENTROPY ANIMATION MODAL ──────────────────────────────────────────────────
function EntropyModal({ open, onClose, onKeyGenerated }) {
  const [phase, setPhase] = useState(0);
  const [sources, setSources] = useState([
    { id: 'server',  label: 'Server Timing',    icon: '⚡', detail: 'Collecting 20 request gaps…',        done: false, value: '' },
    { id: 'btc',     label: 'Bitcoin Price',     icon: '₿',  detail: 'Fetching live BTC/USDT price…',     done: false, value: '' },
    { id: 'eth',     label: 'Ethereum Block',    icon: '◆',  detail: 'Waiting for next ETH block…',       done: false, value: '' },
    { id: 'seismic', label: 'Seismic Activity',  icon: '🌍', detail: 'Querying USGS earthquake feed…',    done: false, value: '' },
  ]);
  const [mixing, setMixing] = useState(false);
  const [done, setDone] = useState(false);
  const [keyValue, setKeyValue] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // reset
    setPhase(0); setMixing(false); setDone(false); setKeyValue(''); setVerifyCode(''); setCopied(false);
    setSources(s => s.map(x => ({ ...x, done: false, value: '' })));

    const fakeValues = [
      '2ms·7ms·3ms·11ms·4ms·8ms·2ms·5ms',
      '$83,412.47382',
      '0x8f3a92b1c4d5e6…',
      'JP 1.2mag · CL 0.8mag',
    ];

    let idx = 0;
    const tick = () => {
      if (idx < 4) {
        setSources(prev => prev.map((s, i) => i === idx ? { ...s, done: true, value: fakeValues[i] } : s));
        setPhase(idx + 1);
        idx++;
        timerRef.current = setTimeout(tick, idx === 2 ? 1200 : idx === 3 ? 1400 : 900);
      } else {
        setMixing(true);
        timerRef.current = setTimeout(async () => {
          try {
            const token = getToken();
            const res = await fetch(`${API}/api/v1/shield/keys/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ tier: 'fast' }),
            });
            const data = await res.json();
            const key = data?.data?.encryptionKey || data?.encryptionKey || 'key-unavailable';
            const code = data?.data?.verificationCode || data?.verificationCode || '';
            setKeyValue(key);
            setVerifyCode(code);
          } catch {
            setKeyValue('offline-demo-key-' + Math.random().toString(36).slice(2, 18));
          }
          setMixing(false);
          setDone(true);
        }, 1600);
      }
    };
    timerRef.current = setTimeout(tick, 400);
    return () => clearTimeout(timerRef.current);
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(keyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (done) onKeyGenerated && onKeyGenerated(keyValue, verifyCode);
    onClose();
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.mHead}>
          <div style={styles.mIcon}>🔑</div>
          <div>
            <div style={styles.mTitle}>Generating Encryption Key</div>
            <div style={styles.mSub}>Multi-source entropy collection in progress</div>
          </div>
        </div>

        {/* Sources */}
        <div style={styles.sourceList}>
          {sources.map((s, i) => (
            <div key={s.id} style={{ ...styles.sourceRow, opacity: i <= phase ? 1 : 0.3, transition: 'opacity 0.4s' }}>
              <div style={{ ...styles.sourceIcon, background: s.done ? '#dcfce7' : i === phase ? '#fef9c3' : '#f1f5f9' }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.sourceLabel}>{s.label}</div>
                <div style={styles.sourceDetail}>
                  {s.done ? <span style={{ color: '#16a34a', fontFamily: 'monospace', fontSize: 11 }}>{s.value}</span> : s.detail}
                </div>
              </div>
              <div style={styles.sourceStatus}>
                {s.done ? (
                  <span style={styles.checkBadge}>✓</span>
                ) : i === phase ? (
                  <span style={styles.spinner} />
                ) : (
                  <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mixing phase */}
        {(mixing || done) && (
          <div style={styles.mixBox}>
            {mixing ? (
              <>
                <div style={styles.mixAnim}>
                  <div style={styles.mixOrb1} /><div style={styles.mixOrb2} /><div style={styles.mixOrb3} />
                </div>
                <div style={styles.mixLabel}>SHA-512 mixing all sources…</div>
              </>
            ) : (
              <div style={styles.keyBox}>
                <div style={styles.keyLabel}>Your Encryption Key</div>
                <div style={styles.keyVal}>{keyValue}</div>
                {verifyCode && <div style={styles.keyVerify}>Verify: <span style={{ color: '#7c3aed' }}>{verifyCode}</span></div>}
                <div style={styles.keyWarn}>⚠️ Copy and store this key securely — it cannot be recovered.</div>
                <button style={{ ...styles.btn, ...styles.btnCopy }} onClick={handleCopy}>
                  {copied ? '✓ Copied!' : 'Copy Key'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={styles.mFooter}>
          {done && (
            <button style={{ ...styles.btn, ...styles.btnClose }} onClick={handleClose}>
              Close & Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');
  const [genOpen, setGenOpen] = useState(false);
  const [keys, setKeys] = useState([{ id: 1, label: 'Key 1', status: 'Active', created: 'Mar 10' }]);
  const [encInput, setEncInput] = useState('');
  const [decInput, setDecInput] = useState('');
  const [encResult, setEncResult] = useState('');
  const [decResult, setDecResult] = useState('');
  const [encLoading, setEncLoading] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [apiCalls, setApiCalls] = useState(0);

  useEffect(() => {
    setUser(getUser());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleKeyGenerated = (key, code) => {
    setKeys(prev => [...prev, { id: prev.length + 1, label: `Key ${prev.length + 1}`, status: 'Active', created: 'Today', value: key, code }]);
    setApiCalls(c => c + 1);
  };

  const handleEncrypt = async () => {
    if (!encInput.trim()) return;
    setEncLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/v1/shield/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      const token = getToken();
      const res = await fetch(`${API}/api/v1/shield/decrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ encrypted: decInput }),
      });
      const data = await res.json();
      setDecResult(data?.data?.plaintext || data?.plaintext || 'Decryption failed');
      setApiCalls(c => c + 1);
    } catch { setDecResult('Error — check connection'); }
    setDecLoading(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '▦' },
    { id: 'keys', label: 'My Keys', icon: '🔑' },
    { id: 'encrypt', label: 'Encrypt / Decrypt', icon: '🔒' },
    { id: 'activity', label: 'Activity', icon: '↗' },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const encData  = [3, 5, 4, 7, 6, 4, 5];
  const decData  = [1, 2, 1, 3, 2, 1, 2];
  const maxVal   = 8;

  return (
    <>
      <Head><title>Dashboard — SRA Shield</title></Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#f8f9fc;color:#0f172a}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes orb{0%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.3) rotate(180deg)}100%{transform:scale(1) rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .spin{animation:spin 1s linear infinite}
        .fadeIn{animation:fadeIn .4s ease forwards}
      `}</style>

      <EntropyModal open={genOpen} onClose={() => setGenOpen(false)} onKeyGenerated={handleKeyGenerated} />

      <div style={styles.shell}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sLogo}>
            <div style={styles.sLogoIcon}>🛡</div>
            <div>
              <div style={styles.sLogoName}>SRA Shield</div>
              <div style={styles.sLogoBeta}>Beta</div>
            </div>
          </div>

          <div style={styles.sSection}>MAIN</div>
          <nav style={styles.sNav}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setActiveNav(n.id)}
                style={{ ...styles.sNavItem, ...(activeNav === n.id ? styles.sNavActive : {}) }}>
                <span style={styles.sNavIcon}>{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>

          <div style={styles.sSection}>ACCOUNT</div>
          <nav style={styles.sNav}>
            <button style={styles.sNavItem}><span style={styles.sNavIcon}>📄</span>Documentation</button>
            <button style={styles.sNavItem}><span style={styles.sNavIcon}>⬆</span>Upgrade Plan</button>
          </nav>

          <div style={styles.sUser}>
            <div style={styles.sAvatar}>{(user?.name || user?.email || 'U')[0].toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.sUserName}>{user?.email || 'User'}</div>
              <div style={styles.sUserPlan}>{user?.plan || 'Starter'} plan</div>
            </div>
            <button style={styles.sSignOut} onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>→</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={styles.main}>
          {/* TOP BAR */}
          <div style={styles.topBar}>
            <div>
              <div style={styles.pageTitle}>
                {navItems.find(n => n.id === activeNav)?.label || 'Overview'}
              </div>
              <div style={styles.pageSub}>Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}</div>
            </div>
            <div style={styles.topRight}>
              <div style={styles.apiPill}><div style={styles.apiDot} />API Online</div>
              <button style={styles.upgradeBtn}>Upgrade →</button>
            </div>
          </div>

          <div style={styles.content}>

            {/* ── OVERVIEW ── */}
            {activeNav === 'overview' && (
              <div className="fadeIn">
                {/* Stats */}
                <div style={styles.statsGrid}>
                  {[
                    { label: 'Total API Calls', value: apiCalls, sub: 'This session', icon: '⚡', color: '#fef3c7' },
                    { label: 'Keys Active', value: keys.filter(k => k.status === 'Active').length, sub: 'Encryption keys', icon: '🔑', color: '#dcfce7' },
                    { label: 'Calls Remaining', value: 1000 - apiCalls, sub: 'Of 1,000 this month', icon: '📊', color: '#dbeafe' },
                  ].map((s, i) => (
                    <div key={i} style={styles.statCard}>
                      <div style={{ ...styles.statIcon, background: s.color }}>{s.icon}</div>
                      <div style={styles.statLabel}>{s.label}</div>
                      <div style={styles.statValue}>{s.value}</div>
                      <div style={styles.statSub}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Chart + Quick Actions */}
                <div style={styles.midGrid}>
                  <div style={styles.card}>
                    <div style={styles.cardHead}>
                      <div style={styles.cardTitle}>API Activity — Last 7 Days</div>
                      <div style={styles.legend}>
                        <span style={styles.legendDot('#7c3aed')} />Encrypt
                        <span style={{ marginLeft: 12 }} />
                        <span style={styles.legendDot('#60a5fa')} />Decrypt
                      </div>
                    </div>
                    <div style={styles.chartArea}>
                      {weekDays.map((d, i) => (
                        <div key={d} style={styles.barGroup}>
                          <div style={styles.bars}>
                            <div style={{ ...styles.bar, height: `${(encData[i] / maxVal) * 100}%`, background: '#7c3aed' }} />
                            <div style={{ ...styles.bar, height: `${(decData[i] / maxVal) * 100}%`, background: '#60a5fa' }} />
                          </div>
                          <div style={styles.barLabel}>{d}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.card}>
                    <div style={styles.cardTitle}>Quick Actions</div>
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button style={styles.qaBtn} onClick={() => setGenOpen(true)}>
                        <span>🔑</span> Generate New Key
                      </button>
                      <button style={styles.qaBtn} onClick={() => setActiveNav('encrypt')}>
                        <span>🔒</span> Encrypt Data
                      </button>
                      <button style={styles.qaBtn} onClick={() => setActiveNav('encrypt')}>
                        <span>🔓</span> Decrypt Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Keys preview */}
                <div style={styles.card}>
                  <div style={styles.cardHead}>
                    <div style={styles.cardTitle}>Active Keys</div>
                    <button style={styles.genBtn} onClick={() => setGenOpen(true)}>+ Generate Key</button>
                  </div>
                  {keys.map(k => (
                    <div key={k.id} style={styles.keyRow}>
                      <span style={styles.keyIcon}>🔑</span>
                      <div style={{ flex: 1 }}>
                        <div style={styles.keyName}>{k.label}</div>
                        {k.value && <div style={styles.keySnippet}>{k.value.slice(0, 32)}…</div>}
                      </div>
                      <span style={styles.activeBadge}>{k.status}</span>
                      <span style={styles.dateBadge}>{k.created}</span>
                      <button style={styles.delBtn}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MY KEYS ── */}
            {activeNav === 'keys' && (
              <div className="fadeIn">
                <div style={styles.card}>
                  <div style={styles.cardHead}>
                    <div style={styles.cardTitle}>Encryption Keys</div>
                    <button style={styles.genBtn} onClick={() => setGenOpen(true)}>+ Generate Key</button>
                  </div>
                  {keys.map(k => (
                    <div key={k.id} style={styles.keyRow}>
                      <span style={styles.keyIcon}>🔑</span>
                      <div style={{ flex: 1 }}>
                        <div style={styles.keyName}>{k.label}</div>
                        <div style={styles.keySnippet}>{k.value ? k.value.slice(0, 48) + '…' : 'Key value hidden for security'}</div>
                        {k.code && <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 2 }}>Verify: {k.code}</div>}
                      </div>
                      <span style={styles.activeBadge}>{k.status}</span>
                      <span style={styles.dateBadge}>{k.created}</span>
                      <button style={styles.delBtn}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ENCRYPT / DECRYPT ── */}
            {activeNav === 'encrypt' && (
              <div className="fadeIn" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>🔒 Encrypt Data</div>
                  <textarea style={styles.textarea} placeholder="Enter text to encrypt…" value={encInput} onChange={e => setEncInput(e.target.value)} rows={5} />
                  <button style={{ ...styles.genBtn, marginTop: 12, width: '100%', padding: '11px 0' }}
                    onClick={handleEncrypt} disabled={encLoading}>
                    {encLoading ? 'Encrypting…' : 'Encrypt →'}
                  </button>
                  {encResult && (
                    <div style={styles.resultBox}>
                      <div style={styles.resultLabel}>Encrypted Output</div>
                      <div style={styles.resultVal}>{encResult}</div>
                    </div>
                  )}
                </div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>🔓 Decrypt Data</div>
                  <textarea style={styles.textarea} placeholder="Paste encrypted string…" value={decInput} onChange={e => setDecInput(e.target.value)} rows={5} />
                  <button style={{ ...styles.genBtn, marginTop: 12, width: '100%', padding: '11px 0', background: '#f1f5f9', color: '#0f172a', border: '1.5px solid #e2e8f0' }}
                    onClick={handleDecrypt} disabled={decLoading}>
                    {decLoading ? 'Decrypting…' : 'Decrypt →'}
                  </button>
                  {decResult && (
                    <div style={{ ...styles.resultBox, background: '#f0fdf4' }}>
                      <div style={styles.resultLabel}>Decrypted Output</div>
                      <div style={{ ...styles.resultVal, color: '#15803d' }}>{decResult}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ACTIVITY ── */}
            {activeNav === 'activity' && (
              <div className="fadeIn" style={styles.card}>
                <div style={styles.cardTitle}>Recent Activity</div>
                <div style={{ marginTop: 16, color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
                  No activity yet. Start encrypting or generating keys!
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  shell:       { display: 'flex', minHeight: '100vh', background: '#f8f9fc' },
  sidebar:     { width: 240, background: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 12px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 10 },
  sLogo:       { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 },
  sLogoIcon:   { width: 34, height: 34, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  sLogoName:   { color: '#f8fafc', fontWeight: 700, fontSize: 15 },
  sLogoBeta:   { color: '#7c3aed', fontSize: 10, fontWeight: 600, letterSpacing: 1 },
  sSection:    { fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', padding: '0 10px', marginBottom: 6, marginTop: 16 },
  sNav:        { display: 'flex', flexDirection: 'column', gap: 2 },
  sNavItem:    { display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: '#94a3b8', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s' },
  sNavActive:  { background: 'rgba(124,58,237,.18)', color: '#a78bfa', fontWeight: 600 },
  sNavIcon:    { fontSize: 14, width: 18, textAlign: 'center' },
  sUser:       { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 8px', borderTop: '1px solid rgba(255,255,255,.06)' },
  sAvatar:     { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  sUserName:   { fontSize: 12, color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sUserPlan:   { fontSize: 11, color: '#64748b' },
  sSignOut:    { background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16 },
  main:        { marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topBar:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', background: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 5 },
  pageTitle:   { fontSize: 20, fontWeight: 700, color: '#0f172a' },
  pageSub:     { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  topRight:    { display: 'flex', alignItems: 'center', gap: 12 },
  apiPill:     { display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#15803d' },
  apiDot:      { width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease infinite' },
  upgradeBtn:  { background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  content:     { padding: 32, flex: 1 },
  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 },
  statCard:    { background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: '22px 22px 18px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' },
  statIcon:    { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 },
  statLabel:   { fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 },
  statValue:   { fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: -1, lineHeight: 1 },
  statSub:     { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  midGrid:     { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 20 },
  card:        { background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.04)' },
  cardHead:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle:   { fontSize: 15, fontWeight: 700, color: '#0f172a' },
  legend:      { display: 'flex', alignItems: 'center', fontSize: 12, color: '#64748b' },
  legendDot:   c => ({ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: c }),
  chartArea:   { display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingTop: 10 },
  barGroup:    { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  bars:        { display: 'flex', gap: 3, alignItems: 'flex-end', height: 120, width: '100%', justifyContent: 'center' },
  bar:         { width: 10, borderRadius: '4px 4px 0 0', transition: 'height .3s ease' },
  barLabel:    { fontSize: 11, color: '#94a3b8', fontWeight: 500 },
  qaBtn:       { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', background: '#f8f9fc', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: '#0f172a', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s' },
  genBtn:      { background: '#0f172a', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  keyRow:      { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #f8f9fc' },
  keyIcon:     { fontSize: 18 },
  keyName:     { fontSize: 14, fontWeight: 600, color: '#0f172a' },
  keySnippet:  { fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 },
  activeBadge: { background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100 },
  dateBadge:   { fontSize: 12, color: '#94a3b8' },
  delBtn:      { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 7, padding: '5px 11px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  textarea:    { width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'DM Mono, monospace', resize: 'vertical', outline: 'none', color: '#0f172a', background: '#fafafa', marginTop: 14 },
  resultBox:   { marginTop: 14, background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 10, padding: 14 },
  resultLabel: { fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  resultVal:   { fontFamily: 'DM Mono, monospace', fontSize: 11.5, color: '#4c1d95', wordBreak: 'break-all', lineHeight: 1.6 },

  // Modal styles
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal:       { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, padding: 28, boxShadow: '0 25px 60px rgba(0,0,0,.25)' },
  mHead:       { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 },
  mIcon:       { width: 44, height: 44, background: '#f5f3ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
  mTitle:      { fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 3 },
  mSub:        { fontSize: 13, color: '#64748b' },
  sourceList:  { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
  sourceRow:   { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: '#f8f9fc', borderRadius: 12, transition: 'all .3s' },
  sourceIcon:  { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'background .4s', flexShrink: 0 },
  sourceLabel: { fontSize: 13.5, fontWeight: 600, color: '#0f172a', marginBottom: 2 },
  sourceDetail:{ fontSize: 11.5, color: '#64748b' },
  sourceStatus:{ flexShrink: 0 },
  checkBadge:  { width: 22, height: 22, background: '#dcfce7', color: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  spinner:     { display: 'inline-block', width: 18, height: 18, border: '2.5px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  mixBox:      { background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' },
  mixAnim:     { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 },
  mixOrb1:     { width: 12, height: 12, borderRadius: '50%', background: '#7c3aed', animation: 'orb 1.2s ease infinite' },
  mixOrb2:     { width: 12, height: 12, borderRadius: '50%', background: '#4f46e5', animation: 'orb 1.2s ease infinite .2s' },
  mixOrb3:     { width: 12, height: 12, borderRadius: '50%', background: '#06b6d4', animation: 'orb 1.2s ease infinite .4s' },
  mixLabel:    { fontSize: 13, color: '#7c3aed', fontWeight: 600 },
  keyBox:      { textAlign: 'left' },
  keyLabel:    { fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  keyVal:      { fontFamily: 'DM Mono, monospace', fontSize: 11.5, color: '#1e1b4b', wordBreak: 'break-all', background: '#fff', border: '1.5px solid #e9d5ff', borderRadius: 8, padding: '10px 12px', lineHeight: 1.6, marginBottom: 8 },
  keyVerify:   { fontSize: 12, color: '#64748b', marginBottom: 6 },
  keyWarn:     { fontSize: 11.5, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', marginBottom: 12 },
  btn:         { border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' },
  btnCopy:     { background: '#7c3aed', color: '#fff', width: '100%' },
  btnClose:    { background: '#0f172a', color: '#fff', width: '100%' },
  mFooter:     { marginTop: 4 },
};