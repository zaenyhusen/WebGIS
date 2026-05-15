const express = require('express');
const router = express.Router();
const {
  getAllPoints,
  getPointById,
  createPoint,
  updatePoint,
  deletePoint
} = require('../controllers/analysisController');

router.get('/', getAllPoints);
router.get('/:id', getPointById);
router.post('/', createPoint);
router.put('/:id', updatePoint);
router.delete('/:id', deletePoint);

module.exports = router;