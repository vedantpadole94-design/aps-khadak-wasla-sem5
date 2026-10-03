import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiSave, FiUser, FiCamera } from 'react-icons/fi';
import { api, assetUrl } from '../../utils/api';
import { toast } from '../../utils/toast';

const ManagePrincipal = () => {
  const [data, setData] = useState({
    name: 'Dr. Yasmin Kaur',
    qualification: 'BSc(Chemistry), MSc(Organic Chemistry), B.Ed, PGDEA',
    message: 'Greetings, dear students, parents, and educators. At APS Khadakwasla, we believe in the power of education to transform lives and shape a brighter future.',
    since: '2020',
    photo: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.list('principal').then(res => {
      if (res.data) setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('qualification', data.qualification);
      formData.append('message', data.message);
      formData.append('since', data.since);
      if (photoFile) formData.append('photo', photoFile);
      await api.updateOne('principal', formData);
      toast.success('Principal information updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const displayPhoto = photoPreview || assetUrl(data.photo);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Principal Information</h1>
          <p className="text-gray-400 text-sm mt-1">Update principal profile shown on the public website</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-60"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo Upload */}
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            {displayPhoto ? (
              <img src={displayPhoto} alt="Principal" className="w-full h-full object-cover rounded-full border-4 border-accent" />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-4 border-dashed border-primary/30">
                <FiUser className="text-5xl text-primary/30" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-2 right-2 w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-colors"
            >
              <FiCamera />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors mx-auto text-sm"
          >
            <FiUpload /> Upload Photo
          </button>
          <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
        </div>

        {/* Info Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Principal Name</label>
              <input
                value={data.name || ''}
                onChange={e => setData({ ...data, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Principal Since</label>
              <input
                value={data.since || ''}
                onChange={e => setData({ ...data, since: e.target.value })}
                placeholder="e.g. 2020"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Qualifications</label>
            <input
              value={data.qualification || ''}
              onChange={e => setData({ ...data, qualification: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Principal's Message (shown on homepage)</label>
            <textarea
              rows={10}
              value={data.message || ''}
              onChange={e => setData({ ...data, message: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePrincipal;
