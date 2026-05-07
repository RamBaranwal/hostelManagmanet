const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Room = require('../models/Room');
const Activity = require('../models/Activity');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a student and book room
router.post('/', async (req, res) => {
  let targetRoom = null;

  if (req.body.roomNumber) {
    targetRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    
    if (!targetRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (targetRoom.status === 'Maintenance') {
      return res.status(400).json({ message: 'Room is under maintenance and cannot be booked.' });
    }
    
    if (targetRoom.status === 'Full' || targetRoom.occupants.length >= targetRoom.capacity) {
      return res.status(400).json({ message: 'Room is fully occupied.' });
    }
  }

  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    rollNo: req.body.rollNo,
    roomNumber: req.body.roomNumber || '',
    contact: req.body.contact
  });

  try {
    const newStudent = await student.save();

    // If room assigned, update the room
    if (targetRoom) {
      targetRoom.occupants.push(newStudent._id);
      if (targetRoom.occupants.length >= targetRoom.capacity) {
        targetRoom.status = 'Full';
      }
      await targetRoom.save();
    }

    await Activity.create({ studentName: newStudent.name, action: 'New Registration' });

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student and free up room
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // If student had a room, remove them from room and update status
    if (student.roomNumber) {
      const room = await Room.findOne({ roomNumber: student.roomNumber });
      if (room) {
        room.occupants = room.occupants.filter(occ => occ.toString() !== student._id.toString());
        if (room.status === 'Full' && room.occupants.length < room.capacity) {
          room.status = 'Available';
        }
        await room.save();
      }
    }

    await Student.findByIdAndDelete(req.params.id);
    await Activity.create({ studentName: student.name, action: 'Student Removed', status: 'Success' });
    res.json({ message: 'Deleted Student and freed room' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const newRoomNumber = req.body.roomNumber || '';
    const oldRoomNumber = student.roomNumber;

    if (oldRoomNumber !== newRoomNumber) {
      // Handle old room
      if (oldRoomNumber) {
        const oldRoom = await Room.findOne({ roomNumber: oldRoomNumber });
        if (oldRoom) {
          oldRoom.occupants = oldRoom.occupants.filter(occ => occ.toString() !== student._id.toString());
          if (oldRoom.status === 'Full' && oldRoom.occupants.length < oldRoom.capacity) {
            oldRoom.status = 'Available';
          }
          await oldRoom.save();
        }
      }

      // Handle new room
      if (newRoomNumber) {
        const newRoom = await Room.findOne({ roomNumber: newRoomNumber });
        if (!newRoom) return res.status(404).json({ message: 'New room not found' });
        if (newRoom.status === 'Maintenance') return res.status(400).json({ message: 'New room is under maintenance' });
        if (newRoom.status === 'Full' || newRoom.occupants.length >= newRoom.capacity) return res.status(400).json({ message: 'New room is fully occupied' });
        
        newRoom.occupants.push(student._id);
        if (newRoom.occupants.length >= newRoom.capacity) {
          newRoom.status = 'Full';
        }
        await newRoom.save();
      }
    }

    student.name = req.body.name;
    student.email = req.body.email;
    student.rollNo = req.body.rollNo;
    student.roomNumber = newRoomNumber;
    student.contact = req.body.contact;

    const updatedStudent = await student.save();
    
    let action = 'Profile Updated';
    if (oldRoomNumber !== newRoomNumber) {
      action = 'Room Reassigned';
    }
    await Activity.create({ studentName: updatedStudent.name, action });

    res.json(updatedStudent);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
