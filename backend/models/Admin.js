const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Should be hashed, but for MVP we might just store plaintext or use bcrypt
});

module.exports = mongoose.model('Admin', adminSchema);
