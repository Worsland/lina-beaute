const express = require('express');
const router = express.Router();
const { 
  intelligentSearch, 
  chat,
  recommendations 
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/search', intelligentSearch);
router.post('/chat', chat);
router.post('/recommendations', protect, recommendations);

module.exports = router;