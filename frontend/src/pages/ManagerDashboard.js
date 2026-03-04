import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from '../components/StatCard';
import TimelineTracker from '../components/TimelineTracker';

const NAV = [
  { key: 'overview', icon: '🏠', label: 'Overview' },
  { key: 'requests', icon: '📋', label: 'Team Requests', badge: 3 },
  { key: 'team',     icon: '👥', label: 'My Team' },
];

const DEFAULT_REQUESTS = [
  { id:'REQ-001', employee:'Soyian Mumbi',   type:'Leave Clearance',    date:'2024-03-01', status:'pending',  urgency:'normal' },
  { id:'REQ-002', employee:'Kosiom Naikumi', type:'Travel Clearance',   date:'2024-03-05', status:'pending',  urgency:'urgent' },
  { id:'REQ-003', employee:'Seela Stacy',    type:'Equipment Return',   date:'2024-02-20', status:'approved', urgency:'normal' },
  { id:'REQ-004', employee:'Resian Camila',  type:'Training Clearance', date:'2024-03-10', status:'pending',  urgency:'normal' },
];

const TEAM = [
  { id:'EMP-001', name:'Soyian Mumbi',   role:'Software Developer', dept:'IT',      status:'active' },
  { id:'EMP-002', name:'Kosiom Naikumi', role:'Finance Analyst',    dept:'Finance', status:'active' },
  { id:'EMP-003', name:'Seela Stacy',    role:'HR Assistant',       dept:'HR',      status:'active' },
  { id:'EMP-004', name:'Resian Camila',  role:'Sales Executive',    dept:'Sales',   status:'active' },
];

function Badge({ status }) {
  const map = { pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected', processing:'badge-processing' };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

function UrgencyBadge({ level }) {
  const colors = { normal:'#9CA3AF', urgent:'#FFD600', critical:'#FF3D71' };
  return <span style={{ color:colors[level], fontSize:'12px', fontWeight:'600' }}>● {level}</span>;
}

function Notification({ msg, type }) {
  if (!msg) return null;
  return <div className={`notification notification-${type}`}>{msg}</div>;
}

function ManagerDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [requests, setRequests]   = useState(DEFAULT_REQUESTS);
  const [notif, setNotif]         = useState({ msg:'', type:'' });
  const [selected, setSelected]   = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Pick up any requests submitted by employees from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ecs_employee_requests') || '[]');
    if (stored.length > 0) {
      setRequests(prev => {
        const existingIds = prev.map(r => r.id);
        const newOnes = stored.filter(r => !existingIds.includes(r.id));
        return [...newOnes, ...prev];
      });
    }
  }, []);

  const showNotif = (msg, type='success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif({ msg:'', type:'' }), 3000);
  };

  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    // Also update in localStorage so employee can see updated status
    const stored = JSON.parse(localStorage.getItem('ecs_employee_requests') || '[]');
    const updated = stored.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('ecs_employee_requests', JSON.stringify(updated));
    setSelected(null);
    showNotif(`✅ Request ${id} has been ${status}`, status === 'approved' ? 'success' : 'error');
  };

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    team:     TEAM.length,
  };

  const navWithTab = NAV.map(n => ({ ...n, onClick: () => setActiveTab(n.key) }));

  const renderContent = () => {
    if (activeTab === 'requests') {
      return (
        <div>
          <div className="page-title">Team Requests</div>
          <div className="page-subtitle">All clearance requests from your team members</div>

          {/* Timeline view for pending */}
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <div style={{ marginBottom:'24px' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px', marginBottom:'12px', color:'#FFD600' }}>
                ⏳ Awaiting Your Review
              </div>
              {requests.filter(r => r.status === 'pending').map(r => (
                <TimelineTracker key={r.id} request={r} />
              ))}
            </div>
          )}

          <div className="card">
            <table>
              <thead>
                <tr><th>ID</th><th>Employee</th><th>Type</th><th>Date</th><th>Urgency</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily:'monospace', color:'#FFD600', fontSize:'12px' }}>{r.id}</td>
                    <td style={{ fontWeight:'500' }}>{r.employee}</td>
                    <td>{r.type}</td>
                    <td style={{ color:'#9CA3AF' }}>{r.date}</td>
                    <td><UrgencyBadge level={r.urgency || 'normal'} /></td>
                    <td><Badge status={r.status} /></td>
                    <td>
                      <button
                        className="btn btn-ghost"
                        style={{ padding:'5px 12px', fontSize:'12px' }}
                        onClick={() => setSelected(r)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'team') {
      return (
        <div>
          <div className="page-title">My Team</div>
          <div className="page-subtitle">Members under Nempiris Kiti's supervision</div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Requests</th><th>Status</th></tr></thead>
              <tbody>
                {TEAM.map(e => {
                  const empRequests = requests.filter(r => r.employee === e.name);
                  const pending     = empRequests.filter(r => r.status === 'pending').length;
                  return (
                    <tr key={e.id}>
                      <td style={{ fontFamily:'monospace', color:'#FFD600', fontSize:'12px' }}>{e.id}</td>
                      <td style={{ fontWeight:'500' }}>{e.name}</td>
                      <td>{e.role}</td>
                      <td style={{ color:'#9CA3AF' }}>{e.dept}</td>
                      <td>
                        <span style={{ color: pending > 0 ? '#FFD600' : '#9CA3AF', fontSize:'12px', fontWeight:'600' }}>
                          {empRequests.length} total {pending > 0 ? `(${pending} pending)` : ''}
                        </span>
                      </td>
                      <td>
                        <span style={{ color:'#00E676', fontSize:'12px', fontWeight:'600' }}>● {e.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Overview
    return (
      <div>
        <div className="page-title">Welcome, Nempiris Kiti 👋</div>
        <div className="page-subtitle">Here's your team overview for today</div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', marginBottom:'28px' }}>
          <StatCard icon="👥" label="Team Size"      value={stats.team}     color="#FFD600" />
          <StatCard icon="📋" label="Total Requests" value={stats.total}    color="#00D4FF" />
          <StatCard icon="⏳" label="Pending"        value={stats.pending}  color="#FF6B35" sub="Needs your review" />
          <StatCard icon="✅" label="Approved"       value={stats.approved} color="#00E676" />
        </div>

        {/* Pending requests needing action */}
        {stats.pending > 0 && (
          <div style={{ marginBottom:'24px' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'16px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px' }}>
              ⚠️ Requests Needing Your Action
              <span style={{ background:'rgba(255,61,113,0.15)', color:'#FF3D71', padding:'2px 10px', borderRadius:'20px', fontSize:'12px' }}>
                {stats.pending} pending
              </span>
            </div>
            {requests.filter(r => r.status === 'pending').map(r => (
              <div key={r.id} className="card" style={{ marginBottom:'10px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
                <div>
                  <div style={{ fontWeight:'600', fontSize:'14px' }}>{r.employee}</div>
                  <div style={{ color:'#9CA3AF', fontSize:'12px', marginTop:'2px' }}>{r.type} • {r.date}</div>
                </div>
                <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  <Badge status={r.status} />
                  <button className="btn btn-success" style={{ padding:'6px 14px', fontSize:'12px' }} onClick={() => updateStatus(r.id,'approved')}>✅ Approve</button>
                  <button className="btn btn-danger"  style={{ padding:'6px 14px', fontSize:'12px' }} onClick={() => updateStatus(r.id,'rejected')}>❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {stats.pending === 0 && (
          <div style={{ textAlign:'center', padding:'32px', background:'rgba(0,230,118,0.05)', border:'1px solid rgba(0,230,118,0.15)', borderRadius:'16px', marginBottom:'24px' }}>
            <div style={{ fontSize:'32px', marginBottom:'8px' }}>🎉</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', color:'#00E676' }}>All caught up!</div>
            <div style={{ color:'#9CA3AF', fontSize:'13px', marginTop:'4px' }}>No pending requests need your review</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout navItems={navWithTab} role="manager" activeTab={activeTab} setActiveTab={setActiveTab}>
      <Notification msg={notif.msg} type={notif.type} />

      {/* Review Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Request</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>
            {[
              ['Request ID',  selected.id],
              ['Employee',    selected.employee],
              ['Type',        selected.type],
              ['Date',        selected.date],
              ['Urgency',     selected.urgency || 'normal'],
              ['Status',      selected.status],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color:'#9CA3AF', fontSize:'13px' }}>{k}</span>
                <span style={{ fontSize:'13px' }}>{v}</span>
              </div>
            ))}
            {selected.status === 'pending' && (
              <div style={{ display:'flex', gap:'12px', marginTop:'24px' }}>
                <button className="btn btn-success" style={{ flex:1, justifyContent:'center' }} onClick={() => updateStatus(selected.id,'approved')}>✅ Approve</button>
                <button className="btn btn-danger"  style={{ flex:1, justifyContent:'center' }} onClick={() => updateStatus(selected.id,'rejected')}>❌ Reject</button>
                <button className="btn btn-ghost"   style={{ flex:1, justifyContent:'center' }} onClick={() => updateStatus(selected.id,'processing')}>🔄 Processing</button>
              </div>
            )}
            {selected.status !== 'pending' && (
              <div style={{ marginTop:'20px', padding:'12px', background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)', borderRadius:'8px', textAlign:'center', color:'#00E676', fontSize:'13px' }}>
                This request has already been {selected.status}
              </div>
            )}
          </div>
        </div>
      )}

      {renderContent()}
    </DashboardLayout>
  );
}

export default ManagerDashboard;