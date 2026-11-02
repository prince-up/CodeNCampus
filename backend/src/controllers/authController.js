const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  let profileData = null;
  if (user.role === 'student') {
    profileData = await Student.findOne({ user: user._id });
  } else if (user.role === 'teacher') {
    profileData = await Teacher.findOne({ user: user._id }).populate('subjects');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      phone: user.phone,
    },
    profile: profileData,
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  let profileData = null;
  if (user.role === 'student') {
    profileData = await Student.findOne({ user: user._id });
  } else if (user.role === 'teacher') {
    profileData = await Teacher.findOne({ user: user._id }).populate('subjects');
  }
  res.json({ success: true, user, profile: profileData });
};
