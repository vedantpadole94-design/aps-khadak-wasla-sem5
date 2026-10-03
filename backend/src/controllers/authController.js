const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getJwtSecret } = require('../config/env');

const BCRYPT_ROUNDS = 12;

const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), username: user.username, role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Username and password are required' });
    }

    // Case-insensitive, trimmed username lookup
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: signToken(user),
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password  (requires auth middleware)
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    // Basic presence check
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'currentPassword and newPassword are required' });
    }

    // New password strength validation
    if (!PASSWORD_POLICY.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          'New password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      });
    }

    // Fetch user with password field
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect' });
    }

    // Prevent reuse of the same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from the current password'
      });
    }

    // Hash and save — pre-save hook will also hash, so set directly via bcrypt
    // to avoid double-hashing, we bypass the pre-save hook using updateOne
    const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await User.updateOne({ _id: user._id }, { $set: { password: hashed } });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, changePassword };
