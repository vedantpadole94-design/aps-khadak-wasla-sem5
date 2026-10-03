const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: '', trim: true, maxlength: 500 },
  date: { type: Date, required: true, index: true },
  endDate: { type: Date },
  category: { type: String, required: true, trim: true, default: 'Event', maxlength: 40 },
  color: { type: String, default: '#7c3aed', match: /^#[0-9a-fA-F]{6}$/ },
  startTime: { type: String, default: '', match: /^$|^(?:[01]\d|2[0-3]):[0-5]\d$/ },
  endTime: { type: String, default: '', match: /^$|^(?:[01]\d|2[0-3]):[0-5]\d$/ },
  venue: { type: String, default: '', trim: true, maxlength: 100 },
  attachment: { type: String, default: '' },
  isRecurring: { type: Boolean, default: false },
  recurrenceType: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
  recurrenceEnd: { type: Date },
  showOnPublic: { type: Boolean, default: true },
  showAsPopup: { type: Boolean, default: false },
  notifyAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

EventSchema.index({ date: 1, category: 1 });
EventSchema.index({ isActive: 1, showOnPublic: 1, date: 1 });

module.exports = mongoose.model('Event', EventSchema);
