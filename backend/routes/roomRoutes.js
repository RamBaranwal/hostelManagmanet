const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Student = require('../models/Student');
const Activity = require('../models/Activity');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('occupants');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a room
router.post('/', async (req, res) => {
  const room = new Room({
    roomNumber: req.body.roomNumber,
    capacity: req.body.capacity
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update room
router.patch('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (req.body.status) {
      room.status = req.body.status;
    }
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update room details (PUT)
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const oldRoomNumber = room.roomNumber;
    const newRoomNumber = req.body.roomNumber;

    if (req.body.capacity < room.occupants.length) {
      return res.status(400).json({ message: 'Cannot reduce capacity below current occupant count.' });
    }

    room.roomNumber = newRoomNumber;
    room.capacity = req.body.capacity;
    
    // If capacity increased and it was full, mark it available
    if (room.status === 'Full' && room.occupants.length < room.capacity) {
      room.status = 'Available';
    } else if (room.status === 'Available' && room.occupants.length >= room.capacity) {
      room.status = 'Full';
    }

    const updatedRoom = await room.save();

    // If room number changed, update all students inside it
    if (oldRoomNumber !== newRoomNumber) {
      await Student.updateMany({ roomNumber: oldRoomNumber }, { roomNumber: newRoomNumber });
    }

    await Activity.create({ studentName: `Room ${newRoomNumber}`, action: 'Room Updated' });
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (room.occupants && room.occupants.length > 0) {
      return res.status(400).json({ message: 'Cannot delete an occupied room. Please remove or reassign students first.' });
    }

    await Room.findByIdAndDelete(req.params.id);
    await Activity.create({ studentName: `Room ${room.roomNumber}`, action: 'Room Deleted', status: 'full' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
