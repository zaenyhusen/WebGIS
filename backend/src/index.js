const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend
app.use('/webgis', express.static(path.join(__dirname, '../../frontend/webgis')));
app.use('/cms', express.static(path.join(__dirname, '../../frontend/cms')));

// Routes
const categoriesRouter = require('./routes/categories');
const analysisRouter = require('./routes/analysis');
const authRouter = require('./routes/auth');

app.use('/api/categories', categoriesRouter);
app.use('/api/analysis-points', analysisRouter);
app.use('/api/auth', authRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🌏 GeoEngine API berjalan',
    version: '1.0.0',
    status: 'online'
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT NOW() as time, PostGIS_Version() as postgis'
    );
    res.json({
      status: 'ok',
      database: 'terhubung',
      time: result.rows[0].time,
      postgis: result.rows[0].postgis
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Export untuk Vercel
module.exports = app;

// Jalankan lokal jika bukan di Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GeoEngine API berjalan di http://localhost:${PORT}`);
  });
}