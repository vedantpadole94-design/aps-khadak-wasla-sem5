const mongoose = require('mongoose');
const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  isActive: { type: Boolean, default: true },
  isPopup: { type: Boolean, default: false },
  isTicker: { type: Boolean, default: false },
  expiresAt: { type: Date },
  category: { type: String, default: 'General' },
}, { timestamps: true });
module.exports = mongoose.model('Notice', NoticeSchema);
