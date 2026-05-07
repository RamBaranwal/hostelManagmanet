const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Get attendance for a specific date
router.get('/:date', async (req, res) => {
  try {
    const records = await Attendance.find({ date: req.params.date }).populate('student');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark/Update attendance
router.post('/', async (req, res) => {
  const { date, studentId, status } = req.body;
  try {
    let record = await Attendance.findOne({ date, student: studentId });
    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = new Attendance({ date, student: studentId, status });
      await record.save();
    }
    const populatedRecord = await Attendance.findById(record._id).populate('student');
    res.json(populatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
