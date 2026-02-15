const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Establishment = require('../models/Establishment');
const { 
  sendBookingConfirmation, 
  sendNewBookingNotification,
  sendBookingCancellation 
} = require('../utils/email');
// @desc    Créer une réservation
// @route   POST /api/bookings
// @access  Private (Cliente)
exports.createBooking = async (req, res) => {


  try {
    
    const { establishment, services, date, startTime, endTime, notes } = req.body;

    // Vérifier que l'établissement existe
    const establishmentExists = await Establishment.findById(establishment);
    if (!establishmentExists) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }

    // Calculer le prix total
    let totalPrice = 0;
    const serviceDetails = [];

    for (const serviceItem of services) {
      const service = await Service.findById(serviceItem.service);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: `Service ${serviceItem.service} non trouvé`
        });
      }
      totalPrice += service.price;
      serviceDetails.push({
        service: service._id,
        price: service.price
      });
    }

    // Vérifier disponibilité
    const existingBooking = await Booking.findOne({
      establishment,
      date,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau n\'est pas disponible'
      });
    }

    const booking = await Booking.create({
      client: req.user.id,
      establishment,
      services: serviceDetails,
      date,
      startTime,
      endTime,
      totalPrice,
      notes,
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('client', 'firstName lastName email phone')
      .populate('establishment', 'name address contact')
      .populate('services.service', 'name duration');
try {
  await sendBookingConfirmation(
    populatedBooking,
    populatedBooking.client,
    populatedBooking.establishment
  );

  await sendNewBookingNotification(
    populatedBooking,
    populatedBooking.establishment,
    populatedBooking.client
  );
} catch (emailError) {
  console.error('❌ Erreur envoi emails:', emailError.message);
  // Ne pas bloquer la création de réservation si email échoue
}
    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir mes réservations
// @route   GET /api/bookings/my
// @access  Private (Cliente)
exports.getMyBookings = async (req, res) => {
  try {
    const { status, upcoming } = req.query;

    const filter = { client: req.user.id };

    if (status) filter.status = status;

    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    const bookings = await Booking.find(filter)
      .populate('establishment', 'name address contact')
      .populate('services.service', 'name duration')
      .sort({ date: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les réservations de mon établissement
// @route   GET /api/bookings/establishment
// @access  Private (Establishment)
exports.getEstablishmentBookings = async (req, res) => {
  try {
    const establishment = await Establishment.findOne({ owner: req.user.id });

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Aucun établissement trouvé'
      });
    }

    const { status, date, startDate, endDate } = req.query;

    const filter = { establishment: establishment._id };

    if (status) filter.status = status;

    if (date) {
      filter.date = new Date(date);
    } else if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(filter)
      .populate('client', 'firstName lastName email phone')
      .populate('services.service', 'name duration price')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir une réservation par ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('client', 'firstName lastName email phone')
      .populate('establishment', 'name address contact')
      .populate('services.service', 'name duration price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est autorisé
    const establishment = await Establishment.findById(booking.establishment._id);
    
    if (
      booking.client._id.toString() !== req.user.id &&
      establishment.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Modifier une réservation
// @route   PUT /api/bookings/:id
// @access  Private (Cliente)
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que c'est bien la cliente
    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    // Ne peut pas modifier une réservation passée ou annulée
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier cette réservation'
      });
    }

    const { date, startTime, endTime } = req.body;

    // Si changement de date/heure, vérifier disponibilité
    if (date || startTime || endTime) {
      const checkDate = date || booking.date;
      const checkStart = startTime || booking.startTime;
      const checkEnd = endTime || booking.endTime;

      const existingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        establishment: booking.establishment,
        date: checkDate,
        status: { $in: ['confirmed', 'pending'] },
        $or: [
          {
            startTime: { $lt: checkEnd },
            endTime: { $gt: checkStart }
          }
        ]
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Ce créneau n\'est pas disponible'
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('client', 'firstName lastName email phone')
      .populate('establishment', 'name address contact')
      .populate('services.service', 'name duration');

    res.status(200).json({
      success: true,
      message: 'Réservation modifiée',
      data: updatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Annuler une réservation
// @route   DELETE /api/bookings/:id
// @access  Private (Cliente ou Establishment)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    const establishment = await Establishment.findById(booking.establishment);

    // Vérifier autorisation
    if (
      booking.client.toString() !== req.user.id &&
      establishment.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Non spécifiée';
    await booking.save();
try {
  await sendBookingCancellation(
    booking,
    await User.findById(booking.client),
    establishment,
    booking.cancellationReason
  );
} catch (emailError) {
  console.error('❌ Erreur envoi email annulation:', emailError.message);
}
    res.status(200).json({
      success: true,
      message: 'Réservation annulée',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Vérifier disponibilité
// @route   POST /api/bookings/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { establishment, date, startTime, endTime } = req.body;

    const existingBooking = await Booking.findOne({
      establishment,
      date: new Date(date),
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    res.status(200).json({
      success: true,
      available: !existingBooking,
      message: existingBooking ? 'Créneau non disponible' : 'Créneau disponible'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Marquer comme complétée (Establishment)
// @route   PUT /api/bookings/:id/complete
// @access  Private (Establishment)
exports.markAsCompleted = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    const establishment = await Establishment.findById(booking.establishment);

    if (establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Réservation marquée comme complétée',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};