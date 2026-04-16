import React, { useState, useEffect, useRef } from 'react';

const ACCENT = '#FFD600';
const INITIAL_MESSAGES = [
  { id:1, from:'Admin',   msg:'New hire onboarding docs ready for review.', me:false, time:'8:20 AM', role:'admin' },
  { id:2, from:'You',     msg:"I'll review and sign off before noon.",       me:true,  time:'8:25 AM', role:'hr' },
  { id:3, from:'Manager', msg:"Can you fast-track Sarah's clearance?",       me:false, time:'8:50 AM', role:'manager' },
];
const AUTO_REPLIES = [
  { from:'Admin',    msg:'2 exit interviews scheduled this afternoon.',    role:'admin' },
  { from:'Manager',  msg:'Payroll cut-off tomorrow — finalise headcount.', role:'manager' },
  { from:'Employee', msg:'Hi, I need help with my clearance status.',      role:'employee' },
];
const ROLE_COLORS = { hr:'#00E676', manager:'#00D4FF', admin:'#FFD600', employee:'#FF6B35' };
const KPI = [
  { label:'Clearances', value:18, target:20, unit:'',  good:false },
  { label:'Onboarding', value:5,  target:5,  unit:'',  good:true  },
  { label:'Compliance', value:97, target:90, unit:'%', good:true  },
  { label:'Open Roles', value:8,  target:5,  unit:'',  good:false },
  { label:'Retention',  value:91, target:88, unit:'%', good:true  },
];
const TIMELINE = [
  { time:'08:00', label:'Review onboarding docs',    done:true,  urgent:false },
  { time:'09:00', label:'HR department standup',      done:true,  urgent:false },
  { time:'10:30', label:'Process clearance backlog',  done:false, urgent:true  },
  { time:'13:00', label:'Exit interview — John D.',   done:false, urgent:false },
  { time:'16:00', label:'Payroll data submission',    done:false, urgent:true  },
];
const GOALS = [
  { label:'Clearance rate',   value:90, good:true  },
  { label:'Onboarding',       value:78, good:false },
  { label:'Compliance score', value:97, good:true  },
  { label:'Role fill rate',   value:50, good:false },
];
const TODAY  = new Date().getDate();
const EVENTS = [1,4,8,10,15,17,21,25,28];

function ChatPanel() {
  const [msgs, setMsgs]     = useState(INITIAL_MESSAGES);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  const idx = useRef(0);
  useEffect(()=>{ ref.current?.scrollIntoView({ behavior:'smooth' }); },[msgs,typing]);
  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    setMsgs(p=>[...p,{id:Date.now(),from:'You',msg:input.trim(),me:true,time:now,role:'hr'}]);
    setInput('');
    const r = AUTO_REPLIES[idx.current % AUTO_REPLIES.length]; idx.current++;
    setTyping(true);
    setTimeout(()=>{ setTyping(false); setMsgs(p=>[...p,{id:Date.now()+1,from:r.from,msg:r.msg,me:false,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),role:r.role}]); },1200);
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'rgba(255,255,255,0.02)', border:`1px solid ${ACCENT}30`, borderRadius:10, overflow:'hidden' }}>
      <div style={{ padding:'6px 10px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:ACCENT }}>💬 HR Chat</span>
        <span style={{ fontSize:10, color:'#00E676' }}>● 4 online</span>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'8px', display:'flex', flexDirection:'column', gap:5, minHeight:0 }}>
        {msgs.map(m=>(
          <div key={m.id} style={{ display:'flex', flexDirection:'column', alignItems:m.me?'flex-end':'flex-start' }}>
            {!m.me && <span style={{ fontSize:9, color:ROLE_COLORS[m.role], marginBottom:1, fontWeight:700 }}>{m.from}</span>}
            <div style={{ maxWidth:'85%', padding:'5px 8px', borderRadius:8, fontSize:11, lineHeight:1.4, borderBottomRightRadius:m.me?2:8, borderBottomLeftRadius:m.me?8:2, background:m.me?ACCENT:'rgba(255,255,255,0.08)', color:m.me?'#000':'var(--text,#F9FAFB)' }}>{m.msg}</div>
            <span style={{ fontSize:9, color:'var(--muted,#9CA3AF)', marginTop:1 }}>{m.time}</span>
          </div>
        ))}
        {typing && <div style={{ display:'flex', gap:3, padding:'5px 8px', background:'rgba(255,255,255,0.06)', borderRadius:8, width:'fit-content' }}>{[0,1,2].map(i=><span key={i} style={{ width:4, height:4, borderRadius:'50%', background:ACCENT, animation:`chatDot 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}</div>}
        <div ref={ref}/>
      </div>
      <div style={{ padding:'6px 8px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:6, flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Message HR team..." style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'5px 8px', fontSize:11, color:'var(--text,#F9FAFB)', outline:'none' }}/>
        <button onClick={send} style={{ background:ACCENT, border:'none', borderRadius:6, width:28, height:28, cursor:'pointer', color:'#000', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>→</button>
      </div>
    </div>
  );
}

function HRDayOverview({ onEnter }) {
  const user    = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [vis,   setVis]   = useState(false);
  const [leave, setLeave] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVis(true),100); return()=>clearTimeout(t); },[]);
  const go = () => { setLeave(true); setTimeout(()=>onEnter(),400); };
  const now  = new Date();
  const hour = now.getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';

  return (
    <>
      <style>{`
        @keyframes chatDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}
        @keyframes ovIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .hr-ov{animation:ovIn .35s ease both}
        .hr-ov.out{animation:ovIn .35s ease reverse both}
        .hr-enter{border:none;border-radius:8px;padding:8px 20px;font-family:Syne,sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:opacity .15s,transform .15s;white-space:nowrap;flex-shrink:0}
        .hr-enter:hover{opacity:.88;transform:translateY(-1px)}
        .hr-sec{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px;overflow:hidden}
        .hr-sec-t{font-size:10px;font-weight:700;color:var(--muted,#9CA3AF);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
      `}</style>
      <div className={`hr-ov${leave?' out':''}`} style={{ position:'fixed', inset:0, background:'var(--bg,#0A0F1E)', zIndex:999, display:'flex', flexDirection:'column', padding:'12px 18px', gap:10, overflow:'hidden' }}>

        {/* HEADER */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'var(--text,#F9FAFB)' }}>{greeting}, {user.name?.split(' ')[0]||'HR'} 👋</div>
            <div style={{ fontSize:11, color:'var(--muted,#9CA3AF)', marginTop:1 }}>{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
            <div style={{ display:'flex', gap:5, marginTop:4 }}>
              {[{t:'Compliance strong',g:true},{t:'2 urgent tasks',g:false},{t:'2 exit interviews',g:true}].map((b,i)=>(
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:700, background:b.g?'rgba(0,230,118,0.12)':'rgba(255,82,82,0.12)', color:b.g?'#00E676':'#FF5252', border:`1px solid ${b.g?'rgba(0,230,118,0.25)':'rgba(255,82,82,0.25)'}` }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:b.g?'#00E676':'#FF5252', display:'inline-block' }}/>{b.t}
                </span>
              ))}
            </div>
          </div>
          <button className="hr-enter" onClick={go} style={{ background:`linear-gradient(135deg,${ACCENT},#ffc400)`, color:'#000', boxShadow:`0 4px 14px ${ACCENT}50` }}>Enter Dashboard →</button>
        </div>

        {/* KPI CHART */}
        <div style={{ background:'linear-gradient(135deg,#4a3800,#7a5c00)', borderRadius:10, padding:'10px 14px', flexShrink:0 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>📊 HR Metrics — Yesterday</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:52 }}>
            {KPI.map((d,i)=>{
              const h = vis ? Math.round((Math.min(100,(d.value/(d.target*1.2))*100)/100)*40) : 0;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  <span style={{ fontSize:9, fontWeight:700, color:d.good?'#00E676':'#FF5252' }}>{d.value}{d.unit}</span>
                  <div style={{ width:'100%', height:h, borderRadius:'3px 3px 0 0', background:d.good?'rgba(0,230,118,0.85)':'rgba(255,82,82,0.75)', transition:`height .6s cubic-bezier(.4,0,.2,1) ${i*80}ms`, minHeight:3 }}/>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.55)', textAlign:'center' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.2fr', gap:10, flex:1, minHeight:0 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:8, minHeight:0 }}>
            <div className="hr-sec" style={{ flex:1 }}>
              <div className="hr-sec-t">🕐 Today's Schedule</div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {TIMELINE.map((t,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, opacity:t.done?.5:1 }}>
                    <span style={{ fontSize:10, color:'var(--muted,#9CA3AF)', minWidth:36, flexShrink:0 }}>{t.time}</span>
                    <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background:t.done?'#444':t.urgent?'#FF6B35':ACCENT, boxShadow:t.done?'none':`0 0 4px ${t.urgent?'#FF6B35':ACCENT}` }}/>
                    <span style={{ fontSize:10, flex:1, color:'var(--text,#F9FAFB)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.label}</span>
                    {t.urgent && <span style={{ fontSize:8, color:'#FF6B35', fontWeight:700 }}>!</span>}
                    {t.done && <span style={{ fontSize:9, color:'#00E676' }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="hr-sec" style={{ flex:1 }}>
              <div className="hr-sec-t">🎯 HR Goals</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {GOALS.map((g,i)=>(
                  <div key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <span style={{ fontSize:10, color:'var(--text,#F9FAFB)' }}>{g.label}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:g.good?'#00E676':'#FF5252' }}>{g.value}%</span>
                    </div>
                    <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${g.value}%`, borderRadius:3, background:g.good?'#00E676':'#FF5252', transition:'width 1s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, minHeight:0 }}>
            <div className="hr-sec">
              <div className="hr-sec-t">👥 HR Snapshot</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[{icon:'👥',label:'Headcount',value:'48',color:'#00D4FF'},{icon:'📋',label:'Clearances',value:'18',color:'#00E676'},{icon:'🚪',label:'Exits',value:'2',color:'#FF5252'},{icon:'🆕',label:'New Hires',value:'5',color:ACCENT}].map((s,i)=>(
                  <div key={i} style={{ padding:'7px 5px', borderRadius:8, background:`${s.color}10`, border:`1px solid ${s.color}20`, textAlign:'center' }}>
                    <div style={{ fontSize:13 }}>{s.icon}</div>
                    <div style={{ fontSize:15, fontWeight:800, fontFamily:'Syne,sans-serif', color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:9, color:'var(--muted,#9CA3AF)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hr-sec" style={{ flex:1 }}>
              <div className="hr-sec-t">📅 {now.toLocaleString('default',{month:'long',year:'numeric'})}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1, textAlign:'center', marginBottom:3 }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} style={{ fontSize:8, color:'var(--muted,#9CA3AF)', fontWeight:700 }}>{d}</div>)}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1, textAlign:'center' }}>
                {Array.from({length:2},(_,i)=><div key={`e${i}`}/>)}
                {Array.from({length:30},(_,i)=>i+1).map(n=>{
                  const isT=n===TODAY, hasE=EVENTS.includes(n);
                  return <div key={n} style={{ fontSize:9, padding:'2px 1px', borderRadius:3, background:isT?ACCENT:hasE?`${ACCENT}20`:'transparent', color:isT?'#000':hasE?ACCENT:'var(--text,#F9FAFB)', fontWeight:isT||hasE?700:400 }}>{n}</div>;
                })}
              </div>
            </div>
          </div>

          <div style={{ minHeight:0, overflow:'hidden' }}><ChatPanel/></div>
        </div>
      </div>
    </>
  );
}

export default HRDayOverview;