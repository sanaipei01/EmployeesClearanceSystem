import React, { useState } from 'react';

const EQUIPMENT_LIST = [
  'Laptop / Computer',
  'Company Phone',
  'Access Card / ID Badge',
  'Office Keys',
  'Company Vehicle',
  'Uniform / PPE',
  'Tools & Equipment',
];

const HANDOVER_ITEMS = [
  'Handover document prepared',
  'Files and documents transferred',
  'Passwords and access shared with supervisor',
  'Pending tasks documented',
  'Client contacts handed over',
  'Training replacement staff',
];

function ResignationForm({ onSubmit }) {
  const user = JSON.parse(localStorage.getItem('ecs_user') || '{}');

  const [form, setForm] = useState({
    lastWorkingDate: '',
    noticePeriod: '4',
    reason: '',
    reasonDetail: '',
    equipment: [],
    handover: [],
    confirmed: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const toggleItem = (field, item) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.confirmed) {
      alert('Please confirm your resignation by checking the confirmation box.');
      return;
    }
    const request = {
      id: `REQ-${Date.now()}`,
      type: 'Resignation Clearance',
      ...form,
      submittedBy: user.name,
      submittedDate: new Date().toLocaleDateString('en-KE'),
      status: 'pending',
    };
    const existing = JSON.parse(localStorage.getItem('ecs_resignations') || '[]');
    localStorage.setItem('ecs_resignations', JSON.stringify([request, ...existing]));
    if (onSubmit) onSubmit(request);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 24px',
        background: '#111827', borderRadius: '20px',
        border: '1px solid rgba(0,230,118,0.2)',
        maxWidth: '560px',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
          Resignation Clearance Submitted!
        </div>
        <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
          Your request has been sent to HR and your Manager for review.
        </div>
        <div style={{ color: '#FFD600', fontSize: '13px', marginBottom: '28px' }}>
          Last Working Date: <strong>{form.lastWorkingDate}</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setStep(1); setForm({ lastWorkingDate:'', noticePeriod:'4', reason:'', reasonDetail:'', equipment:[], handover:[], confirmed:false }); }}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  const stepTitles = ['Personal Details', 'Handover Checklist', 'Equipment Return', 'Confirmation'];

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '28px' }}>
        {stepTitles.map((title, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: step > i + 1 ? '#00E676' : step === i + 1 ? '#00D4FF' : 'rgba(255,255,255,0.1)',
              color: step >= i + 1 ? '#0A0F1E' : '#9CA3AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 6px',
              fontWeight: '700', fontSize: '13px',
              transition: 'all 0.3s',
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: '10px', color: step === i + 1 ? '#00D4FF' : '#9CA3AF', fontWeight: step === i + 1 ? '600' : '400' }}>
              {title}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* STEP 1 - Personal Details */}
          {step === 1 && (
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'17px', marginBottom:'20px', color:'#00D4FF' }}>
                📝 Step 1 — Personal Details
              </div>

              <div className="form-group">
                <label>Employee Name</label>
                <input type="text" value={user.name || ''} disabled style={{ opacity: 0.6 }} />
              </div>

              <div className="form-group">
                <label>Last Working Date</label>
                <input
                  type="date"
                  value={form.lastWorkingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({ ...form, lastWorkingDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notice Period</label>
                <select value={form.noticePeriod} onChange={e => setForm({ ...form, noticePeriod: e.target.value })}>
                  <option value="1">1 Week</option>
                  <option value="2">2 Weeks</option>
                  <option value="4">4 Weeks (1 Month)</option>
                  <option value="8">8 Weeks (2 Months)</option>
                  <option value="12">12 Weeks (3 Months)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reason for Resignation</label>
                <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required>
                  <option value="">Select reason...</option>
                  <option>Better Opportunity</option>
                  <option>Personal Reasons</option>
                  <option>Relocation</option>
                  <option>Further Studies</option>
                  <option>Health Reasons</option>
                  <option>Retirement</option>
                  <option>Contract End</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Additional Details <span style={{ color:'#9CA3AF', fontWeight:'400' }}>(optional)</span></label>
                <textarea
                  rows={3}
                  placeholder="Any additional information you'd like to share..."
                  value={form.reasonDetail}
                  onChange={e => setForm({ ...form, reasonDetail: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width:'100%', justifyContent:'center' }}
                onClick={() => { if (!form.lastWorkingDate || !form.reason) { alert('Please fill in all required fields'); return; } setStep(2); }}
              >
                Next — Handover Checklist →
              </button>
            </div>
          )}

          {/* STEP 2 - Handover Checklist */}
          {step === 2 && (
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'17px', marginBottom:'6px', color:'#FFD600' }}>
                📦 Step 2 — Department Handover
              </div>
              <div style={{ color:'#9CA3AF', fontSize:'13px', marginBottom:'20px' }}>
                Check all items you have completed or will complete before your last day
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
                {HANDOVER_ITEMS.map(item => (
                  <div
                    key={item}
                    onClick={() => toggleItem('handover', item)}
                    style={{
                      display:'flex', alignItems:'center', gap:'12px',
                      padding:'14px 16px', borderRadius:'10px', cursor:'pointer',
                      background: form.handover.includes(item) ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.handover.includes(item) ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.07)'}`,
                      transition:'all 0.2s',
                    }}
                  >
                    <div style={{
                      width:'20px', height:'20px', borderRadius:'5px', flexShrink:0,
                      background: form.handover.includes(item) ? '#00E676' : 'rgba(255,255,255,0.1)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'12px', color:'#0A0F1E', fontWeight:'700',
                    }}>
                      {form.handover.includes(item) ? '✓' : ''}
                    </div>
                    <span style={{ fontSize:'14px', color: form.handover.includes(item) ? '#F9FAFB' : '#9CA3AF' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:'12px' }}>
                <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="btn btn-primary" style={{ flex:2, justifyContent:'center' }} onClick={() => setStep(3)}>Next — Equipment Return →</button>
              </div>
            </div>
          )}

          {/* STEP 3 - Equipment Return */}
          {step === 3 && (
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'17px', marginBottom:'6px', color:'#FF6B35' }}>
                🖥️ Step 3 — Equipment to Return
              </div>
              <div style={{ color:'#9CA3AF', fontSize:'13px', marginBottom:'20px' }}>
                Select all company equipment you will be returning
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'24px' }}>
                {EQUIPMENT_LIST.map(item => (
                  <div
                    key={item}
                    onClick={() => toggleItem('equipment', item)}
                    style={{
                      padding:'14px', borderRadius:'10px', cursor:'pointer', textAlign:'center',
                      background: form.equipment.includes(item) ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.equipment.includes(item) ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      transition:'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize:'11px', color: form.equipment.includes(item) ? '#FF6B35' : '#9CA3AF', fontWeight: form.equipment.includes(item) ? '600' : '400' }}>
                      {form.equipment.includes(item) ? '✓ ' : ''}{item}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:'12px' }}>
                <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(2)}>← Back</button>
                <button type="button" className="btn btn-primary" style={{ flex:2, justifyContent:'center' }} onClick={() => setStep(4)}>Next — Confirm →</button>
              </div>
            </div>
          )}

          {/* STEP 4 - Confirmation */}
          {step === 4 && (
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'17px', marginBottom:'20px', color:'#FF3D71' }}>
                ✍️ Step 4 — Confirmation
              </div>

              {/* Summary */}
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'12px', padding:'16px', marginBottom:'20px', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'13px', marginBottom:'12px', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Summary</div>
                {[
                  ['Employee', user.name],
                  ['Last Working Date', form.lastWorkingDate],
                  ['Notice Period', `${form.noticePeriod} Week(s)`],
                  ['Reason', form.reason],
                  ['Handover Items', `${form.handover.length} of ${HANDOVER_ITEMS.length} completed`],
                  ['Equipment to Return', form.equipment.length > 0 ? form.equipment.join(', ') : 'None selected'],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'13px' }}>
                    <span style={{ color:'#9CA3AF' }}>{k}</span>
                    <span style={{ maxWidth:'60%', textAlign:'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Confirmation checkbox */}
              <div
                onClick={() => setForm({ ...form, confirmed: !form.confirmed })}
                style={{
                  display:'flex', alignItems:'flex-start', gap:'12px',
                  padding:'16px', borderRadius:'12px', cursor:'pointer', marginBottom:'20px',
                  background: form.confirmed ? 'rgba(0,230,118,0.06)' : 'rgba(255,61,113,0.05)',
                  border: `1px solid ${form.confirmed ? 'rgba(0,230,118,0.3)' : 'rgba(255,61,113,0.2)'}`,
                  transition:'all 0.2s',
                }}
              >
                <div style={{
                  width:'22px', height:'22px', borderRadius:'6px', flexShrink:0, marginTop:'1px',
                  background: form.confirmed ? '#00E676' : 'rgba(255,255,255,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'13px', color:'#0A0F1E', fontWeight:'700',
                }}>
                  {form.confirmed ? '✓' : ''}
                </div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'600', marginBottom:'4px' }}>I confirm my resignation</div>
                  <div style={{ fontSize:'12px', color:'#9CA3AF', lineHeight:'1.5' }}>
                    I, <strong>{user.name}</strong>, confirm that I am voluntarily resigning from my position
                    effective <strong>{form.lastWorkingDate || '(date not set)'}</strong>. I understand this action
                    will be reviewed by HR and my Manager.
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:'12px' }}>
                <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(3)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex:2, justifyContent:'center', background: form.confirmed ? undefined : 'rgba(255,255,255,0.1)', color: form.confirmed ? undefined : '#9CA3AF' }}>
                  ✍️ Submit Resignation →
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default ResignationForm;