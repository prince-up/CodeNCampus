const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

exports.markAttendance = async (req, res) => {
  const { records, subjectId, class: cls, section, date } = req.body;
  // records = [{ studentId, status }]
  const attendanceDate = new Date(date);
  const ops = records.map(r => ({
    updateOne: {
      filter: { student: r.studentId, subject: subjectId, date: attendanceDate },
      update: {
        $set: {
          student: r.studentId,
          subject: subjectId,
          class: cls,
          section,
          date: attendanceDate,
          status: r.status,
          markedBy: req.teacher ? req.teacher._id : null
        }
      },
      upsert: true
    }
  }));
  await Attendance.bulkWrite(ops);
  res.json({ success: true, message: 'Attendance marked successfully' });
};

exports.getAttendanceByStudent = async (req, res) => {
  const { studentId } = req.params;
  const { month, year } = req.query;
  let filter = { student: studentId };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    filter.date = { $gte: start, $lte: end };
  }
  const attendance = await Attendance.find(filter).populate('subject', 'name code').sort('-date');
  const total = attendance.length;
  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const late = attendance.filter(a => a.status === 'late').length;
  const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
  res.json({ success: true, data: attendance, stats: { total, present, absent, late, percentage } });
};

exports.getAttendanceByClass = async (req, res) => {
  const { cls, section } = req.params;
  const { date, subjectId } = req.query;
  let filter = { class: cls, section };
  if (date) filter.date = new Date(date);
  if (subjectId) filter.subject = subjectId;
  const attendance = await Attendance.find(filter)
    .populate('student')
    .populate('subject', 'name');
  res.json({ success: true, data: attendance });
};

exports.getAttendanceReport = async (req, res) => {
  const students = await Student.find().populate('user', 'name');
  const report = await Promise.all(students.map(async (s) => {
    const total = await Attendance.countDocuments({ student: s._id });
    const present = await Attendance.countDocuments({ student: s._id, status: { $in: ['present', 'late'] } });
    return {
      student: s,
      totalClasses: total,
      present,
      percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0
    };
  }));
  res.json({ success: true, data: report });
};
