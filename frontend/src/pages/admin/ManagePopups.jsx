import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const emptyForm = {
  title: '',
  message: '',
  image: '',
  isActive: true,
  delay: 2,
  autoDismiss: 0,
  showOnPages: ['home']
};

const ManagePopups = () => {
  const [popups, setPopups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    api.list('popups').then(res => setPopups(res.data || [])).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.message) return toast.error('Title and message required');
    try {
      if (editId) {
        const res = await api.update('popups', editId, form);
        setPopups(prev => prev.map(p => p._id === editId ? (res.data || { ...form, _id: editId }) : p));
      } else {
        const res = await api.create('popups', form);
        setPopups(prev => [res.data || { ...form, _id: Date.now() }, ...prev]);
      }
      toast.success('Saved!');
      setShowModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete popup?')) return;
    try {
      await api.remove('popups', id);
      setPopups(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (p) => {
    try {
      await api.update('popups', p._id, { isActive: !p.isActive });
      setPopups(prev => prev.map(x => x._id === p._id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast.error('Failed to toggle'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Popup Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">Create site-wide popup announcements</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold"
        >
          <FiPlus /> Create Popup
        </button>
      </div>

      <div className="space-y-4">
        {popups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">🔔</p>
            <p className="font-heading text-xl">No popups yet</p>
            <p className="text-sm mt-2">Create your first popup announcement above</p>
          </div>
        ) : (
          popups.map((p, i) => (
            <motion.div key={p._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-800">{p.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{p.message.slice(0, 80)}{p.message.length > 80 ? '...' : ''}</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs text-gray-400">Delay: {p.delay}s</span>
                  {p.autoDismiss > 0 && <span className="text-xs text-gray-400">Auto-close: {p.autoDismiss}s</span>}
                  {p.showOnPages?.length > 0 && <span className="text-xs text-gray-400">Pages: {p.showOnPages.join(', ')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => setShowPreview(p)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Preview"><FiEye /></button>
                <button onClick={() => handleToggle(p)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${p.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${p.isActive ? 'left-7' : 'left-1'}`}></span>
                </button>
                <button onClick={() => { setForm({ ...p }); setEditId(p._id); setShowModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 /></button>
                <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FiTrash2 /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-bold text-primary">{editId ? 'Edit' : 'Create'} Popup</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
                  <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL (optional)</label>
                  <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Delay (seconds)</label>
                    <input type="number" min={0} value={form.delay} onChange={e => setForm({ ...form, delay: +e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Auto-dismiss (0 = manual)</label>
                    <input type="number" min={0} value={form.autoDismiss} onChange={e => setForm({ ...form, autoDismiss: +e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  <span className="text-sm">Active (visible on site)</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowPreview(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {showPreview.image && (
                <img src={showPreview.image} alt="Popup" className="w-full h-48 object-cover" />
              )}
              <div className="p-8 text-center">
                <h3 className="font-heading text-2xl font-bold text-primary mb-3">{showPreview.title}</h3>
                <p className="text-gray-600">{showPreview.message}</p>
                <button onClick={() => setShowPreview(null)} className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-semibold">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePopups;
