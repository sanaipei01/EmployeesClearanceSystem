import React, { useState } from 'react';

const CATEGORIES = [
  'Clearance Process Speed',
  'Staff Communication',
  'System Ease of Use',
  'Request Handling',
  'General Suggestion',
];

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:'flex', gap:'8px', margin:'8px 0' }}>
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          style={{
            background:'none', border:'none', cursor:'pointer',
            fontSize:'28px', padding:'0',
            color: star <= (hover || value) ? '#FFD600' : 'rgba(255,255,255,0.15)',
            transition:'all 0.15s',
            transform: star <= (hover || value) ? 'scale(1.2)' : 'scale(1)',
          }}
        >★</button>
      ))}
      <span style={{ color:'#9CA3AF', fontSize:'13px', alignSelf:'center', marginLeft:'8px' }}>
        {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Very Good' : value === 5 ? 'Excellent' : ''}
      </span>
    </div>
  );
}

function FeedbackForm({ onSubmit }) {
  const [form, setForm] = useState({
    category: '',
    rating: 0,
    comment: '',
    suggestion: '',
    anonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      alert('Please give a star rating!');
      return;
    }
    const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');
    const feedback = {
      id: `FB-${Date.now()}`,
      ...form,
      submittedBy: form.anonymous ? 'Anonymous' : user.name,
      role: user.role,
      date: new Date().toLocaleDateString('en-KE'),
      time: new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }),
    };
    // Save to localStorage so HR/Admin can see it
    const existing = JSON.parse(localStorage.getItem('ecs_feedback') || '[]');
    localStorage.setItem('ecs_feedback', JSON.stringify([feedback, ...existing]));
    if (onSubmit) onSubmit(feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        textAlign:'center', padding:'48px 24px',
        background:'#111827', borderRadius:'20px',
        border:'1px solid rgba(0,230,118,0.2)',
      }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'22px', fontWeight:'800', marginBottom:'8px' }}>
          Thank you for your feedback!
        </div>
        <div style={{ color:'#9CA3AF', fontSize:'14px', marginBottom:'24px' }}>
          Your feedback helps us improve the clearance process for everyone.
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setSubmitted(false); setForm({ category:'', rating:0, comment:'', suggestion:'', anonymous:false }); }}
        >
          Submit Another →
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth:'580px' }}>
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="form-group">
          <label>Feedback Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category:e.target.value })} required>
            <option value="">Select a category...</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Star Rating */}
        <div className="form-group">
          <label>Overall Rating</label>
          <StarRating value={form.rating} onChange={r => setForm({ ...form, rating:r })} />
        </div>

        {/* Comment */}
        <div className="form-group">
          <label>Your Experience</label>
          <textarea
            rows={4}
            placeholder="Tell us about your experience with the clearance process..."
            value={form.comment}
            onChange={e => setForm({ ...form, comment:e.target.value })}
            required
            style={{ resize:'vertical' }}
          />
        </div>

        {/* Suggestion */}
        <div className="form-group">
          <label>Suggestion for Improvement <span style={{ color:'#9CA3AF', fontWeight:'400' }}>(optional)</span></label>
          <textarea
            rows={3}
            placeholder="Any suggestions to improve our clearance system?"
            value={form.suggestion}
            onChange={e => setForm({ ...form, suggestion:e.target.value })}
            style={{ resize:'vertical' }}
          />
        </div>

        {/* Anonymous toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.06)' }}>
          <div
            onClick={() => setForm({ ...form, anonymous:!form.anonymous })}
            style={{
              width:'44px', height:'24px', borderRadius:'12px', cursor:'pointer',
              background: form.anonymous ? '#00D4FF' : 'rgba(255,255,255,0.15)',
              position:'relative', transition:'background 0.2s', flexShrink:0,
            }}
          >
            <div style={{
              position:'absolute', top:'3px',
              left: form.anonymous ? '23px' : '3px',
              width:'18px', height:'18px', borderRadius:'50%',
              background:'white', transition:'left 0.2s',
            }} />
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:'600' }}>Submit Anonymously</div>
            <div style={{ fontSize:'11px', color:'#9CA3AF' }}>Your name will not be shown to HR or Admin</div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" style={{ width:'100%', justifyContent:'center', padding:'14px' }}>
          Submit Feedback →
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;