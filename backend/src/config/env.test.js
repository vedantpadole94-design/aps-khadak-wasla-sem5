const test = require('node:test');
const assert = require('node:assert/strict');
const { getCorsOrigins, getJwtSecret, parseOrigins, validateRuntimeConfig } = require('./env');

test('parseOrigins trims entries and ignores empty values', () => {
  assert.deepEqual(parseOrigins(' https://school.example, ,https://admin.example '), [
    'https://school.example',
    'https://admin.example'
  ]);
});

test('getJwtSecret rejects missing and short secrets', () => {
  assert.throws(() => getJwtSecret({}), /JWT_SECRET must contain at least 32 characters/);
  assert.throws(() => getJwtSecret({ JWT_SECRET: 'short' }), /JWT_SECRET must contain at least 32 characters/);
});

test('validateRuntimeConfig requires a database and a valid secret', () => {
  const baseConfig = { MONGODB_URI: 'mongodb://localhost:27017/aps', JWT_SECRET: 'a'.repeat(32) };
  assert.throws(() => validateRuntimeConfig({ JWT_SECRET: baseConfig.JWT_SECRET }), /MONGODB_URI is required/);

  assert.deepEqual(validateRuntimeConfig(baseConfig), {
    mongodbUri: baseConfig.MONGODB_URI,
    jwtSecret: baseConfig.JWT_SECRET,
    port: 5001,
    corsOrigins: ['https://www.apskhadakwasla.in', 'https://apskhadakwasla.in']
  });
});

test('getCorsOrigins allows local development only in development and adds configured origins', () => {
  assert.deepEqual(getCorsOrigins({
    NODE_ENV: 'development',
    CORS_ORIGIN: 'https://admin.example'
  }), [
    'https://www.apskhadakwasla.in',
    'https://apskhadakwasla.in',
    'https://admin.example',
    'http://localhost:5173'
  ]);

  assert.deepEqual(getCorsOrigins({
    NODE_ENV: 'production',
    CORS_ORIGIN: 'https://admin.example'
  }), [
    'https://www.apskhadakwasla.in',
    'https://apskhadakwasla.in',
    'https://admin.example'
  ]);
});

test('validateRuntimeConfig rejects invalid ports', () => {
  assert.throws(() => validateRuntimeConfig({
    MONGODB_URI: 'mongodb://localhost:27017/aps',
    JWT_SECRET: 'a'.repeat(32),
    PORT: '70000'
  }), /PORT must be a valid TCP port/);
});

test('validateRuntimeConfig warns when production JWT secrets are shorter than 64 characters', () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(message);

  try {
    validateRuntimeConfig({
      MONGODB_URI: 'mongodb://localhost:27017/aps',
      JWT_SECRET: 'a'.repeat(32),
      NODE_ENV: 'production'
    });
    assert.deepEqual(warnings, ['Production JWT_SECRET should contain at least 64 characters']);

    warnings.length = 0;
    validateRuntimeConfig({
      MONGODB_URI: 'mongodb://localhost:27017/aps',
      JWT_SECRET: 'a'.repeat(64),
      NODE_ENV: 'production'
    });
    assert.deepEqual(warnings, []);
  } finally {
    console.warn = originalWarn;
  }
});
