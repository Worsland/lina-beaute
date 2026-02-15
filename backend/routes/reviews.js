const express = require('express');
const router = express.Router();
const {
  createReview,
  getEstablishmentReviews,
  getMyReviews,
  respondToReview,
  suggestResponse,
  reportReview,
  markAsHelpful,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.get('/establishment/:id', getEstablishmentReviews);

// Routes privées
router.post('/', protect, createReview);
router.get('/my', protect, getMyReviews);
router.post('/:id/respond', protect, respondToReview);
router.post('/:id/suggest-response', protect, suggestResponse);
router.post('/:id/report', protect, reportReview);
router.post('/:id/helpful', protect, markAsHelpful);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;