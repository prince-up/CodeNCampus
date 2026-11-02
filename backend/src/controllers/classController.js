const Class = require('../models/Class');

exports.getAllClasses = async (req, res) => {
  const classes = await Class.find().populate({
    path: 'classTeacher',
    populate: { path: 'user', select: 'name' }
  });
  res.json({ success: true, data: classes });
};

exports.createClass = async (req, res) => {
  const cls = await Class.create(req.body);
  res.status(201).json({ success: true, data: cls });
};

exports.updateClass = async (req, res) => {
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: cls });
};

exports.deleteClass = async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Class deleted' });
};
