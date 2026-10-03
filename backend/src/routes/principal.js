const express = require('express');
const router = express.Router();
const Principal = require('../models/Principal');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../src/uploads/principal');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'principal-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    let principal = await Principal.findOne();
    if (!principal) principal = await Principal.create({});
    res.json({ success: true, data: principal });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.photo = '/uploads/principal/' + req.file.filename;
    let principal = await Principal.findOneAndUpdate({}, update, { new: true, upsert: true });
    res.json({ success: true, data: principal });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
