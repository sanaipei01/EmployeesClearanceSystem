import React, { useState } from 'react';
import API_URL from '../api';

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
    <div style={{ display:'flex', gap:'8px', margin:'8px 0', flexWrap:'wrap' }}>
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
            color: star <= (hover || value) ? '#FFD600' : 'rgba(155,155,155,0.4)',
            transition:'all 0.15s',
            transform: star <= (hover || value) ? 'scale(1.2)' : 'scale(1)',
          }}
        >★</button>
      ))}
      <span style={{ color:'var(--muted)', fontSize:'13px', alignSelf:'center', marginLeft:'8px' }}>
        {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Very Good' : value === 5 ? 'Excellent' : ''}
      </span>
    </div>
  );
}

function FeedbackForm({ onSubmit }) {
  const [form, setForm] = useState({ category:'', rating:0, comment:'', suggestion:'', anonymous:false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { alert('Please give a star rating!'); return; }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('ecs_token');
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      if (onSubmit) onSubmit(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign:'center', padding:'48px 24px', background:'var(--card-bg)', borderRadius:'20px', border:'1px solid rgba(0,230,118,0.2)' }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'22px', fontWeight:'800', marginBottom:'8px', color:'var(--text)' }}>
          Thank you for your feedback!
        </div>
        <div style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>
          Your feedback has been sent to HR successfully.
        </div>
        <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ category:'', rating:0, comment:'', suggestion:'', anonymous:false }); }}>
          Submit Another →
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth:'580px', width:'100%', boxSizing:'border-box' }}>
      {error && <div style={{ background:'rgba(255,61,113,0.1)', border:'1px solid rgba(255,61,113,0.3)', color:'#FF3D71', padding:'12px 16px', borderRadius:'10px', marginBottom:'16px', fontSize:'14px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Feedback Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category:e.target.value })} required>
            <option value="">Select a category...</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Overall Rating</label>
          <StarRating value={form.rating} onChange={r => setForm({ ...form, rating:r })} />
        </div>

        <div className="form-group">
          <label>Your Experience</label>
          <textarea rows={4} placeholder="Tell us about your experience..." value={form.comment} onChange={e => setForm({ ...form, comment:e.target.value })} required style={{ resize:'vertical' }} />
        </div>

        <div className="form-group">
          <label>Suggestion <span style={{ color:'var(--muted)', fontWeight:'400' }}>(optional)</span></label>
          <textarea rows={3} placeholder="Any suggestions to improve our system?" value={form.suggestion} onChange={e => setForm({ ...form, suggestion:e.target.value })} style={{ resize:'vertical' }} />
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', padding:'14px 16px', background:'var(--hover)', borderRadius:'10px', border:'1px solid var(--border)' }}>
          <div onClick={() => setForm({ ...form, anonymous:!form.anonymous })} style={{ width:'44px', height:'24px', borderRadius:'12px', cursor:'pointer', background: form.anonymous ? '#00D4FF' : 'rgba(155,155,155,0.3)', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
            <div style={{ position:'absolute', top:'3px', left: form.anonymous ? '23px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'left 0.2s' }} />
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--text)' }}>Submit Anonymously</div>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>Your name will not be shown to HR or Admin</div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" style={{ width:'100%', justifyContent:'center', padding:'14px' }} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback →'}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;