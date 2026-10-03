import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBell } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const emptyForm = {
  title: '',
  content: '',
  priority: 'medium',
  category: 'General',
  isActive: true,
  isPopup: false,
  isTicker: false,
  expiresAt: ''
};

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    api.list('notices/all')
      .then((response) => {
        if (isCurrent) setNotices(response.data || []);
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load notices.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (n) => {
    setForm({ ...n, expiresAt: n.expiresAt ? n.expiresAt.slice(0, 10) : '' });
    setEditId(n._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await api.remove('notices', id);
      setNotices(prev => prev.filter(n => n._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (n) => {
    try {
      await api.update('notices', n._id, { isActive: !n.isActive });
      setNotices(prev => prev.map(x => x._id === n._id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast.error('Failed to update'); }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return toast.error('Title and content required');
    try {
      const payload = { ...form };
      if (!payload.expiresAt) delete payload.expiresAt;
      if (editId) {
        const res = await api.update('notices', editId, payload);
        setNotices(prev => prev.map(n => n._id === editId ? (res.data || { ...payload, _id: editId }) : n));
      } else {
        const res = await api.create('notices', payload);
        setNotices(prev => [res.data || { ...payload, _id: Date.now() }, ...prev]);
      }
      toast.success('Saved!');
      setShowModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const priorityColor = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Notice Board</h1>
          <p className="text-gray-400 text-sm mt-1">{notices.filter(n => n.isActive).length} active notices</p>
        </div>
        {loadError && <p role="alert" className="mb-4 text-red-700">{loadError}</p>}
        <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold">
          <FiPlus /> Post Notice
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-400">
            <FiBell className="text-5xl mx-auto mb-4" />
            <p>No notices yet</p>
          </div>
        ) : (
          notices.map((n, i) => (
            <motion.div key={n._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="font-semibold text-gray-800">{n.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${priorityColor[n.priority] || priorityColor.medium}`}>
                    {n.priority}
                  </span>
                  {n.isPopup && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">Popup</span>}
                  {n.isTicker && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">Ticker</span>}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{n.category}</span>
                </div>
                <p className="text-gray-500 text-sm">{n.content.slice(0, 120)}{n.content.length > 120 ? '...' : ''}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => handleToggle(n)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${n.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${n.isActive ? 'left-7' : 'left-1'}`}></span>
                </button>
                <button onClick={() => openEdit(n)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 /></button>
                <button onClick={() => handleDelete(n._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FiTrash2 /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-bold text-primary">{editId ? 'Edit' : 'Post'} Notice</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Content *</label>
                  <textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none">
                      {['General', 'PTM', 'Exam', 'Holiday', 'Sports', 'Cultural', 'Admission'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Expires At (optional)</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPopup} onChange={e => setForm({ ...form, isPopup: e.target.checked })} className="rounded" />
                    <span className="text-sm font-medium">Show as Popup</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isTicker} onChange={e => setForm({ ...form, isTicker: e.target.checked })} className="rounded" />
                    <span className="text-sm font-medium">Show in Ticker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageNotices;
