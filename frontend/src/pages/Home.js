import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const ROLES = [
  { role: 'Admin',    icon: '🛡️', color: '#FF6B35', desc: 'Full system control' },
  { role: 'HR',       icon: '👔', color: '#00D4FF', desc: 'Approve requests' },
  { role: 'Manager',  icon: '📌', color: '#FFD600', desc: 'Manage your team' },
  { role: 'Employee', icon: '👤', color: '#00E676', desc: 'Submit clearances' },
];

const STATS = [
  { value: '500+', label: 'Employees' },
  { value: '99%',  label: 'Accuracy' },
  { value: '24/7', label: 'Uptime' },
  { value: '4',    label: 'Dashboards' },
];

const FEATURES = [
  { icon: '🛡️', title: 'Secure Login',     desc: 'JWT role-based access',      color: '#00D4FF' },
  { icon: '⚡', title: 'Fast Clearance',   desc: 'Submit & approve instantly',  color: '#FFD600' },
  { icon: '📊', title: 'Smart Reports',    desc: 'Analytics & dashboards',      color: '#FF6B35' },
  { icon: '🔔', title: 'Live Tracking',    desc: 'Track request status',        color: '#00E676' },
  { icon: '👥', title: 'Team Management',  desc: 'Manage all departments',      color: '#A78BFA' },
  { icon: '📋', title: 'Multiple Types',   desc: 'All clearance types covered', color: '#FF3D71' },
];

export default function Home() {
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

      <nav className="home-nav">
        <div className="nav-brand">
          <div className="nav-logo">ECS</div>
          <span className="nav-title">Employee Clearance System</span>
        </div>
        <button className="nav-btn" onClick={() => navigate('/login')}>
          Sign In →
        </button>
      </nav>

      <div className="home-body">
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
            clearance requests — fast, secure and transparent.
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
          </div>
        </div>

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
        <span>Built with React & Node.js</span>
      </footer>
    </div>
  );
}