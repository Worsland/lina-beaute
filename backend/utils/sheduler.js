const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Establishment = require('../models/Establishment');
const { sendBookingReminder } = require('./email');

/**
 * Tâche CRON pour les rappels 24h avant
 * S'exécute tous les jours à 10h00
 */
const reminder24Hours = cron.schedule('0 10 * * *', async () => {
  try {
    console.log('⏰ Exécution rappels 24h...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Trouver toutes les réservations de demain
    const bookings = await Booking.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow
      },
      status: 'confirmed',
      reminderSent: false
    })
      .populate('client', 'firstName lastName email')
      .populate('establishment')
      .populate('services.service', 'name');

    console.log(`📧 ${bookings.length} rappels 24h à envoyer`);

    for (const booking of bookings) {
      try {
        await sendBookingReminder(
          booking,
          booking.client,
          booking.establishment,
          24
        );

        // Marquer le rappel comme envoyé
        booking.reminderSent = true;
        await booking.save();

        console.log(`✅ Rappel 24h envoyé pour booking ${booking._id}`);
      } catch (error) {
        console.error(`❌ Erreur rappel 24h pour ${booking._id}:`, error.message);
      }
    }

    console.log('✅ Rappels 24h terminés');
  } catch (error) {
    console.error('❌ Erreur tâche rappels 24h:', error);
  }
}, {
  scheduled: false // Ne démarre pas automatiquement
});

/**
 * Tâche CRON pour les rappels 2h avant
 * S'exécute toutes les heures
 */
const reminder2Hours = cron.schedule('0 * * * *', async () => {
  try {
    console.log('⏰ Exécution rappels 2h...');

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Trouver les réservations dans ~2h
    const bookings = await Booking.find({
      date: {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lt: new Date(now.setHours(23, 59, 59, 999))
      },
      status: 'confirmed'
    })
      .populate('client', 'firstName lastName email')
      .populate('establishment')
      .populate('services.service', 'name');

    let sentCount = 0;

    for (const booking of bookings) {
      try {
        // Calculer l'heure exacte de la réservation
        const [hours, minutes] = booking.startTime.split(':');
        const bookingTime = new Date(booking.date);
        bookingTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const timeDiff = bookingTime - now;
        const hoursUntilBooking = timeDiff / (1000 * 60 * 60);

        // Si entre 1.5h et 2.5h avant (pour éviter les doublons)
        if (hoursUntilBooking >= 1.5 && hoursUntilBooking <= 2.5) {
          await sendBookingReminder(
            booking,
            booking.client,
            booking.establishment,
            2
          );

          sentCount++;
          console.log(`✅ Rappel 2h envoyé pour booking ${booking._id}`);
        }
      } catch (error) {
        console.error(`❌ Erreur rappel 2h pour ${booking._id}:`, error.message);
      }
    }

    console.log(`✅ Rappels 2h terminés (${sentCount} envoyés)`);
  } catch (error) {
    console.error('❌ Erreur tâche rappels 2h:', error);
  }
}, {
  scheduled: false
});

/**
 * Démarrer tous les schedulers
 */
exports.startSchedulers = () => {
  console.log('🚀 Démarrage des tâches planifiées...');
  
  reminder24Hours.start();
  reminder2Hours.start();
  
  console.log('✅ Schedulers activés :');
  console.log('  - Rappels 24h : Tous les jours à 10h00');
  console.log('  - Rappels 2h : Toutes les heures');
};

/**
 * Arrêter tous les schedulers
 */
exports.stopSchedulers = () => {
  reminder24Hours.stop();
  reminder2Hours.stop();
  console.log('🛑 Schedulers arrêtés');
};

module.exports = exports;