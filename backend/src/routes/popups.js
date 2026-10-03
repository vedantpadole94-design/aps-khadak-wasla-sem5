const express = require('express');
const router = express.Router();
const Popup = require('../models/Popup');
const auth = require('../middleware/auth');

router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const popups = await Popup.find({
      isActive: true,
      $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }]
    });
    res.json({ success: true, data: popups });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });
    res.json({ success: true, data: popups });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const popup = await Popup.create(req.body);
    res.status(201).json({ success: true, data: popup });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const popup = await Popup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: popup });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Popup.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
