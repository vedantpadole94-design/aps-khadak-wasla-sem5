const MIN_JWT_SECRET_LENGTH = 32;
const SCHOOL_ORIGINS = [
  'https://www.apskhadakwasla.in',
  'https://apskhadakwasla.in'
];

const parseOrigins = (value = '') =>
  value.split(',').map((origin) => origin.trim()).filter(Boolean);

const getCorsOrigins = (env = process.env) => [
  ...new Set([
    ...SCHOOL_ORIGINS,
    ...parseOrigins(env.CORS_ORIGIN),
    ...(env.NODE_ENV === 'development' ? ['http://localhost:5173'] : [])
  ])
];

const getJwtSecret = (env = process.env) => {
  const secret = env.JWT_SECRET;
  if (!secret || secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must contain at least ${MIN_JWT_SECRET_LENGTH} characters`);
  }
  return secret;
};

const validateRuntimeConfig = (env = process.env) => {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  const jwtSecret = getJwtSecret(env);
  const port = Number(env.PORT || 5001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port');
  }

  if (env.NODE_ENV === 'production' && jwtSecret.length < 64) {
    console.warn('Production JWT_SECRET should contain at least 64 characters');
  }

  return {
    mongodbUri: env.MONGODB_URI,
    jwtSecret,
    port,
    corsOrigins: getCorsOrigins(env)
  };
};

module.exports = { getCorsOrigins, getJwtSecret, parseOrigins, validateRuntimeConfig };
