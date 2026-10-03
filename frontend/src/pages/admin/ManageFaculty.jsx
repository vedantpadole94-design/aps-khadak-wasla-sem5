import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const emptyForm = { name: '', role: '', dept: '', exp: '', phone: '', email: '', subject: '', qual: '' };

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    api.list('faculty')
      .then((response) => {
        if (isCurrent) setFaculty(response.data || []);
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load faculty records.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const filtered = faculty.filter((member) => member.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (member) => {
    setForm({
      name: member.name,
      role: member.designation,
      dept: member.department,
      exp: member.experience,
      phone: member.phone || '',
      email: member.email || '',
      subject: member.subject || '',
      qual: member.qualification || ''
    });
    setEditId(member._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try {
      await api.remove('faculty', id);
      setFaculty((previous) => previous.filter((member) => member._id !== id));
      toast.success('Faculty member removed');
    } catch (error) {
      toast.error(error.message || 'Unable to remove faculty member');
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.dept.trim()) {
      toast.error('Name, designation, and department are required');
      return;
    }
    const payload = {
      name: form.name.trim(),
      designation: form.role.trim(),
      department: form.dept.trim(),
      experience: Number(form.exp) || 0,
      phone: form.phone.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      qualification: form.qual.trim()
    };
    setSaving(true);
    try {
      const response = editId
        ? await api.update('faculty', editId, payload)
        : await api.create('faculty', payload);
      const savedFaculty = response.data;
      setFaculty((previous) => editId
        ? previous.map((member) => member._id === editId ? savedFaculty : member)
        : [savedFaculty, ...previous]);
      setShowModal(false);
      toast.success('Faculty member saved');
    } catch (error) {
      toast.error(error.message || 'Unable to save faculty member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Faculty Management</h1>
          <p className="text-gray-400 text-sm mt-1">{faculty.length} members total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors font-semibold">
          <FiPlus /> Add Faculty
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-accent outline-none" />
      </div>

      {/* Table */}
      {loadError && <p role="alert" className="mb-4 text-red-700">{loadError}</p>}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-primary text-white text-sm">
              <th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Department</th>
              <th className="p-4">Exp.</th><th className="p-4">Contact</th><th className="p-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((f, i) => (
                <motion.tr key={f._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-800">{f.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{f.designation}</td>
                  <td className="p-4"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{f.department}</span></td>
                  <td className="p-4 text-gray-600 text-sm">{f.experience} yrs</td>
                  <td className="p-4 text-gray-500 text-xs">{f.phone}<br/>{f.email}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(f)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(f._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><FiTrash2 /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <p className="text-center py-12 text-gray-400">Loading faculty records...</p>}
        {!loading && !loadError && filtered.length === 0 && <p className="text-center py-12 text-gray-400">No faculty found.</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-primary">{editId ? 'Edit' : 'Add'} Faculty Member</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['name','Full Name'],['role','Designation'],['dept','Department'],['subject','Subject'],['qual','Qualification'],['exp','Experience (years)'],['phone','Phone'],['email','Email']].map(([key, label]) => (
                <div key={key} className={key === 'name' || key === 'email' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent outline-none text-sm" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} disabled={saving} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageFaculty;
