const { 
  analyzeSearchQuery, 
  generateResponse,
  getRecommendations 
} = require('../utils/geminiAI');
const Establishment = require('../models/Establishment');
const Service = require('../models/Service');

// @desc    Recherche intelligente avec IA
// @route   POST /api/ai/search
// @access  Public
exports.intelligentSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Requête manquante'
      });
    }

    // Analyser la requête avec Gemini
    const analysis = await analyzeSearchQuery(query);

    // Construire les filtres de recherche
    const filters = {};
    
    if (analysis.category) {
      // Rechercher les services correspondants
      const services = await Service.find({ 
        category: analysis.category,
        isActive: true 
      }).select('establishment');
      
      filters._id = { $in: services.map(s => s.establishment) };
    }

    if (analysis.location) {
      filters['address.city'] = new RegExp(analysis.location, 'i');
    }

    if (analysis.priceRange) {
      filters.priceRange = analysis.priceRange;
    }

    // Rechercher les établissements
    const establishments = await Establishment.find(filters)
      .populate('owner', 'firstName lastName')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        analysis,
        results: establishments,
        count: establishments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Chat avec l'assistant IA
// @route   POST /api/ai/chat
// @access  Public
exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message manquant'
      });
    }

    // Générer la réponse
    const response = await generateResponse(context || {}, message);

    res.status(200).json({
      success: true,
      data: {
        response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Recommandations personnalisées
// @route   POST /api/ai/recommendations
// @access  Private
exports.recommendations = async (req, res) => {
  try {
    const user = req.user;

    // Récupérer les établissements
    const establishments = await Establishment.find({ isActive: true })
      .limit(20);

    // Obtenir les recommandations
    const recommendations = await getRecommendations(
      {
        preferences: user.preferences,
        favorites: user.favorites
      },
      establishments
    );

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;