import API_URL from '../api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Real credentials stored here — change these to your preferred passwords
const USERS = [
  { id:1, username:'admin',    password:'REMOVED',    role:'admin',    name:'Kamau Njoroge'   },
  { id:2, username:'hr',       password:'REMOVED',       role:'hr',       name:'Aisha Mwangi'    },
  { id:3, username:'manager',  password:'REMOVED',  role:'manager',  name:'Nempiris Kiti'   },
  { id:4, username:'employee', password:'REMOVED', role:'employee', name:'Soyian Mumbi'    },
];

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    const routes = { admin:'/admin', hr:'/hr', manager:'/manager', employee:'/employee' };
    navigate(routes[role] || '/login');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Try real backend first
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
    } catch {}

    // Fallback to local credentials
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      localStorage.setItem('ecs_user', JSON.stringify(found));
      redirectByRole(found.role);
    } else {
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
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
              autoComplete="username"
            />
          </div>
          <div className="form-group" style={{ position:'relative' }}>
            <label>Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ paddingRight:'48px' }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position:'absolute', right:'12px', bottom:'12px', background:'none', border:'none', cursor:'pointer', color:'#6B7280', fontSize:'16px' }}
            >{showPass ? '🙈' : '👁️'}</button>
          </div>

          {error && <div className="login-error">⚠ {error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop:'20px', textAlign:'center', fontSize:'12px', color:'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Employee Clearance System · 
        </div>
      </div>
    </div>
  );
}

export default Login;