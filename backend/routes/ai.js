const express = require('express');
const router = express.Router();
const { 
  intelligentSearch, 
  chat,
  getRecommendations,
  suggestSlots,
  enhanceServiceDescription,
  generateAutoReviewResponse
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.post('/search', intelligentSearch);
router.post('/chat', chat);

// Routes privées
router.get('/recommendations', protect, getRecommendations);
router.post('/suggest-slots', protect, suggestSlots);
router.post('/enhance-description', protect, enhanceServiceDescription);
router.post('/generate-review-response', protect, generateAutoReviewResponse);

module.exports = router;