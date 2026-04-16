import React, { useState, useRef, useEffect } from 'react';

const RESPONSES = {
  'submit': 'To submit a clearance request:\n1. Click "ðŸ“‹ Submit Request" in the sidebar\n2. Choose your clearance type\n3. Select urgency level\n4. Write your reason\n5. Click Submit!',
  'status': 'To check your request status:\n1. Click "ðŸ•’ My Requests" in the sidebar\n2. You will see a timeline showing where your request is:\n   Submitted â†’ Manager Review â†’ HR Review â†’ Approved',
  'approve': 'Managers and HR can approve requests:\n1. Go to "Team Requests" or "All Requests"\n2. Click "Review" on any pending request\n3. Click âœ… Approve or âŒ Reject',
  'resign': 'To submit a resignation clearance:\n1. Click "ðŸ“ Resign" in the sidebar\n2. Fill in 4 steps:\n   - Last working date & reason\n   - Handover checklist\n   - Equipment to return\n   - Confirmation',
  'certificate': 'To get your clearance certificate:\n1. Go to "ðŸ•’ My Requests"\n2. Find an APPROVED request\n3. Click "ðŸ“„ Download" button\n4. Print or save your certificate!',
  'feedback': 'To give feedback:\n1. Click "ðŸ’¬ Give Feedback" in the sidebar\n2. Choose a category\n3. Give a star rating (1-5)\n4. Write your experience\n5. Submit â€” HR and Admin will see it',
  'login': 'Login credentials:\nâ€¢ Admin: admin / password\nâ€¢ HR: hr / password\nâ€¢ Manager: manager / password\nâ€¢ Employee: employee / password',
  'password': 'Your login password is: password\n(All accounts use this password when connected to the real database)',
  'hello': 'Hello! ðŸ‘‹ I am the ECS Assistant. I can help you with:\nâ€¢ Submitting requests\nâ€¢ Checking request status\nâ€¢ Resignation process\nâ€¢ Downloading certificates\nâ€¢ Giving feedback\n\nWhat do you need help with?',
  'help': 'I can help you with:\nâ€¢ How to submit a request\nâ€¢ Checking your request status\nâ€¢ Resignation clearance steps\nâ€¢ Downloading your certificate\nâ€¢ How to give feedback\nâ€¢ Login information\n\nJust type your question! ðŸ˜Š',
  'types': 'Available clearance types:\n1. Resignation Clearance\n2. Travel Clearance\n3. Leave Clearance\n4. Training Clearance\n5. Equipment Return Clearance\n6. Final Exit Clearance',
  'notification': 'Your notifications are in the ðŸ”” bell icon at the top right of your dashboard. Click it to see your latest updates!',
  'default': "I'm not sure about that. Try asking me about:\nâ€¢ How to submit a request\nâ€¢ Checking request status\nâ€¢ Resignation process\nâ€¢ Your certificate\nâ€¢ Feedback\nâ€¢ Login help",
};

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('hello') || m.includes('hi') || m.includes('hey'))       return RESPONSES.hello;
  if (m.includes('submit') || m.includes('new request'))                   return RESPONSES.submit;
  if (m.includes('status') || m.includes('track') || m.includes('where')) return RESPONSES.status;
  if (m.includes('approv') || m.includes('reject'))                        return RESPONSES.approve;
  if (m.includes('resign'))                                                 return RESPONSES.resign;
  if (m.includes('certif') || m.includes('download'))                      return RESPONSES.certificate;
  if (m.includes('feedback') || m.includes('rating') || m.includes('rate'))return RESPONSES.feedback;
  if (m.includes('login') || m.includes('sign in') || m.includes('account'))return RESPONSES.login;
  if (m.includes('password') || m.includes('pass'))                        return RESPONSES.password;
  if (m.includes('help') || m.includes('what can'))                        return RESPONSES.help;
  if (m.includes('type') || m.includes('kind') || m.includes('clearance')) return RESPONSES.types;
  if (m.includes('notif') || m.includes('bell'))                           return RESPONSES.notification;
  return RESPONSES.default;
}

function AIChatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from:'bot', text:'ðŸ‘‹ Hi! I am your ECS Assistant. How can I help you today?', time: new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }) }
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(1);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from:'user', text:input, time: new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getResponse(input);
      setMessages(prev => [...prev, { from:'bot', text:reply, time: new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }) }]);
      setTyping(false);
      if (!open) setUnread(prev => prev + 1);
    }, 1000 + Math.random() * 500);
  };

  const QUICK = ['Submit request', 'Check status', 'Get certificate', 'Resignation', 'Give feedback'];

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes botPulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,0.4)} 50%{box-shadow:0 0 0 8px rgba(0,212,255,0)} }
        @keyframes typingDot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Chat bubble button */}
      <div style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:1000 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width:'60px', height:'60px', borderRadius:'50%',
            background:'linear-gradient(135deg, #00D4FF, #0055FF)',
            border:'none', cursor:'pointer', fontSize:'26px',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 8px 28px rgba(0,212,255,0.4)',
            animation:'botPulse 2s ease-in-out infinite',
            transition:'transform 0.2s',
          }}
          onMouseEnter={e => e.target.style.transform='scale(1.1)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'}
        >
          {open ? 'âœ•' : 'ðŸ¤–'}
        </button>
        {unread > 0 && !open && (
          <div style={{
            position:'absolute', top:'-4px', right:'-4px',
            width:'20px', height:'20px', borderRadius:'50%',
            background:'#FF3D71', color:'white',
            fontSize:'11px', fontWeight:'700',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'2px solid #080C14',
          }}>{unread}</div>
        )}
      </div>

      {/* Chat window */}
      {open && (
        <div style={{
          position:'fixed', bottom:'100px', right:'28px', zIndex:1000,
          width:'340px', height:'500px',
          background:'#111827', borderRadius:'20px',
          border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:'0 24px 60px rgba(0,0,0,0.6)',
          display:'flex', flexDirection:'column',
          animation:'slideUp 0.25s ease',
          fontFamily:'DM Sans, sans-serif',
        }}>
          {/* Header */}
          <div style={{
            padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)',
            display:'flex', alignItems:'center', gap:'12px',
            background:'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,85,255,0.1))',
            borderRadius:'20px 20px 0 0',
          }}>
            <div style={{
              width:'40px', height:'40px', borderRadius:'50%',
              background:'linear-gradient(135deg, #00D4FF, #0055FF)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px',
              flexShrink:0,
            }}>ðŸ¤–</div>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', fontSize:'14px' }}>ECS Assistant</div>
              <div style={{ fontSize:'11px', color:'#00E676', display:'flex', alignItems:'center', gap:'4px' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00E676', display:'inline-block' }} />
                Online â€” here to help
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: msg.from==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'80%', padding:'10px 14px', borderRadius: msg.from==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.from==='user' ? 'linear-gradient(135deg, #00D4FF, #0055FF)' : 'rgba(255,255,255,0.06)',
                  color: msg.from==='user' ? '#0A0F1E' : '#F0F4FF',
                  fontSize:'13px', lineHeight:'1.6',
                  whiteSpace:'pre-line',
                  fontWeight: msg.from==='user' ? '500' : '400',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize:'10px', color:'#6B7280', marginTop:'4px' }}>{msg.time}</div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', gap:'4px', padding:'10px 14px', background:'rgba(255,255,255,0.06)', borderRadius:'16px 16px 16px 4px', width:'fit-content' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#6B7280', animation:`typingDot 1.2s ${i*0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding:'8px 16px', display:'flex', gap:'6px', flexWrap:'wrap', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(() => sendMessage(), 50); }}
                style={{
                  padding:'4px 10px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.1)',
                  background:'rgba(255,255,255,0.04)', color:'#9CA3AF',
                  fontSize:'11px', cursor:'pointer', transition:'all 0.2s', fontFamily:'DM Sans,sans-serif',
                }}
                onMouseEnter={e => { e.target.style.borderColor='#00D4FF'; e.target.style.color='#00D4FF'; }}
                onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.color='#9CA3AF'; }}
              >{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:'10px', padding:'10px 14px', color:'#F0F4FF',
                fontFamily:'DM Sans,sans-serif', fontSize:'13px', outline:'none',
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                width:'38px', height:'38px', borderRadius:'10px',
                background:'linear-gradient(135deg, #00D4FF, #0055FF)',
                border:'none', cursor:'pointer', fontSize:'16px',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
              }}
            >â†’</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
