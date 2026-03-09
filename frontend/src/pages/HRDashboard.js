import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from '../components/StatCard';
import FeedbackViewer from '../components/FeedbackViewer';

const SAMPLE = [
  { id:1, request_no:'REQ-001', employee:'Soyian Mumbi',   type:'Resignation Clearance', urgency:'urgent',   status:'pending',    review_note:'' },
  { id:2, request_no:'REQ-002', employee:'Kosiom Naikumi', type:'Travel Clearance',       urgency:'normal',   status:'approved',   review_note:'Cleared' },
  { id:3, request_no:'REQ-003', employee:'Seela Stacy',    type:'Leave Clearance',        urgency:'normal',   status:'processing', review_note:'' },
  { id:4, request_no:'REQ-004', employee:'Resian Camila',  type:'Training Clearance',     urgency:'critical', status:'pending',    review_note:'' },
];

const YESTERDAY = [
  { icon:'📋', text:'4 new requests submitted by employees',   time:'Yesterday 9:00 AM',  color:'#00D4FF' },
  { icon:'✅', text:'You approved Seela Stacy Leave Clearance', time:'Yesterday 11:00 AM', color:'#00E676' },
  { icon:'🔄', text:'Kosiom request moved to processing',       time:'Yesterday 2:30 PM',  color:'#FFD600' },
  { icon:'❌', text:'1 request rejected — missing documents',   time:'Yesterday 4:00 PM',  color:'#FF3D71' },
];

const NAV = [
  { key:'overview',  icon:'🏠', label:'Overview'  },
  { key:'requests',  icon:'📋', label:'All Requests' },
  { key:'feedback',  icon:'💬', label:'Feedback'  },
];

function Badge({ status }) {
  const s = { pending:'#FFD600', approved:'#00E676', rejected:'#FF3D71', processing:'#00D4FF', urgent:'#FF6B35', critical:'#FF3D71', normal:'#6B7280' };
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

function HRDashboard() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [requests, setRequests] = useState(SAMPLE);
  const [selected, setSelected] = useState(null);
  const [note, setNote]         = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [open, setOpen] = useState({ stats:false, pending:false, all:false });
  const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => r.status==='pending').length,
    approved: requests.filter(r => r.status==='approved').length,
    rejected: requests.filter(r => r.status==='rejected').length,
  };

  const handleAction = (status) => {
    setRequests(prev => prev.map(r => r.id === selected.id ? { ...r, status, review_note: note } : r));
    setSelected(null); setNote('');
  };

  const renderContent = () => {
    if (activeTab === 'requests') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>All Requests 📋</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>Review and manage clearance requests</div>
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['ID','Employee','Type','Urgency','Status','Action'].map(h => <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'var(--muted)', fontWeight:'600', whiteSpace:'nowrap' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'12px 16px', color:'#00D4FF', fontFamily:'monospace', fontSize:'12px' }}>{r.request_no}</td>
                    <td style={{ padding:'12px 16px' }}>{r.employee}</td>
                    <td style={{ padding:'12px 16px', color:'var(--muted)' }}>{r.type}</td>
                    <td style={{ padding:'12px 16px' }}><Badge status={r.urgency} /></td>
                    <td style={{ padding:'12px 16px' }}><Badge status={r.status} /></td>
                    <td style={{ padding:'12px 16px' }}><button onClick={() => setSelected(r)} style={{ padding:'5px 14px', borderRadius:'8px', border:'1px solid var(--border)', background:'rgba(255,255,255,0.05)', color:'var(--text)', cursor:'pointer', fontSize:'12px' }}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    if (activeTab === 'feedback') return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>Feedback 💬</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>Employee feedback and ratings</div>
        <FeedbackViewer />
      </div>
    );

    // OVERVIEW
    return (
      <div>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'24px', marginBottom:'4px', color:'var(--text)' }}>Welcome back, {user.name?.split(' ')[0]} 👋</div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'20px' }}>Here's a quick snapshot of yesterday</div>

        {/* Mini stat strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }}>
          {[['📋','Total',stats.total,'#00D4FF'],['⏳','Pending',stats.pending,'#FFD600'],['✅','Approved',stats.approved,'#00E676'],['❌','Rejected',stats.rejected,'#FF3D71']].map(([icon,label,val,color]) => (
            <div key={label} style={{ background:'var(--card-bg)', border:`1px solid ${color}25`, borderRadius:'12px', padding:'14px', textAlign:'center' }}>
              <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'22px', color }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Yesterday */}
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

        {/* Expandable: Pending */}
        <Section title="⏳ Pending — Needs Your Review" open={open.pending} onToggle={() => toggle('pending')} count={stats.pending}>
          <div style={{ overflowX:'auto', marginTop:'8px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Employee','Type','Urgency','Action'].map(h => <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'var(--muted)', fontWeight:'600' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.filter(r => r.status==='pending').map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 12px', fontWeight:'500' }}>{r.employee}</td>
                    <td style={{ padding:'10px 12px', color:'var(--muted)', fontSize:'12px' }}>{r.type}</td>
                    <td style={{ padding:'10px 12px' }}><Badge status={r.urgency} /></td>
                    <td style={{ padding:'10px 12px' }}><button onClick={() => setSelected(r)} style={{ padding:'4px 14px', borderRadius:'8px', background:'linear-gradient(135deg,#00D4FF,#0055FF)', border:'none', color:'#0A0F1E', fontFamily:'Syne,sans-serif', fontWeight:'700', cursor:'pointer', fontSize:'11px' }}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Expandable: All */}
        <Section title="📋 All Requests" open={open.all} onToggle={() => toggle('all')}>
          <div style={{ overflowX:'auto', marginTop:'8px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Employee','Type','Status','Action'].map(h => <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'var(--muted)', fontWeight:'600' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 12px' }}>{r.employee}</td>
                    <td style={{ padding:'10px 12px', color:'var(--muted)', fontSize:'12px' }}>{r.type}</td>
                    <td style={{ padding:'10px 12px' }}><Badge status={r.status} /></td>
                    <td style={{ padding:'10px 12px' }}><button onClick={() => setSelected(r)} style={{ padding:'4px 12px', borderRadius:'8px', border:'1px solid var(--border)', background:'rgba(255,255,255,0.05)', color:'var(--text)', cursor:'pointer', fontSize:'11px' }}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  };

  return (
    <DashboardLayout navItems={NAV.map(n => ({ ...n, onClick: () => setActiveTab(n.key) }))} role="hr" activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' }}>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'460px' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', fontSize:'18px', marginBottom:'20px' }}>Review Request</div>
            {[['Request ID', selected.request_no],['Employee', selected.employee],['Type', selected.type],['Urgency', selected.urgency],['Status', selected.status]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:'13px' }}>
                <span style={{ color:'var(--muted)' }}>{k}</span><span style={{ fontWeight:'600' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', marginBottom:'16px' }}>
              <label style={{ fontSize:'12px', color:'var(--muted)', display:'block', marginBottom:'6px' }}>REVIEW NOTE</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add a note..." style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:'10px', padding:'10px', color:'var(--text)', fontSize:'13px', outline:'none', resize:'none', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }} />
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

export default HRDashboard;