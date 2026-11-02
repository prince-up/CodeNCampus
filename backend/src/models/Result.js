const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String },
  remarks: { type: String, default: '' },
}, { timestamps: true });

// Auto-calculate grade before save
resultSchema.pre('save', function() {
  const percent = (this.marksObtained / this.totalMarks) * 100;
  if (percent >= 90) this.grade = 'A+';
  else if (percent >= 80) this.grade = 'A';
  else if (percent >= 70) this.grade = 'B+';
  else if (percent >= 60) this.grade = 'B';
  else if (percent >= 50) this.grade = 'C';
  else if (percent >= 33) this.grade = 'D';
  else this.grade = 'F';
});

module.exports = mongoose.model('Result', resultSchema);
