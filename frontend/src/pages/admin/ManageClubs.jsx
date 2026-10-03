import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiChevronDown, FiChevronUp, FiEdit2, FiEye, FiPlus,
  FiSearch, FiTrash2
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAdminClubs, deleteClub, reorderClubs } from '../../utils/clubsApi';
import { toast } from '../../utils/toast';
import ClubFormModal from '../../components/clubs/ClubFormModal';

const CATEGORIES = ['All', 'Academic', 'Sports', 'Arts', 'Service', 'Other'];

const CATEGORY_COLORS = {
  Academic: '#1E40AF',
  Sports:   '#15803D',
  Arts:     '#7C3AED',
  Service:  '#C8102E',
  Other:    '#6B7280'
};

const TABS = [
  { key: 'primary',   label: 'Classes 1–5 (Primary)' },
  { key: 'secondary', label: 'Classes 6–10 (Secondary)' }
];

const ManageClubs = () => {
  const [clubs, setClubs]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState('');
  const [activeTab, setActiveTab]   = useState('primary');
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('All');
  const [showModal, setShowModal]   = useState(false);
  const [editClub, setEditClub]     = useState(null);
  const [reordering, setReordering] = useState(false);

  const loadClubs = async () => {
    try {
      const res = await getAdminClubs(activeTab);
      setClubs(res.data || []);
      setLoadError('');
    } catch (err) {
      setLoadError(err.message || 'Unable to load clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setSearch('');
    setCatFilter('All');
    loadClubs();
  }, [activeTab]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clubs.filter((c) => {
      const matchCat  = catFilter === 'All' || c.category === catFilter;
      const matchName = !term || c.name.toLowerCase().includes(term) || (c.teacher || '').toLowerCase().includes(term);
      return matchCat && matchName;
    });
  }, [clubs, search, catFilter]);

  const openAdd  = ()    => { setEditClub(null); setShowModal(true); };
  const openEdit = (club) => { setEditClub(club); setShowModal(true); };

  const handleSaved = (savedClub) => {
    setClubs((prev) => {
      const exists = prev.find((c) => c._id === savedClub._id);
      return exists
        ? prev.map((c) => c._id === savedClub._id ? savedClub : c)
        : [...prev, savedClub].sort((a, b) => a.order - b.order);
    });
  };

  const handleDelete = async (club) => {
    if (!window.confirm(`Delete "${club.name}"? This cannot be undone.`)) return;
    try {
      await deleteClub(club._id);
      setClubs((prev) => prev.filter((c) => c._id !== club._id));
      toast.success('Club deleted');
    } catch (err) {
      toast.error(err.message || 'Unable to delete club');
    }
  };

  const handleMove = async (club, direction) => {
    const wingClubs = [...clubs].sort((a, b) => a.order - b.order);
    const idx = wingClubs.findIndex((c) => c._id === club._id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= wingClubs.length) return;

    // Swap orders
    const updated = wingClubs.map((c, i) => {
      if (i === idx)       return { ...c, order: wingClubs[targetIdx].order };
      if (i === targetIdx) return { ...c, order: wingClubs[idx].order };
      return c;
    });

    setClubs(updated);
    setReordering(true);
    try {
      await reorderClubs(updated.map((c) => ({ id: c._id, order: c.order })));
    } catch (err) {
      toast.error(err.message || 'Unable to reorder clubs');
      await loadClubs(); // revert on failure
    } finally {
      setReordering(false);
    }
  };

  const sortedFiltered = useMemo(
    () => [...filtered].sort((a, b) => a.order - b.order),
    [filtered]
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Manage Clubs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit and reorder school clubs for both wings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/clubs"
            target="_blank"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-accent"
          >
            <FiEye /> Preview
          </Link>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary"
          >
            <FiPlus /> Add Club
          </button>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {/* Wing Tabs */}
      <div className="mb-5 flex gap-1 border-b border-gray-200">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`min-h-11 border-b-2 px-5 text-sm font-semibold transition-colors ${
              activeTab === key
                ? 'border-accent text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search + Category Filter */}
      <div className="mb-5 flex flex-wrap gap-3">
        <label className="flex min-h-11 min-w-56 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-500 flex-1 sm:flex-none">
          <FiSearch className="shrink-0" />
          <span className="sr-only">Search clubs</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or teacher…"
            className="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none"
          />
        </label>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          aria-label="Filter by category"
          className="min-h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-primary outline-none focus:border-accent"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-primary text-xs uppercase tracking-wide text-white">
                <th className="w-20 p-4 text-center">Order</th>
                <th className="w-14 p-4 text-center">Icon</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Teacher</th>
                <th className="p-4">Timing</th>
                <th className="w-20 p-4 text-center">Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {sortedFiltered.map((club, idx) => {
                  const color = CATEGORY_COLORS[club.category] || CATEGORY_COLORS.Other;
                  return (
                    <motion.tr
                      key={club._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {/* Order / reorder arrows */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-semibold text-gray-500 w-6 text-right">
                            {club.order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => handleMove(club, 'up')}
                              disabled={reordering || idx === 0}
                              aria-label={`Move ${club.name} up`}
                              className="text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <FiChevronUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(club, 'down')}
                              disabled={reordering || idx === sortedFiltered.length - 1}
                              aria-label={`Move ${club.name} down`}
                              className="text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <FiChevronDown size={14} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Icon */}
                      <td className="p-3 text-center">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl mx-auto"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          {club.icon || '🎯'}
                        </span>
                      </td>

                      {/* Name + description */}
                      <td className="max-w-[220px] p-4">
                        <p className="font-semibold text-primary text-sm">{club.name}</p>
                        {club.description && (
                          <p className="mt-0.5 truncate text-xs text-gray-400">{club.description}</p>
                        )}
                      </td>

                      {/* Category badge */}
                      <td className="p-4">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{ color, backgroundColor: `${color}15` }}
                        >
                          {club.category}
                        </span>
                      </td>

                      {/* Teacher */}
                      <td className="p-4 text-sm text-gray-600">
                        {club.teacher || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Timing */}
                      <td className="p-4 text-sm text-gray-600">
                        {club.timing || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Active toggle (display only — edit via modal) */}
                      <td className="p-4 text-center">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            club.active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {club.active ? 'Yes' : 'No'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(club)}
                            aria-label={`Edit ${club.name}`}
                            className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(club)}
                            aria-label={`Delete ${club.name}`}
                            className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="py-10 text-center text-sm text-gray-500">Loading clubs…</p>
        )}
        {!loading && !loadError && sortedFiltered.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-500">
              {clubs.length === 0
                ? 'No clubs yet. Click Add Club to create one.'
                : 'No clubs match your filters.'}
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-400">
            {sortedFiltered.length} club{sortedFiltered.length !== 1 ? 's' : ''} shown
            {clubs.length !== sortedFiltered.length ? ` of ${clubs.length}` : ''}
          </p>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <ClubFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={handleSaved}
        editClub={editClub}
        defaultWing={activeTab}
      />
    </div>
  );
};

export default ManageClubs;
