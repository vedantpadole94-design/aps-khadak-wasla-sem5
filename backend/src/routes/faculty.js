const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../src/uploads/faculty');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'faculty-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const { dept, search } = req.query;
    let query = { isActive: true };
    if (dept) query.department = dept;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { designation: new RegExp(search, 'i') }];
    const faculty = await Faculty.find(query).sort({ name: 1 });
    res.json({ success: true, data: faculty, count: faculty.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = '/uploads/faculty/' + req.file.filename;
    const faculty = await Faculty.create(data);
    res.status(201).json({ success: true, data: faculty });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.photo = '/uploads/faculty/' + req.file.filename;
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, data: faculty });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Faculty.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Faculty removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
