import React, { useState, useEffect } from 'react';

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ecs_theme');
    if (saved === 'light') { setDark(false); applyTheme(false); }
  }, []);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.style.background = isDark ? '#0A0F1E' : '#F0F4F8';
    document.body.style.color      = isDark ? '#F9FAFB' : '#0A0F1E';

    const style = document.getElementById('ecs-theme-style') || (() => {
      const s = document.createElement('style');
      s.id = 'ecs-theme-style';
      document.head.appendChild(s);
      return s;
    })();

    if (!isDark) {
      style.textContent = `
        /* ── LAYOUT ── */
        [data-theme="light"] .layout,
        [data-theme="light"] .main-content,
        [data-theme="light"] .content-area { background: #F0F4F8 !important; }
        [data-theme="light"] .sidebar       { background: #1a1f2e !important; }

        /* ── TOPBAR ── */
        [data-theme="light"] .topbar        { background: rgba(255,255,255,0.97) !important; border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .topbar *      { color: #0A0F1E !important; }
        [data-theme="light"] .topbar-time   { color: #6B7280 !important; }

        /* ── ALL CARDS & SURFACES ── */
        [data-theme="light"] .card          { background: #FFFFFF !important; border-color: rgba(0,0,0,0.08) !important; color: #0A0F1E !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
        [data-theme="light"] .card *        { color: #0A0F1E !important; }
        [data-theme="light"] .stat-card     { background: #FFFFFF !important; border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .stat-label    { color: #6B7280 !important; }
        [data-theme="light"] .stat-value    { color: #0A0F1E !important; }

        /* ── PAGE TITLES ── */
        [data-theme="light"] .page-title    { color: #0A0F1E !important; }
        [data-theme="light"] .page-subtitle { color: #6B7280 !important; }

        /* ── DARK SURFACE OVERRIDES (inline styles) ── */
        [data-theme="light"] [style*="background:#111827"],
        [data-theme="light"] [style*="background: #111827"],
        [data-theme="light"] [style*="background:#0A0F1E"],
        [data-theme="light"] [style*="background: #0A0F1E"] {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.08) !important;
        }

        /* ── ALL TEXT — force dark on light bg ── */
        [data-theme="light"] [style*="color:#F9FAFB"],
        [data-theme="light"] [style*="color: #F9FAFB"],
        [data-theme="light"] [style*="color:#F0F4FF"],
        [data-theme="light"] [style*="color: #F0F4FF"] { color: #0A0F1E !important; }

        [data-theme="light"] [style*="color:#9CA3AF"],
        [data-theme="light"] [style*="color: #9CA3AF"] { color: #4B5563 !important; }

        [data-theme="light"] [style*="color:#6B7280"],
        [data-theme="light"] [style*="color: #6B7280"] { color: #6B7280 !important; }

        /* ── SECTION EXPAND BUTTONS ── */
        [data-theme="light"] button[style*="background:none"],
        [data-theme="light"] button[style*="background: none"] {
          color: #0A0F1E !important;
          background: transparent !important;
        }
        [data-theme="light"] button[style*="background:none"] span,
        [data-theme="light"] button[style*="background: none"] span { color: #0A0F1E !important; }

        /* ── TABLES ── */
        [data-theme="light"] table { color: #0A0F1E !important; background: #FFFFFF !important; }
        [data-theme="light"] th    { color: #374151 !important; background: #F9FAFB !important; border-color: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] td    { color: #111827 !important; border-color: rgba(0,0,0,0.05) !important; }
        [data-theme="light"] tr    { border-color: rgba(0,0,0,0.05) !important; }
        [data-theme="light"] tr:hover { background: rgba(0,0,0,0.02) !important; }

        /* ── FORMS ── */
        [data-theme="light"] input,
        [data-theme="light"] select,
        [data-theme="light"] textarea {
          background: #F9FAFB !important;
          border-color: rgba(0,0,0,0.12) !important;
          color: #0A0F1E !important;
        }
        [data-theme="light"] label { color: #374151 !important; }

        /* ── BUTTONS ── */
        [data-theme="light"] .btn-ghost {
          background: rgba(0,0,0,0.05) !important;
          color: #111827 !important;
          border-color: rgba(0,0,0,0.12) !important;
        }

        /* ── TRANSPARENT BACKGROUNDS (activity rows etc) ── */
        [data-theme="light"] [style*="rgba(255,255,255,0.03)"],
        [data-theme="light"] [style*="rgba(255,255,255,0.04)"],
        [data-theme="light"] [style*="rgba(255,255,255,0.05)"],
        [data-theme="light"] [style*="rgba(255,255,255,0.06)"],
        [data-theme="light"] [style*="rgba(255,255,255,0.07)"],
        [data-theme="light"] [style*="rgba(255,255,255,0.08)"],
        [data-theme="light"] [style*="rgba(255,255,255,0.1)"] {
          background: rgba(0,0,0,0.03) !important;
          border-color: rgba(0,0,0,0.07) !important;
        }

        /* ── MINI STAT STRIP ── */
        [data-theme="light"] [style*="textAlign:center"][style*="borderRadius:12px"],
        [data-theme="light"] [style*="text-align:center"][style*="border-radius:12px"] {
          background: #FFFFFF !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
        }

        /* ── FORCE ALL CHILDREN TEXT COLORS ── */
        [data-theme="light"] .content-area div,
        [data-theme="light"] .content-area span,
        [data-theme="light"] .content-area p {
          color: inherit;
        }

        /* ── MODAL ── */
        [data-theme="light"] [style*="background:rgba(0,0,0,0.7)"] > div,
        [data-theme="light"] [style*="background: rgba(0,0,0,0.7)"] > div {
          background: #FFFFFF !important;
          color: #0A0F1E !important;
        }
        [data-theme="light"] [style*="background:rgba(0,0,0,0.7)"] > div *,
        [data-theme="light"] [style*="background: rgba(0,0,0,0.7)"] > div * {
          color: #0A0F1E !important;
        }

        /* ── EMPLOYEE ROW CARDS ── */
        [data-theme="light"] [style*="borderRadius:14px"],
        [data-theme="light"] [style*="border-radius:14px"],
        [data-theme="light"] [style*="borderRadius:10px"],
        [data-theme="light"] [style*="border-radius:10px"] {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.08) !important;
        }

        /* ── YESTERDAY ACTIVITY text ── */
        [data-theme="light"] [style*="fontSize:13px"],
        [data-theme="light"] [style*="font-size:13px"] { color: #111827 !important; }
        [data-theme="light"] [style*="fontSize:11px"],
        [data-theme="light"] [style*="font-size:11px"] { color: #6B7280 !important; }

        /* ── CHATBOT ── */
        [data-theme="light"] [style*="background:#111827"][style*="borderRadius:20px"] {
          background: #FFFFFF !important; color: #0A0F1E !important;
        }
      `;
    } else {
      style.textContent = '';
    }
  };

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem('ecs_theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
        borderRadius:'10px', width:'38px', height:'38px',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', fontSize:'17px', transition:'all 0.2s',
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;