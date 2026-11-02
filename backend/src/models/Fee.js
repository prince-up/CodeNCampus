const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ['paid', 'pending', 'partial'], default: 'pending' },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  receiptNo: { type: String },
  feeType: { type: String, default: 'Tuition Fee' },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
