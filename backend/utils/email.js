const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Vérifier la configuration au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur configuration email:', error.message);
  } else {
    console.log('✅ Serveur email prêt');
  }
});

/**
 * Envoyer un email
 * @param {Object} options - Options de l'email
 * @returns {Promise}
 */
exports.sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    throw error;
  }
};

/**
 * Email de confirmation de réservation
 */
exports.sendBookingConfirmation = async (booking, client, establishment) => {
  const date = new Date(booking.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #667eea; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Réservation Confirmée !</h1>
        </div>
        <div class="content">
          <p>Bonjour <strong>${client.firstName}</strong>,</p>
          <p>Votre réservation chez <strong>${establishment.name}</strong> a été confirmée avec succès !</p>
          
          <div class="booking-details">
            <h2 style="color: #667eea; margin-top: 0;">📅 Détails de votre réservation</h2>
            
            <div class="detail-row">
              <span class="label">Date</span>
              <span>${date}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Heure</span>
              <span>${booking.startTime} - ${booking.endTime}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Services</span>
              <span>${booking.services.map(s => s.service.name).join(', ')}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Prix total</span>
              <span style="font-size: 18px; font-weight: bold; color: #667eea;">${booking.totalPrice} DT</span>
            </div>
          </div>

          <div class="booking-details">
            <h3 style="color: #667eea; margin-top: 0;">📍 Adresse</h3>
            <p>
              ${establishment.address.street}<br>
              ${establishment.address.city} ${establishment.address.postalCode}<br>
              📞 ${establishment.contact.phone}
            </p>
          </div>

          ${booking.notes ? `
          <div class="booking-details">
            <h3 style="color: #667eea; margin-top: 0;">📝 Vos notes</h3>
            <p>${booking.notes}</p>
          </div>
          ` : ''}

          <p style="margin-top: 30px;">
            <strong>💡 Rappel :</strong> Vous recevrez des rappels automatiques 24h et 2h avant votre rendez-vous.
          </p>

          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/bookings/${booking._id}" class="button">
              Voir ma réservation
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Merci d'avoir choisi notre plateforme !</p>
          <p>Beauty Booking Platform © 2026</p>
          <p style="font-size: 10px; color: #999; margin-top: 10px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await this.sendEmail({
    to: client.email,
    subject: `✅ Réservation confirmée - ${establishment.name}`,
    html
  });
};

/**
 * Email de rappel de réservation
 */
exports.sendBookingReminder = async (booking, client, establishment, hoursBefore) => {
  const date = new Date(booking.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const reminderText = hoursBefore === 24 
    ? 'Demain' 
    : 'Dans 2 heures';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reminder-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .booking-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Rappel de Rendez-vous</h1>
        </div>
        <div class="content">
          <p>Bonjour <strong>${client.firstName}</strong>,</p>
          
          <div class="reminder-box">
            <h2 style="margin-top: 0; color: #856404;">🔔 ${reminderText}</h2>
            <p style="font-size: 16px;">Vous avez un rendez-vous chez <strong>${establishment.name}</strong></p>
          </div>

          <div class="booking-info">
            <p><strong>📅 Date :</strong> ${date}</p>
            <p><strong>🕐 Heure :</strong> ${booking.startTime}</p>
            <p><strong>💆 Services :</strong> ${booking.services.map(s => s.service.name).join(', ')}</p>
            <p><strong>📍 Adresse :</strong> ${establishment.address.street}, ${establishment.address.city}</p>
          </div>

          <p>Nous avons hâte de vous accueillir ! ✨</p>

          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            Si vous avez besoin d'annuler ou de modifier votre rendez-vous, 
            veuillez contacter l'établissement au ${establishment.contact.phone}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await this.sendEmail({
    to: client.email,
    subject: `⏰ Rappel : Rendez-vous ${reminderText.toLowerCase()} chez ${establishment.name}`,
    html
  });
};

/**
 * Email d'annulation de réservation
 */
exports.sendBookingCancellation = async (booking, client, establishment, reason) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Réservation Annulée</h1>
        </div>
        <div class="content">
          <p>Bonjour <strong>${client.firstName}</strong>,</p>
          <p>Votre réservation chez <strong>${establishment.name}</strong> a été annulée.</p>
          
          ${reason ? `<p><strong>Raison :</strong> ${reason}</p>` : ''}

          <p>Pour toute question, contactez-nous :</p>
          <p>📞 ${establishment.contact.phone}</p>
          <p>📧 ${establishment.contact.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await this.sendEmail({
    to: client.email,
    subject: `Annulation de réservation - ${establishment.name}`,
    html
  });
};

/**
 * Notification nouvelle réservation pour l'établissement
 */
exports.sendNewBookingNotification = async (booking, establishment, client) => {
  const date = new Date(booking.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Nouvelle Réservation !</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Vous avez reçu une nouvelle réservation :</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #28a745;">Informations client</h3>
            <p><strong>Nom :</strong> ${client.firstName} ${client.lastName}</p>
            <p><strong>Email :</strong> ${client.email}</p>
            <p><strong>Téléphone :</strong> ${client.phone}</p>
          </div>

          <div class="info-box">
            <h3 style="margin-top: 0; color: #28a745;">Détails réservation</h3>
            <p><strong>Date :</strong> ${date}</p>
            <p><strong>Heure :</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Services :</strong> ${booking.services.map(s => s.service.name).join(', ')}</p>
            <p><strong>Prix total :</strong> ${booking.totalPrice} DT</p>
            ${booking.notes ? `<p><strong>Notes :</strong> ${booking.notes}</p>` : ''}
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/dashboard/bookings" 
               style="display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">
              Voir dans le dashboard
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const owner = await require('../models/User').findById(establishment.owner);

  return await this.sendEmail({
    to: owner.email,
    subject: `🎉 Nouvelle réservation - ${client.firstName} ${client.lastName}`,
    html
  });
};

module.exports = exports;