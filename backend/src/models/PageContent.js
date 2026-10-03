const mongoose = require('mongoose');
const PageContentSchema = new mongoose.Schema({
  pageKey: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  content: { type: Object, default: {} },
}, { timestamps: true });
module.exports = mongoose.model('PageContent', PageContentSchema);
