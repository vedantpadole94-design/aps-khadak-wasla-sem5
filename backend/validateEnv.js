require('dotenv').config();

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
];

const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error('\n❌ MISSING ENV VARIABLES:', missing.join(', '));
  console.error('Check your backend/.env file\n');
  process.exit(1);
}

console.log('✅ Environment variables OK');
console.log('   PORT:', process.env.PORT);
console.log('   DB:', process.env.MONGODB_URI.split('@').pop() || process.env.MONGODB_URI);
console.log('   JWT_SECRET set:', !!process.env.JWT_SECRET);
