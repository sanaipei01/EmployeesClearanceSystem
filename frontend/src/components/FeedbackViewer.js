import React, { useState, useEffect } from 'react';

function Stars({ rating }) {
  return (
    <div style={{ display:'flex', gap:'3px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#FFD600' : 'rgba(255,255,255,0.15)', fontSize:'16px' }}>â˜…</span>
      ))}
    </div>
  );
}

function FeedbackViewer() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter]       = useState('all');
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ecs_feedback') || '[]');
    // Add some sample feedback if empty
    if (stored.length === 0) {
      const samples = [
        { id:'FB-001', category:'Clearance Process Speed', rating:4, comment:'The process was fairly quick. Got my travel clearance approved within a day!', suggestion:'Maybe add email notifications', submittedBy:'Soyian Mumbi', role:'employee', date:'04/03/2026', time:'09:15 AM', anonymous:false },
        { id:'FB-002', category:'Staff Communication',     rating:5, comment:'HR was very responsive and helpful throughout the process.', suggestion:'', submittedBy:'Anonymous', role:'employee', date:'03/03/2026', time:'02:30 PM', anonymous:true },
        { id:'FB-003', category:'System Ease of Use',      rating:3, comment:'The system is okay but could be more intuitive for first time users.', suggestion:'Add a tutorial or guide for new employees', submittedBy:'Kosiom Naikumi', role:'employee', date:'02/03/2026', time:'11:00 AM', anonymous:false },
        { id:'FB-004', category:'Request Handling',        rating:2, comment:'My resignation clearance took too long to process.', suggestion:'Set a maximum processing time for each request type', submittedBy:'Anonymous', role:'employee', date:'01/03/2026', time:'04:45 PM', anonymous:true },
        { id:'FB-005', category:'General Suggestion',      rating:5, comment:'Overall great system. Very transparent process.', suggestion:'Add a mobile app version', submittedBy:'Resian Camila', role:'employee', date:'28/02/2026', time:'10:20 AM', anonymous:false },
      ];
      localStorage.setItem('ecs_feedback', JSON.stringify(samples));
      setFeedbacks(samples);
    } else {
      setFeedbacks(stored);
    }
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  const ratingCounts = [5,4,3,2,1].map(r => ({
    stars: r,
    count: feedbacks.filter(f => f.rating === r).length,
    pct: feedbacks.length ? Math.round((feedbacks.filter(f => f.rating === r).length / feedbacks.length) * 100) : 0,
  }));

  const filtered = filter === 'all' ? feedbacks : feedbacks.filter(f => f.rating === parseInt(filter));

  const ratingColor = avgRating >= 4 ? '#00E676' : avgRating >= 3 ? '#FFD600' : '#FF3D71';

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'16px', marginBottom:'28px' }}>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', fontWeight:'800', fontFamily:'Syne,sans-serif', color:ratingColor }}>{avgRating}</div>
          <div style={{ display:'flex', justifyContent:'center', margin:'6px 0' }}><Stars rating={Math.round(avgRating)} /></div>
          <div style={{ color:'#9CA3AF', fontSize:'12px' }}>Average Rating</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', fontWeight:'800', fontFamily:'Syne,sans-serif', color:'#00D4FF' }}>{feedbacks.length}</div>
          <div style={{ color:'#9CA3AF', fontSize:'12px', marginTop:'8px' }}>Total Responses</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', fontWeight:'800', fontFamily:'Syne,sans-serif', color:'#A78BFA' }}>
            {feedbacks.filter(f => f.anonymous).length}
          </div>
          <div style={{ color:'#9CA3AF', fontSize:'12px', marginTop:'8px' }}>Anonymous</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', fontWeight:'800', fontFamily:'Syne,sans-serif', color:'#00E676' }}>
            {feedbacks.filter(f => f.rating >= 4).length}
          </div>
          <div style={{ color:'#9CA3AF', fontSize:'12px', marginTop:'8px' }}>Positive (4-5â˜…)</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'20px', marginBottom:'24px' }}>
        {/* Rating breakdown */}
        <div className="card">
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px', marginBottom:'16px' }}>Rating Breakdown</div>
          {ratingCounts.map(r => (
            <div key={r.stars} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
              <span style={{ color:'#FFD600', fontSize:'13px', width:'20px' }}>{r.stars}â˜…</span>
              <div style={{ flex:1, height:'8px', background:'rgba(255,255,255,0.08)', borderRadius:'4px' }}>
                <div style={{ height:'100%', width:`${r.pct}%`, background:'#FFD600', borderRadius:'4px', transition:'width 0.5s' }} />
              </div>
              <span style={{ color:'#9CA3AF', fontSize:'12px', width:'30px' }}>{r.count}</span>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="card">
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px', marginBottom:'16px' }}>By Category</div>
          {['Clearance Process Speed','Staff Communication','System Ease of Use','Request Handling','General Suggestion'].map(cat => {
            const count = feedbacks.filter(f => f.category === cat).length;
            const pct = feedbacks.length ? Math.round((count / feedbacks.length) * 100) : 0;
            return (
              <div key={cat} style={{ marginBottom:'10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
                  <span>{cat}</span>
                  <span style={{ color:'#9CA3AF' }}>{count}</span>
                </div>
                <div style={{ height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:'#00D4FF', borderRadius:'3px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
        {['all','5','4','3','2','1'].map(f => (
          <button key={f} className={`btn ${filter===f ? 'btn-primary':'btn-ghost'}`} style={{ padding:'7px 14px', fontSize:'12px' }} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : `${f}â˜…`}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {filtered.map(f => (
          <div key={f.id} className="card" style={{ cursor:'pointer', transition:'all 0.2s' }}
            onClick={() => setSelected(selected?.id === f.id ? null : f)}
          >
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'16px' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px', flexWrap:'wrap' }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'8px', background:'rgba(0,212,255,0.15)', color:'#00D4FF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'14px', flexShrink:0 }}>
                    {f.anonymous ? '?' : f.submittedBy?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight:'600', fontSize:'14px' }}>{f.submittedBy}</div>
                    <div style={{ color:'#9CA3AF', fontSize:'11px' }}>{f.date} at {f.time}</div>
                  </div>
                  <span style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:'600', background:'rgba(0,212,255,0.1)', color:'#00D4FF' }}>
                    {f.category}
                  </span>
                </div>
                <Stars rating={f.rating} />
                <p style={{ color:'#D1D5DB', fontSize:'13px', marginTop:'8px', lineHeight:'1.6' }}>{f.comment}</p>
                {selected?.id === f.id && f.suggestion && (
                  <div style={{ marginTop:'12px', padding:'12px', background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:'8px' }}>
                    <div style={{ fontSize:'11px', color:'#A78BFA', fontWeight:'700', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>ðŸ’¡ Suggestion</div>
                    <p style={{ color:'#D1D5DB', fontSize:'13px', margin:0 }}>{f.suggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px', color:'#9CA3AF' }}>No feedback found</div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth:'520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Feedback Details</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>Ã—</button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:'rgba(0,212,255,0.15)', color:'#00D4FF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'18px' }}>
                {selected.anonymous ? '?' : selected.submittedBy?.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight:'700' }}>{selected.submittedBy}</div>
                <div style={{ color:'#9CA3AF', fontSize:'12px' }}>{selected.date} at {selected.time}</div>
              </div>
            </div>
            {[['Category', selected.category], ['Rating', '']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color:'#9CA3AF', fontSize:'13px' }}>{k}</span>
                {k === 'Rating' ? <Stars rating={selected.rating} /> : <span style={{ fontSize:'13px' }}>{v}</span>}
              </div>
            ))}
            <div style={{ marginTop:'16px' }}>
              <div style={{ color:'#9CA3AF', fontSize:'12px', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Comment</div>
              <p style={{ fontSize:'14px', lineHeight:'1.7', color:'#D1D5DB' }}>{selected.comment}</p>
            </div>
            {selected.suggestion && (
              <div style={{ marginTop:'16px', padding:'14px', background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:'10px' }}>
                <div style={{ fontSize:'11px', color:'#A78BFA', fontWeight:'700', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' }}>ðŸ’¡ Suggestion</div>
                <p style={{ fontSize:'14px', lineHeight:'1.7', color:'#D1D5DB', margin:0 }}>{selected.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackViewer;
