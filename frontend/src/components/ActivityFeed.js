import React, { useState, useEffect } from 'react';

const SAMPLE_ACTIVITIES = [
  { id:1, action:'submitted',  name:'Soyian Mumbi',    type:'Leave Clearance',       time:'2 mins ago',  color:'#00D4FF', icon:'ðŸ“‹' },
  { id:2, action:'approved',   name:'Kosiom Naikumi',  type:'Travel Clearance',      time:'15 mins ago', color:'#00E676', icon:'âœ…' },
  { id:3, action:'rejected',   name:'Seela Stacy',     type:'Equipment Return',      time:'1 hr ago',    color:'#FF3D71', icon:'âŒ' },
  { id:4, action:'submitted',  name:'Resian Camila',   type:'Training Clearance',    time:'2 hrs ago',   color:'#00D4FF', icon:'ðŸ“‹' },
  { id:5, action:'processing', name:'Nempiris Kiti',   type:'Resignation Clearance', time:'3 hrs ago',   color:'#FFD600', icon:'ðŸ”„' },
  { id:6, action:'approved',   name:'Soyian Mumbi',    type:'Final Exit Clearance',  time:'Yesterday',   color:'#00E676', icon:'âœ…' },
  { id:7, action:'submitted',  name:'Kosiom Naikumi',  type:'Leave Clearance',       time:'Yesterday',   color:'#00D4FF', icon:'ðŸ“‹' },
];

function ActivityFeed() {
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? activities : activities.filter(a => a.action === filter);

  const actionText = { submitted:'submitted a', approved:'was approved for', rejected:'was rejected for', processing:'is processing' };

  return (
    <div style={{
      background:'#111827',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:'16px',
      overflow:'hidden',
    }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px' }}>
          ðŸ•’ Live Activity Feed
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {['all','submitted','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'4px 12px', borderRadius:'20px', border:'none', cursor:'pointer',
              background: filter===f ? '#00D4FF' : 'rgba(255,255,255,0.06)',
              color: filter===f ? '#0A0F1E' : '#9CA3AF',
              fontSize:'11px', fontWeight:'600', textTransform:'capitalize',
              fontFamily:'DM Sans,sans-serif',
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight:'360px', overflowY:'auto' }}>
        {filtered.map((a, i) => (
          <div key={a.id} style={{
            display:'flex', alignItems:'flex-start', gap:'12px',
            padding:'14px 20px',
            borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            animation:'fadeUp 0.3s ease both',
            animationDelay:`${i * 0.05}s`,
          }}>
            <div style={{
              width:'36px', height:'36px', borderRadius:'10px', flexShrink:0,
              background:`${a.color}15`, border:`1px solid ${a.color}30`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px',
            }}>
              {a.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'13px', lineHeight:'1.5' }}>
                <strong style={{ color:'#F9FAFB' }}>{a.name}</strong>
                <span style={{ color:'#9CA3AF' }}> {actionText[a.action]} </span>
                <span style={{ color: a.color, fontWeight:'600' }}>{a.type}</span>
              </div>
              <div style={{ fontSize:'11px', color:'#6B7280', marginTop:'3px' }}>{a.time}</div>
            </div>
            <div style={{
              padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:'700',
              background:`${a.color}15`, color:a.color, flexShrink:0, textTransform:'capitalize',
            }}>
              {a.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
