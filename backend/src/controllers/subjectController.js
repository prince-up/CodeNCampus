const Subject = require('../models/Subject');

exports.getAllSubjects = async (req, res) => {
  const { class: cls } = req.query;
  const filter = cls ? { class: cls } : {};
  const subjects = await Subject.find(filter).populate({
    path: 'teacher',
    populate: { path: 'user', select: 'name' }
  });
  res.json({ success: true, data: subjects });
};

exports.createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, data: subject });
};

exports.updateSubject = async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: subject });
};

exports.deleteSubject = async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Subject deleted' });
};
