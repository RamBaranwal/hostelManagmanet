import React, { useState } from 'react';
import axios from 'axios';
import { Shield } from 'lucide-react';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        setAuth(true);
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', marginBottom: '1rem', width: '64px', height: '64px' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ margin: 0 }}>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Sign in to manage the hostel</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" required className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
