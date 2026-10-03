const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/env');

module.exports = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer') {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    req.user = jwt.verify(token, getJwtSecret());
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
