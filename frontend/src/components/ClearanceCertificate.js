import React, { useRef } from 'react';

function ClearanceCertificate({ request, employee }) {
  const certRef = useRef(null);

  const handleDownload = () => {
    const today    = new Date().toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' });
    const certId   = `CERT-${Date.now().toString().slice(-6)}`;
    const empName  = employee?.name  || 'Employee Name';
    const reqType  = request?.type   || 'Clearance';
    const reqId    = request?.request_no || request?.id || 'REQ-000';

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Clearance Certificate - ${empName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'DM Sans',sans-serif; background:#fff; color:#0A0F1E; padding:40px; }

    .cert {
      max-width:720px; margin:0 auto;
      border:3px solid #0A0F1E;
      padding:52px 56px;
      position:relative;
      background:#fff;
    }
    .cert-inner {
      position:absolute; inset:10px;
      border:1px solid #0A0F1E;
      pointer-events:none;
    }

    .logo {
      text-align:center;
      font-family:'Syne',sans-serif;
      font-size:30px;
      font-weight:800;
      color:#0A0F1E;
      margin-bottom:4px;
    }
    .org {
      text-align:center;
      font-size:11px;
      color:#666;
      letter-spacing:3px;
      text-transform:uppercase;
      margin-bottom:36px;
    }
    .divider {
      border:none;
      border-top:1px solid #ddd;
      margin:20px 0;
    }
    .cert-title {
      font-family:'Syne',sans-serif;
      font-size:34px;
      font-weight:800;
      text-align:center;
      color:#0A0F1E;
      margin-bottom:6px;
      letter-spacing:-1px;
    }
    .cert-sub {
      text-align:center;
      font-size:12px;
      color:#888;
      letter-spacing:2px;
      text-transform:uppercase;
      margin-bottom:36px;
    }
    .body-text {
      font-size:15px;
      line-height:1.9;
      text-align:center;
      color:#1F2937;
      margin-bottom:8px;
    }
    .emp-name {
      font-family:'Syne',sans-serif;
      font-size:30px;
      font-weight:800;
      color:#0A0F1E;
      border-bottom:2px solid #0A0F1E;
      display:inline-block;
      padding:0 24px 4px;
      margin:10px 0;
    }
    .details-grid {
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:16px;
      margin:28px 0;
      padding:20px 0;
      border-top:1px solid #ddd;
      border-bottom:1px solid #ddd;
    }
    .detail { text-align:center; }
    .detail-label {
      font-size:10px;
      text-transform:uppercase;
      letter-spacing:1px;
      color:#999;
      margin-bottom:6px;
    }
    .detail-value {
      font-family:'Syne',sans-serif;
      font-weight:700;
      font-size:13px;
      color:#0A0F1E;
    }
    .sigs {
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:32px;
      margin-top:52px;
    }
    .sig-line {
      border-top:1px solid #0A0F1E;
      padding-top:8px;
      text-align:center;
      font-size:11px;
      color:#666;
    }
    .stamp {
      position:absolute;
      bottom:72px; right:56px;
      width:88px; height:88px;
      border-radius:50%;
      border:3px solid rgba(0,100,220,0.35);
      display:flex; align-items:center; justify-content:center;
      font-size:9px; font-weight:700;
      color:rgba(0,100,220,0.4);
      text-align:center;
      transform:rotate(-15deg);
      text-transform:uppercase;
      letter-spacing:1px;
      padding:10px;
      line-height:1.4;
    }
    .cert-id {
      text-align:center;
      font-size:10px;
      color:#bbb;
      margin-top:28px;
      letter-spacing:1px;
    }

    @media print {
      body { padding:0; }
      .no-print { display:none !important; }
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="cert-inner"></div>

    <div class="logo">ECS</div>
    <div class="org">Employee Clearance System</div>

    <div class="cert-title">Certificate of Clearance</div>
    <div class="cert-sub">This is to certify that</div>

    <div class="body-text">
      <div class="emp-name">${empName}</div>
      <br/>
      has successfully completed all clearance requirements for
      <br/>
      <strong>${reqType}</strong>
      <br/>
      and is hereby granted full clearance as of <strong>${today}</strong>.
    </div>

    <div class="details-grid">
      <div class="detail">
        <div class="detail-label">Certificate ID</div>
        <div class="detail-value">${certId}</div>
      </div>
      <div class="detail">
        <div class="detail-label">Issue Date</div>
        <div class="detail-value">${today}</div>
      </div>
      <div class="detail">
        <div class="detail-label">Request No.</div>
        <div class="detail-value">${reqId}</div>
      </div>
    </div>

    <div class="sigs">
      <div class="sig-line">HR Officer</div>
      <div class="sig-line">Department Manager</div>
      <div class="sig-line">System Administrator</div>
    </div>

    <div class="stamp">APPROVED<br/>ECS<br/>SYSTEM</div>

    <div class="cert-id">${certId} • Employee Clearance System • USIU Africa</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

    // Open in new tab and trigger print/save as PDF
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (!win) {
      // Fallback if popup blocked
      const a = document.createElement('a');
      a.href = url;
      a.download = `Clearance_Certificate_${empName.replace(/ /g,'_')}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const today  = new Date().toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' });
  const certId = `CERT-${Date.now().toString().slice(-6)}`;

  return (
    <div>
      {/* Preview card */}
      <div ref={certRef} style={{
        background:'#fff', color:'#0A0F1E',
        border:'3px solid #0A0F1E',
        borderRadius:'4px',
        padding:'40px 44px',
        maxWidth:'680px',
        position:'relative',
        fontFamily:'DM Sans, sans-serif',
      }}>
        {/* Inner border */}
        <div style={{ position:'absolute', inset:'10px', border:'1px solid #0A0F1E', pointerEvents:'none', borderRadius:'2px' }} />

        <div style={{ textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:'26px', fontWeight:'800', color:'#0A0F1E', marginBottom:'4px' }}>ECS</div>
        <div style={{ textAlign:'center', fontSize:'10px', color:'#888', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'28px' }}>Employee Clearance System</div>

        <div style={{ textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:'26px', fontWeight:'800', color:'#0A0F1E', marginBottom:'6px' }}>Certificate of Clearance</div>
        <div style={{ textAlign:'center', fontSize:'11px', color:'#999', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'28px' }}>This is to certify that</div>

        <div style={{ textAlign:'center', lineHeight:'1.9', fontSize:'14px', color:'#1F2937' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'26px', fontWeight:'800', color:'#0A0F1E', borderBottom:'2px solid #0A0F1E', display:'inline-block', padding:'0 20px 4px', marginBottom:'10px' }}>
            {employee?.name || 'Employee Name'}
          </div>
          <br />
          has successfully completed all clearance requirements for
          <br />
          <strong style={{ color:'#0A0F1E' }}>{request?.type || 'Clearance Type'}</strong>
          <br />
          and is hereby granted full clearance as of <strong>{today}</strong>.
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', margin:'24px 0', borderTop:'1px solid #ddd', borderBottom:'1px solid #ddd', padding:'16px 0' }}>
          {[['Certificate ID', certId],['Issue Date', today],['Request No.', request?.request_no || request?.id || '—']].map(([label, value]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'9px', textTransform:'uppercase', letterSpacing:'1px', color:'#999', marginBottom:'4px' }}>{label}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'12px', color:'#0A0F1E' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', marginTop:'36px' }}>
          {['HR Officer','Department Manager','System Admin'].map(r => (
            <div key={r} style={{ borderTop:'1px solid #0A0F1E', paddingTop:'8px', textAlign:'center', fontSize:'10px', color:'#666' }}>{r}</div>
          ))}
        </div>

        <div style={{ position:'absolute', bottom:'48px', right:'40px', width:'72px', height:'72px', borderRadius:'50%', border:'3px solid rgba(0,100,220,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8px', fontWeight:'700', color:'rgba(0,100,220,0.4)', textAlign:'center', transform:'rotate(-15deg)', textTransform:'uppercase', letterSpacing:'1px', padding:'8px', lineHeight:'1.4' }}>
          APPROVED<br/>ECS
        </div>

        <div style={{ textAlign:'center', fontSize:'9px', color:'#bbb', marginTop:'20px', letterSpacing:'1px' }}>
          {certId} • Employee Clearance System
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        style={{
          marginTop:'16px',
          padding:'12px 28px',
          background:'linear-gradient(135deg,#00D4FF,#0055FF)',
          border:'none',
          borderRadius:'10px',
          color:'#0A0F1E',
          fontFamily:'Syne,sans-serif',
          fontWeight:'700',
          fontSize:'14px',
          cursor:'pointer',
          display:'inline-flex',
          alignItems:'center',
          gap:'8px',
          transition:'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
      >
        📄 Download Certificate
      </button>
      <p style={{ fontSize:'12px', color:'#6B7280', marginTop:'8px' }}>
        A new tab will open — use <strong>Ctrl+P</strong> (or File → Print) → Save as PDF
      </p>
    </div>
  );
}

export default ClearanceCertificate;