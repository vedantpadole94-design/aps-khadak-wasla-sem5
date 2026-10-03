const mongoose = require('mongoose');
const SiteSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: 'Army Public School Khadakwasla' },
  email: { type: String, default: 'apskhadakwasla1@gmail.com' },
  phone: { type: String, default: '020-25290084' },
  address: { type: String, default: 'Barrack No. 03, Opp Gole Market, NDA Khadakwasla, Pune 411023' },
  principalName: { type: String, default: 'Dr. Yasmin Kaur' },
  enquiryEmail: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  youtube: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
