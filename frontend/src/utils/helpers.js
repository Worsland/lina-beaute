import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DATE_FORMATS } from './constants';

/**
 * Formater une date
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Formater un prix
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '';
  return `${price.toFixed(2)} DT`;
};

/**
 * Capitaliser la première lettre
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Tronquer un texte
 */
export const truncate = (str, length = 100) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Valider un email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider un numéro de téléphone tunisien
 */
export const isValidTunisianPhone = (phone) => {
  // Format: +216XXXXXXXX ou 216XXXXXXXX ou XXXXXXXX (8 chiffres)
  const phoneRegex = /^(\+?216)?[2-9]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Formater un numéro de téléphone
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Enlever les espaces et caractères spéciaux
  const cleaned = phone.replace(/\D/g, '');
  // Format: +216 XX XXX XXX
  if (cleaned.length === 11 && cleaned.startsWith('216')) {
    return `+216 ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
  }
  if (cleaned.length === 8) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
  }
  return phone;
};

/**
 * Calculer le nombre d'étoiles pour un rating
 */
export const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
  };
};

/**
 * Obtenir les initiales d'un nom
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '??';
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Générer une couleur aléatoire pour un avatar
 */
export const getRandomColor = (str) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  ];
  if (!str) return colors[0];
  const index = str.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Débounce une fonction
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculer la distance entre deux points GPS
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
};

/**
 * Générer un slug à partir d'un texte
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/\s+/g, '-') // Remplacer espaces par -
    .replace(/[^\w-]+/g, '') // Enlever caractères non-alphanumériques
    .replace(/--+/g, '-') // Remplacer plusieurs - par un seul
    .replace(/^-+/, '') // Enlever - au début
    .replace(/-+$/, ''); // Enlever - à la fin
};

/**
 * Grouper un tableau par une clé
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Vérifier si un objet est vide
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export default {
  formatDate,
  formatPrice,
  capitalize,
  truncate,
  isValidEmail,
  isValidTunisianPhone,
  formatPhoneNumber,
  getRatingStars,
  getInitials,
  getRandomColor,
  debounce,
  calculateDistance,
  slugify,
  groupBy,
  isEmpty,
};