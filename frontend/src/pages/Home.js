import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const ROLES = [
  { role: 'Admin',    icon: '🛡️', color: '#FF6B35', desc: 'Full system control',  path:'/login' },
  { role: 'HR',       icon: '👔', color: '#00D4FF', desc: 'Approve requests',      path:'/login' },
  { role: 'Manager',  icon: '📌', color: '#FFD600', desc: 'Manage your team',      path:'/login' },
  { role: 'Employee', icon: '👤', color: '#00E676', desc: 'Submit clearances',     path:'/login' },
];

const STATS = [
  { value: '4',    label: 'User Roles'    },
  { value: '6',    label: 'Request Types' },
  { value: '99%',  label: 'Accuracy'      },
  { value: '24/7', label: 'Available'     },
];

const FEATURES = [
  { icon: '🛡️', title: 'Secure Login',    desc: 'JWT role-based access',       color: '#00D4FF' },
  { icon: '⚡', title: 'Fast Clearance',  desc: 'Submit & approve instantly',   color: '#FFD600' },
  { icon: '📊', title: 'Live Dashboard',  desc: 'Track everything in real time',color: '#FF6B35' },
  { icon: '🔔', title: 'Notifications',   desc: 'Email alerts on every action', color: '#00E676' },
  { icon: '📄', title: 'Certificates',    desc: 'Download clearance letters',   color: '#A78BFA' },
  { icon: '🤖', title: 'AI Assistant',    desc: 'Get help anytime',             color: '#FF3D71' },
];

function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % ROLES.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home">
      <div className="home-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid-lines" />
      </div>

      {/* NAV */}
      <nav className="home-nav">
        <div className="nav-brand">
          <div className="nav-logo">ECS</div>
          <span className="nav-title">Employee Clearance System</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <a href="mailto:sanaipeitenkes@gmail.com" style={{ color:'#6B7280', fontSize:'13px', textDecoration:'none', display:'flex', alignItems:'center', gap:'6px' }}>
            <span>📧</span>
            <span className="nav-email">sanaipeitenkes@gmail.com</span>
          </a>
          <button className="nav-btn" onClick={() => navigate('/login')}>Sign In →</button>
        </div>
      </nav>

      <div className="home-body">
        {/* LEFT */}
        <div className="home-left">
          <div className="hero-tag">
            <span className="tag-dot" /> Clearance System
          </div>
          <h1 className="hero-title">
            Clearance Made<span className="grad"> Simple.</span>
            <br />
            Management Made<span className="grad"> Smart.</span>
          </h1>
          <p className="hero-sub">
            A modern platform for submitting, tracking and approving employee
            clearance requests — fast, secure and transparent. Built for real organisations.
          </p>
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div key={i} className="stat-box">
                <div className="stat-val">{s.value}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Get Started →
            </button>
            <a href="mailto:sanaipeitenkes@gmail.com" className="btn-ghost">
              📧 Contact Us
            </a>
          </div>

          {/* Contact info strip */}
          <div style={{ display:'flex', gap:'20px', marginTop:'24px', flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#6B7280' }}>
              <span>📧</span>
              <a href="mailto:sanaipeitenkes@gmail.com" style={{ color:'#00D4FF', textDecoration:'none' }}>sanaipeitenkes@gmail.com</a>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#6B7280' }}>
              <span>🐙</span>
              <a href="https://github.com/sanaipei01" target="_blank" rel="noreferrer" style={{ color:'#A78BFA', textDecoration:'none' }}>github.com/sanaipei01</a>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#6B7280' }}>
              <span>📍</span>
              <span>Nairobi, Kenya 🇰🇪</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="home-right">
          <div className="roles-grid">
            {ROLES.map((r, i) => (
              <div
                key={r.role}
                className={"role-card" + (active === i ? " role-active" : "")}
                style={{ "--rc": r.color }}
                onClick={() => navigate('/login')}
              >
                <span className="role-icon">{r.icon}</span>
                <div className="role-info">
                  <div className="role-name">{r.role}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
                <span className="role-arrow">→</span>
              </div>
            ))}
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card" style={{ "--fc": f.color }}>
                <span className="feat-icon">{f.icon}</span>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <span>© Employee Clearance System</span>
        <span>Built by <strong style={{ color:'#00D4FF' }}>Sanaipei Tenkes</strong></span>
        <span>
          <a href="mailto:sanaipeitenkes@gmail.com" style={{ color:'#A78BFA', textDecoration:'none' }}>sanaipeitenkes@gmail.com</a>
        </span>
      </footer>
    </div>
  );
}

export default Home;