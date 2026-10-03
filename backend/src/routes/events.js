const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const Event = require('../models/Event');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { parseEventCsv, toCsv } = require('../utils/calendarCsv');
const { expandRecurringEvents } = require('../utils/expandRecurringEvents');

const router = express.Router();
const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const RECURRENCE_TYPES = ['none', 'daily', 'weekly', 'monthly', 'yearly'];
const uploadDirectory = path.join(__dirname, '..', 'uploads', 'events');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`);
  }
});
const attachmentUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const validType = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype);
    if (!validType) return callback(new Error('Attachments must be JPEG, PNG, WebP, or PDF'));
    callback(null, true);
  }
});
const uploadEventAttachment = (req, res, next) => attachmentUpload.single('attachment')(req, res, (error) => {
  if (error) return res.status(400).json({ success: false, message: error.message });
  next();
});

const toDate = (value, field) => {
  if (value === undefined || value === null || value === '') return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${field} must be a valid date`);
  return date;
};

const toBoolean = (value, field, defaultValue) => {
  if (value === undefined || value === '') return defaultValue;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  throw new Error(`${field} must be true or false`);
};

const normalizeEventInput = (input, { partial = false } = {}) => {
  const body = input || {};
  const normalized = {};
  const assign = (key, value) => {
    if (value !== undefined) normalized[key] = value;
  };

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title || title.length > 100) throw new Error('Title is required and must not exceed 100 characters');
    normalized.title = title;
  }
  if (!partial || body.description !== undefined) {
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (description.length > 500) throw new Error('Description must not exceed 500 characters');
    normalized.description = description;
  }
  if (!partial || body.category !== undefined) {
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    if (!category || category.length > 40) throw new Error('Category is required');
    normalized.category = category;
  }

  const eventDateInput = body.startDate ?? body.date;
  const eventDate = toDate(eventDateInput, 'Start date');
  if (!partial || eventDate !== undefined) {
    if (!eventDate) throw new Error('Start date is required');
    assign('date', eventDate);
  }

  const endDate = toDate(body.endDate, 'End date');
  if (endDate !== undefined || (partial && (body.endDate === '' || body.endDate === null))) {
    assign('endDate', endDate || null);
  }
  const effectiveStart = eventDate || (body.date ? toDate(body.date, 'Start date') : undefined);
  const effectiveEnd = endDate || (partial && body.endDate === undefined ? undefined : null);
  if (effectiveStart && effectiveEnd && effectiveEnd < effectiveStart) {
    throw new Error('End date cannot be before start date');
  }

  for (const field of ['startTime', 'endTime']) {
    if (body[field] === undefined && partial) continue;
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (value && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      throw new Error(`${field} must use 24-hour HH:MM format`);
    }
    assign(field, value);
  }

  if (body.venue !== undefined || !partial) {
    const venue = typeof body.venue === 'string' ? body.venue.trim() : '';
    if (venue.length > 100) throw new Error('Venue must not exceed 100 characters');
    assign('venue', venue);
  }
  if (body.color !== undefined || !partial) {
    const color = typeof body.color === 'string' ? body.color : '#7c3aed';
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Color must be a six-digit hex value');
    assign('color', color);
  }

  for (const field of ['isRecurring', 'showOnPublic', 'showAsPopup', 'notifyAdmin', 'isActive']) {
    if (body[field] !== undefined || !partial) {
      const defaultValue = field === 'isRecurring' || field === 'showAsPopup' || field === 'notifyAdmin'
        ? false
        : true;
      assign(field, toBoolean(body[field], field, defaultValue));
    }
  }

  if (body.recurrenceType !== undefined || !partial) {
    const recurrenceType = body.recurrenceType || (body.isRecurring ? 'yearly' : 'none');
    if (!RECURRENCE_TYPES.includes(recurrenceType)) throw new Error('Recurrence type is invalid');
    normalized.recurrenceType = recurrenceType;
    if (body.isRecurring === undefined && !partial) normalized.isRecurring = recurrenceType !== 'none';
  }
  const recurrenceEnd = toDate(body.recurrenceEnd, 'Recurrence end');
  if (recurrenceEnd !== undefined) assign('recurrenceEnd', recurrenceEnd);
  const recurring = normalized.isRecurring ?? body.isRecurring;
  const recurrenceType = normalized.recurrenceType ?? body.recurrenceType;
  const effectiveRecurrenceEnd = recurrenceEnd || (partial && body.recurrenceEnd === undefined ? undefined : null);
  if (recurring && (!recurrenceType || recurrenceType === 'none' || !effectiveRecurrenceEnd)) {
    throw new Error('Recurring events require a recurrence type and end date');
  }
  if (recurring && eventDate && effectiveRecurrenceEnd && effectiveRecurrenceEnd < eventDate) {
    throw new Error('Recurrence end cannot be before start date');
  }
  if (recurring && eventDate && effectiveRecurrenceEnd
    && effectiveRecurrenceEnd > new Date(eventDate.getTime() + 5 * 366 * 86400000)) {
    throw new Error('Recurring events can be scheduled for up to five years');
  }

  if (body.attachment !== undefined) {
    if (typeof body.attachment !== 'string' || body.attachment.length > 500) {
      throw new Error('Attachment URL is invalid');
    }
    assign('attachment', body.attachment);
  }

  return normalized;
};

const validateCategoryExists = async (name) => {
  if (!await Category.exists({ name })) throw new Error('Select a valid event category');
};

const getEventFilter = (query, isAdmin = false) => {
  const filter = isAdmin ? {} : { isActive: true, showOnPublic: { $ne: false } };
  if (typeof query.category === 'string' && query.category) filter.category = query.category;
  if (!isAdmin && query.upcoming === 'true') filter.date = { $gte: new Date() };
  if (query.from || query.to) {
    filter.date = filter.date || {};
    if (query.from) filter.date.$gte = toDate(query.from, 'from');
    if (query.to) filter.date.$lte = toDate(query.to, 'to');
  }
  if (typeof query.search === 'string' && query.search.trim()) {
    const search = query.search.trim().slice(0, 100);
    filter.$or = [
      { title: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { description: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { venue: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
    ];
  }
  return filter;
};

const parsePagination = (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || PAGE_SIZE);
  if (!Number.isSafeInteger(page) || page < 1) throw new Error('page must be a positive integer');
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error('limit must be a positive integer');
  const safeLimit = Math.min(limit, MAX_PAGE_SIZE);
  const skip = (page - 1) * safeLimit;
  if (!Number.isSafeInteger(skip)) throw new Error('page is out of range');
  return { page, limit: safeLimit, skip };
};

router.get('/upcoming', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=60');
    const now = new Date();
    const rangeEnd = new Date(now.getTime() + 366 * 86400000);
    const events = await Event.find({
      isActive: true,
      showOnPublic: { $ne: false },
      $or: [
        { date: { $gte: now } },
        { isRecurring: true, recurrenceEnd: { $gte: now } }
      ]
    }).sort({ date: 1 }).lean();
    const occurrences = expandRecurringEvents(events, { from: now, to: rangeEnd }).slice(0, 5);
    res.json({ success: true, data: occurrences, count: occurrences.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/month/:year/:month', async (req, res) => {
  try {
    const year = Number(req.params.year);
    const month = Number(req.params.month);
    if (!Number.isInteger(year) || year < 1 || year > 9999 || !Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ success: false, message: 'Year and month are invalid' });
    }
    res.set('Cache-Control', 'public, max-age=60');
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 1));
    const events = await Event.find({
      isActive: true,
      showOnPublic: { $ne: false },
      $or: [
        { date: { $gte: from, $lt: to } },
        { isRecurring: true, date: { $lt: to }, recurrenceEnd: { $gte: from } }
      ]
    }).sort({ date: 1 }).lean();
    const occurrences = expandRecurringEvents(events, { from, to });
    res.json({ success: true, data: occurrences, count: occurrences.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/export/ics', async (req, res) => {
  try {
    const sourceEvents = await Event.find({ isActive: true, showOnPublic: { $ne: false } }).sort({ date: 1 }).lean();
    const events = expandRecurringEvents(sourceEvents);
    const escape = (value = '') => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//APS Khadakwasla//Academic Calendar//EN'];
    events.forEach((event) => {
      lines.push(
        'BEGIN:VEVENT',
        `UID:${event._id}@apskhadakwasla.in`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `DTSTART;VALUE=DATE:${new Date(event.date).toISOString().slice(0, 10).replace(/-/g, '')}`,
        `SUMMARY:${escape(event.title)}`,
        `DESCRIPTION:${escape(event.description)}`,
        `CATEGORIES:${escape(event.category)}`
      );
      if (event.endDate) {
        const exclusiveEnd = new Date(event.endDate);
        exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
        lines.push(`DTEND;VALUE=DATE:${exclusiveEnd.toISOString().slice(0, 10).replace(/-/g, '')}`);
      }
      if (event.venue) lines.push(`LOCATION:${escape(event.venue)}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    res.set({ 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="aps-calendar.ics"' });
    res.send(lines.join('\r\n'));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/export', auth, async (req, res) => {
  try {
    const filter = getEventFilter(req.query, true);
    const events = await Event.find(filter).sort({ date: 1 }).lean();
    res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="calendar.csv"' });
    res.send(toCsv(events));
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/admin', auth, async (req, res) => {
  try {
    const filter = getEventFilter(req.query, true);
    const { page, limit, skip } = parsePagination(req.query);
    const [events, count] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter)
    ]);
    res.json({ success: true, data: events, count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/admin/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [total, thisMonth, upcoming, holidays, byCategory] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: monthStart, $lt: monthEnd } }),
      Event.countDocuments({ date: { $gte: now }, isActive: true }),
      Event.countDocuments({ category: 'Holiday' }),
      Event.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    ]);
    res.json({ success: true, data: { total, thisMonth, upcoming, holidays, byCategory } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/bulk-import', auth, async (req, res) => {
  try {
    if (typeof req.body?.csv !== 'string' || req.body.csv.length > 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Provide a CSV file no larger than 1 MB' });
    }
    const inputRows = parseEventCsv(req.body.csv);
    if (inputRows.length > 500) return res.status(400).json({ success: false, message: 'Import is limited to 500 events at a time' });
    const rows = inputRows.map((row, index) => {
      try {
        const normalized = normalizeEventInput({
          ...row,
          date: row.startDate,
          isRecurring: row.isRecurring.toLowerCase(),
          showOnPublic: 'true'
        });
        return normalized;
      } catch (error) {
        throw new Error(`CSV row ${index + 2}: ${error.message}`);
      }
    });
    const categoryNames = [...new Set(rows.map((row) => row.category))];
    const existingCategories = await Category.find({ name: { $in: categoryNames } }).select('name').lean();
    const existingNames = new Set(existingCategories.map((category) => category.name));
    const missingCategory = categoryNames.find((name) => !existingNames.has(name));
    if (missingCategory) throw new Error(`Unknown category "${missingCategory}"`);
    const created = await Event.insertMany(rows, { ordered: true });
    res.status(201).json({ success: true, count: created.length });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = getEventFilter(req.query);
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
    res.set('Cache-Control', 'public, max-age=60');
    if (!hasPagination) {
      const sourceEvents = await Event.find(filter).sort({ date: 1 }).lean();
      const events = expandRecurringEvents(sourceEvents);
      return res.json({ success: true, data: events, count: events.length });
    }
    const { page, limit, skip } = parsePagination(req.query);
    const sourceEvents = await Event.find(filter).sort({ date: 1 }).lean();
    const allEvents = expandRecurringEvents(sourceEvents);
    const events = allEvents.slice(skip, skip + limit);
    const count = allEvents.length;
    res.json({ success: true, data: events, count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/', auth, uploadEventAttachment, async (req, res) => {
  try {
    const input = { ...req.body };
    if (req.file) input.attachment = `/uploads/events/${req.file.filename}`;
    const normalized = normalizeEventInput(input);
    await validateCategoryExists(normalized.category);
    const event = await Event.create(normalized);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (req.file) fs.rmSync(req.file.path, { force: true });
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Event ID is invalid' });
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      isActive: true,
      showOnPublic: { $ne: false }
    }).lean();
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, uploadEventAttachment, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Event ID is invalid' });
  try {
    const input = { ...req.body };
    if (req.file) input.attachment = `/uploads/events/${req.file.filename}`;
    const normalized = normalizeEventInput(input, { partial: true });
    if (normalized.category) await validateCategoryExists(normalized.category);
    const existing = await Event.findById(req.params.id);
    if (!existing) {
      if (req.file) fs.rmSync(req.file.path, { force: true });
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    const nextDate = normalized.date || existing.date;
    const nextEndDate = normalized.endDate === null ? null : normalized.endDate || existing.endDate;
    if (nextEndDate && nextEndDate < nextDate) {
      if (req.file) fs.rmSync(req.file.path, { force: true });
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }
    const event = await Event.findByIdAndUpdate(req.params.id, normalized, { new: true, runValidators: true });
    if (!event) {
      if (req.file) fs.rmSync(req.file.path, { force: true });
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    if (req.file) fs.rmSync(req.file.path, { force: true });
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Event ID is invalid' });
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.attachment?.startsWith('/uploads/events/')) {
      const attachmentPath = path.join(uploadDirectory, path.basename(event.attachment));
      fs.rmSync(attachmentPath, { force: true });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
module.exports.normalizeEventInput = normalizeEventInput;
module.exports.parsePagination = parsePagination;
