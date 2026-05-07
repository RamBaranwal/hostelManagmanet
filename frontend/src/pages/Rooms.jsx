import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_URL = `http://${window.location.hostname}:5000/api/rooms`;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({ roomNumber: '', capacity: 2 });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(API_URL);
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        const response = await axios.put(`${API_URL}/${editingRoom._id}`, formData);
        setRooms(rooms.map(r => r._id === editingRoom._id ? response.data : r));
      } else {
        const response = await axios.post(API_URL, formData);
        setRooms([...rooms, response.data]);
      }
      setShowModal(false);
      setEditingRoom(null);
      setFormData({ roomNumber: '', capacity: 2 });
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving room');
    }
  };

  const handleEditClick = (room) => {
    setEditingRoom(room);
    setFormData({ roomNumber: room.roomNumber, capacity: room.capacity });
    setShowModal(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${API_URL}/${roomId}`);
      setRooms(rooms.filter(r => r._id !== roomId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting room');
    }
  };

  const handleStatusToggle = async (roomId, currentStatus, occupantsCount) => {
    try {
      let newStatus = 'Maintenance';
      if (currentStatus === 'Maintenance') {
        newStatus = occupantsCount > 0 ? 'Available' : 'Available'; // simplify, or maybe if it's full it goes to full? Actually backend patch updates status, but let's just let backend handle it or we explicitly send status
        // Let's explicitly set
      }
      
      if (currentStatus === 'Available' || currentStatus === 'Full') {
        if (occupantsCount > 0) {
          alert("Cannot put an occupied room under maintenance. Please reassign students first.");
          return;
        }
        newStatus = 'Maintenance';
      } else if (currentStatus === 'Maintenance') {
        newStatus = 'Available';
      }

      const response = await axios.patch(`${API_URL}/${roomId}`, { status: newStatus });
      setRooms(rooms.map(r => r._id === roomId ? response.data : r));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Available': return <span className="badge available">Available</span>;
      case 'Full': return <span className="badge full">Full</span>;
      case 'Maintenance': return <span className="badge maintenance">Maintenance</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rooms Management</h1>
          <p>Monitor room availability and status</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingRoom(null); setFormData({ roomNumber: '', capacity: 2 }); setShowModal(true); }}>
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="dashboard-grid">
        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p>No rooms found.</p>
        ) : (
          rooms.map(room => {
            const occCount = room.occupants ? room.occupants.length : 0;
            return (
              <div key={room._id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Room {room.roomNumber}</h3>
                    <button className="btn" style={{ padding: '0.2rem', background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => handleEditClick(room)} title="Edit Room">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn" style={{ padding: '0.2rem', background: 'transparent', color: 'var(--danger-color)' }} onClick={() => handleDelete(room._id)} title="Delete Room">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {getStatusBadge(room.status)}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p>Capacity: {room.capacity} person(s)</p>
                    <p>Occupied: {occCount}</p>
                  </div>
                  <button 
                    className="btn" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: room.status === 'Maintenance' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: room.status === 'Maintenance' ? 'var(--success-color)' : '#f59e0b' }}
                    onClick={() => handleStatusToggle(room._id, room.status, occCount)}
                  >
                    {room.status === 'Maintenance' ? 'Mark Available' : 'Set Maintenance'}
                  </button>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: room.status === 'Full' ? 'var(--danger-color)' : 
                                room.status === 'Maintenance' ? '#f59e0b' : 'var(--success-color)',
                    width: `${(occCount / room.capacity) * 100}%`
                  }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room Number</label>
                <input type="text" name="roomNumber" className="form-control" value={formData.roomNumber} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" name="capacity" className="form-control" min="1" max="10" value={formData.capacity} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => { setShowModal(false); setEditingRoom(null); setFormData({ roomNumber: '', capacity: 2 }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
