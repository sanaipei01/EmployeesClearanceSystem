import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://employeesclearancesystem.onrender.com/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Login error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Employee Clearance System</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          {error && <div className="error">{error}</div>}
          <div className="demo-creds">
            <p>admin / REMOVED | manager / REMOVED | hr / REMOVED | employee / REMOVED</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Employee Clearance System</h1>
        <div>
          <span>{user.role?.toUpperCase()} - {user.name || user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main>
        {user.role === 'employee' && <EmployeeView token={token} />}
        {user.role === 'manager' && <ManagerView token={token} />}
        {user.role === 'hr' && <HRView token={token} />}
        {user.role === 'admin' && <AdminView token={token} />}
      </main>
    </div>
  );
}

function EmployeeView({ token }) {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ type: '', reason: '', urgency: 'normal' });

  const fetchRequests = async () => {
    const res = await fetch(API_URL + '/requests/my', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL + '/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(form)
    });
    setForm({ type: '', reason: '', urgency: 'normal' });
    fetchRequests();
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} required>
          <option value="">Select Type</option>
          <option value="Leave Clearance">Leave Clearance</option>
          <option value="Exit Clearance">Exit Clearance</option>
          <option value="Financial Clearance">Financial Clearance</option>
        </select>
        <textarea placeholder="Reason" value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})} required />
        <button type="submit">Submit Request</button>
      </form>
      <h3>My Requests</h3>
      {requests.map(r => (
        <div key={r.id}>{r.request_no} - {r.type} - {r.status}</div>
      ))}
    </div>
  );
}

function ManagerView({ token }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch(API_URL + '/requests/team', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id, action) => {
    await fetch(API_URL + '/requests/' + id + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status: action, review_note: 'Manager reviewed' })
    });
    fetchRequests();
  };

  const pending = requests.filter(r => r.approval_level === 'manager');

  return (
    <div>
      <h2>Manager Dashboard</h2>
      {pending.map(r => (
        <div key={r.id}>
          {r.request_no} - {r.type}
          <button onClick={() => approve(r.id, 'approved')}>Approve</button>
          <button onClick={() => approve(r.id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  );
}

function HRView({ token }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch(API_URL + '/requests/team', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id, action) => {
    await fetch(API_URL + '/requests/' + id + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status: action, review_note: 'HR reviewed' })
    });
    fetchRequests();
  };

  const pending = requests.filter(r => r.approval_level === 'hr');

  return (
    <div>
      <h2>HR Dashboard</h2>
      {pending.map(r => (
        <div key={r.id}>
          {r.request_no} - {r.type}
          <button onClick={() => approve(r.id, 'approved')}>Approve</button>
          <button onClick={() => approve(r.id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  );
}

function AdminView({ token }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch(API_URL + '/requests', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id, action) => {
    await fetch(API_URL + '/requests/' + id + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status: action, review_note: 'Admin final approval' })
    });
    fetchRequests();
  };

  const pending = requests.filter(r => r.approval_level === 'admin');

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Requests: {requests.length}</p>
      <p>Approved: {requests.filter(r => r.status === 'approved').length}</p>
      <h3>Pending Admin Approval</h3>
      {pending.map(r => (
        <div key={r.id}>
          {r.request_no} - {r.type}
          <button onClick={() => approve(r.id, 'approved')}>Approve & Generate Certificate</button>
          <button onClick={() => approve(r.id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default App;
