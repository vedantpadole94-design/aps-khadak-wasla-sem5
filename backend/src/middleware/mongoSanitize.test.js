const test = require('node:test');
const assert = require('node:assert/strict');
const { mongoSanitizeMiddleware, sanitizeMongoQuery } = require('./mongoSanitize');

test('sanitizeMongoQuery removes operator and dotted query keys', () => {
  const query = sanitizeMongoQuery('$where=1&profile.name=Alice&category=Sports');
  assert.deepEqual(Object.keys(query), ['category']);
  assert.equal(query.category, 'Sports');
});

test('mongoSanitizeMiddleware removes operator and dotted body keys', () => {
  const req = {
    body: {
      username: { $ne: null },
      'profile.name': 'Alice',
      category: 'Sports'
    }
  };

  mongoSanitizeMiddleware(req, {}, () => {});

  assert.deepEqual(req.body, {
    username: {},
    category: 'Sports'
  });
});
