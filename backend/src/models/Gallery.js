const mongoose = require('mongoose');
const GallerySchema = new mongoose.Schema({
  caption: { type: String, default: '' },
  url: { type: String, required: true },
  category: { type: String, default: 'General' },
  date: { type: String, default: '' },
  isCover: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Gallery', GallerySchema);
