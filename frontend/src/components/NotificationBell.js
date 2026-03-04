import React, { useState, useEffect, useRef } from 'react';

const NOTIFS_BY_ROLE = {
  employee: [
    { id:1, message:'Your Travel Clearance was approved ✅',       time:'2 mins ago', read:false, type:'success' },
    { id:2, message:'Your Leave Clearance is being processed 🔄',  time:'1 hr ago',   read:false, type:'info' },
    { id:3, message:'Your Resignation request was received 📋',    time:'Yesterday',  read:true,  type:'info' },
  ],
  hr: [
    { id:1, message:'New clearance request needs your review 📋',  time:'2 mins ago', read:false, type:'warning' },
    { id:2, message:'Kosiom Naikumi submitted a Leave Clearance',  time:'1 hr ago',   read:false, type:'info' },
    { id:3, message:'Resian Camila submitted a Travel Clearance',  time:'3 hrs ago',  read:false, type:'info' },
    { id:4, message:'Soyian Mumbi clearance approved ✅',          time:'Yesterday',  read:true,  type:'success' },
  ],
  manager: [
    { id:1, message:'Soyian Mumbi submitted a Leave Clearance 📋', time:'5 mins ago', read:false, type:'warning' },
    { id:2, message:'Kosiom Naikumi travel request is pending ⏳', time:'2 hrs ago',  read:false, type:'info' },
    { id:3, message:'Resian Camila request was approved ✅',       time:'Yesterday',  read:true,  type:'success' },
  ],
  admin: [
    { id:1, message:'3 requests pending approval ⏳',              time:'10 mins ago',read:false, type:'warning' },
    { id:2, message:'Seela Stacy resignation submitted 📝',        time:'1 hr ago',   read:false, type:'info' },
    { id:3, message:'New user account created 👤',                 time:'2 hrs ago',  read:false, type:'info' },
    { id:4, message:'System backup completed ✅',                  time:'Yesterday',  read:true,  type:'success' },
    { id:5, message:'Monthly report is ready 📊',                  time:'2 days ago', read:true,  type:'info' },
  ],
};

function NotificationBell() {
  const user        = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const roleNotifs  = NOTIFS_BY_ROLE[user.role] || [];
  const [open, setOpen]     = useState(false);
  const [notifs, setNotifs] = useState(roleNotifs);
  const ref = useRef(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read:true })));
  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read:true } : n));

  const typeColors = { success:'#00E676', warning:'#FFD600', info:'#00D4FF' };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: open ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', width:'38px', height:'38px',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', position:'relative', transition:'all 0.2s',
          fontSize:'17px',
        }}
      >
        🔔
        {unread > 0 && (
          <div style={{
            position:'absolute', top:'-4px', right:'-4px',
            width:'18px', height:'18px', borderRadius:'50%',
            background:'#FF3D71', color:'white',
            fontSize:'10px', fontWeight:'700',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'2px solid #0A0F1E',
          }}>
            {unread}
          </div>
        )}
      </button>

      {open && (
        <div style={{
          position:'absolute', top:'46px', right:'0',
          width:'320px', background:'#111827',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'16px', zIndex:1000,
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
          overflow:'hidden',
        }}>
          <div style={{ padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px' }}>
              Notifications {unread > 0 && <span style={{ color:'#FF3D71', fontSize:'13px' }}>({unread})</span>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ background:'none', border:'none', color:'#00D4FF', fontSize:'12px', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight:'340px', overflowY:'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding:'32px', textAlign:'center', color:'#9CA3AF', fontSize:'13px' }}>No notifications</div>
            ) : (
              notifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    padding:'14px 18px', cursor:'pointer',
                    background: n.read ? 'transparent' : 'rgba(255,255,255,0.03)',
                    borderBottom:'1px solid rgba(255,255,255,0.04)',
                    display:'flex', gap:'12px', alignItems:'flex-start',
                    transition:'background 0.2s',
                  }}
                >
                  <div style={{
                    width:'8px', height:'8px', borderRadius:'50%',
                    background: n.read ? 'transparent' : typeColors[n.type],
                    flexShrink:0, marginTop:'5px',
                    boxShadow: n.read ? 'none' : `0 0 6px ${typeColors[n.type]}`,
                  }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', color: n.read ? '#9CA3AF' : '#F9FAFB', lineHeight:'1.5' }}>{n.message}</div>
                    <div style={{ fontSize:'11px', color:'#6B7280', marginTop:'4px' }}>{n.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:'#9CA3AF', fontSize:'12px', cursor:'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;