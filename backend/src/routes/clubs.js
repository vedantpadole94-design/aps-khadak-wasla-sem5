const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const VALID_WINGS = ['primary', 'secondary'];
const VALID_CATEGORIES = ['Academic', 'Sports', 'Arts', 'Service', 'Other'];

// ─── Helpers ────────────────────────────────────────────────────────────────

const validate = (body) => {
  const errors = [];
  if (!body.name || String(body.name).trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  if (String(body.name || '').trim().length > 60) {
    errors.push('Name must be 60 characters or fewer');
  }
  if (!VALID_WINGS.includes(body.wing)) {
    errors.push('Wing must be "primary" or "secondary"');
  }
  if (body.category && !VALID_CATEGORIES.includes(body.category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  return errors;
};

// ─── Public routes ───────────────────────────────────────────────────────────

// GET /api/clubs  — active clubs only, optional ?wing= filter, sorted by order
router.get('/', async (req, res) => {
  try {
    const query = { active: true };
    if (req.query.wing && VALID_WINGS.includes(req.query.wing)) {
      query.wing = req.query.wing;
    }
    const clubs = await Club.find(query).sort({ wing: 1, order: 1, createdAt: 1 });
    res.json({ success: true, data: clubs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Admin routes ────────────────────────────────────────────────────────────

// PUT /api/clubs/reorder  — must be ABOVE /:id to avoid "reorder" being treated as an id
router.put('/reorder', auth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'items must be a non-empty array' });
    }
    await Promise.all(
      items.map(({ id, order }) =>
        Club.findByIdAndUpdate(id, { order: Number(order) })
      )
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/clubs/admin  — all clubs (active + inactive), optional ?wing= filter
router.get('/admin', auth, async (req, res) => {
  try {
    const query = {};
    if (req.query.wing && VALID_WINGS.includes(req.query.wing)) {
      query.wing = req.query.wing;
    }
    const clubs = await Club.find(query).sort({ wing: 1, order: 1, createdAt: 1 });
    res.json({ success: true, data: clubs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/clubs  — create a club
router.post('/', auth, async (req, res) => {
  try {
    const errors = validate(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }
    const club = await Club.create(req.body);
    res.status(201).json({ success: true, data: club });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/clubs/:id  — update a club
router.put('/:id', auth, async (req, res) => {
  try {
    const errors = validate({ ...req.body, wing: req.body.wing || 'primary' });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    res.json({ success: true, data: club });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/clubs/:id  — delete a club
router.delete('/:id', auth, async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
