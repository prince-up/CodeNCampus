const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
  const { cls, section } = req.params;
  const timetable = await Timetable.find({ class: cls, section })
    .populate({ path: 'periods.subject', select: 'name code' })
    .populate({ path: 'periods.teacher', populate: { path: 'user', select: 'name' } })
    .sort('day');
  res.json({ success: true, data: timetable });
};

exports.saveTimetable = async (req, res) => {
  const { class: cls, section, day, periods } = req.body;
  const timetable = await Timetable.findOneAndUpdate(
    { class: cls, section, day },
    { $set: { periods } },
    { upsert: true, new: true }
  );
  res.json({ success: true, data: timetable });
};

exports.deleteTimetable = async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Timetable deleted' });
};
