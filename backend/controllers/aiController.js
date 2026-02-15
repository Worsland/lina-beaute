const { 
  analyzeSearchQuery, 
  generateConversationalResponse,
  generateRecommendations,
  extractIntent,
  suggestOptimalSlots,
  generateServiceDescription,
  generateReviewResponse
} = require('../utils/geminiAI');
const Establishment = require('../models/Establishment');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Recherche intelligente avec IA
// @route   POST /api/ai/search
// @access  Public
exports.intelligentSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Requête manquante'
      });
    }

    console.log('🔍 Recherche IA pour:', query);

    // 1. Analyser la requête avec Gemini
    const analysis = await analyzeSearchQuery(query);

    // 2. Construire les filtres de recherche MongoDB
    const filters = { isActive: true };
    
    // Filtre par catégorie
    if (analysis.category) {
      // Rechercher les services de cette catégorie
      const services = await Service.find({ 
        category: analysis.category,
        isActive: true 
      }).select('establishment');
      
      const establishmentIds = [...new Set(services.map(s => s.establishment.toString()))];
      
      if (establishmentIds.length > 0) {
        filters._id = { $in: establishmentIds };
      }
    }

    // Filtre par localisation
    if (analysis.location) {
      filters['address.city'] = new RegExp(analysis.location, 'i');
    }

    // Filtre par prix
    if (analysis.priceRange) {
      filters.priceRange = analysis.priceRange;
    }

    // 3. Rechercher les établissements
    let establishments = await Establishment.find(filters)
      .populate('owner', 'firstName lastName')
      .limit(10)
      .sort({ 'rating.average': -1 });

    // 4. Si recherche géospatiale et coordonnées disponibles
    if (analysis.location && establishments.length === 0) {
      // Fallback : recherche plus large
      establishments = await Establishment.find({ isActive: true })
        .populate('owner', 'firstName lastName')
        .limit(5)
        .sort({ 'rating.average': -1 });
    }

    // 5. Générer une réponse conversationnelle
    const conversationalResponse = await generateConversationalResponse(
      { 
        previousMessages: req.body.context?.messages || [],
        analysis 
      },
      query,
      establishments
    );

    res.status(200).json({
      success: true,
      data: {
        analysis,
        establishments,
        count: establishments.length,
        aiResponse: conversationalResponse,
        suggestions: analysis.preferences
      }
    });

  } catch (error) {
    console.error('❌ Erreur recherche intelligente:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
};

// @desc    Chat conversationnel avec l'IA
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

    console.log('💬 Chat IA:', message);

    // Extraire l'intention
    const intent = await extractIntent(message);

    // Générer la réponse
    const response = await generateConversationalResponse(
      context || {},
      message
    );

    res.status(200).json({
      success: true,
      data: {
        response,
        intent: intent.intent,
        confidence: intent.confidence,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Erreur chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chat',
      error: error.message
    });
  }
};

// @desc    Recommandations personnalisées
// @route   GET /api/ai/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    console.log('🎯 Génération recommandations pour:', user.email);

    // Récupérer l'historique de réservations
    const bookings = await Booking.find({ 
      client: user._id,
      status: 'completed'
    })
      .populate('services.service')
      .limit(10)
      .sort({ createdAt: -1 });

    // Profil utilisateur enrichi
    const userProfile = {
      preferences: user.preferences || {},
      favorites: user.favorites || [],
      pastBookings: bookings.map(b => ({
        category: b.services[0]?.service?.category,
        establishment: b.establishment
      }))
    };

    // Récupérer des établissements variés
    const establishments = await Establishment.find({ isActive: true })
      .limit(20)
      .sort({ 'rating.average': -1 });

    // Générer les recommandations
    const recommendations = await generateRecommendations(
      userProfile,
      establishments
    );

    // Enrichir avec les détails complets
    const enrichedRecommendations = await Promise.all(
      recommendations.recommendations.map(async (rec) => {
        const establishment = await Establishment.findById(rec.establishmentId)
          .populate('owner', 'firstName lastName');
        
        return {
          ...rec,
          establishment
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedRecommendations
    });

  } catch (error) {
    console.error('❌ Erreur recommandations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur génération recommandations',
      error: error.message
    });
  }
};

// @desc    Suggérer des créneaux optimaux
// @route   POST /api/ai/suggest-slots
// @access  Private
exports.suggestSlots = async (req, res) => {
  try {
    const { establishmentId, serviceIds, dateRange } = req.body;

    console.log('📅 Suggestion créneaux pour établissement:', establishmentId);

    // Récupérer les services et calculer la durée totale
    const services = await Service.find({ _id: { $in: serviceIds } });
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

    // Récupérer les réservations existantes
    const startDate = new Date(dateRange?.start || new Date());
    const endDate = new Date(dateRange?.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    const existingBookings = await Booking.find({
      establishment: establishmentId,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['confirmed', 'pending'] }
    });

    // Créneaux horaires standards (à améliorer avec les vraies heures d'ouverture)
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
      { start: '17:00', end: '18:00' }
    ];

    // Générer créneaux disponibles pour les 7 prochains jours
    const availableSlots = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Ignorer les dimanches (jour 0)
      if (date.getDay() === 0) continue;

      timeSlots.forEach(slot => {
        const slotDate = date.toISOString().split('T')[0];
        
        // Vérifier si le créneau est déjà pris
        const isBooked = existingBookings.some(booking => {
          const bookingDate = new Date(booking.date).toISOString().split('T')[0];
          return bookingDate === slotDate && 
                 booking.startTime === slot.start;
        });

        if (!isBooked) {
          availableSlots.push({
            date: slotDate,
            startTime: slot.start,
            endTime: slot.end
          });
        }
      });
    }

    // Récupérer les préférences de l'utilisateur
    const user = await User.findById(req.user.id);
    const userPreferences = {
      preferredTimeOfDay: user.preferences?.preferredTimeOfDay || 'afternoon',
      preferredDays: user.preferences?.preferredDays || []
    };

    // Demander à l'IA de suggérer les meilleurs créneaux
    const suggestedSlots = await suggestOptimalSlots(
      availableSlots,
      userPreferences
    );

    res.status(200).json({
      success: true,
      data: {
        availableSlots: availableSlots.slice(0, 10),
        suggestedSlots: suggestedSlots.slice(0, 3),
        totalDuration
      }
    });

  } catch (error) {
    console.error('❌ Erreur suggestion créneaux:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur suggestion créneaux',
      error: error.message
    });
  }
};

// @desc    Améliorer description de service avec IA
// @route   POST /api/ai/enhance-description
// @access  Private (Establishment)
exports.enhanceServiceDescription = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId).populate('establishment');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    // Vérifier que c'est le propriétaire
    if (service.establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    console.log('✨ Amélioration description pour:', service.name);

    const enhancedDescription = await generateServiceDescription({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      description: service.description
    });

    res.status(200).json({
      success: true,
      data: {
        original: service.description,
        enhanced: enhancedDescription
      }
    });

  } catch (error) {
    console.error('❌ Erreur amélioration description:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur amélioration description',
      error: error.message
    });
  }
};

// @desc    Générer réponse automatique à un avis
// @route   POST /api/ai/generate-review-response
// @access  Private (Establishment)
exports.generateAutoReviewResponse = async (req, res) => {
  try {
    const { reviewId } = req.body;

    const Review = require('../models/Review');
    const review = await Review.findById(reviewId)
      .populate('establishment')
      .populate('client', 'firstName lastName');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Vérifier que c'est le propriétaire
    if (review.establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    console.log('💬 Génération réponse avis pour:', review._id);

    const suggestedResponse = await generateReviewResponse({
      rating: review.rating,
      comment: review.comment,
      establishmentName: review.establishment.name
    });

    res.status(200).json({
      success: true,
      data: {
        suggestedResponse,
        review: {
          rating: review.rating,
          comment: review.comment,
          client: review.client.firstName
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur génération réponse avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur génération réponse',
      error: error.message
    });
  }
};

module.exports = exports;