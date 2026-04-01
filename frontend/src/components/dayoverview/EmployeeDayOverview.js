import React, { useState, useEffect, useRef } from 'react';

// ─── Chat data (Socket.io-style simulation) ───────────────────────────────────
const INITIAL_MESSAGES = [
  { id: 1, from: 'Maya (HR)',        msg: 'Morning! Training session is at 3pm today.', me: false, time: '8:42 AM', role: 'hr' },
  { id: 2, from: 'You',              msg: 'Thanks, I have it in my calendar!',           me: true,  time: '8:45 AM', role: 'employee' },
  { id: 3, from: 'James (Manager)',  msg: 'Great work on your last clearance report 👍',  me: false, time: '9:01 AM', role: 'manager' },
];

const AUTO_REPLIES = [
  { from: 'Maya (HR)',       msg: 'Also, please submit your timesheet by EOD.',  role: 'hr' },
  { from: 'James (Manager)', msg: 'Team standup in 10 minutes — join when ready.', role: 'manager' },
  { from: 'System',          msg: '🔔 Your Travel Clearance is pending review.',  role: 'admin' },
];

const ROLE_COLORS = {
  hr: '#00E676', manager: '#00D4FF', admin: '#FFD600', employee: '#FF6B35',
};

// ─── KPI data ─────────────────────────────────────────────────────────────────
const KPI_DATA = [
  { label: 'Tasks Done',    value: 8,  target: 10, unit: '',  good: false },
  { label: 'On Time',       value: 95, target: 90, unit: '%', good: true  },
  { label: 'Hours Logged',  value: 7,  target: 8,  unit: 'h', good: false },
  { label: 'Quality Score', value: 98, target: 85, unit: '%', good: true  },
  { label: 'Collaboration', value: 72, target: 80, unit: '%', good: false },
];

const TIMELINE_TODAY = [
  { time: '09:00', label: 'Team standup',             type: 'meeting', done: true  },
  { time: '10:30', label: 'Project sprint block',     type: 'task',    done: true  },
  { time: '12:00', label: 'Lunch break',              type: 'break',   done: false },
  { time: '13:00', label: 'Code review with Maya',    type: 'meeting', done: false },
  { time: '15:00', label: 'Submit weekly report',     type: 'task',    done: false, urgent: true },
  { time: '16:30', label: '1-on-1 with manager',      type: 'meeting', done: false },
];

const GOALS = [
  { label: 'Sprint tasks completed',   value: 72, good: true  },
  { label: 'Bug resolution rate',      value: 55, good: false },
  { label: 'Documentation coverage',  value: 88, good: true  },
  { label: 'Peer review turnaround',   value: 40, good: false },
];

const CALENDAR_EVENTS = [2, 5, 8, 15, 18, 22, 25];
const TODAY_DATE = new Date().getDate();
const MONTH_START_DAY = 2; // Tuesday offset for demo

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPIBadge({ good, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: good ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.15)',
      color: good ? '#00E676' : '#FF5252',
      border: `1px solid ${good ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: good ? '#00E676' : '#FF5252',
        boxShadow: good ? '0 0 6px #00E676' : '0 0 6px #FF5252',
      }} />
      {label}
    </span>
  );
}

function YesterdayChart({ visible }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
      border: '1px solid rgba(0,212,255,0.2)',
      borderRadius: 14, padding: '18px 20px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#00D4FF' }}>
            📊 Yesterday's KPI Performance
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            vs. your targets
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10 }}>
          <KPIBadge good label="Above target" />
          <KPIBadge good={false} label="Below target" />
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
        {KPI_DATA.map((d, i) => {
          const pct = Math.min(100, (d.value / d.target) * 100);
          const barH = visible ? Math.round((pct / 100) * 80) : 0;
          const color = d.good ? '#00E676' : '#FF5252';
          const glow = d.good ? '0 0 8px rgba(0,230,118,0.5)' : '0 0 8px rgba(255,82,82,0.5)';
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color }}>{d.value}{d.unit}</span>
              <div style={{ width: '100%', position: 'relative', height: 80, display: 'flex', alignItems: 'flex-end' }}>
                {/* Target line */}
                <div style={{
                  position: 'absolute', bottom: `${(d.target / (d.target * 1.2)) * 80}px`,
                  width: '100%', height: 1, background: 'rgba(255,255,255,0.15)',
                  borderTop: '1px dashed rgba(255,255,255,0.2)',
                }} />
                <div style={{
                  width: '100%', height: barH,
                  borderRadius: '4px 4px 0 0',
                  background: color,
                  boxShadow: glow,
                  transition: `height 0.7s cubic-bezier(.4,0,.2,1) ${i * 100}ms`,
                }} />
              </div>
              <span style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.3 }}>{d.label}</span>
            </div>
          );
        })}
      </div>

      {/* Overall verdict */}
      <div style={{
        marginTop: 14, padding: '8px 12px', borderRadius: 8,
        background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
        fontSize: 12, color: 'var(--muted)',
      }}>
        <span style={{ color: '#00D4FF', fontWeight: 700 }}>Overall: </span>
        2 of 5 KPIs below target yesterday —
        <span style={{ color: '#FF5252', fontWeight: 600 }}> Hours Logged, Tasks Done & Collaboration</span> need attention today.
      </div>
    </div>
  );
}

function TodayTimeline() {
  const typeColors = { meeting: '#00D4FF', task: '#00E676', break: '#FFD600' };
  const typeIcons  = { meeting: '🤝', task: '📋', break: '☕' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {TIMELINE_TODAY.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8,
          background: item.urgent ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${item.urgent ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.06)'}`,
          opacity: item.done ? 0.5 : 1,
        }}>
          <span style={{ fontSize: 12, minWidth: 42, color: 'var(--muted)' }}>{item.time}</span>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: item.done ? 'var(--muted)' : typeColors[item.type],
            boxShadow: item.done ? 'none' : `0 0 6px ${typeColors[item.type]}`,
          }} />
          <span style={{ fontSize: 11, flex: 1 }}>{typeIcons[item.type]} {item.label}</span>
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
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${g.value}%`,
              background: g.good ? '#00E676' : '#FF5252',
              boxShadow: g.good ? '0 0 6px rgba(0,230,118,0.4)' : '0 0 6px rgba(255,82,82,0.4)',
              transition: 'width 1s cubic-bezier(.4,0,.2,1)',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center', marginBottom: 4 }}>
        {days.map(d => <div key={d} style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, padding: '2px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {Array.from({ length: MONTH_START_DAY }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: 30 }, (_, i) => i + 1).map(n => {
          const isToday   = n === TODAY_DATE;
          const hasEvent  = CALENDAR_EVENTS.includes(n);
          return (
            <div key={n} style={{
              fontSize: 10, padding: '3px 1px', borderRadius: 4,
              background: isToday ? '#00D4FF' : hasEvent ? 'rgba(0,212,255,0.12)' : 'transparent',
              color: isToday ? '#000' : hasEvent ? '#00D4FF' : 'inherit',
              fontWeight: isToday || hasEvent ? 700 : 400,
              cursor: 'default',
            }}>{n}</div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: 'var(--muted)' }}>
        🔵 {CALENDAR_EVENTS.length} events this month
      </div>
    </div>
  );
}

function ChatPanel() {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef(null);
  const replyIndex              = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), from: 'You', msg: input.trim(), me: true, time: now, role: 'employee' }]);
    setInput('');

    // simulate reply
    const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
    replyIndex.current++;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: reply.from, msg: reply.msg, me: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), role: reply.role }]);
    }, 1400);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0a', border: '1px solid rgba(0,212,255,0.15)',
      borderRadius: 14, overflow: 'hidden', height: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,212,255,0.05)',
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#00D4FF' }}>
          💬 Team Chat
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 6px #00E676', display: 'inline-block' }} />
          <span style={{ fontSize: 10, color: '#00E676' }}>3 online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.me ? 'flex-end' : 'flex-start' }}>
            {!m.me && (
              <span style={{ fontSize: 9, color: ROLE_COLORS[m.role] || 'var(--muted)', marginBottom: 2, fontWeight: 700 }}>{m.from}</span>
            )}
            <div style={{
              maxWidth: '82%', padding: '7px 11px', borderRadius: 10, fontSize: 12, lineHeight: 1.5,
              borderBottomRightRadius: m.me ? 3 : 10,
              borderBottomLeftRadius: m.me ? 10 : 3,
              background: m.me
                ? 'linear-gradient(135deg, #FF6B35, #ff8c5a)'
                : 'rgba(255,255,255,0.06)',
              border: m.me ? 'none' : '1px solid rgba(255,255,255,0.08)',
              color: m.me ? '#fff' : 'var(--text)',
            }}>
              {m.msg}
            </div>
            <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{m.time}</span>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 3, padding: '8px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 10 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#00D4FF',
                  animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--text)',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: '#FF6B35', border: 'none', borderRadius: 8,
            width: 34, height: 34, cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >→</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function EmployeeDayOverview({ onEnter }) {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // trigger bar chart animation after mount
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(() => onEnter(), 500);
  };

  const now   = new Date();
  const hour  = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const overallGood = KPI_DATA.filter(k => k.good).length >= 3;

  return (
    <>
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .day-overview-root {
          animation: fadeSlideIn .4s ease both;
        }
        .day-overview-root.leaving {
          animation: fadeSlideIn .4s ease reverse both;
        }
        .enter-dashboard-btn {
          background: linear-gradient(135deg, #FF6B35, #ff8c5a);
          border: none; border-radius: 10px;
          padding: 12px 28px; font-family: Syne, sans-serif;
          font-weight: 700; font-size: 14px; color: #fff;
          cursor: pointer; transition: opacity .15s, transform .15s;
          box-shadow: 0 4px 20px rgba(255,107,53,0.4);
        }
        .enter-dashboard-btn:hover { opacity: .9; transform: translateY(-1px); }
        .ov-section-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 16px;
        }
        .ov-section-title {
          font-family: Syne, sans-serif; font-weight: 700;
          font-size: 12px; color: var(--muted);
          text-transform: uppercase; letter-spacing: .6px;
          margin-bottom: 12px;
        }
        .chat-input-custom:focus {
          border-color: rgba(0,212,255,0.4) !important;
          box-shadow: 0 0 0 2px rgba(0,212,255,0.1);
        }
      `}</style>

      <div
        className={`day-overview-root${leaving ? ' leaving' : ''}`}
        style={{
          position: 'fixed', inset: 0, overflowY: 'auto',
          background: 'var(--bg, #0d0d0d)', zIndex: 999, padding: '24px 28px',
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22 }}>
              {greeting}, {user.name?.split(' ')[0] || 'there'} 👋
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{dateStr}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <KPIBadge good={overallGood} label={overallGood ? 'On track today' : 'Needs attention'} />
              <KPIBadge good label="3 meetings today" />
              <KPIBadge good={false} label="2 tasks overdue" />
            </div>
          </div>
          <button className="enter-dashboard-btn" onClick={handleEnter}>
            Enter Dashboard →
          </button>
        </div>

        {/* ── Yesterday KPI Chart ── */}
        <YesterdayChart visible={visible} />

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 14 }}>

          {/* Today's Timeline */}
          <div className="ov-section-card">
            <div className="ov-section-title">🕐 Today's Schedule</div>
            <TodayTimeline />
          </div>

          {/* Goal Progress */}
          <div className="ov-section-card">
            <div className="ov-section-title">🎯 Goal Progress</div>
            <GoalProgress />

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              {[
                { icon: '📋', label: 'Requests', value: '3',  color: '#00D4FF' },
                { icon: '✅', label: 'Approved', value: '1',  color: '#00E676' },
                { icon: '⏳', label: 'Pending',  value: '1',  color: '#FFD600' },
                { icon: '🔄', label: 'In Review', value: '1', color: '#FF6B35' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '10px', borderRadius: 8,
                  background: `${s.color}10`,
                  border: `1px solid ${s.color}25`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="ov-section-card">
            <div className="ov-section-title">📅 {now.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
            <MiniCalendar />
          </div>
        </div>

        {/* ── Chat (full width below) ── */}
        <div style={{ height: 300 }}>
          <ChatPanel />
        </div>
      </div>
    </>
  );
}

export default EmployeeDayOverview;