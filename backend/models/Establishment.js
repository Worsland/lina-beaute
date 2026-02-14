const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['institut_beaute', 'spa', 'salon_coiffure', 'centre_esthetique'],
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: String,
    country: { type: String, default: 'Tunisie' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  contact: {
    phone: { type: String, required: true },
    email: String,
    website: String,
    facebook: String,
    instagram: String
  },
  openingHours: [{
    day: {
      type: Number, // 0 = Dimanche, 1 = Lundi, etc.
      required: true
    },
    open: { type: String, required: true }, // Format: "09:00"
    close: { type: String, required: true }, // Format: "18:00"
    isClosed: { type: Boolean, default: false }
  }],
  images: [{
    url: String,
    caption: String
  }],
  amenities: [String], // Parking, WiFi, Climatisation, etc.
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  priceRange: {
    type: String,
    enum: ['€', '€€', '€€€'],
    default: '€€'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  cancellationPolicy: {
    type: String,
    default: 'Annulation gratuite jusqu\'à 24h avant le rendez-vous'
  }
}, {
  timestamps: true
});

// Index géospatial pour les recherches par localisation
establishmentSchema.index({ location: '2dsphere' });

// Index pour la recherche textuelle
establishmentSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Establishment', establishmentSchema);