const Notice = require('../models/Notice');

exports.getAllNotices = async (req, res) => {
  const { role, class: cls } = req.query;
  let filter = {};
  if (role && role !== 'admin') {
    filter.$or = [{ targetRole: 'all' }, { targetRole: role }];
  }
  if (cls) {
    filter.$or = filter.$or
      ? [...filter.$or, { targetClass: cls }]
      : [{ targetClass: '' }, { targetClass: cls }];
  }
  const notices = await Notice.find(filter).populate('createdBy', 'name').sort('-date');
  res.json({ success: true, data: notices });
};

exports.createNotice = async (req, res) => {
  const notice = await Notice.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: notice });
};

exports.updateNotice = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: notice });
};

exports.deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Notice deleted' });
};
