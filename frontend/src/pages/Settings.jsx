import React, { useState } from 'react';
import axios from 'axios';
import { Save, User, Shield } from 'lucide-react';

const Settings = () => {
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.new !== password.confirm) {
      setMessage("Passwords don't match!");
      return;
    }
    
    try {
      const response = await axios.put('http://localhost:5000/api/auth/update-password', {
        currentPassword: password.current,
        newPassword: password.new
      });
      setMessage(response.data.message || "Password updated successfully!");
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and security</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <User size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Admin Profile</h2>
          </div>
          
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" value="admin" disabled />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" defaultValue="admin@hostelflow.com" />
          </div>
          <button className="btn btn-primary" onClick={() => alert('Profile updated!')}>
            <Save size={18} /> Update Profile
          </button>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
              <Shield size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Security</h2>
          </div>
          
          {message && (
            <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? '#10b981' : 'var(--danger-color)', textAlign: 'center' }}>
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" required className="form-control" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" required className="form-control" value={password.new} onChange={e => setPassword({...password, new: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" required className="form-control" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: 'var(--danger-color)', boxShadow: 'none' }}>
              <Save size={18} /> Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
