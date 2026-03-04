import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from '../components/StatCard';
import FeedbackViewer from '../components/FeedbackViewer';

const NAV = [
  { key: 'overview',  icon: '🏠', label: 'Overview' },
  { key: 'requests',  icon: '📋', label: 'All Requests', badge: 3 },
  { key: 'employees', icon: '👥', label: 'Employees' },
  { key: 'reports',   icon: '📊', label: 'Reports' },
  { key: 'feedback',  icon: '💬', label: 'Feedback' },
];

const INIT_REQUESTS = [
  { id:'REQ-001', employee:'Judy Faith',      dept:'IT',         type:'Resignation Clearance', date:'2024-01-15', status:'pending',    urgency:'normal' },
  { id:'REQ-002', employee:'Jeff Otieno',     dept:'IT',         type:'Travel Clearance',      date:'2024-02-10', status:'pending',    urgency:'urgent' },
  { id:'REQ-003', employee:'Hellen Moraa',    dept:'IT',         type:'Leave Clearance',       date:'2024-03-01', status:'processing', urgency:'normal' },
  { id:'REQ-004', employee:'Langisa Ole',     dept:'Sales',      type:'Final Exit Clearance',  date:'2024-03-05', status:'approved',   urgency:'critical' },
  { id:'REQ-005', employee:'Resian Nkoitoi',  dept:'HR',         type:'Equipment Return',      date:'2024-03-08', status:'rejected',   urgency:'normal' },
  { id:'REQ-006', employee:'Soyian Lenku',    dept:'Finance',    type:'Training Clearance',    date:'2024-03-10', status:'pending',    urgency:'normal' },
  { id:'REQ-007', employee:'Nempiris Sakuda', dept:'Finance',    type:'Resignation Clearance', date:'2024-03-11', status:'pending',    urgency:'urgent' },
  { id:'REQ-008', employee:'John Kamau',      dept:'IT',         type:'Leave Clearance',       date:'2024-03-12', status:'pending',    urgency:'normal' },
];

const EMPLOYEES = [
  { id:'EMP-001', name:'Kitipa Naikumi',  dept:'Management', role:'Manager',    status:'active' },
  { id:'EMP-002', name:'Judy Faith',      dept:'IT',         role:'Developer',  status:'active' },
  { id:'EMP-003', name:'Hellen Moraa',    dept:'IT',         role:'Designer',   status:'active' },
  { id:'EMP-004', name:'John Kamau',      dept:'IT',         role:'QA Engineer',status:'active' },
  { id:'EMP-005', name:'Jeff Otieno',     dept:'IT',         role:'DevOps',     status:'active' },
  { id:'EMP-006', name:'Soyian Lenku',    dept:'Finance',    role:'Analyst',    status:'active' },
  { id:'EMP-007', name:'Langisa Ole',     dept:'Sales',      role:'Sales Rep',  status:'active' },
  { id:'EMP-008', name:'Resian Nkoitoi',  dept:'HR',         role:'HR Assist',  status:'active' },
  { id:'EMP-009', name:'Nempiris Sakuda', dept:'Finance',    role:'Accountant', status:'active' },
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

function HRDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [filter, setFilter]     = useState('all');
  const [notif, setNotif]       = useState({ msg:'', type:'' });
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const showNotif = (msg, type='success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif({ msg:'', type:'' }), 3000);
  };

  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(null);
    showNotif(`Request ${id} has been ${status}`, status === 'approved' ? 'success' : 'error');
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
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
          <div className="page-subtitle">Review and action employee clearance requests</div>
          <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
            {['all','pending','approved','rejected','processing'].map(f => (
              <button key={f} className={`btn ${filter===f ? 'btn-primary':'btn-ghost'}`} style={{ padding:'7px 16px', fontSize:'12px', textTransform:'capitalize' }} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Employee</th><th>Dept</th><th>Type</th><th>Urgency</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily:'monospace', color:'#00D4FF', fontSize:'12px' }}>{r.id}</td>
                    <td style={{ fontWeight:'500' }}>{r.employee}</td>
                    <td style={{ color:'#9CA3AF' }}>{r.dept}</td>
                    <td>{r.type}</td>
                    <td><UrgencyBadge level={r.urgency} /></td>
                    <td style={{ color:'#9CA3AF' }}>{r.date}</td>
                    <td><Badge status={r.status} /></td>
                    <td><button className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'12px' }} onClick={() => setSelected(r)}>View</button></td>
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
          <div className="page-subtitle">All registered employees</div>
          <div className="card">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {EMPLOYEES.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily:'monospace', color:'#00D4FF', fontSize:'12px' }}>{e.id}</td>
                    <td style={{ fontWeight:'500' }}>{e.name}</td>
                    <td>{e.dept}</td>
                    <td style={{ color:'#9CA3AF' }}>{e.role}</td>
                    <td><span style={{ color:e.status==='active'?'#00E676':'#9CA3AF', fontSize:'12px', fontWeight:'600' }}>● {e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'reports') {
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
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Clearance statistics overview</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px' }}>
            <StatCard icon="📊" label="Total Requests"  value={stats.total}    color="#00D4FF" />
            <StatCard icon="⏳" label="Pending"         value={stats.pending}  color="#FFD600" sub="Requires action" />
            <StatCard icon="✅" label="Approved"        value={stats.approved} color="#00E676" />
            <StatCard icon="❌" label="Rejected"        value={stats.rejected} color="#FF3D71" />
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
        <div className="page-title">HR Dashboard 👋</div>
        <div className="page-subtitle">Welcome back, {user.name} — here's today's overview</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', marginBottom:'28px' }}>
          <StatCard icon="📋" label="Total"    value={stats.total}    color="#00D4FF" />
          <StatCard icon="⏳" label="Pending"  value={stats.pending}  color="#FFD600" sub="Needs review" />
          <StatCard icon="✅" label="Approved" value={stats.approved} color="#00E676" />
          <StatCard icon="❌" label="Rejected" value={stats.rejected} color="#FF3D71" />
        </div>
        <div className="card">
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'16px', marginBottom:'16px' }}>Pending Requests</div>
          <table>
            <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>Urgency</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {requests.filter(r => r.status==='pending').map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily:'monospace', color:'#00D4FF', fontSize:'12px' }}>{r.id}</td>
                  <td>{r.employee}</td>
                  <td>{r.type}</td>
                  <td><UrgencyBadge level={r.urgency} /></td>
                  <td><Badge status={r.status} /></td>
                  <td><button className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'12px' }} onClick={() => setSelected(r)}>Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout navItems={navWithTab} role="hr" activeTab={activeTab} setActiveTab={setActiveTab}>
      <Notification msg={notif.msg} type={notif.type} />

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Details</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>
            {[['Request ID',selected.id],['Employee',selected.employee],['Department',selected.dept],['Type',selected.type],['Date',selected.date],['Urgency',selected.urgency],['Status',selected.status]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color:'#9CA3AF', fontSize:'13px' }}>{k}</span>
                <span style={{ fontSize:'13px' }}>{v}</span>
              </div>
            ))}
            {selected.status === 'pending' && (
              <div style={{ display:'flex', gap:'12px', marginTop:'24px' }}>
                <button className="btn btn-success" style={{ flex:1, justifyContent:'center' }} onClick={() => updateStatus(selected.id,'approved')}>✅ Approve</button>
                <button className="btn btn-danger"  style={{ flex:1, justifyContent:'center' }} onClick={() => updateStatus(selected.id,'rejected')}>❌ Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {renderContent()}
    </DashboardLayout>
  );
}

export default HRDashboard;