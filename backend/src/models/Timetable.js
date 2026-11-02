const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  periodNo: Number,
  startTime: String,
  endTime: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
});

const timetableSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: { type: String, required: true },
  day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], required: true },
  periods: [periodSchema],
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
