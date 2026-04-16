import React, { useState, useEffect } from 'react';

function RequestsList({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://employeesclearancesystem.onrender.com/api/requests/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>My Requests</h3>
      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr><th>Request #</th><th>Type</th><th>Reason</th><th>Status</th><th>Created</th></tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.request_no}</td>
                <td>{req.type}</td>
                <td>{req.reason}</td>
                <td style={{color: req.status === 'approved' ? 'green' : req.status === 'rejected' ? 'red' : 'orange'}}>
                  {req.status}
                </td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RequestsList;
