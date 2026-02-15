/**
 * Utilitaires pour la géolocalisation
 */

/**
 * Calculer la distance entre deux points (formule Haversine)
 * @param {Number} lat1 - Latitude point 1
 * @param {Number} lon1 - Longitude point 1
 * @param {Number} lat2 - Latitude point 2
 * @param {Number} lon2 - Longitude point 2
 * @returns {Number} Distance en kilomètres
 */
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Arrondi à 2 décimales
};

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Villes principales de Tunisie avec coordonnées
 */
exports.tunisianCities = {
  'tunis': { latitude: 36.8065, longitude: 10.1815 },
  'sfax': { latitude: 34.7406, longitude: 10.7603 },
  'sousse': { latitude: 35.8256, longitude: 10.6369 },
  'kairouan': { latitude: 35.6781, longitude: 10.0963 },
  'bizerte': { latitude: 37.2746, longitude: 9.8739 },
  'gabes': { latitude: 33.8815, longitude: 10.0982 },
  'ariana': { latitude: 36.8625, longitude: 10.1956 },
  'gafsa': { latitude: 34.4250, longitude: 8.7842 },
  'monastir': { latitude: 35.7774, longitude: 10.8263 },
  'ben-arous': { latitude: 36.7539, longitude: 10.2189 },
  'kasserine': { latitude: 35.1676, longitude: 8.8369 },
  'medenine': { latitude: 33.3549, longitude: 10.5052 },
  'nabeul': { latitude: 36.4561, longitude: 10.7376 },
  'tataouine': { latitude: 32.9297, longitude: 10.4517 },
  'beja': { latitude: 36.7256, longitude: 9.1817 },
  'jendouba': { latitude: 36.5011, longitude: 8.7803 },
  'mahdia': { latitude: 35.5047, longitude: 11.0622 },
  'siliana': { latitude: 36.0853, longitude: 9.3703 },
  'kef': { latitude: 36.1743, longitude: 8.7049 },
  'tozeur': { latitude: 33.9197, longitude: 8.1339 },
  'kebili': { latitude: 33.7047, longitude: 8.9697 },
  'zaghouan': { latitude: 36.4028, longitude: 10.1425 },
  'manouba': { latitude: 36.8080, longitude: 10.0969 },
  'la-marsa': { latitude: 36.8783, longitude: 10.3247 },
  'carthage': { latitude: 36.8531, longitude: 10.3231 },
  'sidi-bou-said': { latitude: 36.8686, longitude: 10.3411 },
  'hammamet': { latitude: 36.4000, longitude: 10.6167 },
  'djerba': { latitude: 33.8076, longitude: 10.8451 }
};

/**
 * Obtenir les coordonnées d'une ville tunisienne
 * @param {String} cityName - Nom de la ville
 * @returns {Object|null} {latitude, longitude} ou null
 */
exports.getCityCoordinates = (cityName) => {
  if (!cityName) return null;
  
  const normalized = cityName.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/\s+/g, '-');
  
  return this.tunisianCities[normalized] || null;
};

/**
 * Valider des coordonnées GPS
 * @param {Number} latitude 
 * @param {Number} longitude 
 * @returns {Boolean}
 */
exports.validateCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

/**
 * Formater une adresse complète
 * @param {Object} address - Objet adresse
 * @returns {String} Adresse formatée
 */
exports.formatAddress = (address) => {
  const parts = [
    address.street,
    address.city,
    address.postalCode,
    address.country || 'Tunisie'
  ].filter(Boolean);
  
  return parts.join(', ');
};

module.exports = exports;