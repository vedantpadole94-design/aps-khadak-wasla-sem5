const querystring = require('node:querystring');
const mongoSanitize = require('express-mongo-sanitize');

const sanitizeMongoQuery = (query) => mongoSanitize.sanitize(querystring.parse(query));

const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body);
  }
  next();
};

module.exports = { mongoSanitizeMiddleware, sanitizeMongoQuery };
