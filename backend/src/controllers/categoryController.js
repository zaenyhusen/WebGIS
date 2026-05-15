const db = require('../config/database');

// GET semua kategori
const getAllCategories = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    res.json({
      status: 'ok',
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST buat kategori baru
const createCategory = async (req, res) => {
  const { name, slug, color } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO categories (name, slug, color) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, slug, color]
    );
    res.status(201).json({
      status: 'ok',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PUT update kategori
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, color } = req.body;
  try {
    const result = await db.query(
      `UPDATE categories SET name=$1, slug=$2, color=$3 
       WHERE id=$4 RETURNING *`,
      [name, slug, color, id]
    );
    res.json({ status: 'ok', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE kategori
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM categories WHERE id=$1', [id]);
    res.json({ status: 'ok', message: 'Kategori dihapus' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};