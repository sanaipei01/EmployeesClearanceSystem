import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from '../components/StatCard';
import FeedbackForm from '../components/FeedbackForm';
import ResignationForm from '../components/ResignationForm';
import TimelineTracker from '../components/TimelineTracker';
import ClearanceCertificate from '../components/ClearanceCertificate';

const NAV = [
  { key: 'overview',    icon: '🏠', label: 'Overview' },
  { key: 'request',     icon: '📋', label: 'Submit Request' },
  { key: 'history',     icon: '🕒', label: 'My Requests' },
  { key: 'resignation', icon: '📝', label: 'Resign' },
  { key: 'profile',     icon: '👤', label: 'My Profile' },
  { key: 'feedback',    icon: '💬', label: 'Give Feedback' },
];

const SAMPLE_REQUESTS = [
  { id:'REQ-001', type:'Resignation Clearance', date:'2024-01-15', status:'approved',   note:'All cleared' },
  { id:'REQ-002', type:'Travel Clearance',      date:'2024-02-10', status:'pending',    note:'Awaiting HR' },
  { id:'REQ-003', type:'Leave Clearance',        date:'2024-03-01', status:'processing', note:'Under review' },
];

const CLEARANCE_TYPES = [
  'Resignation Clearance','Travel Clearance','Leave Clearance',
  'Training Clearance','Equipment Return Clearance','Final Exit Clearance',
];

const YESTERDAY_ACTIVITY = [
  { icon:'📋', text:'You submitted a Travel Clearance request', time:'Yesterday 10:32 AM', color:'#00D4FF' },
  { icon:'✅', text:'Your Leave Clearance was approved by HR', time:'Yesterday 2:15 PM',  color:'#00E676' },
  { icon:'🔔', text:'Manager reviewed your request',            time:'Yesterday 4:00 PM',  color:'#FFD600' },
];

function Badge({ status }) {
  const map = { pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected', processing:'badge-processing' };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

function Notification({ msg, type }) {
  if (!msg) return null;
  return <div className={`notification notification-${type}`}>{msg}</div>;
}

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [requests, setRequests]     = useState(() => {
    const stored = JSON.parse(localStorage.getItem('ecs_employee_requests') || '[]');
    const mine   = stored.filter(r => r.employee === user.name);
    return mine.length > 0 ? [...mine, ...SAMPLE_REQUESTS] : SAMPLE_REQUESTS;
  });
  const [form, setForm]             = useState({ type:'', reason:'', urgency:'normal' });
  const [notif, setNotif]           = useState({ msg:'', type:'' });
  const [activeTab, setActiveTab]   = useState('overview');
  const [certRequest, setCertRequest] = useState(null);

  // Overview expanded sections
  const [showStats, setShowStats]       = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showQuick, setShowQuick]       = useState(false);

  const showNotif = (msg, type='success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif({ msg:'', type:'' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-5)}`,
      type: form.type, reason: form.reason, urgency: form.urgency,
      employee: user.name,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', note: 'Submitted — awaiting review',
    };
    setRequests([newReq, ...requests]);
    const stored = JSON.parse(localStorage.getItem('ecs_employee_requests') || '[]');
    localStorage.setItem('ecs_employee_requests', JSON.stringify([newReq, ...stored]));
    setForm({ type:'', reason:'', urgency:'normal' });
    showNotif('✅ Request submitted! Your manager will review it shortly.');
  };

  const stats = {
    total:      requests.length,
    approved:   requests.filter(r => r.status==='approved').length,
    pending:    requests.filter(r => r.status==='pending').length,
    processing: requests.filter(r => r.status==='processing').length,
  };

  const navWithTab = NAV.map(n => ({ ...n, onClick: () => setActiveTab(n.key) }));

  const renderContent = () => {
    if (activeTab === 'request') {
      return (
        <div>
          <div className="page-title">Submit Clearance Request</div>
          <div className="page-subtitle">Fill in the form to submit a new clearance request</div>
          <div style={{ maxWidth:'560px' }}>
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Clearance Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type:e.target.value })} required>
                    <option value="">Select clearance type...</option>
                    {CLEARANCE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select value={form.urgency} onChange={e => setForm({ ...form, urgency:e.target.value })}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reason / Details</label>
                  <textarea rows={4} placeholder="Describe the reason..." value={form.reason} onChange={e => setForm({ ...form, reason:e.target.value })} required style={{ resize:'vertical' }} />
                </div>
                <button className="btn btn-primary" type="submit" style={{ width:'100%', justifyContent:'center' }}>Submit Request →</button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'history') {
      return (
        <div>
          <div className="page-title">My Requests</div>
          <div className="page-subtitle">Track all your clearance requests with live status</div>
          <div style={{ marginBottom:'28px' }}>
            {requests.map(r => <TimelineTracker key={r.id} request={r} />)}
          </div>
          <div className="card">
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'16px', marginBottom:'16px' }}>All Requests</div>
            <table>
              <thead><tr><th>Request ID</th><th>Type</th><th>Date</th><th>Status</th><th>Certificate</th></tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily:'monospace', color:'#00D4FF' }}>{r.id}</td>
                    <td>{r.type}</td>
                    <td style={{ color:'var(--muted)' }}>{r.date}</td>
                    <td><Badge status={r.status} /></td>
                    <td>
                      {r.status === 'approved'
                        ? <button className="btn btn-success" style={{ padding:'5px 12px', fontSize:'12px' }} onClick={() => setCertRequest(r)}>📄 Download</button>
                        : <span style={{ color:'var(--muted)', fontSize:'12px' }}>Not available</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {certRequest && (
            <div style={{ marginTop:'28px' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'18px', marginBottom:'16px' }}>📄 Clearance Certificate</div>
              <ClearanceCertificate request={certRequest} employee={user} />
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'resignation') {
      return (
        <div>
          <div className="page-title">Resignation Clearance 📝</div>
          <div className="page-subtitle">Complete all steps to submit your resignation clearance</div>
          <ResignationForm />
        </div>
      );
    }

    if (activeTab === 'profile') {
      return (
        <div>
          <div className="page-title">My Profile</div>
          <div className="page-subtitle">Your account information</div>
          <div className="card" style={{ maxWidth:'480px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'28px' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'16px', background:'rgba(0,230,118,0.15)', color:'#00E676', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'800', fontFamily:'Syne,sans-serif' }}>
                {user.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize:'20px', fontWeight:'700', fontFamily:'Syne,sans-serif' }}>{user.name}</div>
                <div style={{ color:'var(--muted)', fontSize:'13px', textTransform:'capitalize', marginTop:'4px' }}>{user.role}</div>
              </div>
            </div>
            {[['Username',user.username],['Role',user.role],['Employee ID',`EMP-00${user.id||'1'}`]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--muted)', fontSize:'13px' }}>{k}</span>
                <span style={{ fontSize:'13px', textTransform:'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'feedback') {
      return (
        <div>
          <div className="page-title">Give Feedback 💬</div>
          <div className="page-subtitle">Help us improve the clearance process</div>
          <FeedbackForm />
        </div>
      );
    }

    // OVERVIEW — yesterday snapshot + expandable sections
    return (
      <div>
        {/* Welcome */}
        <div className="page-title">Welcome back, {user.name?.split(' ')[0]} 👋</div>
        <div className="page-subtitle">Here's what happened yesterday</div>

        {/* Yesterday Activity */}
        <div className="card" style={{ marginBottom:'20px' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
            🕐 Yesterday's Activity
          </div>
          {YESTERDAY_ACTIVITY.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'12px 0', borderBottom: i < YESTERDAY_ACTIVITY.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px' }}>{a.text}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'3px' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

          {/* Stats */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <button onClick={() => setShowStats(!showStats)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px' }}>
              <span>📊 My Request Stats</span>
              <span style={{ transition:'transform 0.3s', transform: showStats ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
            </button>
            {showStats && (
              <div style={{ padding:'0 20px 20px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px' }}>
                <StatCard icon="📋" label="Total"      value={stats.total}      color="#00D4FF" />
                <StatCard icon="✅" label="Approved"   value={stats.approved}   color="#00E676" />
                <StatCard icon="⏳" label="Pending"    value={stats.pending}    color="#FFD600" />
                <StatCard icon="🔄" label="Processing" value={stats.processing} color="#FF6B35" />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <button onClick={() => setShowTimeline(!showTimeline)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px' }}>
              <span>🗺️ Request Timeline</span>
              <span style={{ transition:'transform 0.3s', transform: showTimeline ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
            </button>
            {showTimeline && (
              <div style={{ padding:'0 20px 20px' }}>
                {requests.slice(0,3).map(r => <TimelineTracker key={r.id} request={r} />)}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <button onClick={() => setShowQuick(!showQuick)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px' }}>
              <span>⚡ Quick Actions</span>
              <span style={{ transition:'transform 0.3s', transform: showQuick ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
            </button>
            {showQuick && (
              <div style={{ padding:'0 20px 20px', display:'flex', gap:'10px', flexWrap:'wrap' }}>
                <button className="btn btn-primary"  onClick={() => setActiveTab('request')}>📋 Submit Request</button>
                <button className="btn btn-ghost"    onClick={() => setActiveTab('history')}>🕒 View Requests</button>
                <button className="btn btn-ghost"    onClick={() => setActiveTab('resignation')}>📝 Resign</button>
                <button className="btn btn-ghost"    onClick={() => setActiveTab('feedback')}>💬 Give Feedback</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout navItems={navWithTab} role="employee" activeTab={activeTab} setActiveTab={setActiveTab}>
      <Notification msg={notif.msg} type={notif.type} />
      {renderContent()}
    </DashboardLayout>
  );
}

export default EmployeeDashboard;