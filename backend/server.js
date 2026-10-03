const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
mongoose.set('strict', true);
mongoose.set('strictQuery', true);

const uploadsDir = path.join(__dirname, 'src', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const connectDB = require('./src/config/db');
const { validateRuntimeConfig } = require('./src/config/env');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { mongoSanitizeMiddleware, sanitizeMongoQuery } = require('./src/middleware/mongoSanitize');
const Category = require('./src/models/Category');
const { seedDefaultCategories } = require('./src/utils/defaultCategories');

const app = express();

app.set('query parser', sanitizeMongoQuery);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitizeMiddleware);
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = runtimeConfig.corsOrigins;
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const error = new Error('CORS blocked');
    error.status = 403;
    callback(error);
  }
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.use('/api', apiLimiter);
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/enquiries', require('./src/routes/enquiries'));
app.use('/api/events', require('./src/routes/events'));
app.use('/api/notices', require('./src/routes/notices'));
app.use('/api/gallery', require('./src/routes/gallery'));
app.use('/api/faculty', require('./src/routes/faculty'));
app.use('/api/principal', require('./src/routes/principal'));
app.use('/api/results', require('./src/routes/results'));
app.use('/api/popups', require('./src/routes/popups'));
app.use('/api/settings', require('./src/routes/settings'));
app.use('/api/pages', require('./src/routes/pages'));
app.use('/api/clubs', require('./src/routes/clubs'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'APS Backend Running' }));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    error: status >= 500 ? 'Server Error' : 'Request Error',
    message: status >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred'
      : err.message
  });
});

let runtimeConfig;

const startServer = async () => {
  runtimeConfig = validateRuntimeConfig();
  await connectDB(runtimeConfig.mongodbUri);
  await seedDefaultCategories(Category);
  app.listen(runtimeConfig.port, () => {
    console.log(`APS Server running on port ${runtimeConfig.port}`);
  });
};

startServer().catch((error) => {
  console.error(`Unable to start APS server: ${error.message}`);
  process.exitCode = 1;
});
