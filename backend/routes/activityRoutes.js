const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Get recent activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 }).limit(5);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
