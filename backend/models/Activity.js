const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Success' }
});

module.exports = mongoose.model('Activity', activitySchema);
