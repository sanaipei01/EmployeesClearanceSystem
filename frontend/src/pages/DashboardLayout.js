import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '../components/ThemeToggle';
import './DashboardLayout.css';

function DashboardLayout({ children, navItems, role, activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // On mobile, show max 5 nav items to avoid overflow
  const visibleNavItems = isMobile ? navItems.slice(0, 5) : navItems;

  return (
    <div className={`layout ${collapsed && !isMobile ? 'collapsed' : ''}`}>
      <aside className="sidebar">

        {/* ── Desktop: full sidebar header ── */}
        {!isMobile && (
          <div className="sidebar-header">
            <div className="sidebar-logo" style={{ color: roleColor }}>ECS</div>
            {!collapsed && <span className="sidebar-title">Clearance</span>}
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '→' : '←'}
            </button>
          </div>
        )}

        {/* ── Desktop: role badge ── */}
        {!isMobile && !collapsed && (
          <div
            className="sidebar-role-badge"
            style={{ background: `${roleColor}20`, color: roleColor, border: `1px solid ${roleColor}40` }}
          >
            {role?.toUpperCase()}
          </div>
        )}

        {/* ── Nav items ── */}
        <nav className="sidebar-nav">
          {visibleNavItems.map(item => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.key); if (item.onClick) item.onClick(); }}
              style={
                activeTab === item.key
                  ? isMobile
                    ? { color: roleColor, borderBottom: `3px solid ${roleColor}` }
                    : { background: `${roleColor}15`, borderLeft: `3px solid ${roleColor}`, color: roleColor }
                  : {}
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {/* On mobile always show label; on desktop hide when collapsed */}
              {(isMobile || !collapsed) && (
                <span className="nav-label">{item.label}</span>
              )}
              {/* Badge: desktop only */}
              {!isMobile && !collapsed && item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Desktop: footer with user info + logout ── */}
        {!isMobile && (
          <div className="sidebar-footer">
            {!collapsed && (
              <div className="sidebar-user">
                <div
                  className="user-avatar"
                  style={{ background: `${roleColor}20`, color: roleColor }}
                >
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
        )}
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h2 className="topbar-page">
            {navItems.find(n => n.key === activeTab)?.label || 'Dashboard'}
          </h2>
          <div className="topbar-actions">
            <div className="topbar-time">
              {new Date().toLocaleDateString('en-KE', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
            <NotificationBell />
            <ThemeToggle />
            {/* Logout button in topbar on mobile */}
            {isMobile && (
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,61,113,0.1)',
                  border: '1px solid rgba(255,61,113,0.3)',
                  color: '#FF3D71',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                🚪
              </button>
            )}
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