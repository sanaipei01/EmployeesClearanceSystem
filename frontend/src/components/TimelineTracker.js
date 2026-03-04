import React from 'react';

const STEPS = [
  { key: 'submitted',  label: 'Submitted',       icon: '📋' },
  { key: 'manager',    label: 'Manager Review',   icon: '📌' },
  { key: 'hr',         label: 'HR Review',        icon: '👔' },
  { key: 'approved',   label: 'Approved',         icon: '✅' },
];

function getActiveStep(status) {
  if (status === 'pending')    return 1;
  if (status === 'processing') return 2;
  if (status === 'approved')   return 3;
  if (status === 'rejected')   return 3;
  return 0;
}

function TimelineTracker({ request }) {
  const activeStep = getActiveStep(request.status);
  const isRejected = request.status === 'rejected';

  return (
    <div style={{
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '20px 24px',
      marginBottom: '12px',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'15px' }}>{request.type}</div>
          <div style={{ color:'#9CA3AF', fontSize:'12px', marginTop:'3px' }}>Submitted: {request.date}</div>
        </div>
        <span className={`badge badge-${request.status}`}>{request.status}</span>
      </div>

      {/* Timeline */}
      <div style={{ display:'flex', alignItems:'center', position:'relative' }}>
        {STEPS.map((step, i) => {
          const done    = i < activeStep;
          const current = i === activeStep;
          const failed  = isRejected && i === activeStep;
          const color   = failed ? '#FF3D71' : done || current ? '#00D4FF' : 'rgba(255,255,255,0.15)';

          return (
            <React.Fragment key={step.key}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:1 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: failed ? 'rgba(255,61,113,0.15)' : done ? 'rgba(0,212,255,0.15)' : current ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  boxShadow: (done || current) && !failed ? `0 0 12px rgba(0,212,255,0.3)` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {failed ? '✗' : done ? '✓' : step.icon}
                </div>
                <div style={{ fontSize:'10px', marginTop:'6px', color: done || current ? '#F9FAFB' : '#9CA3AF', fontWeight: current ? '700' : '400', textAlign:'center', maxWidth:'64px' }}>
                  {step.label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex:1, height:'2px', background: i < activeStep ? '#00D4FF' : 'rgba(255,255,255,0.08)', transition:'background 0.5s', margin:'0 4px', marginBottom:'20px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default TimelineTracker;