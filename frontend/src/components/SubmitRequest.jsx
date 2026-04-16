// src/components/SubmitRequest.jsx - Fixed version
import React, { useState } from 'react';

function SubmitRequest({ token, onSuccess }) {
  const [formData, setFormData] = useState({ type: '', reason: '', urgency: 'normal' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('https://employeesclearancesystem.onrender.com/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJTeXN0ZW0gQWRtaW5pc3RyYXRvciIsImlhdCI6MTc3NjM1ODg1MiwiZXhwIjoxNzc2Mzg3NjUyfQ.nXtIPSttryT507oz7pe_nam1OcV_875PkibHC6PLykk
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Request submitted successfully!');
        setFormData({ type: '', reason: '', urgency: 'normal' });
        if (onSuccess) onSuccess();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage('❌ Error: ' + (data.error || 'Submission failed'));
      }
    } catch (error) {
      setMessage('❌ Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:'20px'}}>
      <h3>Submit Clearance Request</h3>
      <form onSubmit={handleSubmit}>
        <div style={{margin:'10px 0'}}>
          <label>Type: </label>
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
            <option value="">Select type</option>
            <option value="Leave Clearance">Leave Clearance</option>
            <option value="Exit Clearance">Exit Clearance</option>
            <option value="Financial Clearance">Financial Clearance</option>
          </select>
        </div>
        <div style={{margin:'10px 0'}}>
          <label>Reason: </label>
          <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required />
        </div>
        <div style={{margin:'10px 0'}}>
          <label>Urgency: </label>
          <select value={formData.urgency} onChange={(e) => setFormData({...formData, urgency: e.target.value})}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{padding:'10px 20px',background:'#007bff',color:'white',border:'none',borderRadius:'4px'}}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      {message && <p style={{marginTop:'10px',color: message.includes('✅') ? 'green' : 'red'}}>{message}</p>}
    </div>
  );
}

export default SubmitRequest;
