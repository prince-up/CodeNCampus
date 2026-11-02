const User = require('../models/User');
const Student = require('../models/Student');

exports.getAllStudents = async (req, res) => {
  const students = await Student.find().populate('user', 'name email phone photo isActive');
  res.json({ success: true, count: students.length, data: students });
};

exports.getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('user', 'name email phone photo');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
};

exports.createStudent = async (req, res) => {
  const { name, email, password, phone, rollNo, class: cls, section, dob, gender, address, parentName, parentPhone, bloodGroup } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });
  const user = await User.create({ name, email, password: password || 'Student@123', role: 'student', phone });
  const student = await Student.create({ user: user._id, rollNo, class: cls, section, dob, gender, address, parentName, parentPhone, bloodGroup });
  const populated = await Student.findById(student._id).populate('user', 'name email phone photo');
  res.status(201).json({ success: true, data: populated });
};

exports.updateStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  const { name, email, phone, rollNo, class: cls, section, dob, gender, address, parentName, parentPhone, bloodGroup, isActive } = req.body;
  await User.findByIdAndUpdate(student.user, { name, email, phone, isActive });
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    { rollNo, class: cls, section, dob, gender, address, parentName, parentPhone, bloodGroup },
    { new: true }
  ).populate('user', 'name email phone photo');
  res.json({ success: true, data: updatedStudent });
};

exports.deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  await User.findByIdAndDelete(student.user);
  await Student.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Student deleted successfully' });
};
