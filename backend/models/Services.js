const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Establishment',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Le nom du service est requis'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'soins_visage',
      'soins_corps',
      'massage',
      'manucure_pedicure',
      'coiffure',
      'maquillage',
      'epilation',
      'spa',
      'autre'
    ]
  },
  duration: {
    type: Number, // en minutes
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String], // relaxant, anti-âge, hydratant, etc.
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);