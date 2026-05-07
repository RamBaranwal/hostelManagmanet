import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/students';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', rollNo: '', roomNumber: '', contact: ''
  });

  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://localhost:5000/api/rooms')
      ]);
      setStudents(studentsRes.data);
      // Only keep rooms that have space and are not in maintenance
      setAvailableRooms(roomsRes.data.filter(r => r.status === 'Available'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const response = await axios.put(`${API_URL}/${editingStudent}`, formData);
        setStudents(students.map(s => s._id === editingStudent ? response.data : s));
      } else {
        const response = await axios.post(API_URL, formData);
        setStudents([...students, response.data]);
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ name: '', email: '', rollNo: '', roomNumber: '', contact: '' });
      setErrorMsg('');
      fetchStudents(); // refresh available rooms
    } catch (error) {
      console.error('Error saving student:', error);
      setErrorMsg(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      roomNumber: student.roomNumber || '',
      contact: student.contact || ''
    });
    // Add current room to available rooms temporarily so it can be selected in dropdown
    if (student.roomNumber && !availableRooms.some(r => r.roomNumber === student.roomNumber)) {
      setAvailableRooms([...availableRooms, { _id: 'temp', roomNumber: student.roomNumber, capacity: 1, occupants: [] }]);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setStudents(students.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students Management</h1>
          <p>Manage all registered students</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingStudent(null);
          setFormData({ name: '', email: '', rollNo: '', roomNumber: '', contact: '' });
          setShowModal(true);
        }}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={20} style={{ color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Search students by name, roll no or room..." 
          className="form-control"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}
        />
      </div>

      <div className="glass-card">
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.email}</td>
                    <td>{student.roomNumber || 'Not assigned'}</td>
                    <td>{student.contact}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ padding: '0.5rem', background: 'var(--primary-color)' }} onClick={() => handleEdit(student)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(student._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              {errorMsg && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Roll Number</label>
                  <input type="text" name="rollNo" className="form-control" value={formData.rollNo} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Assign Room (Optional)</label>
                  <select name="roomNumber" className="form-control" value={formData.roomNumber} onChange={handleInputChange}>
                    <option value="">None</option>
                    {availableRooms.map(r => (
                      <option key={r._id} value={r.roomNumber}>Room {r.roomNumber} ({(r.capacity - (r.occupants ? r.occupants.length : 0))} spots)</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="text" name="contact" className="form-control" value={formData.contact} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update Student' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
