const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  section: { type: String, required: true, default: 'A' },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  address: { type: String, default: '' },
  parentName: { type: String, default: '' },
  parentPhone: { type: String, default: '' },
  admissionDate: { type: Date, default: Date.now },
  bloodGroup: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
