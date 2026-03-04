import React, { useState, useEffect } from 'react';

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ecs_theme');
    if (saved === 'light') { setDark(false); applyTheme(false); }
  }, []);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--primary',   '#0A0F1E');
      root.style.setProperty('--surface',   '#111827');
      root.style.setProperty('--surface2',  '#1F2937');
      root.style.setProperty('--surface3',  '#374151');
      root.style.setProperty('--text',      '#F9FAFB');
      root.style.setProperty('--text2',     '#9CA3AF');
      root.style.setProperty('--border',    'rgba(255,255,255,0.08)');
      document.body.style.background = '#0A0F1E';
      document.body.style.color      = '#F9FAFB';
    } else {
      root.style.setProperty('--primary',   '#F0F4F8');
      root.style.setProperty('--surface',   '#FFFFFF');
      root.style.setProperty('--surface2',  '#F3F4F6');
      root.style.setProperty('--surface3',  '#E5E7EB');
      root.style.setProperty('--text',      '#0A0F1E');
      root.style.setProperty('--text2',     '#6B7280');
      root.style.setProperty('--border',    'rgba(0,0,0,0.08)');
      document.body.style.background = '#F0F4F8';
      document.body.style.color      = '#0A0F1E';
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
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
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