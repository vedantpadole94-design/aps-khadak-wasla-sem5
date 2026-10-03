const mongoose = require('mongoose');
const ResultSchema = new mongoose.Schema({
  classLevel: { type: String, enum: ['X', 'XII'], required: true },
  year: { type: String, required: true },
  registered: { type: Number, required: true },
  passed: { type: Number, required: true },
  percentage: { type: String, required: true },
  remarks: { type: String, default: '-' },
}, { timestamps: true });
module.exports = mongoose.model('Result', ResultSchema);
