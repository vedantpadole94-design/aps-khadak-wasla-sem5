import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { api, assetUrl } from '../../utils/api';
import { toast } from '../../utils/toast';

const ManageGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [caption, setCaption] = useState('');
  const [cat, setCat] = useState('Events');
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    api.list('gallery')
      .then((response) => {
        if (isCurrent) setPhotos(response.data || []);
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load gallery photos.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Select a valid image file');
      e.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Images must be 10 MB or smaller');
      e.target.value = '';
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageFile) return toast.error('Select an image first');
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption.trim());
      formData.append('category', cat);
      const response = await api.create('gallery', formData);
      setPhotos((previous) => [response.data, ...previous]);
      setImageFile(null);
      setPreviewUrl('');
      setCaption('');
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error(error.message || 'Unable to upload photo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.remove('gallery', id);
      setPhotos((previous) => previous.filter((photo) => photo._id !== id));
      toast.success('Photo deleted');
    } catch (error) {
      toast.error(error.message || 'Unable to delete photo');
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Gallery Management</h1>
      <p className="text-gray-400 text-sm mb-8">{photos.length} photos total</p>

      {/* Upload Section */}
      {loadError && <p role="alert" className="mb-4 text-red-700">{loadError}</p>}
      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <h2 className="font-heading text-xl font-bold text-primary mb-6">Upload New Photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-accent transition-colors">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                <FiUpload className="text-4xl mb-2" />
                <p className="text-sm">Click to select image</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="gallery-upload" />
            <label htmlFor="gallery-upload" className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
              Browse File
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Caption</label>
              <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Photo caption..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none text-sm">
                {['Republic Day','Independence Day','Annual Day','Sports Day','Festivals','Science Exhibition','Award Ceremony'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <button onClick={handleUpload} disabled={saving} className="w-full py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              <FiUpload /> {saving ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="relative group rounded-xl overflow-hidden shadow aspect-square"
          >
            <img src={assetUrl(p.url)} alt={p.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-white text-xs text-center px-2">{p.caption}</p>
              <button onClick={() => handleDelete(p._id)} aria-label={`Delete ${p.caption || 'photo'}`} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                <FiTrash2 />
              </button>
            </div>
            <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">{p.category}</span>
          </motion.div>
        ))}
      </div>
      {loading && <p className="text-center py-10 text-gray-500">Loading gallery...</p>}
    </div>
  );
};

export default ManageGallery;
