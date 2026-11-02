const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true, default: 'A' },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  capacity: { type: Number, default: 40 },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
