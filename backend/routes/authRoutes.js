const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (password !== admin.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.json({ token, user: { username: admin.username, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Password
router.put('/update-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (currentPassword !== admin.password) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
