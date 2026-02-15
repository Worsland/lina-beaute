const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Establishment',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Le commentaire est requis'],
    maxlength: [1000, 'Maximum 1000 caractères'],
    trim: true
  },
  photos: [{
    url: String,
    caption: String
  }],
  response: {
    text: {
      type: String,
      maxlength: 500
    },
    date: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  helpful: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Un seul avis par réservation
reviewSchema.index({ booking: 1 }, { unique: true });

// Index pour recherche rapide
reviewSchema.index({ establishment: 1, createdAt: -1 });
reviewSchema.index({ client: 1 });
reviewSchema.index({ rating: 1 });

// Middleware pour mettre à jour la note moyenne de l'établissement
reviewSchema.post('save', async function() {
  await updateEstablishmentRating(this.establishment);
});

reviewSchema.post('remove', async function() {
  await updateEstablishmentRating(this.establishment);
});

// Fonction pour calculer et mettre à jour la note moyenne
async function updateEstablishmentRating(establishmentId) {
  const Establishment = require('./Establishment');
  
  const stats = await mongoose.model('Review').aggregate([
    {
      $match: { 
        establishment: establishmentId,
        isVerified: true 
      }
    },
    {
      $group: {
        _id: '$establishment',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Establishment.findByIdAndUpdate(establishmentId, {
      'rating.average': Math.round(stats[0].averageRating * 10) / 10,
      'rating.count': stats[0].totalReviews
    });
  } else {
    await Establishment.findByIdAndUpdate(establishmentId, {
      'rating.average': 0,
      'rating.count': 0
    });
  }
}

module.exports = mongoose.model('Review', reviewSchema);