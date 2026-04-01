import React, { useState, useEffect, useRef } from 'react';

const INITIAL_MESSAGES = [
  { id: 1, from: 'HR Dept',      msg: '3 new clearance requests need your approval.', me: false, time: '8:30 AM', role: 'hr' },
  { id: 2, from: 'You',          msg: "On it — reviewing now.",                        me: true,  time: '8:35 AM', role: 'manager' },
  { id: 3, from: 'Admin',        msg: 'Board meeting prep deck due by 2pm today.',     me: false, time: '9:00 AM', role: 'admin' },
];

const AUTO_REPLIES = [
  { from: 'HR Dept',  msg: "Thanks! Sarah's resignation clearance is also pending.",         role: 'hr' },
  { from: 'Admin',    msg: 'Reminder: quarterly review submissions close Friday.',            role: 'admin' },
  { from: 'Employee', msg: 'Hi, could you approve my travel clearance request? REQ-00421',   role: 'employee' },
];

const ROLE_COLORS = { hr: '#00E676', manager: '#00D4FF', admin: '#FFD600', employee: '#FF6B35' };

const KPI_DATA = [
  { label: 'Team Output',   value: 87, target: 80,  unit: '%', good: true  },
  { label: 'Approvals',     value: 4,  target: 10,  unit: '',  good: false },
  { label: 'Attendance',    value: 92, target: 90,  unit: '%', good: true  },
  { label: 'Pending Tasks', value: 14, target: 10,  unit: '',  good: false },
  { label: 'SLA Met',       value: 96, target: 95,  unit: '%', good: true  },
];

const TIMELINE_TODAY = [
  { time: '08:30', label: 'Review pending approvals',  type: 'task',    done: true  },
  { time: '09:30', label: 'Department standup',         type: 'meeting', done: true  },
  { time: '11:00', label: 'Budget review with Finance', type: 'meeting', done: false },
  { time: '13:00', label: 'Performance reviews due',    type: 'task',    done: false, urgent: true },
  { time: '14:00', label: 'Board meeting prep',         type: 'meeting', done: false },
  { time: '16:00', label: 'Team 1-on-1s',               type: 'meeting', done: false },
];

const GOALS = [
  { label: 'Team clearance approval rate', value: 85, good: true  },
  { label: 'Pending request backlog',      value: 42, good: false },
  { label: 'Team attendance this month',   value: 92, good: true  },
  { label: 'Performance reviews complete', value: 60, good: false },
];

const CALENDAR_EVENTS = [1, 3, 7, 10, 13, 15, 20, 24, 28];
const TODAY_DATE  = new Date().getDate();
const MONTH_START = 2;

function KPIBadge({ good, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: good ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.15)',
      color: good ? '#00E676' : '#FF5252',
      border: `1px solid ${good ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: good ? '#00E676' : '#FF5252', boxShadow: good ? '0 0 6px #00E676' : '0 0 6px #FF5252', flexShrink: 0 }} />
      {label}
    </span>
  );
}

function YesterdayChart({ visible }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#0a0a0a,#111)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: '#00E676' }}>📊 Team KPI — Yesterday</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>vs. department targets</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <KPIBadge good label="Met" />
          <KPIBadge good={false} label="Missed" />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
        {KPI_DATA.map((d, i) => {
          const pct  = Math.min(100, (d.value / (d.target * 1.2)) * 100);
          const barH = visible ? Math.round((pct / 100) * 80) : 0;
          const color = d.good ? '#00E676' : '#FF5252';
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color }}>{d.value}{d.unit}</span>
              <div style={{ width: '100%', height: 80, display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', height: barH, borderRadius: '4px 4px 0 0', background: color, boxShadow: `0 0 8px ${color}55`, transition: `height .7s cubic-bezier(.4,0,.2,1) ${i * 100}ms` }} />
              </div>
              <span style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.3 }}>{d.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 8, background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', fontSize: 12, color: 'var(--muted)' }}>
        <span style={{ color: '#00E676', fontWeight: 700 }}>Team performance: </span>
        3 of 5 metrics on target — action needed on <span style={{ color: '#FF5252', fontWeight: 600 }}>Approvals & Pending Tasks</span>.
      </div>
    </div>
  );
}

function TodayTimeline() {
  const tc = { meeting: '#00D4FF', task: '#00E676', break: '#FFD600' };
  const ti = { meeting: '🤝', task: '📋', break: '☕' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {TIMELINE_TODAY.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: item.urgent ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${item.urgent ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.06)'}`, opacity: item.done ? 0.5 : 1 }}>
          <span style={{ fontSize: 12, minWidth: 42, color: 'var(--muted)' }}>{item.time}</span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: item.done ? 'var(--muted)' : tc[item.type], boxShadow: item.done ? 'none' : `0 0 6px ${tc[item.type]}` }} />
          <span style={{ fontSize: 11, flex: 1 }}>{ti[item.type]} {item.label}</span>
          {item.urgent && <span style={{ fontSize: 9, color: '#FF6B35', fontWeight: 700, background: 'rgba(255,107,53,0.15)', padding: '2px 6px', borderRadius: 10 }}>URGENT</span>}
          {item.done && <span style={{ fontSize: 9, color: '#00E676' }}>✓</span>}
        </div>
      ))}
    </div>
  );
}

function GoalProgress() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {GOALS.map((g, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11 }}>{g.label}</span>
            <KPIBadge good={g.good} label={`${g.value}%`} />
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, width: `${g.value}%`, background: g.good ? '#00E676' : '#FF5252', boxShadow: g.good ? '0 0 6px rgba(0,230,118,0.4)' : '0 0 6px rgba(255,82,82,0.4)', transition: 'width 1s cubic-bezier(.4,0,.2,1)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center', marginBottom: 4 }}>
        {days.map(d => <div key={d} style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700 }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {Array.from({ length: MONTH_START }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: 30 }, (_, i) => i + 1).map(n => {
          const isToday  = n === TODAY_DATE;
          const hasEvent = CALENDAR_EVENTS.includes(n);
          return (
            <div key={n} style={{ fontSize: 10, padding: '3px 1px', borderRadius: 4, background: isToday ? '#00E676' : hasEvent ? 'rgba(0,230,118,0.12)' : 'transparent', color: isToday ? '#000' : hasEvent ? '#00E676' : 'inherit', fontWeight: isToday || hasEvent ? 700 : 400 }}>{n}</div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: 'var(--muted)' }}>🟢 {CALENDAR_EVENTS.length} events this month</div>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef(null);
  const replyIdx                = useRef(0);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(p => [...p, { id: Date.now(), from: 'You', msg: input.trim(), me: true, time: now, role: 'manager' }]);
    setInput('');
    const r = AUTO_REPLIES[replyIdx.current % AUTO_REPLIES.length]; replyIdx.current++;
    setTyping(true);
    setTimeout(() => { setTyping(false); setMessages(p => [...p, { id: Date.now()+1, from: r.from, msg: r.msg, me: false, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), role: r.role }]); }, 1400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#0a0a0a', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 14, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,230,118,0.05)' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: '#00E676' }}>💬 Department Chat</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 6px #00E676', display: 'inline-block' }} />
          <span style={{ fontSize: 10, color: '#00E676' }}>5 online</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.me ? 'flex-end' : 'flex-start' }}>
            {!m.me && <span style={{ fontSize: 9, color: ROLE_COLORS[m.role] || 'var(--muted)', marginBottom: 2, fontWeight: 700 }}>{m.from}</span>}
            <div style={{ maxWidth: '82%', padding: '7px 11px', borderRadius: 10, fontSize: 12, lineHeight: 1.5, borderBottomRightRadius: m.me ? 3 : 10, borderBottomLeftRadius: m.me ? 10 : 3, background: m.me ? 'linear-gradient(135deg,#00E676,#00c853)' : 'rgba(255,255,255,0.06)', border: m.me ? 'none' : '1px solid rgba(255,255,255,0.08)', color: m.me ? '#000' : 'var(--text)' }}>{m.msg}</div>
            <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{m.time}</span>
          </div>
        ))}
        {typing && <div style={{ display: 'flex', gap: 3, padding: '8px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, width: 'fit-content' }}>{[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#00E676', animation: `typingDot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Message your team..." style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--text)', outline: 'none' }} />
        <button onClick={send} style={{ background: '#00E676', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#000' }}>→</button>
      </div>
    </div>
  );
}

function ManagerDayOverview({ onEnter }) {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const handleEnter = () => { setLeaving(true); setTimeout(() => onEnter(), 500); };

  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        @keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-4px);opacity:1} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .mgr-ov-root { animation: fadeSlideIn .4s ease both; }
        .mgr-ov-root.leaving { animation: fadeSlideIn .4s ease reverse both; }
        .mgr-enter-btn { background: linear-gradient(135deg,#00E676,#00c853); border:none; border-radius:10px; padding:12px 28px; font-family:Syne,sans-serif; font-weight:700; font-size:14px; color:#000; cursor:pointer; transition:opacity .15s,transform .15s; box-shadow:0 4px 20px rgba(0,230,118,0.4); }
        .mgr-enter-btn:hover { opacity:.9; transform:translateY(-1px); }
        .mgr-section { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; }
        .mgr-section-title { font-family:Syne,sans-serif; font-weight:700; font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:12px; }
      `}</style>
      <div className={`mgr-ov-root${leaving ? ' leaving' : ''}`} style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: 'var(--bg,#0d0d0d)', zIndex: 20, padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22 }}>{greeting}, {user.name?.split(' ')[0] || 'Manager'} 👋</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{dateStr}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <KPIBadge good label="Team on track" />
              <KPIBadge good={false} label="3 pending approvals" />
              <KPIBadge good label="4 meetings today" />
            </div>
          </div>
          <button className="mgr-enter-btn" onClick={handleEnter}>Enter Dashboard →</button>
        </div>
        <YesterdayChart visible={visible} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div className="mgr-section"><div className="mgr-section-title">🕐 Today's Schedule</div><TodayTimeline /></div>
          <div className="mgr-section">
            <div className="mgr-section-title">🎯 Team Goals</div>
            <GoalProgress />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              {[{ icon:'👥', label:'Team Size', value:'12', color:'#00D4FF' },{ icon:'✅', label:'Approved', value:'7', color:'#00E676' },{ icon:'⏳', label:'Pending', value:'3', color:'#FFD600' },{ icon:'🚨', label:'Escalated', value:'1', color:'#FF5252' }].map((s,i) => (
                <div key={i} style={{ padding:10, borderRadius:8, background:`${s.color}10`, border:`1px solid ${s.color}25`, textAlign:'center' }}>
                  <div style={{ fontSize:18 }}>{s.icon}</div>
                  <div style={{ fontSize:18, fontWeight:800, fontFamily:'Syne,sans-serif', color:s.color, lineHeight:1.2 }}>{s.value}</div>
                  <div style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mgr-section"><div className="mgr-section-title">📅 {now.toLocaleString('default',{month:'long',year:'numeric'})}</div><MiniCalendar /></div>
        </div>
        <div style={{ height: 300 }}><ChatPanel /></div>
      </div>
    </>
  );
}

export default ManagerDayOverview;