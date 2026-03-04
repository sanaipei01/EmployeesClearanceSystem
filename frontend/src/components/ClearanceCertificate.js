import React, { useRef } from 'react';

function ClearanceCertificate({ request, employee }) {
  const certRef = useRef(null);

  const handlePrint = () => {
    const content = certRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Clearance Certificate - ${employee?.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: 'DM Sans', sans-serif; background: white; color: #0A0F1E; padding: 40px; }
            .cert { max-width: 700px; margin: 0 auto; border: 3px solid #0A0F1E; padding: 48px; position: relative; }
            .cert-border { position: absolute; inset: 8px; border: 1px solid #0A0F1E; pointer-events: none; }
            .cert-logo { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #0A0F1E; text-align: center; margin-bottom: 4px; }
            .cert-org { text-align: center; font-size: 13px; color: #666; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px; }
            .cert-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 8px; }
            .cert-subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 36px; letter-spacing: 1px; text-transform: uppercase; }
            .cert-body { font-size: 15px; line-height: 2; text-align: center; margin-bottom: 32px; }
            .cert-name { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; border-bottom: 2px solid #0A0F1E; display: inline-block; padding: 0 20px; margin: 8px 0; }
            .cert-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 20px 0; }
            .detail-item { text-align: center; }
            .detail-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 4px; }
            .detail-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
            .cert-signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 40px; }
            .sig-line { border-top: 1px solid #0A0F1E; padding-top: 8px; text-align: center; font-size: 12px; color: #666; }
            .cert-id { text-align: center; font-size: 11px; color: #999; margin-top: 24px; letter-spacing: 1px; }
            .stamp { position: absolute; bottom: 80px; right: 60px; width: 90px; height: 90px; border-radius: 50%; border: 3px solid rgba(0,150,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: rgba(0,150,255,0.5); text-align: center; transform: rotate(-15deg); text-transform: uppercase; letter-spacing: 1px; padding: 10px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const today = new Date().toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' });
  const certId = `CERT-${Date.now().toString().slice(-6)}`;

  return (
    <div>
      {/* Preview */}
      <div ref={certRef}>
        <div className="cert" style={{
          maxWidth:'680px', background:'white', color:'#0A0F1E',
          border:'3px solid #0A0F1E', padding:'48px', position:'relative',
          fontFamily:'DM Sans,sans-serif',
        }}>
          <div className="cert-border" style={{ position:'absolute', inset:'10px', border:'1px solid #0A0F1E', pointerEvents:'none' }} />

          <div style={{ textAlign:'center', marginBottom:'4px', fontFamily:'Syne,sans-serif', fontSize:'26px', fontWeight:'800', color:'#0A0F1E' }}>
            ECS
          </div>
          <div style={{ textAlign:'center', fontSize:'11px', color:'#666', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'32px' }}>
            Employee Clearance System
          </div>

          <div style={{ textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:'30px', fontWeight:'800', marginBottom:'6px' }}>
            Certificate of Clearance
          </div>
          <div style={{ textAlign:'center', fontSize:'12px', color:'#888', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'36px' }}>
            This is to certify that
          </div>

          <div style={{ textAlign:'center', fontSize:'14px', lineHeight:'2', marginBottom:'8px' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'32px', fontWeight:'800', borderBottom:'2px solid #0A0F1E', display:'inline-block', padding:'0 24px', marginBottom:'12px' }}>
              {employee?.name || 'Employee Name'}
            </div>
            <br />
            has successfully completed all clearance requirements for
            <br />
            <strong>{request?.type || 'Clearance Type'}</strong>
            <br />
            and is hereby granted full clearance as of <strong>{today}</strong>.
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', margin:'28px 0', borderTop:'1px solid #ddd', borderBottom:'1px solid #ddd', padding:'20px 0' }}>
            {[
              ['Certificate ID', certId],
              ['Issue Date', today],
              ['Clearance Type', request?.type || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'1px', color:'#999', marginBottom:'4px' }}>{label}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'13px' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', marginTop:'48px' }}>
            {['HR Officer', 'Department Manager', 'System Admin'].map(role => (
              <div key={role} style={{ borderTop:'1px solid #0A0F1E', paddingTop:'8px', textAlign:'center', fontSize:'11px', color:'#666' }}>
                {role}
              </div>
            ))}
          </div>

          <div style={{ position:'absolute', bottom:'60px', right:'48px', width:'80px', height:'80px', borderRadius:'50%', border:'3px solid rgba(0,100,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:'700', color:'rgba(0,100,255,0.4)', textAlign:'center', transform:'rotate(-15deg)', textTransform:'uppercase', letterSpacing:'1px', padding:'8px' }}>
            APPROVED ECS
          </div>

          <div style={{ textAlign:'center', fontSize:'10px', color:'#bbb', marginTop:'24px', letterSpacing:'1px' }}>
            {certId} • Generated by Employee Clearance System
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop:'20px', padding:'12px 28px' }}
        onClick={handlePrint}
      >
        🖨️ Print / Download Certificate
      </button>
    </div>
  );
}

export default ClearanceCertificate;