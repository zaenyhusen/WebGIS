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

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'GeoEngine API berjalan',
    version: '1.0.0',
    status: 'online'
  });
});

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