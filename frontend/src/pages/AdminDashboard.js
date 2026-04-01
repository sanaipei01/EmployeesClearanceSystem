 import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import AdminDayOverview from '../components/dayoverview/AdminDayOverview';

const ALL_REQUESTS = [
  { id:1, request_no:'REQ-001', employee:'Soyian Mumbi',   type:'Resignation Clearance', urgency:'urgent',   status:'pending',    manager:'Nempiris Kiti', review_note:'' },
  { id:2, request_no:'REQ-002', employee:'Kosiom Naikumi', type:'Travel Clearance',       urgency:'normal',   status:'approved',   manager:'Nempiris Kiti', review_note:'Cleared' },
  { id:3, request_no:'REQ-003', employee:'Seela Stacy',    type:'Leave Clearance',        urgency:'normal',   status:'processing', manager:'Nempiris Kiti', review_note:'' },
  { id:4, request_no:'REQ-004', employee:'Resian Camila',  type:'Training Clearance',     urgency:'critical', status:'pending',    manager:'Nempiris Kiti', review_note:'' },
  { id:5, request_no:'REQ-005', employee:'Baraka Omondi',  type:'Final Exit Clearance',   urgency:'urgent',   status:'rejected',   manager:'Nempiris Kiti', review_note:'Missing IT sign-off' },
  { id:6, request_no:'REQ-006', employee:'Zawadi Muthoni', type:'Equipment Return',        urgency:'normal',   status:'approved',   manager:'Nempiris Kiti', review_note:'All returned' },
];

const ALL_USERS = [
  { id:1, name:'Kamau Njoroge',  username:'admin',    role:'admin',    status:'active',   last:'Just now'    },
  { id:2, name:'Aisha Mwangi',   username:'hr',       role:'hr',       status:'active',   last:'2 mins ago'  },
  { id:3, name:'Nempiris Kiti',  username:'manager',  role:'manager',  status:'active',   last:'5 mins ago'  },
  { id:4, name:'Soyian Mumbi',   username:'employee', role:'employee', status:'active',   last:'12 mins ago' },
  { id:5, name:'Kosiom Naikumi', username:'kosiom',   role:'employee', status:'inactive', last:'Yesterday'   },
  { id:6, name:'Seela Stacy',    username:'seela',    role:'employee', status:'active',   last:'1 hour ago'  },
];

const YESTERDAY = [
  { icon:'📋', text:'6 total clearance requests in the system',      time:'Yesterday 8:00 AM',  color:'#00D4FF' },
  { icon:'✅', text:'2 requests approved by manager',                 time:'Yesterday 10:00 AM', color:'#00E676' },
  { icon:'❌', text:'1 request rejected — missing IT sign-off',       time:'Yesterday 1:00 PM',  color:'#FF3D71' },
  { icon:'👤', text:'New user account created for Zawadi Muthoni',    time:'Yesterday 3:00 PM',  color:'#A78BFA' },
  { icon:'🔒', text:'Security audit passed — all systems nominal',    time:'Yesterday 5:00 PM',  color:'#FFD600' },
];

const NAV = [
  { key:'overview', icon:'🏠', label:'Overview'      },
  { key:'requests', icon:'📋', label:'All Requests'  },
  { key:'users',    icon:'👥', label:'User Management'},
  { key:'reports',  icon:'📊', label:'Reports'        },
];

const ROLE_COLORS = {
  admin:'#FF3D71', hr:'#00D4FF', manager:'#A78BFA', employee:'#00E676',
};

function Badge({ status }) {
  const s = { pending:'#FFD600', approved:'#00E676', rejected:'#FF3D71', processing:'#00D4FF', urgent:'#FF6B35', critical:'#FF3D71', normal:'#6B7280', active:'#00E676', inactive:'#6B7280', admin:'#FF3D71', hr:'#00D4FF', manager:'#A78BFA', employee:'#00E676' };
  return <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:`${s[status]||'#6B7280'}20`, color:s[status]||'#6B7280', border:`1px solid ${s[status]||'#6B7280'}40` }}>{status}</span>;
}

function Section({ title, open, onToggle, children, count }) {
  return (
    <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', marginBottom:'12px' }}>
      <button onClick={onToggle} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px' }}>
        <span>{title} {count !== undefined && <span style={{ color:'#FFD600', fontSize:'12px' }}>({count})</span>}</span>
        <span style={{ transition:'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0)', color:'var(--muted)' }}>▼</span>
      </button>
      {open && <div style={{ padding:'4px 20px 20px' }}>{children}</div>}
    </div>
  );
}

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [showDayOverview, setShowDayOverview] = useState(true);
  const [requests, setRequests]   = useState(ALL_REQUESTS);
  const [users, setUsers]         = useState(ALL_USERS);
  const [selected, setSelected]   = useState(null);
  const [note, setNote]           = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [open, setOpen]           = useState({ requests:false, users:false });
  const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));

  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => r.status==='pending').length,
    approved:   requests.filter(r => r.status==='approved').length,
    rejected:   requests.filter(r => r.status==='rejected').length,
    users:      users.length,
    active:     users.filter(u => u.status==='active').length,
  };

  const handleAction = (status) => {
    setRequests(prev => prev.map(r => r.id === selected.id ? { ...r, status, review_note: note } : r));
    setSelected(null); setNote('');
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const renderContent = () => {

    // ── ALL REQUESTS TAB ──────────────────────────────────────────────────────
    if (activeTab === 'requests') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>All Requests 📋</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>System-wide view of every clearance request</div>

        {/* Stats strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'20px' }}>
          {[['📋','Total',stats.total,'#00D4FF'],['⏳','Pending',stats.pending,'#FFD600'],['✅','Approved',stats.approved,'#00E676'],['❌','Rejected',stats.rejected,'#FF3D71']].map(([icon,label,val,color]) => (
            <div key={label} style={{ background:'var(--card-bg)', border:`1px solid ${color}25`, borderRadius:'12px', padding:'14px', textAlign:'center' }}>
              <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'22px', color }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['ID','Employee','Type','Urgency','Status','Manager','Action'].map(h => <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'var(--muted)', fontWeight:'600', whiteSpace:'nowrap' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'12px 16px', color:'#FF3D71', fontFamily:'monospace', fontSize:'12px' }}>{r.request_no}</td>
                    <td style={{ padding:'12px 16px', fontWeight:'500' }}>{r.employee}</td>
                    <td style={{ padding:'12px 16px', color:'var(--muted)', fontSize:'12px' }}>{r.type}</td>
                    <td style={{ padding:'12px 16px' }}><Badge status={r.urgency} /></td>
                    <td style={{ padding:'12px 16px' }}><Badge status={r.status} /></td>
                    <td style={{ padding:'12px 16px', color:'var(--muted)', fontSize:'12px' }}>{r.manager}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <button onClick={() => setSelected(r)} style={{ padding:'5px 14px', borderRadius:'8px', border:'1px solid var(--border)', background:'rgba(255,255,255,0.05)', color:'var(--text)', cursor:'pointer', fontSize:'12px' }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ── USER MANAGEMENT TAB ───────────────────────────────────────────────────
    if (activeTab === 'users') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>User Management 👥</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>Manage all system users and their access</div>

        {/* User stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'20px' }}>
          {[['👥','Total Users',stats.users,'#00D4FF'],['✅','Active',stats.active,'#00E676'],['⛔','Inactive',stats.users-stats.active,'#FF3D71']].map(([icon,label,val,color]) => (
            <div key={label} style={{ background:'var(--card-bg)', border:`1px solid ${color}25`, borderRadius:'12px', padding:'14px', textAlign:'center' }}>
              <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'22px', color }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {users.map(u => (
            <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px', background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'14px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:`${ROLE_COLORS[u.role]}15`, color:ROLE_COLORS[u.role], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'18px', flexShrink:0 }}>
                {u.name[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:'600', fontSize:'14px' }}>{u.name}</div>
                <div style={{ color:'var(--muted)', fontSize:'12px', marginTop:'2px' }}>@{u.username} · Last active: {u.last}</div>
              </div>
              <Badge status={u.role} />
              <Badge status={u.status} />
              <button
                onClick={() => toggleUserStatus(u.id)}
                style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid var(--border)', background: u.status === 'active' ? 'rgba(255,61,113,0.1)' : 'rgba(0,230,118,0.1)', color: u.status === 'active' ? '#FF3D71' : '#00E676', cursor:'pointer', fontSize:'12px', fontWeight:'600', whiteSpace:'nowrap' }}
              >
                {u.status === 'active' ? '⛔ Deactivate' : '✅ Activate'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );

    // ── REPORTS TAB ───────────────────────────────────────────────────────────
    if (activeTab === 'reports') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>Reports 📊</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>System-wide analytics and performance</div>

        {/* KPI grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'14px', marginBottom:'20px' }}>
          {[
            { title:'Request Completion Rate', value:'67%', sub:'4 of 6 requests resolved', color:'#00E676', icon:'✅' },
            { title:'Average Processing Time',  value:'2.4d', sub:'Down from 3.1 days last month', color:'#00D4FF', icon:'⏱️' },
            { title:'Critical Requests',        value:'1',  sub:'Resian Camila — Training', color:'#FF3D71', icon:'🚨' },
            { title:'Active Users Today',       value:`${stats.active}`, sub:`of ${stats.users} total users`, color:'#A78BFA', icon:'👤' },
          ].map((k,i) => (
            <div key={i} style={{ background:'var(--card-bg)', border:`1px solid ${k.color}25`, borderRadius:'14px', padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                <div style={{ fontSize:'22px' }}>{k.icon}</div>
                <div style={{ fontSize:'12px', color:'var(--muted)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px' }}>{k.title}</div>
              </div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'32px', color:k.color, lineHeight:1 }}>{k.value}</div>
              <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'8px' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Request breakdown */}
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px', marginBottom:'16px' }}>Request Status Breakdown</div>
          {[
            { label:'Approved',   count: stats.approved,  total: stats.total, color:'#00E676' },
            { label:'Pending',    count: stats.pending,   total: stats.total, color:'#FFD600' },
            { label:'Processing', count: requests.filter(r=>r.status==='processing').length, total: stats.total, color:'#00D4FF' },
            { label:'Rejected',   count: stats.rejected,  total: stats.total, color:'#FF3D71' },
          ].map((b,i) => (
            <div key={i} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px' }}>
                <span>{b.label}</span>
                <span style={{ color:'var(--muted)' }}>{b.count} of {b.total}</span>
              </div>
              <div style={{ height:'7px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(b.count/b.total)*100}%`, background:b.color, borderRadius:'4px', boxShadow:`0 0 6px ${b.color}55`, transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // ── OVERVIEW TAB ──────────────────────────────────────────────────────────
    return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>Welcome back, {user.name?.split(' ')[0]} 👋</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'20px' }}>System-wide snapshot from yesterday</div>

        {/* Stats strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }}>
          {[['👥','Users',stats.users,'#A78BFA'],['📋','Requests',stats.total,'#00D4FF'],['⏳','Pending',stats.pending,'#FFD600'],['✅','Approved',stats.approved,'#00E676']].map(([icon,label,val,color]) => (
            <div key={label} style={{ background:'var(--card-bg)', border:`1px solid ${color}25`, borderRadius:'12px', padding:'14px', textAlign:'center' }}>
              <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'22px', color }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Yesterday activity */}
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px', marginBottom:'16px' }}>
          <div style={{ fontSize:'11px', color:'var(--muted)', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'14px' }}>🕐 Yesterday's Activity</div>
          {YESTERDAY.map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom: i < YESTERDAY.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px' }}>{a.text}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable: Pending requests */}
        <Section title="⏳ Pending Requests — System Wide" open={open.requests} onToggle={() => toggle('requests')} count={stats.pending}>
          <div style={{ overflowX:'auto', marginTop:'8px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['ID','Employee','Type','Urgency','Action'].map(h => <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'var(--muted)', fontWeight:'600' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.filter(r => r.status==='pending').map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 12px', color:'#FF3D71', fontFamily:'monospace', fontSize:'12px' }}>{r.request_no}</td>
                    <td style={{ padding:'10px 12px', fontWeight:'500' }}>{r.employee}</td>
                    <td style={{ padding:'10px 12px', color:'var(--muted)', fontSize:'12px' }}>{r.type}</td>
                    <td style={{ padding:'10px 12px' }}><Badge status={r.urgency} /></td>
                    <td style={{ padding:'10px 12px' }}>
                      <button onClick={() => setSelected(r)} style={{ padding:'4px 14px', borderRadius:'8px', background:'linear-gradient(135deg,#FF3D71,#CC0044)', border:'none', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:'700', cursor:'pointer', fontSize:'11px' }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Expandable: Users */}
        <Section title="👥 System Users" open={open.users} onToggle={() => toggle('users')} count={stats.users}>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginTop:'8px' }}>
            {users.map(u => (
              <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px', background:'rgba(255,255,255,0.03)', borderRadius:'10px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`${ROLE_COLORS[u.role]}15`, color:ROLE_COLORS[u.role], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'16px', flexShrink:0 }}>{u.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:'600', fontSize:'13px' }}>{u.name}</div>
                  <div style={{ color:'var(--muted)', fontSize:'11px' }}>@{u.username} · {u.role}</div>
                </div>
                <Badge status={u.status} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  };

  return (
    <DashboardLayout navItems={NAV.map(n => ({ ...n, onClick: () => setActiveTab(n.key) }))} role="admin" activeTab={activeTab} setActiveTab={setActiveTab}>

      {/* ✅ DAY OVERVIEW OVERLAY */}
      {showDayOverview && (
        <AdminDayOverview onEnter={() => setShowDayOverview(false)} />
      )}

      {renderContent()}

      {/* Review modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' }}>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'460px' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'18px', marginBottom:'20px' }}>🔍 Admin Review</div>
            {[['Request ID',selected.request_no],['Employee',selected.employee],['Type',selected.type],['Urgency',selected.urgency],['Manager',selected.manager],['Status',selected.status]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:'13px' }}>
                <span style={{ color:'var(--muted)' }}>{k}</span><span style={{ fontWeight:'600' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', marginBottom:'16px' }}>
              <label style={{ fontSize:'12px', color:'var(--muted)', display:'block', marginBottom:'6px' }}>ADMIN NOTE</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add admin note..." style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:'10px', padding:'10px', color:'var(--text)', fontSize:'13px', outline:'none', resize:'none', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => handleAction('approved')} style={{ flex:1, padding:'12px', borderRadius:'10px', background:'linear-gradient(135deg,#00E676,#00A854)', border:'none', color:'#0A0F1E', fontFamily:'Syne,sans-serif', fontWeight:'700', cursor:'pointer' }}>✅ Approve</button>
              <button onClick={() => handleAction('rejected')} style={{ flex:1, padding:'12px', borderRadius:'10px', background:'linear-gradient(135deg,#FF3D71,#CC0044)', border:'none', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:'700', cursor:'pointer' }}>❌ Reject</button>
              <button onClick={() => setSelected(null)} style={{ padding:'12px 16px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;