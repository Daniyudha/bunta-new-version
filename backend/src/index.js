const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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