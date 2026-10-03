import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiDownload,
  FiMapPin, FiPrinter, FiSearch, FiX
} from 'react-icons/fi';
import { API_BASE_URL, api, assetUrl } from '../utils/api';

const DEFAULT_CATEGORIES = [
  { name: 'Holiday', emoji: '🎉', color: '#c8102e' },
  { name: 'Exam', emoji: '📚', color: '#1e40af' },
  { name: 'Sports', emoji: '🏆', color: '#15803d' },
  { name: 'Cultural', emoji: '🎭', color: '#d4af37' },
  { name: 'Event', emoji: '📅', color: '#7c3aed' },
  { name: 'Academic', emoji: '🎓', color: '#4338ca' },
  { name: 'PTM', emoji: '👨‍👩‍👧', color: '#d97706' }
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const VIEWS = ['Month', 'Week', 'Day', 'List'];

const dateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const toDateInput = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const formatDate = (value, options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(value).toLocaleDateString('en-IN', options);
const shiftDate = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const CalendarPage = () => {
  const today = new Date();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateInput(today));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isCurrent = true;
    Promise.all([api.list('events'), api.list('categories')])
      .then(([eventsResponse, categoryResponse]) => {
        if (!isCurrent) return;
        setEvents(eventsResponse.data || []);
        if (categoryResponse.data?.length) setCategories(categoryResponse.data);
        setLoadError('');
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load calendar events. Please try again later.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    if (!selectedEvent) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedEvent]);

  const categoryDetails = useMemo(() => new Map(categories.map((category) => [category.name, category])), [categories]);
  const filteredEvents = useMemo(() => events
    .filter((event) => !categoryFilter || event.category === categoryFilter)
    .filter((event) => {
      const term = search.trim().toLowerCase();
      return !term || [event.title, event.description, event.venue, event.category]
        .some((value) => String(value || '').toLowerCase().includes(term));
    })
    .sort((first, second) => new Date(first.date) - new Date(second.date)), [events, categoryFilter, search]);

  const dateEvents = useMemo(() => {
    const grouped = new Map();
    filteredEvents.forEach((event) => {
      const key = dateKey(event.date);
      grouped.set(key, [...(grouped.get(key) || []), event]);
    });
    return grouped;
  }, [filteredEvents]);

  const monthTitle = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const monthDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthCells = Array.from({ length: Math.ceil((monthStart.getDay() + monthDays) / 7) * 7 }, (_, index) => {
    const dayNumber = index - monthStart.getDay() + 1;
    if (dayNumber < 1 || dayNumber > monthDays) return null;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    return { date, key: toDateInput(date), day: dayNumber };
  });

  const selectCalendarDate = (date) => {
    setSelectedDate(toDateInput(date));
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };
  const moveMonth = (amount) => {
    if (view === 'Week') {
      selectCalendarDate(shiftDate(new Date(`${selectedDate}T12:00:00`), amount * 7));
    } else if (view === 'Day') {
      selectCalendarDate(shiftDate(new Date(`${selectedDate}T12:00:00`), amount));
    } else {
      setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
    }
  };
  const goToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(toDateInput(now));
  };
  const openDate = (date) => {
    const key = toDateInput(date);
    selectCalendarDate(date);
    const matches = dateEvents.get(key) || [];
    if (matches.length === 1) setSelectedEvent(matches[0]);
    else if (matches.length > 1) setView('Day');
    else setView('Day');
  };
  const selectedDayEvents = dateEvents.get(selectedDate) || [];
  const todayKey = toDateInput(today);
  const upcomingEvents = filteredEvents.filter((event) => dateKey(event.date) >= todayKey).slice(0, 5);
  const googleCalendarUrl = (event) => {
    const start = dateKey(event.date).replaceAll('-', '');
    const endDate = event.endDate ? shiftDate(new Date(event.endDate), 1) : shiftDate(new Date(event.date), 1);
    const end = toDateInput(endDate).replaceAll('-', '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: event.description || '',
      location: event.venue || ''
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const EventButton = ({ event, compact = false }) => {
    const category = categoryDetails.get(event.category) || {};
    return (
      <button
        type="button"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          setSelectedEvent(event);
        }}
        className={`block w-full truncate rounded-md text-left font-semibold transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${compact ? 'px-1.5 py-1 text-[10px]' : 'px-3 py-2 text-sm'}`}
        style={{ color: category.color || '#1a2332', backgroundColor: `${category.color || '#1a2332'}18` }}
        aria-label={`${event.title}, ${event.category}, ${formatDate(event.date)}`}
      >
        {category.emoji || '📅'} {event.title}
      </button>
    );
  };

  const renderDayList = (date, compact = false) => {
    const key = toDateInput(date);
    const items = dateEvents.get(key) || [];
    return (
      <div className="space-y-1">
        {items.slice(0, compact ? 2 : items.length).map((event) => (
        <EventButton key={event.occurrenceId || event._id} event={event} compact={compact} />
        ))}
        {compact && items.length > 2 && <p className="text-[10px] text-gray-500">+{items.length - 2} more</p>}
      </div>
    );
  };

  const renderMonthView = () => (
    <div
      className="grid grid-cols-7 gap-1.5 sm:gap-2"
      role="grid"
      aria-label={`${monthTitle} calendar`}
      onKeyDown={(event) => {
        const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
        if (offset === undefined) return;
        const day = Number(event.target.closest('[role="gridcell"]')?.getAttribute('aria-label')?.match(/(\d{1,2})/)?.[1]);
        if (!day) return;
        event.preventDefault();
        selectCalendarDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day + offset));
      }}
    >
      {WEEKDAYS.map((day) => (
        <div key={day} role="columnheader" className="rounded-t-lg bg-primary py-3 text-center text-xs font-bold uppercase tracking-wider text-accent sm:text-sm">
          {day}
        </div>
      ))}
      {monthCells.map((cell, index) => {
        if (!cell) return <div key={`empty-${index}`} aria-hidden="true" className="min-h-20 rounded-lg bg-gray-50/70 sm:min-h-28" />;
        const isToday = cell.key === todayKey;
        const count = (dateEvents.get(cell.key) || []).length;
        return (
          <button
            type="button"
            key={cell.key}
            role="gridcell"
            aria-label={`${formatDate(cell.date)}, ${count} events`}
            onClick={() => openDate(cell.date)}
            className={`min-h-20 rounded-lg border p-1.5 text-left transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:min-h-28 sm:p-2 ${isToday ? 'border-accent bg-amber-50' : 'border-gray-100 bg-white'} ${cell.date.getDay() === 0 || cell.date.getDay() === 6 ? 'bg-stone-50' : ''}`}
          >
            <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold sm:h-8 sm:w-8 ${isToday ? 'bg-accent text-primary' : 'text-primary'}`}>{cell.day}</span>
            <div className="mt-1 space-y-1">{renderDayList(cell.date, true)}</div>
          </button>
        );
      })}
    </div>
  );

  const weekStart = shiftDate(new Date(`${selectedDate}T12:00:00`), -new Date(`${selectedDate}T12:00:00`).getDay());
  const weekDates = Array.from({ length: 7 }, (_, index) => shiftDate(weekStart, index));
  const renderWeekView = () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {weekDates.map((date) => (
        <section key={toDateInput(date)} className={`min-h-40 rounded-xl border p-3 ${toDateInput(date) === todayKey ? 'border-accent bg-amber-50/60' : 'border-gray-200 bg-white'}`}>
          <button type="button" onClick={() => selectCalendarDate(date)} className="mb-3 text-left font-bold text-primary focus-visible:outline focus-visible:outline-accent">
            <span className="block text-xs uppercase text-gray-500">{WEEKDAYS[date.getDay()]}</span>
            {formatDate(date, { day: 'numeric', month: 'short' })}
          </button>
          {renderDayList(date)}
        </section>
      ))}
    </div>
  );

  const renderDayView = () => {
    const date = new Date(`${selectedDate}T12:00:00`);
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
        <h3 className="mb-5 text-xl font-bold text-primary">{formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
        {selectedDayEvents.length ? (
          <div className="space-y-3">          {selectedDayEvents.map((event) => <EventButton key={event.occurrenceId || event._id} event={event} />)}</div>
        ) : <p className="text-gray-500">No events are scheduled for this day.</p>}
      </section>
    );
  };

  const renderListView = () => {
    const groups = filteredEvents.reduce((result, event) => {
      const label = new Date(event.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      result.set(label, [...(result.get(label) || []), event]);
      return result;
    }, new Map());
    return groups.size ? (
      <div className="space-y-6">
        {[...groups].map(([label, items]) => (
          <section key={label} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <h3 className="border-b border-gray-100 bg-stone-50 px-5 py-3 font-heading text-lg font-bold text-primary">{label}</h3>
            <div className="divide-y divide-gray-100">
              {items.map((event) => {
                const category = categoryDetails.get(event.category) || {};
                return (
                  <button key={event.occurrenceId || event._id} type="button" onClick={() => setSelectedEvent(event)} className="flex w-full flex-col gap-2 px-5 py-4 text-left hover:bg-amber-50/50 sm:flex-row sm:items-center">
                    <span className="w-28 shrink-0 text-sm font-semibold text-gray-500">{formatDate(event.date)}</span>
                    <span className="flex-1 font-bold text-primary">{event.title}</span>
                    <span className="text-sm" style={{ color: category.color }}>{category.emoji || '📅'} {event.category}</span>
                    {event.startTime && <span className="text-sm text-gray-500">{event.startTime}{event.endTime ? `–${event.endTime}` : ''}</span>}
                    {event.venue && <span className="text-sm text-gray-500">{event.venue}</span>}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    ) : <p className="rounded-xl bg-white p-8 text-center text-gray-500">No events match your filters.</p>;
  };

  return (
    <main className="min-h-screen bg-bg-light pt-24">
      <section className="relative overflow-hidden bg-primary px-4 py-16 text-center text-white sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_40%)]" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">Army Public School Khadakwasla</p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Academic Calendar</h1>
          <div className="mx-auto mt-5 h-1 w-16 bg-accent" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">Holidays, examinations, events and celebrations in one place. Keep up with the school year.</p>
          <p className="mt-4 text-xs text-white/60"><a href="/" className="hover:text-accent">Home</a> <span aria-hidden="true">›</span> Calendar</p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1440px] px-3 py-8 sm:px-6 sm:py-12">
        {loadError && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">{loadError}</p>}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-[#faf7f0] p-4 shadow-sm sm:p-5" aria-label="Calendar controls">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="grid h-11 w-11 place-items-center rounded-lg border border-gray-200 bg-white text-primary hover:border-accent hover:text-accent"><FiChevronLeft size={20} /></button>
              <h2 aria-live="polite" className="min-w-[190px] text-center font-heading text-xl font-bold uppercase tracking-wide text-primary sm:min-w-[250px] sm:text-2xl">{monthTitle}</h2>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" className="grid h-11 w-11 place-items-center rounded-lg border border-gray-200 bg-white text-primary hover:border-accent hover:text-accent"><FiChevronRight size={20} /></button>
              <button type="button" onClick={goToday} className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-secondary">Today</button>
            </div>
            <label className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-500">
              <FiCalendar />
              <span className="sr-only">Jump to month</span>
              <input
                type="month"
                aria-label="Jump to month"
                value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
                onChange={(event) => {
                  if (!event.target.value) return;
                  const [year, month] = event.target.value.split('-').map(Number);
                  const date = new Date(year, month - 1, 1);
                  setCurrentDate(date);
                  setSelectedDate(toDateInput(date));
                }}
                className="bg-transparent text-primary outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-gray-200 pt-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Calendar view">
              {VIEWS.map((item) => (
                <button key={item} type="button" onClick={() => setView(item)} aria-pressed={view === item} className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition ${view === item ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:text-primary'}`}>{item}</button>
              ))}
            </div>
            <label className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-500 lg:max-w-xs">
              <FiSearch />
              <span className="sr-only">Search calendar events</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="min-w-0 flex-1 bg-transparent text-primary outline-none" />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><FiX /></button>}
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setCategoryFilter('')} aria-pressed={!categoryFilter} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!categoryFilter ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-600'}`}>All categories</button>
            {categories.map((category) => (
              <button key={category._id || category.name} type="button" onClick={() => setCategoryFilter(categoryFilter === category.name ? '' : category.name)} aria-pressed={categoryFilter === category.name} className="rounded-full border px-3 py-1.5 text-xs font-semibold transition" style={{ borderColor: category.color, color: categoryFilter === category.name ? '#fff' : category.color, backgroundColor: categoryFilter === category.name ? category.color : '#fff' }}>
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            <div className="mb-5 text-center">
              <h2 className="font-heading text-3xl font-bold uppercase tracking-[0.08em] text-primary sm:text-4xl">{monthTitle}</h2>
              <div className="mx-auto mt-3 h-1 w-16 bg-accent" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={`${view}-${currentDate.toISOString()}-${selectedDate}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {view === 'Month' && renderMonthView()}
                {view === 'Week' && renderWeekView()}
                {view === 'Day' && renderDayView()}
                {view === 'List' && renderListView()}
              </motion.div>
            </AnimatePresence>
            {loading && <p className="py-8 text-center text-sm text-gray-500">Loading calendar...</p>}
            {!loading && !loadError && filteredEvents.length === 0 && view !== 'List' && <p className="py-6 text-center text-sm text-gray-500">No events match your filters.</p>}

            <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
              <a href={`${API_BASE_URL}/events/export/ics`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"><FiDownload /> Download iCalendar</a>
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-accent"><FiPrinter /> Print / Save PDF</button>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-heading text-xl font-bold text-primary">Upcoming Events</h2>
              {upcomingEvents.length ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const category = categoryDetails.get(event.category) || {};
                    return (
                      <button key={event.occurrenceId || event._id} type="button" onClick={() => setSelectedEvent(event)} className="w-full rounded-xl border border-gray-100 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                        <span className="mb-1 block text-xs font-semibold" style={{ color: category.color }}>{category.emoji || '📅'} {event.category}</span>
                        <span className="block font-bold text-primary">{event.title}</span>
                        <span className="mt-1 block text-xs text-gray-500">{formatDate(event.date)}</span>
                      </button>
                    );
                  })}
                </div>
              ) : <p className="text-sm text-gray-500">No upcoming events.</p>}
            </section>
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-heading text-xl font-bold text-primary">Calendar Legend</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button key={category._id || category.name} type="button" onClick={() => setCategoryFilter(categoryFilter === category.name ? '' : category.name)} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ color: category.color, backgroundColor: `${category.color}18` }}>
                    {category.emoji} {category.name}
                  </button>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-primary">{filteredEvents.length} events shown</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">Dates and event details are maintained by the school. Please check with the school office for updates.</p>
            </section>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedEvent(null); }}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="calendar-event-title" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="h-2" style={{ backgroundColor: categoryDetails.get(selectedEvent.category)?.color || '#d4af37' }} />
              <div className="p-6 sm:p-8">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">{categoryDetails.get(selectedEvent.category)?.emoji || '📅'} {selectedEvent.category}</p>
                    <h2 id="calendar-event-title" className="font-heading text-2xl font-bold text-primary">{selectedEvent.title}</h2>
                  </div>
                  <button type="button" onClick={() => setSelectedEvent(null)} aria-label="Close event details" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"><FiX /></button>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-start gap-3"><FiCalendar className="mt-0.5 shrink-0 text-accent" /><span>{formatDate(selectedEvent.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}{selectedEvent.endDate && dateKey(selectedEvent.endDate) !== dateKey(selectedEvent.date) ? ` – ${formatDate(selectedEvent.endDate, { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}</span></p>
                  {(selectedEvent.startTime || selectedEvent.endTime) && <p className="flex items-start gap-3"><FiClock className="mt-0.5 shrink-0 text-accent" /><span>{selectedEvent.startTime || 'Time not specified'}{selectedEvent.endTime ? ` – ${selectedEvent.endTime}` : ''}</span></p>}
                  {selectedEvent.venue && <p className="flex items-start gap-3"><FiMapPin className="mt-0.5 shrink-0 text-accent" /><span>{selectedEvent.venue}</span></p>}
                  {selectedEvent.description && <p className="border-t border-gray-100 pt-3 leading-6">{selectedEvent.description}</p>}
                  {selectedEvent.attachment && <a href={assetUrl(selectedEvent.attachment)} target="_blank" rel="noreferrer" className="inline-block font-semibold text-secondary underline">View event attachment</a>}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={googleCalendarUrl(selectedEvent)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary">Add to Google Calendar</a>
                  <button type="button" onClick={() => setSelectedEvent(null)} className="min-h-11 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Close</button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CalendarPage;
