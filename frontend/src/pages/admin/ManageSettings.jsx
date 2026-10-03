import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiGlobe, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const ManageSettings = () => {
  const [settings, setSettings] = useState({
    schoolName: 'Army Public School Khadakwasla',
    email: 'apskhadakwasla1@gmail.com',
    phone: '020-25290084',
    address: 'Barrack No. 03, Opp Gole Market, NDA Khadakwasla, Pune 411023',
    principalName: 'Dr. Yasmin Kaur',
    enquiryEmail: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.list('settings').then(res => {
      if (res.data) setSettings(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateOne('settings', settings);
      toast.success('Settings saved successfully!');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-shadow";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Site Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage school contact details and social links</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-60"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save All'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* School Info */}
        <div className="bg-white rounded-2xl shadow p-8 space-y-5">
          <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
            <FiGlobe className="text-accent" /> School Information
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">School Name</label>
            <input value={settings.schoolName} onChange={e => setSettings({ ...settings, schoolName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Principal Name</label>
            <input value={settings.principalName} onChange={e => setSettings({ ...settings, principalName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide flex items-center gap-1">
              <FiMapPin className="inline" /> Address
            </label>
            <textarea rows={3} value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })}
              className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow p-8 space-y-5">
          <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
            <FiPhone className="text-accent" /> Contact Details
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Phone Number</label>
            <input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide flex items-center gap-1">
              <FiMail className="inline" /> School Email
            </label>
            <input value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Enquiry Notification Email</label>
            <input value={settings.enquiryEmail} onChange={e => setSettings({ ...settings, enquiryEmail: e.target.value })} className={inputClass} />
          </div>
        </div>

        {/* Social Links */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
          <h2 className="font-heading text-xl font-bold text-primary mb-5">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['facebook', 'Facebook URL', '🔵'],
              ['instagram', 'Instagram URL', '🟣'],
              ['twitter', 'Twitter / X URL', '⚫'],
              ['youtube', 'YouTube URL', '🔴']
            ].map(([key, label, emoji]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  {emoji} {label}
                </label>
                <input value={settings[key]} onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder="https://..." className={inputClass} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSettings;
