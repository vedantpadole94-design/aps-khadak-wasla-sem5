const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
  emoji: { type: String, default: '📅', maxlength: 8 },
  color: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  order: { type: Number, default: 0, min: 0 },
  isSystem: { type: Boolean, default: false, select: false }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
