const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
const path = require('path');
app.use('/webgis', express.static(path.join(__dirname, '../../frontend/webgis')));
app.use('/cms', express.static(path.join(__dirname, '../../frontend/cms')));

// Routes
const categoriesRouter = require('./routes/categories');
const analysisRouter = require('./routes/analysis');

app.use('/api/categories', categoriesRouter);
app.use('/api/analysis-points', analysisRouter);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'GeoEngine API berjalan',
    version: '1.0.0',
    status: 'online'
  });
});

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Test koneksi database
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GeoEngine API berjalan di http://localhost:${PORT}`);
});