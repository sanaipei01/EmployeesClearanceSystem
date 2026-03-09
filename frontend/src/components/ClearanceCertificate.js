import React, { useRef } from 'react';

function ClearanceCertificate({ request, employee }) {
  const today  = new Date().toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' });
  const certId = `CERT-${Date.now().toString().slice(-6)}`;
  const empName = employee?.name  || 'Employee Name';
  const reqType = request?.type   || 'Clearance';
  const reqId   = request?.request_no || request?.id || 'REQ-000';

  const handleDownload = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Clearance Certificate - ${empName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'DM Sans',Georgia,serif; background:#fff; color:#0A0F1E; }
    .page { width:794px; min-height:1123px; margin:0 auto; padding:60px; position:relative; background:#fff; }
    .outer-border { position:absolute; inset:20px; border:3px solid #0A0F1E; pointer-events:none; }
    .inner-border { position:absolute; inset:28px; border:1px solid #0A0F1E; pointer-events:none; }
    .content { position:relative; z-index:1; }
    .logo { text-align:center; font-family:'Syne',sans-serif; font-size:36px; font-weight:800; color:#0A0F1E; margin-bottom:4px; letter-spacing:4px; }
    .org { text-align:center; font-size:11px; color:#666; letter-spacing:4px; text-transform:uppercase; margin-bottom:8px; }
    .line { width:60px; height:2px; background:#0A0F1E; margin:0 auto 32px; }
    .title { font-family:'Syne',sans-serif; font-size:36px; font-weight:800; text-align:center; color:#0A0F1E; margin-bottom:8px; letter-spacing:-1px; }
    .sub { text-align:center; font-size:12px; color:#888; letter-spacing:3px; text-transform:uppercase; margin-bottom:40px; }
    .body-text { font-size:15px; line-height:2; text-align:center; color:#1F2937; margin-bottom:16px; }
    .name { font-family:'Syne',sans-serif; font-size:34px; font-weight:800; color:#0A0F1E; border-bottom:2.5px solid #0A0F1E; display:inline-block; padding:0 32px 6px; margin:12px 0; }
    .details { display:flex; justify-content:center; gap:48px; margin:32px 0; padding:24px 0; border-top:1px solid #ccc; border-bottom:1px solid #ccc; }
    .detail-label { font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:#999; margin-bottom:6px; }
    .detail-value { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; color:#0A0F1E; }
    .sigs { display:flex; justify-content:space-between; margin-top:64px; padding:0 20px; }
    .sig { width:28%; text-align:center; }
    .sig-line { border-top:1px solid #0A0F1E; padding-top:10px; font-size:11px; color:#666; }
    .stamp { position:absolute; bottom:100px; right:72px; width:96px; height:96px; border-radius:50%; border:3px solid rgba(0,80,200,0.3); display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:rgba(0,80,200,0.35); text-align:center; transform:rotate(-20deg); text-transform:uppercase; letter-spacing:1px; padding:12px; line-height:1.5; }
    .footer { text-align:center; font-size:10px; color:#bbb; margin-top:40px; letter-spacing:1px; }
  </style>
</head>
<body>
<div class="page">
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  <div class="content">
    <div class="logo">ECS</div>
    <div class="org">Employee Clearance System</div>
    <div class="line"></div>
    <div class="title">Certificate of Clearance</div>
    <div class="sub">This is to certify that</div>
    <div class="body-text">
      <div class="name">${empName}</div><br/>
      has successfully completed all clearance requirements for<br/>
      <strong>${reqType}</strong><br/>
      and is hereby granted full clearance as of <strong>${today}</strong>.
    </div>
    <div class="details">
      <div><div class="detail-label">Certificate ID</div><div class="detail-value">${certId}</div></div>
      <div><div class="detail-label">Issue Date</div><div class="detail-value">${today}</div></div>
      <div><div class="detail-label">Request No.</div><div class="detail-value">${reqId}</div></div>
    </div>
    <div class="sigs">
      <div class="sig"><div class="sig-line">HR Officer</div></div>
      <div class="sig"><div class="sig-line">Department Manager</div></div>
      <div class="sig"><div class="sig-line">System Administrator</div></div>
    </div>
    <div class="stamp">APPROVED<br/>ECS<br/>SYSTEM</div>
    <div class="footer">${certId} &bull; Employee Clearance System &bull; USIU Africa &bull; Nairobi, Kenya</div>
  </div>
</div>
</body>
</html>`;

    // Direct download as .html file — opens perfectly in any browser
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Clearance_Certificate_${empName.replace(/\s+/g,'_')}_${certId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Preview */}
      <div style={{
        background:'#fff', color:'#0A0F1E',
        border:'3px solid #0A0F1E',
        padding:'40px 44px',
        maxWidth:'640px',
        position:'relative',
        fontFamily:'Georgia, serif',
      }}>
        <div style={{ position:'absolute', inset:'10px', border:'1px solid #0A0F1E', pointerEvents:'none' }} />

        <div style={{ textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:'28px', fontWeight:'800', letterSpacing:'4px', marginBottom:'4px' }}>ECS</div>
        <div style={{ textAlign:'center', fontSize:'10px', color:'#888', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'8px' }}>Employee Clearance System</div>
        <div style={{ width:'40px', height:'2px', background:'#0A0F1E', margin:'0 auto 24px' }} />

        <div style={{ textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:'24px', fontWeight:'800', marginBottom:'6px' }}>Certificate of Clearance</div>
        <div style={{ textAlign:'center', fontSize:'10px', color:'#999', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'24px' }}>This is to certify that</div>

        <div style={{ textAlign:'center', lineHeight:'1.9', fontSize:'14px' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'24px', fontWeight:'800', borderBottom:'2px solid #0A0F1E', display:'inline-block', padding:'0 20px 4px', marginBottom:'10px' }}>{empName}</div>
          <br />has successfully completed all clearance requirements for<br />
          <strong>{reqType}</strong><br />
          and is hereby granted full clearance as of <strong>{today}</strong>.
        </div>

        <div style={{ display:'flex', justifyContent:'center', gap:'40px', margin:'24px 0', padding:'16px 0', borderTop:'1px solid #ddd', borderBottom:'1px solid #ddd' }}>
          {[['Certificate ID', certId],['Issue Date', today],['Request No.', reqId]].map(([label, value]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'9px', textTransform:'uppercase', letterSpacing:'1px', color:'#999', marginBottom:'4px' }}>{label}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'12px' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'32px', padding:'0 10px' }}>
          {['HR Officer','Department Manager','System Admin'].map(r => (
            <div key={r} style={{ width:'28%', borderTop:'1px solid #0A0F1E', paddingTop:'8px', textAlign:'center', fontSize:'10px', color:'#666' }}>{r}</div>
          ))}
        </div>

        <div style={{ position:'absolute', bottom:'44px', right:'36px', width:'68px', height:'68px', borderRadius:'50%', border:'2px solid rgba(0,80,200,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'7px', fontWeight:'700', color:'rgba(0,80,200,0.35)', textAlign:'center', transform:'rotate(-20deg)', textTransform:'uppercase', letterSpacing:'1px', padding:'8px', lineHeight:'1.4' }}>
          APPROVED<br/>ECS
        </div>

        <div style={{ textAlign:'center', fontSize:'9px', color:'#bbb', marginTop:'20px', letterSpacing:'1px' }}>
          {certId} • Employee Clearance System
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        style={{ marginTop:'16px', padding:'13px 32px', background:'linear-gradient(135deg,#00D4FF,#0055FF)', border:'none', borderRadius:'10px', color:'#0A0F1E', fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px' }}
      >
        ⬇️ Download Certificate
      </button>
      <p style={{ fontSize:'12px', color:'#6B7280', marginTop:'8px' }}>
        Downloads as an HTML file — open in browser and press <strong>Ctrl+P → Save as PDF</strong> to get a PDF copy.
      </p>
    </div>
  );
}

export default ClearanceCertificate;