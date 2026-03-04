import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from '../components/StatCard';
import FeedbackViewer from '../components/FeedbackViewer';
import ActivityFeed from '../components/ActivityFeed';

const NAV = [
  { key: 'overview',  icon: '🏠', label: 'Overview' },
  { key: 'requests',  icon: '📋', label: 'All Requests' },
  { key: 'employees', icon: '👥', label: 'Employees' },
  { key: 'users',     icon: '🔑', label: 'User Accounts' },
  { key: 'reports',   icon: '📊', label: 'Reports' },
  { key: 'feedback',  icon: '💬', label: 'Feedback' },
];

const INIT_REQUESTS = [
  { id:'REQ-001', employee:'Judy Faith',      dept:'IT',         type:'Resignation Clearance', date:'2024-01-15', status:'pending',    urgency:'normal' },
  { id:'REQ-002', employee:'Jeff Otieno',     dept:'IT',         type:'Travel Clearance',      date:'2024-02-10', status:'pending',    urgency:'urgent' },
  { id:'REQ-003', employee:'Hellen Moraa',    dept:'IT',         type:'Leave Clearance',       date:'2024-03-01', status:'approved',   urgency:'normal' },
  { id:'REQ-004', employee:'Langisa Ole',     dept:'Sales',      type:'Final Exit Clearance',  date:'2024-03-05', status:'rejected',   urgency:'critical' },
  { id:'REQ-005', employee:'Resian Nkoitoi',  dept:'HR',         type:'Equipment Return',      date:'2024-03-08', status:'processing', urgency:'normal' },
  { id:'REQ-006', employee:'Soyian Lenku',    dept:'Finance',    type:'Training Clearance',    date:'2024-03-10', status:'pending',    urgency:'normal' },
  { id:'REQ-007', employee:'Nempiris Sakuda', dept:'Finance',    type:'Resignation Clearance', date:'2024-03-11', status:'pending',    urgency:'urgent' },
  { id:'REQ-008', employee:'John Kamau',      dept:'IT',         type:'Leave Clearance',       date:'2024-03-12', status:'processing', urgency:'normal' },
];

const EMPLOYEES = [
  { id:'EMP-001', name:'Kitipa Naikumi',  dept:'Management', role:'Manager',      email:'kitipa@ecs.co.ke',   status:'active' },
  { id:'EMP-002', name:'Judy Faith',      dept:'IT',         role:'Developer',    email:'judy@ecs.co.ke',     status:'active' },
  { id:'EMP-003', name:'Hellen Moraa',    dept:'IT',         role:'Designer',     email:'hellen@ecs.co.ke',   status:'active' },
  { id:'EMP-004', name:'John Kamau',      dept:'IT',         role:'QA Engineer',  email:'john@ecs.co.ke',     status:'active' },
  { id:'EMP-005', name:'Jeff Otieno',     dept:'IT',         role:'DevOps',       email:'jeff@ecs.co.ke',     status:'active' },
  { id:'EMP-006', name:'Soyian Lenku',    dept:'Finance',    role:'Analyst',      email:'soyian@ecs.co.ke',   status:'active' },
  { id:'EMP-007', name:'Langisa Ole',     dept:'Sales',      role:'Sales Rep',    email:'langisa@ecs.co.ke',  status:'active' },
  { id:'EMP-008', name:'Resian Nkoitoi',  dept:'HR',         role:'HR Assist',    email:'resian@ecs.co.ke',   status:'active' },
  { id:'EMP-009', name:'Nempiris Sakuda', dept:'Finance',    role:'Accountant',   email:'nempiris@ecs.co.ke', status:'active' },
];

const USERS = [
  { id:1, username:'admin',    name:'Kamau Njoroge',  role:'admin',    lastLogin:'2024-03-08' },
  { id:2, username:'hr',       name:'Resian Nkoitoi', role:'hr',       lastLogin:'2024-03-07' },
  { id:3, username:'manager',  name:'Kitipa Naikumi', role:'manager',  lastLogin:'2024-03-08' },
  { id:4, username:'employee', name:'Judy Faith',     role:'employee', lastLogin:'2024-03-06' },
];

function Badge({ status }) {
  const map = { pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected', processing:'badge-processing' };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

function Notification({ msg, type }) {
  if (!msg) return null;
  return <div className={`notification notification-${type}`}>{msg}</div>;
}

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [requests, setRequests]   = useState(INIT_REQUESTS);
  const [notif, setNotif]         = useState({ msg:'', type:'' });
  const [selected, setSelected]   = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const showNotif = (msg, type='success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif({ msg:'', type:'' }), 3000);
  };

  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(null);
    showNotif(`Request ${id} marked as ${status}`, status==='approved' ? 'success' : 'error');
  };

  const stats = {
    total:     requests.length,
    pending:   requests.filter(r => r.status==='pending').length,
    approved:  requests.filter(r => r.status==='approved').length,
    rejected:  requests.filter(r => r.status==='rejected').length,
    employees: EMPLOYEES.length,
    active:    EMPLOYEES.filter(e => e.status==='active').length,
  };

  const navWithTab = NAV.map(n => ({ ...n, onClick: () => setActiveTab(n.key) }));

  const renderContent = () => {
    if (activeTab === 'requests') {
      if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Employee Feedback 💬</div>
          <div className="page-subtitle">All feedback submitted by employees</div>
          <FeedbackViewer />
        </div>
      );
    }

    return (
        <div>
          <div className="page-title">All Clearance Requests</div>
          <div className="page-subtitle">Manage and oversee all clearance requests</div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Employee</th><th>Dept</th><th>Type</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily:'monospace', color:'#FF6B35', fontSize:'12px' }}>{r.id}</td>
                    <td style={{ fontWeight:'500' }}>{r.employee}</td>
                    <td style={{ color:'#9CA3AF' }}>{r.dept}</td>
                    <td>{r.type}</td>
                    <td style={{ color:'#9CA3AF' }}>{r.date}</td>
                    <td><Badge status={r.status} /></td>
                    <td><button className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'12px' }} onClick={() => setSelected(r)}>Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'employees') {
      if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Employee Feedback 💬</div>
          <div className="page-subtitle">All feedback submitted by employees</div>
          <FeedbackViewer />
        </div>
      );
    }

    return (
        <div>
          <div className="page-title">Employees</div>
          <div className="page-subtitle">All employees in the system</div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Role</th><th>Email</th><th>Status</th></tr></thead>
              <tbody>
                {EMPLOYEES.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily:'monospace', color:'#FF6B35', fontSize:'12px' }}>{e.id}</td>
                    <td style={{ fontWeight:'500' }}>{e.name}</td>
                    <td>{e.dept}</td>
                    <td style={{ color:'#9CA3AF' }}>{e.role}</td>
                    <td style={{ color:'#9CA3AF', fontSize:'13px' }}>{e.email}</td>
                    <td><span style={{ color:e.status==='active'?'#00E676':'#9CA3AF', fontSize:'12px', fontWeight:'600' }}>● {e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'users') {
      if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Employee Feedback 💬</div>
          <div className="page-subtitle">All feedback submitted by employees</div>
          <FeedbackViewer />
        </div>
      );
    }

    return (
        <div>
          <div className="page-title">User Accounts</div>
          <div className="page-subtitle">System user accounts and roles</div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Username</th><th>Role</th><th>Last Login</th></tr></thead>
              <tbody>
                {USERS.map(u => (
                  <tr key={u.id}>
                    <td style={{ color:'#FF6B35', fontFamily:'monospace', fontSize:'12px' }}>{u.id}</td>
                    <td style={{ fontWeight:'500' }}>{u.name}</td>
                    <td style={{ color:'#9CA3AF', fontFamily:'monospace' }}>{u.username}</td>
                    <td>
                      <span style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:'700',
                        background: u.role==='admin'?'rgba(255,107,53,0.15)':u.role==='hr'?'rgba(0,212,255,0.15)':u.role==='manager'?'rgba(255,214,0,0.15)':'rgba(0,230,118,0.15)',
                        color: u.role==='admin'?'#FF6B35':u.role==='hr'?'#00D4FF':u.role==='manager'?'#FFD600':'#00E676',
                      }}>{u.role}</span>
                    </td>
                    <td style={{ color:'#9CA3AF' }}>{u.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'reports') {
      const depts = [...new Set(EMPLOYEES.map(e => e.dept))];
      if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Employee Feedback 💬</div>
          <div className="page-subtitle">All feedback submitted by employees</div>
          <FeedbackViewer />
        </div>
      );
    }

    return (
        <div>
          <div className="page-title">Reports & Analytics</div>
          <div className="page-subtitle">System-wide statistics</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', marginBottom:'28px' }}>
            <StatCard icon="👥" label="Total Employees" value={stats.employees} color="#FF6B35" />
            <StatCard icon="✅" label="Active Staff"    value={stats.active}    color="#00E676" />
            <StatCard icon="📋" label="Total Requests"  value={stats.total}     color="#00D4FF" />
            <StatCard icon="⏳" label="Pending"         value={stats.pending}   color="#FFD600" sub="Awaiting action" />
          </div>
          <div className="card">
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', marginBottom:'16px' }}>Requests by Department</div>
            {depts.map(dept => {
              const count = requests.filter(r => r.dept === dept).length;
              const pct   = Math.round((count / requests.length) * 100);
              if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Employee Feedback 💬</div>
          <div className="page-subtitle">All feedback submitted by employees</div>
          <FeedbackViewer />
        </div>
      );
    }

    return (
                <div key={dept} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'6px' }}>
                    <span>{dept}</span>
                    <span style={{ color:'#9CA3AF' }}>{count} requests ({pct}%)</span>
                  </div>
                  <div style={{ height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:'#FF6B35', borderRadius:'3px', transition:'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Employee Feedback 💬</div>
          <div className="page-subtitle">All feedback submitted by employees</div>
          <FeedbackViewer />
        </div>
      );
    }

    return (
      <div>
        <div className="page-title">Admin Dashboard 🛡️</div>
        <div className="page-subtitle">Full system control — welcome back, {user.name}</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'16px', marginBottom:'28px' }}>
          <StatCard icon="👥" label="Employees"  value={stats.employees} color="#FF6B35" />
          <StatCard icon="📋" label="Requests"   value={stats.total}     color="#00D4FF" />
          <StatCard icon="⏳" label="Pending"    value={stats.pending}   color="#FFD600" sub="Needs action" />
          <StatCard icon="✅" label="Approved"   value={stats.approved}  color="#00E676" />
          <StatCard icon="❌" label="Rejected"   value={stats.rejected}  color="#FF3D71" />
        </div>
        <div className="card">
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'16px', marginBottom:'16px' }}>Recent Requests</div>
          <table>
            <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {requests.slice(0,5).map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily:'monospace', color:'#FF6B35', fontSize:'12px' }}>{r.id}</td>
                  <td>{r.employee}</td>
                  <td>{r.type}</td>
                  <td><Badge status={r.status} /></td>
                  <td><button className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'12px' }} onClick={() => setSelected(r)}>Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <div style={{ marginTop:'24px' }}>
          <ActivityFeed />
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout navItems={navWithTab} role="admin" activeTab={activeTab} setActiveTab={setActiveTab}>
      <Notification msg={notif.msg} type={notif.type} />

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request — {selected.id}</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>
            {[['Employee',selected.employee],['Department',selected.dept],['Type',selected.type],['Date',selected.date],['Urgency',selected.urgency],['Status',selected.status]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color:'#9CA3AF', fontSize:'13px' }}>{k}</span>
                <span style={{ fontSize:'13px' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', gap:'10px', marginTop:'24px', flexWrap:'wrap' }}>
              <button className="btn btn-success" onClick={() => updateStatus(selected.id,'approved')}>✅ Approve</button>
              <button className="btn btn-danger"  onClick={() => updateStatus(selected.id,'rejected')}>❌ Reject</button>
              <button className="btn btn-ghost"   onClick={() => updateStatus(selected.id,'processing')}>🔄 Processing</button>
            </div>
          </div>
        </div>
      )}

      {renderContent()}
    </DashboardLayout>
  );
}

export default AdminDashboard;