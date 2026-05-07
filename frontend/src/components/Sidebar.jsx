import { NavLink } from 'react-router-dom';
import { Home, Users, DoorOpen, Settings, CalendarCheck } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        HostelFlow
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Students</span>
        </NavLink>
        <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <DoorOpen size={20} />
          <span>Rooms</span>
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <CalendarCheck size={20} />
          <span>Attendance</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
