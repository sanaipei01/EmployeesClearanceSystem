import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import FeedbackViewer from '../components/FeedbackViewer';

const SAMPLE_REQUESTS = [
  { id:1, request_no:'REQ-001', employee:'Soyian Mumbi',   type:'Resignation Clearance', urgency:'urgent',   status:'pending',    review_note:'' },
  { id:2, request_no:'REQ-002', employee:'Kosiom Naikumi', type:'Travel Clearance',       urgency:'normal',   status:'approved',   review_note:'All good' },
  { id:3, request_no:'REQ-003', employee:'Seela Stacy',    type:'Leave Clearance',        urgency:'normal',   status:'processing', review_note:'' },
  { id:4, request_no:'REQ-004', employee:'Resian Camila',  type:'Training Clearance',     urgency:'critical', status:'pending',    review_note:'' },
  { id:5, request_no:'REQ-005', employee:'Soyian Mumbi',   type:'Equipment Return',       urgency:'normal',   status:'rejected',   review_note:'Missing items' },
];

const YESTERDAY = [
  { icon:'🆕', text:'6 new clearance requests submitted',       time:'Yesterday 8:00 AM',  color:'#00D4FF' },
  { icon:'✅', text:'Aisha Mwangi approved 3 requests',          time:'Yesterday 11:30 AM', color:'#00E676' },
  { icon:'❌', text:'1 request was rejected — missing documents', time:'Yesterday 2:00 PM',  color:'#FF3D71' },
  { icon:'👤', text:'New employee account created',              time:'Yesterday 4:45 PM',  color:'#FFD600' },
];

const NAV = [
  { key:'overview',  icon:'🏠', label:'Overview'  },
  { key:'requests',  icon:'📋', label:'All Requests' },
  { key:'employees', icon:'👥', label:'Employees' },
  { key:'feedback',  icon:'💬', label:'Feedback'  },
  { key:'activity',  icon:'🕒', label:'Activity'  },
];

function Badge({ status }) {
  const s = { pending:'#FFD600', approved:'#00E676', rejected:'#FF3D71', processing:'#00D4FF' };
  return <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:`${s[status]}20`, color:s[status], border:`1px solid ${s[status]}40` }}>{status}</span>;
}

function Section({ title, open, onToggle, children, count }) {
  return (
    <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', overflow:'hidden', marginBottom:'12px' }}>
      <button onClick={onToggle} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'none', border:'none', color:'#F9FAFB', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px' }}>
        <span>{title} {count !== undefined && <span style={{ color:'#FFD600', fontSize:'12px', fontWeight:'600' }}>({count})</span>}</span>
        <span style={{ transition:'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0)', color:'#6B7280' }}>▼</span>
      </button>
      {open && <div style={{ padding:'4px 20px 20px' }}>{children}</div>}
    </div>
  );
}

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [requests, setRequests] = useState(SAMPLE_REQUESTS);
  const [selected, setSelected] = useState(null);
  const [note, setNote]         = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [open, setOpen] = useState({ stats:false, requests:false, activity:false });

  const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));

  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => r.status==='pending').length,
    approved:   requests.filter(r => r.status==='approved').length,
    rejected:   requests.filter(r => r.status==='rejected').length,
    processing: requests.filter(r => r.status==='processing').length,
    employees:  5,
  };

  const handleAction = (status) => {
    setRequests(prev => prev.map(r => r.id === selected.id ? { ...r, status, review_note: note } : r));
    setSelected(null); setNote('');
  };

  const renderContent = () => {
    if (activeTab === 'requests') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px' }}>All Requests 📋</div>
        <div style={{ color:'#6B7280', fontSize:'14px', marginBottom:'24px' }}>Manage all clearance requests across the system</div>
        <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                {['ID','Employee','Type','Urgency','Status','Action'].map(h => <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'#6B7280', fontWeight:'600', whiteSpace:'nowrap' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'12px 16px', color:'#FF6B35', fontFamily:'monospace', fontSize:'12px' }}>{r.request_no}</td>
                    <td style={{ padding:'12px 16px' }}>{r.employee}</td>
                    <td style={{ padding:'12px 16px', color:'#9CA3AF' }}>{r.type}</td>
                    <td style={{ padding:'12px 16px' }}><Badge status={r.urgency} /></td>
                    <td style={{ padding:'12px 16px' }}><Badge status={r.status} /></td>
                    <td style={{ padding:'12px 16px' }}><button onClick={() => setSelected(r)} style={{ padding:'5px 14px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#F9FAFB', cursor:'pointer', fontSize:'12px' }}>Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    if (activeTab === 'employees') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px' }}>Employees 👥</div>
        <div style={{ color:'#6B7280', fontSize:'14px', marginBottom:'24px' }}>All registered employees</div>
        {[
          { name:'Soyian Mumbi',   dept:'IT',      role:'Software Developer',   status:'active' },
          { name:'Kosiom Naikumi', dept:'Finance',  role:'Finance Analyst',      status:'active' },
          { name:'Seela Stacy',    dept:'HR',       role:'HR Assistant',         status:'active' },
          { name:'Resian Camila',  dept:'Sales',    role:'Sales Executive',      status:'active' },
          { name:'Nempiris Kiti',  dept:'Management',role:'Manager',             status:'active' },
        ].map((e,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px 20px', background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', marginBottom:'10px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(255,107,53,0.15)', color:'#FF6B35', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'18px', flexShrink:0 }}>{e.name[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:'600', fontSize:'14px' }}>{e.name}</div>
              <div style={{ color:'#6B7280', fontSize:'12px', marginTop:'2px' }}>{e.role} · {e.dept}</div>
            </div>
            <Badge status={e.status} />
          </div>
        ))}
      </div>
    );

    if (activeTab === 'feedback') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px' }}>Feedback 💬</div>
        <div style={{ color:'#6B7280', fontSize:'14px', marginBottom:'24px' }}>Employee feedback and ratings</div>
        <FeedbackViewer />
      </div>
    );

    if (activeTab === 'activity') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px' }}>Activity Feed 🕒</div>
        <div style={{ color:'#6B7280', fontSize:'14px', marginBottom:'24px' }}>Live system activity log</div>
        <ActivityFeed />
      </div>
    );

    // OVERVIEW
    return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px' }}>Welcome back, {user.name?.split(' ')[0]} 👋</div>
        <div style={{ color:'#6B7280', fontSize:'14px', marginBottom:'20px' }}>Here's a quick snapshot of yesterday</div>

        {/* Yesterday cards */}
        <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'20px', marginBottom:'16px' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px', marginBottom:'16px', color:'#9CA3AF', letterSpacing:'0.5px', textTransform:'uppercase', fontSize:'11px' }}>🕐 Yesterday's Activity</div>
          {YESTERDAY.map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom: i < YESTERDAY.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px' }}>{a.text}</div>
                <div style={{ fontSize:'11px', color:'#6B7280', marginTop:'2px' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable: Stats */}
        <Section title="📊 System Statistics" open={open.stats} onToggle={() => toggle('stats')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'10px', marginTop:'8px' }}>
            <StatCard icon="👥" label="Employees"  value={stats.employees} color="#FF6B35" />
            <StatCard icon="📋" label="Total"      value={stats.total}     color="#00D4FF" />
            <StatCard icon="⏳" label="Pending"    value={stats.pending}   color="#FFD600" />
            <StatCard icon="✅" label="Approved"   value={stats.approved}  color="#00E676" />
            <StatCard icon="❌" label="Rejected"   value={stats.rejected}  color="#FF3D71" />
          </div>
        </Section>

        {/* Expandable: Recent Requests */}
        <Section title="📋 Recent Requests" open={open.requests} onToggle={() => toggle('requests')} count={stats.pending}>
          <div style={{ overflowX:'auto', marginTop:'8px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                {['Employee','Type','Status','Action'].map(h => <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'#6B7280', fontWeight:'600' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.slice(0,4).map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'10px 12px' }}>{r.employee}</td>
                    <td style={{ padding:'10px 12px', color:'#9CA3AF', fontSize:'12px' }}>{r.type}</td>
                    <td style={{ padding:'10px 12px' }}><Badge status={r.status} /></td>
                    <td style={{ padding:'10px 12px' }}><button onClick={() => setSelected(r)} style={{ padding:'4px 12px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#F9FAFB', cursor:'pointer', fontSize:'11px' }}>Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Expandable: Activity */}
        <Section title="🕒 Live Activity Feed" open={open.activity} onToggle={() => toggle('activity')}>
          <div style={{ marginTop:'8px' }}><ActivityFeed /></div>
        </Section>
      </div>
    );
  };

  return (
    <DashboardLayout navItems={NAV.map(n => ({ ...n, onClick: () => setActiveTab(n.key) }))} role="admin" activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}

      {/* Manage Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' }}>
          <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'460px' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'18px', marginBottom:'20px' }}>Manage Request</div>
            {[['Request ID', selected.request_no],['Employee', selected.employee],['Type', selected.type],['Status', selected.status]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'13px' }}>
                <span style={{ color:'#6B7280' }}>{k}</span><span style={{ fontWeight:'600' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', marginBottom:'16px' }}>
              <label style={{ fontSize:'12px', color:'#6B7280', display:'block', marginBottom:'6px' }}>REVIEW NOTE</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add a note..." style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'10px', color:'#F9FAFB', fontSize:'13px', outline:'none', resize:'none', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => handleAction('approved')} style={{ flex:1, padding:'12px', borderRadius:'10px', background:'linear-gradient(135deg,#00E676,#00A854)', border:'none', color:'#0A0F1E', fontFamily:'Syne,sans-serif', fontWeight:'700', cursor:'pointer' }}>✅ Approve</button>
              <button onClick={() => handleAction('rejected')} style={{ flex:1, padding:'12px', borderRadius:'10px', background:'linear-gradient(135deg,#FF3D71,#CC0044)', border:'none', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:'700', cursor:'pointer' }}>❌ Reject</button>
              <button onClick={() => setSelected(null)} style={{ padding:'12px 16px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#9CA3AF', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;