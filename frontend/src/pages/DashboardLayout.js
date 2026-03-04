import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '../components/ThemeToggle';
import './DashboardLayout.css';

function DashboardLayout({ children, navItems, role, activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('ecs_user');
    localStorage.removeItem('ecs_token');
    navigate('/login');
  };

  const roleColors = {
    admin:    '#FF6B35',
    hr:       '#00D4FF',
    manager:  '#FFD600',
    employee: '#00E676',
  };
  const roleColor = roleColors[role] || '#00D4FF';

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ color:roleColor }}>ECS</div>
          {!collapsed && <span className="sidebar-title">Clearance</span>}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-role-badge" style={{ background:`${roleColor}20`, color:roleColor, border:`1px solid ${roleColor}40` }}>
            {role?.toUpperCase()}
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.key); if (item.onClick) item.onClick(); }}
              style={activeTab === item.key ? { background:`${roleColor}15`, borderLeft:`3px solid ${roleColor}`, color:roleColor } : {}}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-user">
              <div className="user-avatar" style={{ background:`${roleColor}20`, color:roleColor }}>
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{role}</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h2 className="topbar-page">
            {navItems.find(n => n.key === activeTab)?.label || 'Dashboard'}
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div className="topbar-time">
              {new Date().toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </div>
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;