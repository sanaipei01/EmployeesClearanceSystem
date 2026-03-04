import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const DEMO_USERS = [
  { id: 1, username: 'admin',    password: 'admin123',   role: 'admin',    name: 'System Admin' },
  { id: 2, username: 'hr',       password: 'hr123',      role: 'hr',       name: 'HR Officer' },
  { id: 3, username: 'manager',  password: 'manager123', role: 'manager',  name: 'Dept Manager' },
  { id: 4, username: 'employee', password: 'emp123',     role: 'employee', name: 'John Employee' },
];

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('ecs_user', JSON.stringify(data.user));
        localStorage.setItem('ecs_token', data.token);
        redirectByRole(data.user.role);
        return;
      }
    } catch (err) {
      // backend not running, use demo
    }

    const found = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (found) {
      localStorage.setItem('ecs_user', JSON.stringify(found));
      redirectByRole(found.role);
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    const routes = { admin: '/admin', hr: '/hr', manager: '/manager', employee: '/employee' };
    navigate(routes[role] || '/login');
  };

  const fillDemo = (role) => {
    const u = DEMO_USERS.find(d => d.role === role);
    setUsername(u.username);
    setPassword(u.password);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb orb1" />
        <div className="login-orb orb2" />
        <div className="login-grid" />
      </div>

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo">ECS</div>
          <h1>Employee Clearance System</h1>
          <p>Secure. Efficient. Transparent.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">⚠ {error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Quick Demo Login:</p>
          <div className="demo-btns">
            {['admin','hr','manager','employee'].map(role => (
              <button key={role} className="demo-btn" type="button" onClick={() => fillDemo(role)}>
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;