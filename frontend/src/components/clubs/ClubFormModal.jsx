import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { createClub, updateClub } from '../../utils/clubsApi';
import { toast } from '../../utils/toast';

const CATEGORIES = ['Academic', 'Sports', 'Arts', 'Service', 'Other'];

const emptyForm = (wing) => ({
  wing:        wing || 'primary',
  name:        '',
  description: '',
  category:    'Other',
  icon:        '🎯',
  teacher:     '',
  timing:      '',
  venue:       '',
  order:       1,
  active:      true
});

const ClubFormModal = ({ open, onClose, onSaved, editClub, defaultWing }) => {
  const [form, setForm]     = useState(emptyForm(defaultWing));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editClub) {
        setForm({
          wing:        editClub.wing        || defaultWing || 'primary',
          name:        editClub.name        || '',
          description: editClub.description || '',
          category:    editClub.category    || 'Other',
          icon:        editClub.icon        || '🎯',
          teacher:     editClub.teacher     || '',
          timing:      editClub.timing      || '',
          venue:       editClub.venue       || '',
          order:       editClub.order       ?? 1,
          active:      editClub.active      !== false
        });
      } else {
        setForm(emptyForm(defaultWing));
      }
      setErrors({});
    }
  }, [open, editClub, defaultWing]);

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Name is required (min 2 characters)';
    }
    if (form.name.trim().length > 60) {
      errs.name = 'Name must be 60 characters or fewer';
    }
    if (form.order < 1 || !Number.isInteger(Number(form.order))) {
      errs.order = 'Order must be a positive integer';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        name:  form.name.trim(),
        order: Number(form.order)
      };
      const res = editClub
        ? await updateClub(editClub._id, payload)
        : await createClub(payload);

      toast.success(editClub ? 'Club updated' : 'Club created');
      onSaved(res.data);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Unable to save club');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
            noValidate
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                  {editClub ? 'Edit Club' : 'New Club'}
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-primary">
                  {editClub ? editClub.name : 'Add Club'}
                </h2>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                aria-label="Close modal"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiX />
              </button>
            </div>

            {/* Fields */}
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-name">
                  Club Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="club-name"
                  type="text"
                  required
                  maxLength={60}
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-accent ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="e.g. Science & Innovation Club"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-desc">
                  Description <span className="font-normal text-gray-400">(up to 200 characters)</span>
                </label>
                <textarea
                  id="club-desc"
                  rows={3}
                  maxLength={200}
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-accent resize-none"
                  placeholder="Brief description of the club's activities…"
                />
                <p className="mt-0.5 text-right text-[11px] text-gray-400">{form.description.length}/200</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-category">
                  Category
                </label>
                <select
                  id="club-category"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-icon">
                  Icon <span className="font-normal text-gray-400">(emoji)</span>
                </label>
                <input
                  id="club-icon"
                  type="text"
                  maxLength={8}
                  value={form.icon}
                  onChange={(e) => setField('icon', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-lg outline-none focus:border-accent"
                  placeholder="🎯"
                />
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-teacher">
                  Teacher in Charge
                </label>
                <input
                  id="club-teacher"
                  type="text"
                  maxLength={60}
                  value={form.teacher}
                  onChange={(e) => setField('teacher', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
                  placeholder="e.g. Mrs. Sharma"
                />
              </div>

              {/* Timing */}
              <div>
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-timing">
                  Timing
                </label>
                <input
                  id="club-timing"
                  type="text"
                  maxLength={60}
                  value={form.timing}
                  onChange={(e) => setField('timing', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
                  placeholder="e.g. Mon & Wed, 3:00–4:00 PM"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-venue">
                  Venue
                </label>
                <input
                  id="club-venue"
                  type="text"
                  maxLength={60}
                  value={form.venue}
                  onChange={(e) => setField('venue', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
                  placeholder="e.g. Science Lab / Ground"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700" htmlFor="club-order">
                  Display Order
                </label>
                <input
                  id="club-order"
                  type="number"
                  min={1}
                  step={1}
                  value={form.order}
                  onChange={(e) => setField('order', e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-accent ${errors.order ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.order && <p className="mt-1 text-xs text-red-500">{errors.order}</p>}
              </div>

              {/* Active checkbox */}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 sm:col-span-2">
                <input
                  id="club-active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setField('active', e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <label htmlFor="club-active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Active — visible on the public page
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                className="min-h-11 rounded-lg border border-gray-200 px-5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-50"
              >
                {saving ? 'Saving…' : editClub ? 'Save changes' : 'Create Club'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClubFormModal;
