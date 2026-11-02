const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');
const Result = require('../models/Result');

exports.getAdminStats = async (req, res) => {
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();
  const totalNotices = await Notice.countDocuments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalTodayAttendance = await Attendance.countDocuments({ date: { $gte: today } });
  const presentToday = await Attendance.countDocuments({ date: { $gte: today }, status: 'present' });
  const attendancePercent = totalTodayAttendance > 0
    ? ((presentToday / totalTodayAttendance) * 100).toFixed(1)
    : 0;

  const fees = await Fee.find();
  const totalFee = fees.reduce((s, f) => s + f.amount, 0);
  const collectedFee = fees.reduce((s, f) => s + f.paidAmount, 0);

  // Class-wise student count
  const classStats = await Student.aggregate([
    { $group: { _id: '$class', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalStudents,
      totalTeachers,
      totalNotices,
      attendancePercent,
      totalFee,
      collectedFee,
      pendingFee: totalFee - collectedFee,
      classStats,
    }
  });
};
