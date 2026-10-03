const mongoose = require('mongoose');
const EnquirySchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  classSeeking: { type: String, required: true },
  message: { type: String, default: '' },
  source: { type: String, default: '' },
  contactTime: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
  notes: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Enquiry', EnquirySchema);
