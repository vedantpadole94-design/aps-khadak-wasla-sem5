const mongoose = require('mongoose');
const PrincipalSchema = new mongoose.Schema({
  name: { type: String, default: 'Dr. Yasmin Kaur' },
  qualification: { type: String, default: 'BSc(Chemistry), MSc(Organic Chemistry), B.Ed, PGDEA' },
  message: { type: String, default: '' },
  photo: { type: String, default: '' },
  since: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Principal', PrincipalSchema);
