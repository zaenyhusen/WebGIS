const db = require('../config/database');

// GET semua titik analisis sebagai GeoJSON
const getAllPoints = async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT 
        ap.id,
        ap.title,
        ap.description,
        ap.tools,
        ap.external_link,
        ap.thumbnail_url,
        ap.confidence_score,
        ap.created_at,
        c.name AS category_name,
        c.slug AS category_slug,
        c.color AS category_color,
        ST_X(ap.location) AS longitude,
        ST_Y(ap.location) AS latitude
      FROM analysis_points ap
      LEFT JOIN categories c ON ap.category_id = c.id
    `;

    const params = [];
    if (category) {
      query += ` WHERE c.slug = $1`;
      params.push(category);
    }

    query += ` ORDER BY ap.created_at DESC`;

    const result = await db.query(query, params);

    // Format sebagai GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [row.longitude, row.latitude]
        },
        properties: {
          id: row.id,
          title: row.title,
          description: row.description,
          tools: row.tools,
          external_link: row.external_link,
          thumbnail_url: row.thumbnail_url,
          confidence_score: row.confidence_score,
          category_name: row.category_name,
          category_slug: row.category_slug,
          category_color: row.category_color,
          created_at: row.created_at
        }
      }))
    };

    res.json(geojson);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET satu titik analisis by ID
const getPointById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT 
        ap.*,
        c.name AS category_name,
        c.color AS category_color,
        ST_X(ap.location) AS longitude,
        ST_Y(ap.location) AS latitude
       FROM analysis_points ap
       LEFT JOIN categories c ON ap.category_id = c.id
       WHERE ap.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
    }
    res.json({ status: 'ok', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST tambah titik analisis baru
const createPoint = async (req, res) => {
  const {
    title, description, category_id,
    tools, external_link, confidence_score,
    latitude, longitude
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO analysis_points 
        (title, description, category_id, tools, external_link, 
         confidence_score, location)
       VALUES ($1, $2, $3, $4, $5, $6, 
               ST_SetSRID(ST_MakePoint($7, $8), 4326))
       RETURNING *`,
      [title, description, category_id, tools, external_link,
       confidence_score, longitude, latitude]
    );
    res.status(201).json({ status: 'ok', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PUT update titik analisis
const updatePoint = async (req, res) => {
  const { id } = req.params;
  const {
    title, description, category_id,
    tools, external_link, confidence_score,
    latitude, longitude
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE analysis_points SET
        title=$1, description=$2, category_id=$3,
        tools=$4, external_link=$5, confidence_score=$6,
        location=ST_SetSRID(ST_MakePoint($7, $8), 4326),
        updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [title, description, category_id, tools, external_link,
       confidence_score, longitude, latitude, id]
    );
    res.json({ status: 'ok', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE titik analisis
const deletePoint = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM analysis_points WHERE id=$1', [id]);
    res.json({ status: 'ok', message: 'Data analisis dihapus' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getAllPoints,
  getPointById,
  createPoint,
  updatePoint,
  deletePoint
};