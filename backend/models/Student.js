const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, unique: true },
  roomNumber: { type: String },
  contact: { type: String },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
