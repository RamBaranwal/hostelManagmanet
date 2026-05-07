import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }} onClick={handleLogout}>Logout</button>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
