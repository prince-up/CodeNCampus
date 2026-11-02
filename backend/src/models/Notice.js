const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  targetRole: { type: String, enum: ['all', 'student', 'teacher'], default: 'all' },
  targetClass: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
