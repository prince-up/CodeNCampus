const User = require('../models/User');
const Teacher = require('../models/Teacher');

exports.getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find()
    .populate('user', 'name email phone photo isActive')
    .populate('subjects', 'name code');
  res.json({ success: true, count: teachers.length, data: teachers });
};

exports.getTeacherById = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate('user', 'name email phone photo')
    .populate('subjects', 'name code');
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  res.json({ success: true, data: teacher });
};

exports.createTeacher = async (req, res) => {
  const { name, email, password, phone, employeeId, qualification, subjects, classes, salary, gender, designation } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });
  const user = await User.create({ name, email, password: password || 'Teacher@123', role: 'teacher', phone });
  const teacher = await Teacher.create({ user: user._id, employeeId, qualification, subjects, classes, salary, gender, designation });
  const populated = await Teacher.findById(teacher._id)
    .populate('user', 'name email phone photo')
    .populate('subjects', 'name code');
  res.status(201).json({ success: true, data: populated });
};

exports.updateTeacher = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  const { name, email, phone, employeeId, qualification, subjects, classes, salary, gender, designation, isActive } = req.body;
  await User.findByIdAndUpdate(teacher.user, { name, email, phone, isActive });
  const updated = await Teacher.findByIdAndUpdate(
    req.params.id,
    { employeeId, qualification, subjects, classes, salary, gender, designation },
    { new: true }
  ).populate('user', 'name email phone photo').populate('subjects', 'name code');
  res.json({ success: true, data: updated });
};

exports.deleteTeacher = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  await User.findByIdAndDelete(teacher.user);
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Teacher deleted successfully' });
};
