const express = require('express');
const router = express.Router();
const {
  createEstablishment,
  getEstablishments,
  getEstablishmentById,
  updateEstablishment,
  deleteEstablishment,
  getNearbyEstablishments,
  getMyEstablishment
} = require('../controllers/establishmentController');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', getEstablishments);
router.get('/nearby', getNearbyEstablishments);
router.get('/:id', getEstablishmentById);

// Routes privées (nécessitent authentification)
router.post('/', protect, createEstablishment);
router.get('/me/establishment', protect, getMyEstablishment);
router.put('/:id', protect, updateEstablishment);
router.delete('/:id', protect, deleteEstablishment);

module.exports = router;