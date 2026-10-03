const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../src/uploads/gallery');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) =>
    cb(null, 'gallery-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    const photos = await Gallery.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: photos, count: photos.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.url = '/uploads/gallery/' + req.file.filename;
    else if (!data.url) return res.status(400).json({ success: false, message: 'Image required' });
    const photo = await Gallery.create(data);
    res.status(201).json({ success: true, data: photo });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: 'Not found' });
    if (photo.url && photo.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../src', photo.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
