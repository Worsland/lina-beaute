const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.get('/', getServices);
router.get('/:id', getServiceById);

// Routes privées
router.post('/', protect, createService);
router.get('/my/services', protect, getMyServices);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;