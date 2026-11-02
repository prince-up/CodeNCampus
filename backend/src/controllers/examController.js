const Exam = require('../models/Exam');
const Result = require('../models/Result');

exports.getAllExams = async (req, res) => {
  const { class: cls } = req.query;
  const filter = cls ? { class: cls } : {};
  const exams = await Exam.find(filter).sort('-startDate');
  res.json({ success: true, data: exams });
};

exports.createExam = async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json({ success: true, data: exam });
};

exports.updateExam = async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: exam });
};

exports.deleteExam = async (req, res) => {
  await Exam.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Exam deleted' });
};

exports.getResultsByExam = async (req, res) => {
  const results = await Result.find({ exam: req.params.id })
    .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
    .populate('subject', 'name code');
  res.json({ success: true, data: results });
};

exports.getResultsByStudent = async (req, res) => {
  const results = await Result.find({ student: req.params.studentId })
    .populate('exam', 'name term totalMarks')
    .populate('subject', 'name code');
  res.json({ success: true, data: results });
};

exports.saveResults = async (req, res) => {
  // req.body.results = [{studentId, examId, subjectId, marksObtained, totalMarks}]
  const { results } = req.body;
  const saved = [];
  for (const r of results) {
    const result = await Result.findOneAndUpdate(
      { student: r.studentId, exam: r.examId, subject: r.subjectId },
      { $set: { marksObtained: r.marksObtained, totalMarks: r.totalMarks } },
      { upsert: true, new: true }
    );
    // Recalculate grade
    const percent = (r.marksObtained / r.totalMarks) * 100;
    let grade = 'F';
    if (percent >= 90) grade = 'A+';
    else if (percent >= 80) grade = 'A';
    else if (percent >= 70) grade = 'B+';
    else if (percent >= 60) grade = 'B';
    else if (percent >= 50) grade = 'C';
    else if (percent >= 33) grade = 'D';
    result.grade = grade;
    await result.save();
    saved.push(result);
  }
  res.json({ success: true, data: saved });
};
