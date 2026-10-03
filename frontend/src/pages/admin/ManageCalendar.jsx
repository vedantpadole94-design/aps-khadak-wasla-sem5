import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiCalendar, FiCheck, FiDownload, FiEdit2, FiEye, FiPlus,
  FiSearch, FiTag, FiTrash2, FiUpload, FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../../utils/api';
import { toast } from '../../utils/toast';

const PAGE_SIZE = 20;
const CSV_HEADERS = 'title,description,category,startDate,endDate,startTime,endTime,venue,color,isRecurring,recurrenceType,recurrenceEnd';
const dateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const newEvent = (category = 'Event') => ({
  title: '', description: '', category, date: dateInput(new Date()), endDate: '',
  startTime: '', endTime: '', venue: '', color: '#7c3aed', attachment: '',
  isRecurring: false, recurrenceType: 'none', recurrenceEnd: '',
  showOnPublic: true, showAsPopup: false, isActive: true
});

const ManageCalendar = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, upcoming: 0, holidays: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('events');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState(newEvent());
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', emoji: '📅', color: '#7c3aed', order: 0 });
  const [editCategoryId, setEditCategoryId] = useState('');
  const [csvText, setCsvText] = useState('');
  const [csvFilename, setCsvFilename] = useState('');
  const [importing, setImporting] = useState(false);

  const eventQuery = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (appliedSearch) params.set('search', appliedSearch);
    if (categoryFilter) params.set('category', categoryFilter);
    return `?${params.toString()}`;
  }, [page, appliedSearch, categoryFilter]);

  const refreshEvents = async () => {
    const [eventResponse, statsResponse] = await Promise.all([
      api.list('events/admin', eventQuery),
      api.list('events/admin/stats')
    ]);
    setEvents(eventResponse.data || []);
    setCount(eventResponse.count || 0);
    setTotalPages(eventResponse.totalPages || 0);
    setStats(statsResponse.data || { total: 0, thisMonth: 0, upcoming: 0, holidays: 0, byCategory: [] });
    setSelectedIds([]);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      setAppliedSearch(search.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    let current = true;
    Promise.all([api.list('events/admin', eventQuery), api.list('events/admin/stats')])
      .then(([eventResponse, statsResponse]) => {
        if (!current) return;
        setEvents(eventResponse.data || []);
        setCount(eventResponse.count || 0);
        setTotalPages(eventResponse.totalPages || 0);
        setStats(statsResponse.data || { total: 0, thisMonth: 0, upcoming: 0, holidays: 0, byCategory: [] });
        setLoadError('');
        setSelectedIds([]);
      })
      .catch(() => {
        if (current) setLoadError('Unable to load calendar data. Please try again.');
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, [eventQuery]);

  useEffect(() => {
    let current = true;
    api.list('categories')
      .then((response) => { if (current) setCategories(response.data || []); })
      .catch(() => { if (current) toast.error('Unable to load event categories'); });
    return () => { current = false; };
  }, []);

  const openAdd = (category = categories[0]?.name || 'Event') => {
    const event = newEvent(category);
    event.color = categories.find((item) => item.name === category)?.color || event.color;
    setForm(event);
    setAttachmentFile(null);
    setEditId('');
    setShowEventForm(true);
  };

  const openEdit = (event) => {
    setForm({
      title: event.title || '',
      description: event.description || '',
      category: event.category || 'Event',
      date: dateInput(event.date),
      endDate: dateInput(event.endDate),
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      venue: event.venue || '',
      color: event.color || categories.find((item) => item.name === event.category)?.color || '#7c3aed',
      attachment: event.attachment || '',
      isRecurring: Boolean(event.isRecurring),
      recurrenceType: event.recurrenceType || (event.isRecurring ? 'yearly' : 'none'),
      recurrenceEnd: dateInput(event.recurrenceEnd),
      showOnPublic: event.showOnPublic !== false,
      showAsPopup: Boolean(event.showAsPopup),
      isActive: event.isActive !== false
    });
    setAttachmentFile(null);
    setEditId(event._id);
    setShowEventForm(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || form.title.trim().length > 100) return toast.error('Enter an event title (maximum 100 characters)');
    if (form.description.trim().length > 500) return toast.error('Description must be 500 characters or fewer');
    if (!form.date) return toast.error('Start date is required');
    if (form.endDate && form.endDate < form.date) return toast.error('End date cannot be before start date');
    if (form.isRecurring && (!form.recurrenceEnd || form.recurrenceType === 'none')) return toast.error('Choose a recurrence type and end date');
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, String(value)));
      if (attachmentFile) data.append('attachment', attachmentFile);
      const response = editId
        ? await api.update('events', editId, data)
        : await api.create('events', data);
      setEvents((current) => editId
        ? current.map((item) => item._id === editId ? response.data : item)
        : [...current, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setShowEventForm(false);
      toast.success('Calendar event saved');
      await refreshEvents();
    } catch (error) {
      toast.error(error.message || 'Unable to save calendar event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    try {
      await api.remove('events', event._id);
      toast.success('Calendar event deleted');
      await refreshEvents();
      if (events.length === 1 && page > 1) setPage((value) => value - 1);
    } catch (error) {
      toast.error(error.message || 'Unable to delete calendar event');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected events?`)) return;
    const results = await Promise.allSettled(selectedIds.map((id) => api.remove('events', id)));
    const deleted = results.filter((result) => result.status === 'fulfilled').length;
    if (deleted) toast.success(`${deleted} event${deleted === 1 ? '' : 's'} deleted`);
    if (deleted !== results.length) toast.error('Some events could not be deleted');
    await refreshEvents();
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (appliedSearch) params.set('search', appliedSearch);
      const blob = await api.download(`/events/export${params.size ? `?${params}` : ''}`);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'calendar.csv';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || 'Unable to export events');
    }
  };

  const handleCsvFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error('CSV files must be 1 MB or smaller');
      event.target.value = '';
      return;
    }
    try {
      setCsvText(await file.text());
      setCsvFilename(file.name);
    } catch {
      toast.error('Unable to read CSV file');
    }
  };

  const handleImport = async () => {
    if (!csvText) return;
    setImporting(true);
    try {
      const response = await api.create('events/bulk-import', { csv: csvText });
      toast.success(`${response.count} events imported`);
      setCsvText('');
      setCsvFilename('');
      await refreshEvents();
    } catch (error) {
      toast.error(error.message || 'Unable to import events');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([`${CSV_HEADERS}\n`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'calendar-template.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    try {
      const response = editCategoryId
        ? await api.update('categories', editCategoryId, categoryForm)
        : await api.create('categories', categoryForm);
      setCategories((current) => editCategoryId
        ? current.map((category) => category._id === editCategoryId ? response.data : category).sort((a, b) => a.order - b.order)
        : [...current, response.data].sort((a, b) => a.order - b.order));
      setCategoryForm({ name: '', emoji: '📅', color: '#7c3aed', order: categories.length });
      setEditCategoryId('');
      toast.success(editCategoryId ? 'Category updated' : 'Category created');
      await refreshEvents();
    } catch (error) {
      toast.error(error.message || 'Unable to save category');
    }
  };

  const editCategory = (category) => {
    setCategoryForm({ name: category.name, emoji: category.emoji || '📅', color: category.color, order: category.order || 0 });
    setEditCategoryId(category._id);
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await api.remove('categories', category._id);
      setCategories((current) => current.filter((item) => item._id !== category._id));
      toast.success('Category deleted');
      await refreshEvents();
    } catch (error) {
      toast.error(error.message || 'Unable to delete category');
    }
  };

  const setEventField = (field, value) => setForm((current) => ({
    ...current,
    [field]: value,
    ...(field === 'category' ? { color: categories.find((category) => category.name === value)?.color || current.color } : {}),
    ...(field === 'isRecurring' && !value ? { recurrenceType: 'none', recurrenceEnd: '' } : {})
  }));

  const allSelected = events.length > 0 && events.every((event) => selectedIds.includes(event._id));
  const selectVisible = () => setSelectedIds(allSelected ? [] : events.map((event) => event._id));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Calendar Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage school events, holidays, and calendar categories.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/calendar" target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-accent"><FiEye /> Preview</Link>
          <button type="button" onClick={handleExport} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-accent"><FiDownload /> Export CSV</button>
          <button type="button" onClick={() => openAdd()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary"><FiPlus /> Add Event</button>
        </div>
      </div>

      {loadError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{loadError}</p>}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Total events', stats.total, FiCalendar],
          ['This month', stats.thisMonth, FiCalendar],
          ['Upcoming', stats.upcoming, FiCheck],
          ['Holidays', stats.holidays, FiTag]
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
              <Icon className="text-accent" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">{value}</p>
          </div>
        ))}
      </div>

      {stats.byCategory?.length > 0 && (
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-heading text-lg font-bold text-primary">Events by category</h2>
          <div className="flex flex-wrap gap-2">
            {stats.byCategory.map((item) => <span key={item._id} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">{item._id}: {item.count}</span>)}
          </div>
        </section>
      )}

      <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-200">
        {[
          ['events', 'All events'],
          ['holidays', 'Holiday manager'],
          ['categories', 'Categories']
        ].map(([key, label]) => (
          <button key={key} type="button" onClick={() => { setLoading(true); setActiveTab(key); setPage(1); setCategoryFilter(key === 'holidays' ? 'Holiday' : ''); }} className={`min-h-11 border-b-2 px-4 text-sm font-semibold ${activeTab === key ? 'border-accent text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}>{label}</button>
        ))}
      </div>

      {activeTab === 'categories' ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <h2 className="border-b border-gray-100 p-5 font-heading text-xl font-bold text-primary">Event categories</h2>
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full text-lg" style={{ backgroundColor: `${category.color}20` }}>{category.emoji || '📅'}</span>
                    <div><p className="font-semibold text-primary">{category.name}</p><p className="text-xs text-gray-500">{category.color} · Order {category.order}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editCategory(category)} aria-label={`Edit ${category.name}`} className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><FiEdit2 /></button>
                    <button type="button" onClick={() => deleteCategory(category)} aria-label={`Delete ${category.name}`} className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <form onSubmit={saveCategory} className="h-fit rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-xl font-bold text-primary">{editCategoryId ? 'Edit category' : 'Add category'}</h2>
            <label className="mb-3 block text-sm font-semibold text-gray-700">Name<input required maxLength={40} value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" /></label>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold text-gray-700">Emoji<input value={categoryForm.emoji} maxLength={8} onChange={(event) => setCategoryForm({ ...categoryForm, emoji: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" /></label>
              <label className="text-sm font-semibold text-gray-700">Color<input type="color" value={categoryForm.color} onChange={(event) => setCategoryForm({ ...categoryForm, color: event.target.value })} className="mt-1 h-11 w-full rounded-lg border border-gray-200 p-1" /></label>
            </div>
            <label className="mb-4 block text-sm font-semibold text-gray-700">Display order<input type="number" min="0" value={categoryForm.order} onChange={(event) => setCategoryForm({ ...categoryForm, order: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" /></label>
            <div className="flex gap-2">
              <button type="submit" className="min-h-11 flex-1 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-secondary">{editCategoryId ? 'Save category' : 'Create category'}</button>
              {editCategoryId && <button type="button" onClick={() => { setEditCategoryId(''); setCategoryForm({ name: '', emoji: '📅', color: '#7c3aed', order: categories.length }); }} className="min-h-11 rounded-lg border px-4 text-sm">Cancel</button>}
            </div>
          </form>
        </div>
      ) : (
        <>
          <section className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {['Holiday', 'Exam', 'Event'].map((category) => (
                  <button key={category} type="button" onClick={() => openAdd(category)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-primary hover:border-accent"><FiPlus /> {category}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex min-h-11 min-w-60 items-center gap-2 rounded-lg border border-gray-200 px-3 text-gray-500">
                  <FiSearch /><span className="sr-only">Search events</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, description, venue..." className="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none" />
                </label>
                <select value={categoryFilter} onChange={(event) => { setLoading(true); setCategoryFilter(event.target.value); setPage(1); }} aria-label="Filter events by category" className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-primary">
                  <option value="">All categories</option>
                  {categories.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={downloadTemplate} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-primary hover:border-accent"><FiDownload /> CSV template</button>
              <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-primary hover:border-accent">
                <FiUpload /> Select CSV
                <input type="file" accept=".csv,text/csv" onChange={handleCsvFile} className="sr-only" />
              </label>
              {csvFilename && <span className="text-sm text-gray-600">{csvFilename}</span>}
              {csvText && <button type="button" onClick={handleImport} disabled={importing} className="min-h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50">{importing ? 'Importing...' : 'Validate & import'}</button>}
              {csvText && <button type="button" onClick={() => { setCsvText(''); setCsvFilename(''); }} aria-label="Clear selected CSV" className="grid h-10 w-10 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"><FiX /></button>}
            </div>
            {csvText && <div className="mt-3 rounded-lg bg-gray-50 p-3"><p className="mb-2 text-xs font-semibold text-gray-500">CSV preview — first rows</p><pre className="max-h-28 overflow-auto whitespace-pre-wrap break-all text-xs text-gray-600">{csvText.split(/\r?\n/).filter(Boolean).slice(0, 4).join('\n')}</pre></div>}
          </section>

          {selectedIds.length > 0 && <div className="mb-3 flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm"><span>{selectedIds.length} events selected</span><button type="button" onClick={handleBulkDelete} className="font-semibold text-red-700">Delete selected</button></div>}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead><tr className="bg-primary text-xs uppercase tracking-wide text-white">
                  <th className="w-12 p-4"><input type="checkbox" checked={allSelected} onChange={selectVisible} aria-label="Select all events on this page" /></th>
                  <th className="p-4">Date</th><th className="p-4">Event</th><th className="p-4">Category</th><th className="p-4">Time / venue</th><th className="p-4">Visibility</th><th className="p-4 text-right">Actions</th>
                </tr></thead>
                <tbody>
                  {events.map((event) => {
                    const category = categories.find((item) => item.name === event.category);
                    return (
                      <motion.tr key={event._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4"><input type="checkbox" checked={selectedIds.includes(event._id)} onChange={() => setSelectedIds((current) => current.includes(event._id) ? current.filter((id) => id !== event._id) : [...current, event._id])} aria-label={`Select ${event.title}`} /></td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-600">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{event.endDate && <span className="block text-xs text-gray-400">to {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}</td>
                        <td className="max-w-xs p-4"><p className="font-semibold text-primary">{event.title}</p>{event.description && <p className="truncate text-xs text-gray-500">{event.description}</p>}{event.isRecurring && <span className="text-xs text-indigo-600">Repeats {event.recurrenceType}</span>}</td>
                        <td className="p-4"><span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color: category?.color || '#1a2332', backgroundColor: `${category?.color || '#1a2332'}18` }}>{category?.emoji || '📅'} {event.category}</span></td>
                        <td className="p-4 text-sm text-gray-600">{event.startTime || '—'}{event.endTime ? `–${event.endTime}` : ''}{event.venue && <span className="block text-xs text-gray-400">{event.venue}</span>}</td>
                        <td className="p-4 text-xs">{event.isActive === false ? <span className="text-gray-500">Inactive</span> : event.showOnPublic === false ? <span className="text-amber-700">Hidden</span> : <span className="text-green-700">Public</span>}</td>
                        <td className="p-4"><div className="flex justify-end gap-2">
                          {event.attachment && <a href={assetUrl(event.attachment)} target="_blank" rel="noreferrer" aria-label="Open event attachment" className="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 text-gray-600"><FiEye /></a>}
                          <button type="button" onClick={() => openEdit(event)} aria-label={`Edit ${event.title}`} className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><FiEdit2 /></button>
                          <button type="button" onClick={() => handleDelete(event)} aria-label={`Delete ${event.title}`} className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><FiTrash2 /></button>
                        </div></td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {loading && <p className="py-10 text-center text-gray-500">Loading events...</p>}
            {!loading && !loadError && events.length === 0 && <p className="py-10 text-center text-gray-500">No events found.</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4">
              <p className="text-sm text-gray-500">{count} total events</p>
              {totalPages > 0 && <div className="flex items-center gap-3">
                <button type="button" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="min-h-10 rounded-lg border px-3 text-sm disabled:opacity-50">Previous</button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages || loading} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="min-h-10 rounded-lg border px-3 text-sm disabled:opacity-50">Next</button>
              </div>}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showEventForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setShowEventForm(false); }}>
            <motion.form onSubmit={handleSave} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="my-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-widest text-secondary">{editId ? 'Update schedule' : 'Add to schedule'}</p><h2 className="mt-1 font-heading text-2xl font-bold text-primary">{editId ? 'Edit event' : 'New calendar event'}</h2></div>
                <button type="button" disabled={saving} onClick={() => setShowEventForm(false)} aria-label="Close event form" className="grid h-11 w-11 place-items-center rounded-full bg-gray-100"><FiX /></button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-gray-700 md:col-span-2">Event title *
                  <input required maxLength={100} value={form.title} onChange={(event) => setEventField('title', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-accent" />
                </label>
                <label className="text-sm font-semibold text-gray-700 md:col-span-2">Description <span className="font-normal text-gray-400">(up to 500 characters)</span>
                  <textarea maxLength={500} rows={3} value={form.description} onChange={(event) => setEventField('description', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-accent" />
                </label>
                <label className="text-sm font-semibold text-gray-700">Category *
                  <select required value={form.category} onChange={(event) => setEventField('category', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                    {categories.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-gray-700">Category color
                  <input type="color" value={form.color} onChange={(event) => setEventField('color', event.target.value)} className="mt-1 h-11 w-full rounded-lg border border-gray-200 p-1" />
                </label>
                <label className="text-sm font-semibold text-gray-700">Start date *
                  <input required type="date" value={form.date} onChange={(event) => setEventField('date', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold text-gray-700">End date
                  <input type="date" min={form.date} value={form.endDate} onChange={(event) => setEventField('endDate', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold text-gray-700">Start time
                  <input type="time" value={form.startTime} onChange={(event) => setEventField('startTime', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold text-gray-700">End time
                  <input type="time" value={form.endTime} onChange={(event) => setEventField('endTime', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold text-gray-700 md:col-span-2">Venue
                  <input maxLength={100} value={form.venue} onChange={(event) => setEventField('venue', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold text-gray-700 md:col-span-2">Attachment <span className="font-normal text-gray-400">(PDF, JPEG, PNG, WebP — maximum 10 MB)</span>
                  <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(event) => setAttachmentFile(event.target.files?.[0] || null)} className="mt-1 block w-full rounded-lg border border-gray-200 p-2 text-sm" />
                  {form.attachment && <span className="mt-1 block text-xs text-secondary">Current attachment saved{attachmentFile ? ' — new file selected' : ''}</span>}
                </label>
                <div className="grid gap-2 rounded-xl bg-gray-50 p-4 text-sm md:col-span-2 md:grid-cols-2">
                  {[
                    ['showOnPublic', 'Show on public calendar'],
                    ['isActive', 'Event is active'],
                  ].map(([field, label]) => (
                    <label key={field} className="flex min-h-10 items-center gap-2"><input type="checkbox" checked={form[field]} onChange={(event) => setEventField(field, event.target.checked)} />{label}</label>
                  ))}
                  <label className="flex min-h-10 items-center gap-2"><input type="checkbox" checked={form.isRecurring} onChange={(event) => setEventField('isRecurring', event.target.checked)} />Recurring event</label>
                  {form.isRecurring && <>
                    <label className="text-sm font-semibold text-gray-700">Repeat
                      <select value={form.recurrenceType} onChange={(event) => setEventField('recurrenceType', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2">
                        {['daily', 'weekly', 'monthly', 'yearly'].map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-gray-700">Repeat until *
                      <input required type="date" min={form.date} value={form.recurrenceEnd} onChange={(event) => setEventField('recurrenceEnd', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
                    </label>
                  </>}
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" disabled={saving} onClick={() => setShowEventForm(false)} className="min-h-11 rounded-lg border border-gray-200 px-5 font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-primary px-6 font-semibold text-white hover:bg-secondary disabled:opacity-50">{saving ? 'Saving...' : editId ? 'Save changes' : 'Save event'}</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCalendar;
