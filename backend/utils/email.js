// Email désactivé temporairement
// Pour activer : installer nodemailer et configurer les variables EMAIL_* dans .env

console.log('⚠️ Système d\'emails désactivé (configuration manquante)');

exports.sendEmail = async (options) => {
  console.log('📧 [SIMULÉ] Email vers:', options.to);
  console.log('   Sujet:', options.subject);
  return { success: true, messageId: 'simulated-' + Date.now() };
};

exports.sendBookingConfirmation = async (booking, client, establishment) => {
  console.log('📧 [SIMULÉ] Email confirmation réservation vers:', client.email);
  return { success: true };
};

exports.sendBookingReminder = async (booking, client, establishment, hoursBefore) => {
  console.log(`📧 [SIMULÉ] Email rappel ${hoursBefore}h vers:`, client.email);
  return { success: true };
};

exports.sendBookingCancellation = async (booking, client, establishment, reason) => {
  console.log('📧 [SIMULÉ] Email annulation vers:', client.email);
  return { success: true };
};

exports.sendNewBookingNotification = async (booking, establishment, client) => {
  console.log('📧 [SIMULÉ] Email nouvelle réservation vers établissement');
  return { success: true };
};

module.exports = exports;