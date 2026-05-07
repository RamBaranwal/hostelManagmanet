import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        axios.get('http://localhost:5000/api/students'),
        axios.get(`http://localhost:5000/api/attendance/${date}`)
      ]);
      
      const sortedStudents = studentsRes.data.sort((a, b) => {
        if (!a.roomNumber && !b.roomNumber) return 0;
        if (!a.roomNumber) return 1;
        if (!b.roomNumber) return -1;
        return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: 'base' });
      });
      
      setStudents(sortedStudents);
      
      // Map attendance data
      const attMap = {};
      attendanceRes.data.forEach(record => {
        attMap[record.student._id || record.student] = record.status;
      });
      setAttendance(attMap);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
    setLoading(false);
  };

  const markAttendance = async (studentId, status) => {
    try {
      await axios.post('http://localhost:5000/api/attendance', {
        date,
        studentId,
        status
      });
      setAttendance({ ...attendance, [studentId]: status });
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Student Attendance</h1>
          <p>Track daily attendance for all students</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
          <Calendar size={20} style={{ color: 'var(--primary-color)' }} />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0 }}
          />
        </div>
      </div>

      <div className="glass-card">
        {loading ? (
          <p>Loading records...</p>
        ) : students.length === 0 ? (
          <p>No students found. Please add students first.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.roomNumber || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        !student.roomNumber ? '' :
                        attendance[student._id] === 'Present' ? 'available' : 
                        attendance[student._id] === 'Absent' ? 'full' : 
                        attendance[student._id] === 'Leave' ? 'maintenance' : ''
                      }`}>
                        {!student.roomNumber ? 'No Room' : (attendance[student._id] || 'Not Marked')}
                      </span>
                    </td>
                    <td>
                      {student.roomNumber ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn" 
                            style={{ padding: '0.4rem', background: attendance[student._id] === 'Present' ? 'rgba(34, 197, 94, 0.2)' : 'transparent', color: 'var(--success-color)' }}
                            onClick={() => markAttendance(student._id, 'Present')}
                            title="Present"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '0.4rem', background: attendance[student._id] === 'Absent' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: 'var(--danger-color)' }}
                            onClick={() => markAttendance(student._id, 'Absent')}
                            title="Absent"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '0.4rem', background: attendance[student._id] === 'Leave' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', color: '#f59e0b' }}
                            onClick={() => markAttendance(student._id, 'Leave')}
                            title="Leave"
                          >
                            <Clock size={18} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Needs Room Assignment</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
