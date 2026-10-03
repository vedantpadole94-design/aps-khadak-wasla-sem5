const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const auth = require('../middleware/auth');

// GET all pages
router.get('/', async (req, res) => {
  try {
    const pages = await PageContent.find().sort({ pageKey: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single page by pageKey
router.get('/:pageKey', async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageKey: req.params.pageKey.toLowerCase() });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT / UPDATE page by pageKey (upsert)
router.put('/:pageKey', auth, async (req, res) => {
  try {
    const pageKey = req.params.pageKey.toLowerCase();
    const { title, content } = req.body;
    
    const page = await PageContent.findOneAndUpdate(
      { pageKey },
      { 
        pageKey,
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content })
      },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, message: 'Page updated successfully', data: page });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE page by pageKey
router.delete('/:pageKey', auth, async (req, res) => {
  try {
    await PageContent.findOneAndDelete({ pageKey: req.params.pageKey.toLowerCase() });
    res.json({ success: true, message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
