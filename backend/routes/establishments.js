const express = require('express');
const router = express.Router();
const {
  createEstablishment,
  getEstablishments,
  getEstablishmentById,
  updateEstablishment,
  deleteEstablishment,
  getNearbyEstablishments,
  getMyEstablishment,
  advancedGeoSearch,           // ← AJOUTER
  getEstablishmentsWithinRadius, // ← AJOUTER
  getEstablishmentsWithinArea   // ← AJOUTER
} = require('../controllers/establishmentController');
const { protect} = require('../middleware/auth');

// Routes publiques
router.get('/', getEstablishments);
router.get('/nearby', getNearbyEstablishments);
router.get('/:id', getEstablishmentById);
router.post('/search-nearby', advancedGeoSearch);          // ← AJOUTER
router.get('/within-radius', getEstablishmentsWithinRadius); // ← AJOUTER
router.post('/within-area', getEstablishmentsWithinArea);  
// Routes privées (nécessitent authentification)
router.post('/', protect, createEstablishment);
router.get('/me/establishment', protect, getMyEstablishment);
router.put('/:id', protect, updateEstablishment);
router.delete('/:id', protect, deleteEstablishment);

module.exports = router;