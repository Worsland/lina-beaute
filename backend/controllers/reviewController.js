const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Establishment = require('../models/Establishment');
const User = require('../models/User');
const { generateReviewResponse } = require('../utils/geminiAI');

// @desc    Créer un avis
// @route   POST /api/reviews
// @access  Private (Cliente)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, photos } = req.body;

    // Vérifier que la réservation existe et est complétée
    const booking = await Booking.findById(bookingId)
      .populate('establishment');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Vous pouvez laisser un avis uniquement après la prestation'
      });
    }

    // Vérifier qu'il n'existe pas déjà un avis pour cette réservation
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour cette réservation'
      });
    }

    // Créer l'avis
    const review = await Review.create({
      establishment: booking.establishment._id,
      client: req.user.id,
      booking: bookingId,
      rating,
      comment,
      photos: photos || []
    });

    const populatedReview = await Review.findById(review._id)
      .populate('client', 'firstName lastName avatar')
      .populate('establishment', 'name');

    res.status(201).json({
      success: true,
      message: 'Avis publié avec succès',
      data: populatedReview
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour cette réservation'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les avis d'un établissement
// @route   GET /api/reviews/establishment/:id
// @access  Public
exports.getEstablishmentReviews = async (req, res) => {
  try {
    const { rating, sort = '-createdAt', page = 1, limit = 10 } = req.query;

    const filter = {
      establishment: req.params.id,
      isVerified: true
    };

    if (rating) {
      filter.rating = parseInt(rating);
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .populate('client', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Statistiques des notes
    const stats = await Review.aggregate([
      {
        $match: { 
          establishment: require('mongoose').Types.ObjectId(req.params.id),
          isVerified: true 
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    stats.forEach(stat => {
      ratingDistribution[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: reviews,
      stats: {
        total,
        ratingDistribution,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir mes avis
// @route   GET /api/reviews/my
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ client: req.user.id })
      .populate('establishment', 'name address rating')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Répondre à un avis
// @route   POST /api/reviews/:id/respond
// @access  Private (Establishment owner)
exports.respondToReview = async (req, res) => {
  try {
    const { responseText } = req.body;

    const review = await Review.findById(req.params.id)
      .populate('establishment');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Vérifier que c'est le propriétaire de l'établissement
    if (review.establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    if (review.response && review.response.text) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà répondu à cet avis'
      });
    }

    review.response = {
      text: responseText,
      date: new Date(),
      author: req.user.id
    };

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('client', 'firstName lastName')
      .populate('response.author', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Réponse publiée',
      data: updatedReview
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Suggérer une réponse avec IA
// @route   POST /api/reviews/:id/suggest-response
// @access  Private (Establishment owner)
exports.suggestResponse = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('establishment')
      .populate('client', 'firstName');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (review.establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const suggestedResponse = await generateReviewResponse({
      rating: review.rating,
      comment: review.comment,
      establishmentName: review.establishment.name,
      clientName: review.client.firstName
    });

    res.status(200).json({
      success: true,
      data: {
        suggestedResponse,
        review: {
          rating: review.rating,
          comment: review.comment
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Signaler un avis
// @route   POST /api/reviews/:id/report
// @access  Private
exports.reportReview = async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    review.isReported = true;
    review.reportReason = reason;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Avis signalé, il sera examiné par notre équipe'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Marquer un avis comme utile
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markAsHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà marqué comme utile
    const alreadyMarked = review.helpfulBy.includes(req.user.id);

    if (alreadyMarked) {
      // Retirer le vote
      review.helpfulBy = review.helpfulBy.filter(
        id => id.toString() !== req.user.id
      );
      review.helpful -= 1;
    } else {
      // Ajouter le vote
      review.helpfulBy.push(req.user.id);
      review.helpful += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyMarked ? 'Vote retiré' : 'Marqué comme utile',
      data: {
        helpful: review.helpful,
        isMarked: !alreadyMarked
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Modifier un avis
// @route   PUT /api/reviews/:id
// @access  Private (Author only)
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (review.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    // Ne peut modifier que dans les 7 jours
    const daysSinceCreation = (new Date() - review.createdAt) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 7) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez modifier votre avis que dans les 7 jours suivant sa publication'
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Avis mis à jour',
      data: review
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un avis
// @route   DELETE /api/reviews/:id
// @access  Private (Author only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (review.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    await review.remove();

    res.status(200).json({
      success: true,
      message: 'Avis supprimé'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
