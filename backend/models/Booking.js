const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Establishment',
    required: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    price: Number
  }],
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: "14:30"
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'confirmed'
  },
  notes: String,
  cancellationReason: String,
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour recherche efficace
bookingSchema.index({ client: 1, date: -1 });
bookingSchema.index({ establishment: 1, date: 1 });
bookingSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);