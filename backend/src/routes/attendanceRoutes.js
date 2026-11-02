const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
  getAttendanceReport,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/mark', authorize('admin', 'teacher'), markAttendance);
router.get('/report', authorize('admin'), getAttendanceReport);
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/class/:cls/:section', authorize('admin', 'teacher'), getAttendanceByClass);

module.exports = router;
