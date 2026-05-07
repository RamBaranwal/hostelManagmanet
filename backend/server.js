require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authMiddleware = require('./middleware/auth');
const Admin = require('./models/Admin');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/activities', authMiddleware, activityRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    // Seed default admin if none exists
    try {
      const adminExists = await Admin.findOne({ username: 'admin' });
      if (!adminExists) {
        await Admin.create({ username: 'admin', password: 'admin123' });
        console.log('Default admin user created');
      }
    } catch (err) {
      console.error('Error seeding admin', err);
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB. The backend is running without a database connection.');
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
