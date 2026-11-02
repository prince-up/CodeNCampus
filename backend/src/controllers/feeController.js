const Fee = require('../models/Fee');

exports.getAllFees = async (req, res) => {
  const { studentId, status } = req.query;
  const filter = {};
  if (studentId) filter.student = studentId;
  if (status) filter.status = status;
  const fees = await Fee.find(filter)
    .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
    .sort('-createdAt');
  res.json({ success: true, data: fees });
};

exports.createFee = async (req, res) => {
  const receiptNo = 'RCP' + Date.now();
  const fee = await Fee.create({ ...req.body, receiptNo });
  res.status(201).json({ success: true, data: fee });
};

exports.updateFee = async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: fee });
};

exports.getFeesByStudent = async (req, res) => {
  const fees = await Fee.find({ student: req.params.studentId }).sort('-year -month');
  const totalDue = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  res.json({ success: true, data: fees, stats: { totalDue, totalPaid, balance: totalDue - totalPaid } });
};

exports.getFeeCollection = async (req, res) => {
  const { month, year } = req.query;
  const filter = {};
  if (month) filter.month = month;
  if (year) filter.year = parseInt(year);
  const fees = await Fee.find(filter);
  const total = fees.reduce((sum, f) => sum + f.amount, 0);
  const collected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const pending = total - collected;
  res.json({ success: true, stats: { total, collected, pending }, data: fees });
};
