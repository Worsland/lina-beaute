const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getEstablishmentBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  checkAvailability,
  markAsCompleted
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.post('/check-availability', checkAvailability);

// Routes privées
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/establishment', protect, getEstablishmentBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);
router.put('/:id/complete', protect, markAsCompleted);

module.exports = router;