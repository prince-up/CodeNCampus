const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/students', require('./src/routes/studentRoutes'));
app.use('/api/teachers', require('./src/routes/teacherRoutes'));
app.use('/api/classes', require('./src/routes/classRoutes'));
app.use('/api/subjects', require('./src/routes/subjectRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/exams', require('./src/routes/examRoutes'));
app.use('/api/fees', require('./src/routes/feeRoutes'));
app.use('/api/notices', require('./src/routes/noticeRoutes'));
app.use('/api/timetable', require('./src/routes/timetableRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

app.get('/', (req, res) => res.json({ message: 'CodeNCampus API Running' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5005;

async function start() {
  let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codencampus';
  
  try {
    // Attempt local MongoDB first
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to local MongoDB');
  } catch (err) {
    console.log('Local MongoDB not found. Starting in-memory MongoDB server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB');

    // Auto-seed demo data if running in-memory
    console.log('Populating demo seed data...');
    try {
      const { runSeed } = require('./src/utils/seedRunner');
      await runSeed();
      console.log('Demo seed data populated successfully!');
    } catch (seedErr) {
      console.error('Seed error:', seedErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

start();
