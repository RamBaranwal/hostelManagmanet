import React, { useEffect, useState } from 'react';
import { Users, DoorOpen, BedDouble, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, roomsRes, activitiesRes] = await Promise.all([
          axios.get(`http://${window.location.hostname}:5000/api/students`),
          axios.get(`http://${window.location.hostname}:5000/api/rooms`),
          axios.get(`http://${window.location.hostname}:5000/api/activities`)
        ]);
        
        const students = studentsRes.data;
        const rooms = roomsRes.data;
        
        const availableRooms = rooms.filter(r => r.status === 'Available').length;
        const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
        
        setStats({
          totalStudents: students.length,
          totalRooms: rooms.length,
          availableRooms: availableRooms,
          maintenanceRooms: maintenanceRooms
        });

        setActivities(activitiesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Total Students</h3>
            <div className="value">{stats.totalStudents}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Total Rooms</h3>
            <div className="value">{stats.totalRooms}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <BedDouble size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Available Rooms</h3>
            <div className="value">{stats.availableRooms}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            <DoorOpen size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Maintenance</h3>
            <div className="value">{stats.maintenanceRooms}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Activity</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Action</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.studentName}</td>
                  <td>{activity.action}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${activity.action === 'Student Removed' ? 'full' : activity.action === 'Room Reassigned' ? 'maintenance' : 'available'}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No recent activity</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
