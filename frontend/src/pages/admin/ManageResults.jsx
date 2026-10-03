import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const defaultX = [
  { classLevel: 'X', year: '2021-22', registered: 119, passed: 119, percentage: '100%', remarks: '-' },
  { classLevel: 'X', year: '2022-23', registered: 121, passed: 120, percentage: '99.11%', remarks: '-' },
  { classLevel: 'X', year: '2023-24', registered: 111, passed: 111, percentage: '100%', remarks: '-' },
  { classLevel: 'X', year: '2024-25', registered: 124, passed: 124, percentage: '100%', remarks: '-' },
];
const defaultXII = [
  { classLevel: 'XII', year: '2022-23', registered: 53, passed: 52, percentage: '98.11%', remarks: 'Compartment' },
  { classLevel: 'XII', year: '2023-24', registered: 46, passed: 46, percentage: '100%', remarks: '-' },
  { classLevel: 'XII', year: '2024-25', registered: 64, passed: 64, percentage: '100%', remarks: '-' },
];

const emptyForm = { classLevel: 'X', year: '', registered: '', passed: '', percentage: '', remarks: '-' };

const ManageResults = () => {
  const [results, setResults] = useState([...defaultX, ...defaultXII]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('X');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.list('results').then(res => {
      if (res.data && res.data.length > 0) setResults(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = results.filter(r => r.classLevel === activeTab);

  const openAdd = () => { setForm({ ...emptyForm, classLevel: activeTab }); setEditId(null); setShowModal(true); };
  const openEdit = (r) => { setForm({ ...r }); setEditId(r._id || r.id); setShowModal(true); };

  const handleDelete = async (r) => {
    if (!window.confirm('Delete this result entry?')) return;
    try {
      if (r._id) await api.remove('results', r._id);
      setResults(prev => prev.filter(x => (x._id || x.id) !== (r._id || r.id)));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleSave = async () => {
    if (!form.year || !form.registered) return toast.error('Year and registered count required');
    try {
      if (editId) {
        const res = await api.update('results', editId, form).catch(() => null);
        setResults(prev => prev.map(r => (r._id || r.id) === editId ? (res?.data || { ...form, _id: editId }) : r));
      } else {
        const res = await api.create('results', form).catch(() => null);
        setResults(prev => [...prev, res?.data || { ...form, id: Date.now() }]);
      }
      toast.success('Saved!');
      setShowModal(false);
    } catch { toast.error('Failed to save'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Board Results</h1>
          <p className="text-gray-400 text-sm mt-1">Manage Class X and XII CBSE results</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors font-semibold">
          <FiPlus /> Add Entry
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['X', 'XII'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${activeTab === tab ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
            Class {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-white text-sm">
                <th className="p-4">Year</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Passed</th>
                <th className="p-4">Pass %</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td></tr>
              ) : filtered.map((r, i) => (
                <motion.tr key={r._id || r.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{r.year}</td>
                  <td className="p-4">{r.registered}</td>
                  <td className="p-4">{r.passed}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.percentage === '100%' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.percentage}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{r.remarks}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(r)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(r)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FiTrash2 /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <p className="text-center py-12 text-gray-400">No results for Class {activeTab}.</p>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-bold text-primary">{editId ? 'Edit' : 'Add'} Result</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Class</label>
                  <select value={form.classLevel} onChange={e => setForm({ ...form, classLevel: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none">
                    <option value="X">Class X</option>
                    <option value="XII">Class XII</option>
                  </select>
                </div>
                {[['year', 'Year (e.g. 2024-25)'], ['registered', 'Registered'], ['passed', 'Passed'], ['percentage', 'Percentage (e.g. 100%)'], ['remarks', 'Remarks']].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none text-sm" />
                  </div>
                ))}
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

export default ManageResults;
