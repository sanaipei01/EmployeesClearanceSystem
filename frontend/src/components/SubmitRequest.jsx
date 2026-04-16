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
          'Authorization': Bearer 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Request submitted successfully!');
        setFormData({ type: '', reason: '', urgency: 'normal' });
        if (onSuccess) onSuccess();
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
    <div>
      <h3>Submit Clearance Request</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Type: </label>
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required style={{ padding: '5px', marginLeft: '10px' }}>
            <option value="">Select type</option>
            <option value="Leave Clearance">Leave Clearance</option>
            <option value="Exit Clearance">Exit Clearance</option>
            <option value="Financial Clearance">Financial Clearance</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Reason: </label>
          <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required style={{ width: '300px', height: '80px', marginLeft: '10px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Urgency: </label>
          <select value={formData.urgency} onChange={(e) => setFormData({...formData, urgency: e.target.value})} style={{ marginLeft: '10px', padding: '5px' }}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default SubmitRequest;
