import React, { useState, useEffect, useRef } from 'react';

const ACCENT = '#00E676';
const INITIAL_MESSAGES = [
  { id:1, from:'HR Dept',  msg:'3 clearance requests need your approval.', me:false, time:'8:30 AM', role:'hr' },
  { id:2, from:'You',      msg:"On it â€” reviewing now.",                    me:true,  time:'8:35 AM', role:'manager' },
  { id:3, from:'Admin',    msg:'Board meeting prep deck due by 2pm.',       me:false, time:'9:00 AM', role:'admin' },
];
const AUTO_REPLIES = [
  { from:'HR Dept',  msg:"Sarah's resignation clearance is also pending.", role:'hr' },
  { from:'Admin',    msg:'Quarterly review submissions close Friday.',      role:'admin' },
  { from:'Employee', msg:'Can you approve my travel clearance? REQ-00421', role:'employee' },
];
const ROLE_COLORS = { hr:'#00E676', manager:'#00D4FF', admin:'#FFD600', employee:'#FF6B35' };
const KPI = [
  { label:'Team Output', value:87, target:80,  unit:'%', good:true  },
  { label:'Approvals',   value:4,  target:10,  unit:'',  good:false },
  { label:'Attendance',  value:92, target:90,  unit:'%', good:true  },
  { label:'Backlog',     value:14, target:10,  unit:'',  good:false },
  { label:'SLA Met',     value:96, target:95,  unit:'%', good:true  },
];
const TIMELINE = [
  { time:'08:30', label:'Review pending approvals', done:true,  urgent:false },
  { time:'09:30', label:'Department standup',        done:true,  urgent:false },
  { time:'11:00', label:'Budget review â€” Finance',   done:false, urgent:false },
  { time:'13:00', label:'Performance reviews due',   done:false, urgent:true  },
  { time:'14:00', label:'Board meeting prep',        done:false, urgent:false },
];
const GOALS = [
  { label:'Approval rate',    value:85, good:true  },
  { label:'Request backlog',  value:42, good:false },
  { label:'Team attendance',  value:92, good:true  },
  { label:'Reviews complete', value:60, good:false },
];
const TODAY  = new Date().getDate();
const EVENTS = [1,3,7,10,13,15,20,24,28];

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
    setMsgs(p=>[...p,{id:Date.now(),from:'You',msg:input.trim(),me:true,time:now,role:'manager'}]);
    setInput('');
    const r = AUTO_REPLIES[idx.current % AUTO_REPLIES.length]; idx.current++;
    setTyping(true);
    setTimeout(()=>{ setTyping(false); setMsgs(p=>[...p,{id:Date.now()+1,from:r.from,msg:r.msg,me:false,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),role:r.role}]); },1200);
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'rgba(255,255,255,0.02)', border:`1px solid ${ACCENT}30`, borderRadius:10, overflow:'hidden' }}>
      <div style={{ padding:'6px 10px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:ACCENT }}>ðŸ’¬ Department Chat</span>
        <span style={{ fontSize:10, color:ACCENT }}>â— 5 online</span>
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
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Message your team..." style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'5px 8px', fontSize:11, color:'var(--text,#F9FAFB)', outline:'none' }}/>
        <button onClick={send} style={{ background:ACCENT, border:'none', borderRadius:6, width:28, height:28, cursor:'pointer', color:'#000', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>â†’</button>
      </div>
    </div>
  );
}

function ManagerDayOverview({ onEnter }) {
  const user    = JSON.parse(localStorage.getItem('ecs_user') || '{}');
  const [vis,   setVis]   = useState(false);
  const [leave, setLeave] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVis(true),100); return()=>clearTimeout(t); },[]);
  const go = () => { setLeave(true); setTimeout(()=>onEnter(),400); };
  const now  = new Date();
  const hour = now.getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  return (
    <>
      <style>{`
        @keyframes chatDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}
        @keyframes ovIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .mgr-ov{animation:ovIn .35s ease both}
        .mgr-ov.out{animation:ovIn .35s ease reverse both}
        .mgr-enter{border:none;border-radius:8px;padding:8px 20px;font-family:Syne,sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:opacity .15s,transform .15s;white-space:nowrap;flex-shrink:0}
        .mgr-enter:hover{opacity:.88;transform:translateY(-1px)}
        .mgr-sec{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px;overflow:hidden}
        .mgr-sec-t{font-size:10px;font-weight:700;color:var(--muted,#9CA3AF);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
      `}</style>
      <div className={`mgr-ov${leave?' out':''}`} style={{ position:'fixed', inset:0, background:'var(--bg,#0A0F1E)', zIndex:999, display:'flex', flexDirection:'column', padding:'12px 18px', gap:10, overflow:'hidden' }}>

        {/* HEADER */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'var(--text,#F9FAFB)' }}>{greeting}, {user.name?.split(' ')[0]||'Manager'} ðŸ‘‹</div>
            <div style={{ fontSize:11, color:'var(--muted,#9CA3AF)', marginTop:1 }}>{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
            <div style={{ display:'flex', gap:5, marginTop:4 }}>
              {[{t:'Team on track',g:true},{t:'3 approvals due',g:false},{t:'4 meetings',g:true}].map((b,i)=>(
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:700, background:b.g?'rgba(0,230,118,0.12)':'rgba(255,82,82,0.12)', color:b.g?'#00E676':'#FF5252', border:`1px solid ${b.g?'rgba(0,230,118,0.25)':'rgba(255,82,82,0.25)'}` }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:b.g?'#00E676':'#FF5252', display:'inline-block' }}/>{b.t}
                </span>
              ))}
            </div>
          </div>
          <button className="mgr-enter" onClick={go} style={{ background:`linear-gradient(135deg,${ACCENT},#00c853)`, color:'#000', boxShadow:`0 4px 14px ${ACCENT}50` }}>Enter Dashboard â†’</button>
        </div>

        {/* KPI CHART */}
        <div style={{ background:'linear-gradient(135deg,#1b5e20,#2e7d32)', borderRadius:10, padding:'10px 14px', flexShrink:0 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>ðŸ“Š Team KPIs â€” Yesterday</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:52 }}>
            {KPI.map((d,i)=>{
              const h = vis ? Math.round((Math.min(100,(d.value/(d.target*1.2))*100)/100)*40) : 0;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  <span style={{ fontSize:9, fontWeight:700, color:d.good?'#69f0ae':'#ff5252' }}>{d.value}{d.unit}</span>
                  <div style={{ width:'100%', height:h, borderRadius:'3px 3px 0 0', background:d.good?'rgba(105,240,174,0.85)':'rgba(255,82,82,0.75)', transition:`height .6s cubic-bezier(.4,0,.2,1) ${i*80}ms`, minHeight:3 }}/>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.55)', textAlign:'center' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.2fr', gap:10, flex:1, minHeight:0 }}>
          {/* Timeline + Goals */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, minHeight:0 }}>
            <div className="mgr-sec" style={{ flex:1 }}>
              <div className="mgr-sec-t">ðŸ• Today's Schedule</div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {TIMELINE.map((t,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, opacity:t.done?.5:1 }}>
                    <span style={{ fontSize:10, color:'var(--muted,#9CA3AF)', minWidth:36, flexShrink:0 }}>{t.time}</span>
                    <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background:t.done?'#444':t.urgent?'#FF6B35':ACCENT, boxShadow:t.done?'none':`0 0 4px ${t.urgent?'#FF6B35':ACCENT}` }}/>
                    <span style={{ fontSize:10, flex:1, color:'var(--text,#F9FAFB)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.label}</span>
                    {t.urgent && <span style={{ fontSize:8, color:'#FF6B35', fontWeight:700 }}>!</span>}
                    {t.done && <span style={{ fontSize:9, color:ACCENT }}>âœ“</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="mgr-sec" style={{ flex:1 }}>
              <div className="mgr-sec-t">ðŸŽ¯ Team Goals</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {GOALS.map((g,i)=>(
                  <div key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <span style={{ fontSize:10, color:'var(--text,#F9FAFB)' }}>{g.label}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:g.good?'#00E676':'#FF5252' }}>{g.value}%</span>
                    </div>
                    <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${g.value}%`, borderRadius:3, background:g.good?ACCENT:'#FF5252', transition:'width 1s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards + Calendar */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, minHeight:0 }}>
            <div className="mgr-sec">
              <div className="mgr-sec-t">ðŸ‘¥ Team Overview</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[{icon:'ðŸ‘¥',label:'Team',value:'12',color:'#00D4FF'},{icon:'âœ…',label:'Approved',value:'7',color:ACCENT},{icon:'â³',label:'Pending',value:'3',color:'#FFD600'},{icon:'ðŸš¨',label:'Escalated',value:'1',color:'#FF5252'}].map((s,i)=>(
                  <div key={i} style={{ padding:'7px 5px', borderRadius:8, background:`${s.color}10`, border:`1px solid ${s.color}20`, textAlign:'center' }}>
                    <div style={{ fontSize:13 }}>{s.icon}</div>
                    <div style={{ fontSize:15, fontWeight:800, fontFamily:'Syne,sans-serif', color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:9, color:'var(--muted,#9CA3AF)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mgr-sec" style={{ flex:1 }}>
              <div className="mgr-sec-t">ðŸ“… {now.toLocaleString('default',{month:'long',year:'numeric'})}</div>
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

          {/* Chat */}
          <div style={{ minHeight:0, overflow:'hidden' }}><ChatPanel/></div>
        </div>
      </div>
    </>
  );
}

export default ManagerDayOverview;
