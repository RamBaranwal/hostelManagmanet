const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

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

module.exports = router;
