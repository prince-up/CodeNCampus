const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  term: { type: String, enum: ['Term1', 'Term2', 'Final', 'Unit Test'], required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  totalMarks: { type: Number, default: 100 },
  passingMarks: { type: Number, default: 33 },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
