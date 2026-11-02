const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  qualification: { type: String, default: '' },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  classes: [{ type: String }],
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number, default: 0 },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  designation: { type: String, default: 'Teacher' },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
