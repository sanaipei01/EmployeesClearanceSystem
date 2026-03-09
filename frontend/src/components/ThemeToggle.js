import React, { useState, useEffect } from 'react';

const LIGHT_CSS = `
  /* ── BODY & LAYOUT ── */
  body, .layout, .main-content, .content-area {
    background: #F0F4FF !important;
    color: #111827 !important;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    background: #1E2433 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }

  /* ── TOPBAR ── */
  .topbar {
    background: #FFFFFF !important;
    border-color: rgba(0,0,0,0.08) !important;
  }
  .topbar-page { color: #111827 !important; }
  .topbar-time { color: #6B7280 !important; }

  /* ── ALL CARDS AND DARK SECTIONS ── */
  .card,
  div[style*="#111827"],
  div[style*="#0A0F1E"],
  div[style*="#080C14"],
  div[style*="#0D1220"],
  div[style*="#1F2937"] {
    background: #FFFFFF !important;
    border-color: rgba(0,0,0,0.08) !important;
    color: #111827 !important;
  }

  /* ── ALL TEXT ── */
  div, span, p, h1, h2, h3, h4, td, th, label {
    color: inherit;
  }

  /* Force dark text on light background */
  .content-area div,
  .content-area span,
  .content-area p,
  .content-area td,
  .content-area th {
    color: #111827 !important;
  }

  /* ── MUTED TEXT ── */
  .content-area [style*="6B7280"],
  .content-area [style*="9CA3AF"],
  .content-area [style*="6b7280"],
  .content-area [style*="9ca3af"] {
    color: #6B7280 !important;
  }

  /* ── TABLES ── */
  table { background: #FFFFFF !important; }
  th {
    color: #374151 !important;
    background: #F9FAFB !important;
    border-color: rgba(0,0,0,0.08) !important;
  }
  td {
    color: #111827 !important;
    border-color: rgba(0,0,0,0.06) !important;
  }
  tr:hover td { background: rgba(0,0,0,0.02) !important; }

  /* ── INPUTS & FORMS ── */
  input, select, textarea {
    background: #F9FAFB !important;
    border-color: rgba(0,0,0,0.12) !important;
    color: #111827 !important;
  }
  input::placeholder, textarea::placeholder { color: #9CA3AF !important; }
  label { color: #374151 !important; }

  /* ── SECTION TOGGLE BUTTONS ── */
  button[style*="background:none"],
  button[style*="background: none"],
  button[style*="background:transparent"],
  button[style*="background: transparent"] {
    color: #111827 !important;
  }

  /* ── EXPANDABLE SECTION CARDS ── */
  div[style*="overflow:hidden"][style*="borderRadius:16px"],
  div[style*="overflow: hidden"][style*="border-radius: 16px"] {
    background: #FFFFFF !important;
    border-color: rgba(0,0,0,0.08) !important;
  }

  /* ── YESTERDAY ACTIVITY ── */
  div[style*="borderRadius:16px"][style*="padding:20px"],
  div[style*="border-radius: 16px"][style*="padding: 20px"] {
    background: #FFFFFF !important;
    border-color: rgba(0,0,0,0.08) !important;
    color: #111827 !important;
  }

  /* ── STAT STRIP ── */
  div[style*="borderRadius:12px"][style*="textAlign:center"],
  div[style*="border-radius: 12px"][style*="text-align: center"] {
    background: #FFFFFF !important;
    border-color: rgba(0,0,0,0.08) !important;
  }

  /* ── EMPLOYEE/TEAM ROW CARDS ── */
  div[style*="borderRadius:14px"],
  div[style*="border-radius: 14px"] {
    background: #FFFFFF !important;
    border-color: rgba(0,0,0,0.08) !important;
  }

  /* ── MODAL ── */
  div[style*="rgba(0,0,0,0.7)"] > div,
  div[style*="rgba(0, 0, 0, 0.7)"] > div {
    background: #FFFFFF !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }
  div[style*="rgba(0,0,0,0.7)"] span,
  div[style*="rgba(0,0,0,0.7)"] div {
    color: #111827 !important;
  }

  /* ── MODAL TEXTAREA ── */
  div[style*="rgba(0,0,0,0.7)"] textarea {
    background: #F9FAFB !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.12) !important;
  }

  /* ── BORDERS ── */
  div[style*="rgba(255,255,255,0.04)"],
  div[style*="rgba(255,255,255,0.06)"],
  div[style*="rgba(255,255,255,0.07)"],
  div[style*="rgba(255,255,255,0.08)"],
  div[style*="rgba(255,255,255,0.1)"] {
    border-color: rgba(0,0,0,0.07) !important;
  }

  /* ── BUTTONS ── */
  .btn-ghost {
    background: rgba(0,0,0,0.05) !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.12) !important;
  }
  button[style*="rgba(255,255,255,0.05)"] {
    background: rgba(0,0,0,0.05) !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }

  /* ── PAGE TITLE & SUBTITLE ── */
  .page-title    { color: #111827 !important; }
  .page-subtitle { color: #6B7280 !important; }

  /* ── NOTIFICATION BELL DROPDOWN ── */
  div[style*="borderRadius:16px"][style*="boxShadow"],
  div[style*="border-radius: 16px"][style*="box-shadow"] {
    background: #FFFFFF !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }

  /* ── AI CHATBOT ── */
  div[style*="borderRadius:20px"][style*="border:1px solid"] {
    background: #FFFFFF !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }

  /* ── CHATBOT MESSAGES ── */
  div[style*="rgba(255,255,255,0.06)"][style*="borderRadius"] {
    background: rgba(0,0,0,0.05) !important;
    color: #111827 !important;
  }

  /* ── CHATBOT INPUT ── */
  div[style*="borderRadius:20px"] input {
    background: rgba(0,0,0,0.05) !important;
    color: #111827 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }

  /* ── QUICK REPLY CHIPS ── */
  div[style*="flexWrap:wrap"] button {
    background: rgba(0,0,0,0.04) !important;
    color: #374151 !important;
    border-color: rgba(0,0,0,0.1) !important;
  }

  /* ── COLORED ACCENT TEXTS stay colored ── */
  span[style*="#00D4FF"], span[style*="#00E676"],
  span[style*="#FF6B35"], span[style*="#FFD600"],
  span[style*="#FF3D71"], span[style*="#A78BFA"] {
    color: inherit !important;
  }
`;

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ecs_theme');
    if (saved === 'light') { setDark(false); applyTheme(false); }
  }, []);

  const applyTheme = (isDark) => {
    // Toggle body class
    document.body.classList.toggle('light-mode', !isDark);

    // Inject/remove override stylesheet
    let el = document.getElementById('ecs-theme-override');
    if (!el) {
      el = document.createElement('style');
      el.id = 'ecs-theme-override';
      document.head.appendChild(el);
    }
    el.textContent = isDark ? '' : LIGHT_CSS;
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