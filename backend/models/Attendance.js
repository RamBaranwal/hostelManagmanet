const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Present' }
});

// Ensure one record per student per day
attendanceSchema.index({ date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
