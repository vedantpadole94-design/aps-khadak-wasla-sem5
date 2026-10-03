const mongoose = require('mongoose');
const PopupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  delay: { type: Number, default: 2 },
  autoDismiss: { type: Number, default: 0 },
  expiresAt: { type: Date },
  showOnPages: { type: [String], default: ['home'] },
}, { timestamps: true });
module.exports = mongoose.model('Popup', PopupSchema);
