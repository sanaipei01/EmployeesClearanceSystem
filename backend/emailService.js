const nodemailer = require('nodemailer');

// Configure your email — uses Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// ── EMAIL TEMPLATES ──────────────────────────────────────

const templates = {

  requestSubmitted: (employee, requestType, requestId) => ({
    subject: `✅ Clearance Request Submitted — ${requestId}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0A0F1E;color:#F9FAFB;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00D4FF,#0055FF);padding:32px;text-align:center;">
          <div style="font-size:32px;font-weight:900;color:#0A0F1E;letter-spacing:-1px;">ECS</div>
          <div style="color:#0A0F1E;font-size:13px;margin-top:4px;opacity:0.8;">Employee Clearance System</div>
        </div>
        <div style="padding:32px;">
          <h2 style="font-size:22px;margin-bottom:8px;">Request Submitted Successfully! 🎉</h2>
          <p style="color:#9CA3AF;margin-bottom:24px;">Hello <strong style="color:#F9FAFB">${employee}</strong>, your clearance request has been received.</p>
          <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Request ID</span>
              <span style="font-weight:700;color:#00D4FF;">${requestId}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Type</span>
              <span style="font-weight:600;">${requestType}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;">
              <span style="color:#9CA3AF;font-size:13px;">Status</span>
              <span style="color:#FFD600;font-weight:700;">⏳ Pending Review</span>
            </div>
          </div>
          <p style="color:#9CA3AF;font-size:13px;">Your request will be reviewed by your Manager and HR. You will receive an email when the status changes.</p>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#6B7280;font-size:12px;">
          © Employee Clearance System • USIU Africa
        </div>
      </div>
    `,
  }),

  requestApproved: (employee, requestType, requestId) => ({
    subject: `🎉 Your ${requestType} has been APPROVED — ${requestId}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0A0F1E;color:#F9FAFB;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00E676,#00A854);padding:32px;text-align:center;">
          <div style="font-size:32px;font-weight:900;color:#0A0F1E;">ECS</div>
          <div style="color:#0A0F1E;font-size:13px;margin-top:4px;opacity:0.8;">Employee Clearance System</div>
        </div>
        <div style="padding:32px;">
          <div style="text-align:center;font-size:48px;margin-bottom:16px;">✅</div>
          <h2 style="font-size:22px;margin-bottom:8px;text-align:center;">Clearance Approved!</h2>
          <p style="color:#9CA3AF;margin-bottom:24px;text-align:center;">Hello <strong style="color:#F9FAFB">${employee}</strong>, great news!</p>
          <div style="background:#111827;border:1px solid rgba(0,230,118,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Request ID</span>
              <span style="font-weight:700;color:#00D4FF;">${requestId}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Type</span>
              <span style="font-weight:600;">${requestType}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;">
              <span style="color:#9CA3AF;font-size:13px;">Status</span>
              <span style="color:#00E676;font-weight:700;">✅ Approved</span>
            </div>
          </div>
          <p style="color:#9CA3AF;font-size:13px;">You can now login to the system and download your <strong style="color:#F9FAFB">Clearance Certificate</strong> from the My Requests section.</p>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#6B7280;font-size:12px;">
          © Employee Clearance System • USIU Africa
        </div>
      </div>
    `,
  }),

  requestRejected: (employee, requestType, requestId, note) => ({
    subject: `❌ Your ${requestType} was not approved — ${requestId}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0A0F1E;color:#F9FAFB;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#FF3D71,#CC0044);padding:32px;text-align:center;">
          <div style="font-size:32px;font-weight:900;color:#fff;">ECS</div>
          <div style="color:#fff;font-size:13px;margin-top:4px;opacity:0.8;">Employee Clearance System</div>
        </div>
        <div style="padding:32px;">
          <div style="text-align:center;font-size:48px;margin-bottom:16px;">❌</div>
          <h2 style="font-size:22px;margin-bottom:8px;text-align:center;">Request Not Approved</h2>
          <p style="color:#9CA3AF;margin-bottom:24px;text-align:center;">Hello <strong style="color:#F9FAFB">${employee}</strong>, unfortunately your request was not approved.</p>
          <div style="background:#111827;border:1px solid rgba(255,61,113,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Request ID</span>
              <span style="font-weight:700;color:#00D4FF;">${requestId}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Type</span>
              <span style="font-weight:600;">${requestType}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Status</span>
              <span style="color:#FF3D71;font-weight:700;">❌ Rejected</span>
            </div>
            ${note ? `<div style="padding:10px 0;">
              <span style="color:#9CA3AF;font-size:13px;display:block;margin-bottom:6px;">Reason</span>
              <span style="font-size:14px;color:#F9FAFB;">${note}</span>
            </div>` : ''}
          </div>
          <p style="color:#9CA3AF;font-size:13px;">You may resubmit your request after addressing the reason above. Login to the system for more details.</p>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#6B7280;font-size:12px;">
          © Employee Clearance System • USIU Africa
        </div>
      </div>
    `,
  }),

  newRequestToHR: (employeeName, requestType, requestId, urgency) => ({
    subject: `🔔 New ${urgency === 'urgent' ? '🚨 URGENT' : ''} Clearance Request — ${requestId}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0A0F1E;color:#F9FAFB;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00D4FF,#0055FF);padding:32px;text-align:center;">
          <div style="font-size:32px;font-weight:900;color:#0A0F1E;">ECS</div>
        </div>
        <div style="padding:32px;">
          <h2 style="font-size:20px;margin-bottom:8px;">New Request Needs Review 📋</h2>
          <p style="color:#9CA3AF;margin-bottom:24px;"><strong style="color:#F9FAFB">${employeeName}</strong> has submitted a new clearance request that needs your review.</p>
          <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Employee</span>
              <span style="font-weight:600;">${employeeName}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Request Type</span>
              <span style="font-weight:600;">${requestType}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#9CA3AF;font-size:13px;">Urgency</span>
              <span style="font-weight:700;color:${urgency==='critical'?'#FF3D71':urgency==='urgent'?'#FFD600':'#9CA3AF'};">● ${urgency}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
              <span style="color:#9CA3AF;font-size:13px;">Request ID</span>
              <span style="font-weight:700;color:#00D4FF;">${requestId}</span>
            </div>
          </div>
          <p style="color:#9CA3AF;font-size:13px;">Login to the ECS system to review and action this request.</p>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#6B7280;font-size:12px;">
          © Employee Clearance System • USIU Africa
        </div>
      </div>
    `,
  }),
};

// ── SEND FUNCTIONS ────────────────────────────────────────

const sendEmail = async (to, template) => {
  try {
    await transporter.sendMail({
      from: `"ECS System" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
  }
};

module.exports = {
  sendRequestSubmitted: (to, employee, type, id)       => sendEmail(to, templates.requestSubmitted(employee, type, id)),
  sendRequestApproved:  (to, employee, type, id)       => sendEmail(to, templates.requestApproved(employee, type, id)),
  sendRequestRejected:  (to, employee, type, id, note) => sendEmail(to, templates.requestRejected(employee, type, id, note)),
  sendNewRequestToHR:   (to, name, type, id, urgency)  => sendEmail(to, templates.newRequestToHR(name, type, id, urgency)),
};