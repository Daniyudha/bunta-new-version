const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - restrict to frontend domain in production
const corsOrigins = process.env.CORS_ORIGINS || 'http://localhost:3000';
const allowedOrigins = corsOrigins.split(',').map(origin => origin.trim());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development, allow localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://192.168.')) {
        return callback(null, true);
      }
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user-id', 'x-user-role']
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/data', require('./routes/data'));
app.use('/api/news', require('./routes/news'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/sliders', require('./routes/sliders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/irrigation-profiles', require('./routes/irrigation-profiles'));

// Default 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});