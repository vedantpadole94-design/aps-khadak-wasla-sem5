const express = require('express');
const { login, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginLimiter, login);

// GET /api/auth/verify  — validate a bearer token
router.get('/verify', auth, (req, res) =>
  res.json({ success: true, data: req.user })
);

// PUT /api/auth/change-password  — requires a valid bearer token
router.put('/change-password', auth, changePassword);

module.exports = router;
