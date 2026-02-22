// Catégories de services
export const SERVICE_CATEGORIES = {
  SOINS_VISAGE: 'soins_visage',
  SOINS_CORPS: 'soins_corps',
  MASSAGE: 'massage',
  MANUCURE_PEDICURE: 'manucure_pedicure',
  COIFFURE: 'coiffure',
  MAQUILLAGE: 'maquillage',
  EPILATION: 'epilation',
  SPA: 'spa',
  AUTRE: 'autre',
};

export const SERVICE_CATEGORY_LABELS = {
  [SERVICE_CATEGORIES.SOINS_VISAGE]: 'Soins Visage',
  [SERVICE_CATEGORIES.SOINS_CORPS]: 'Soins Corps',
  [SERVICE_CATEGORIES.MASSAGE]: 'Massage',
  [SERVICE_CATEGORIES.MANUCURE_PEDICURE]: 'Manucure & Pédicure',
  [SERVICE_CATEGORIES.COIFFURE]: 'Coiffure',
  [SERVICE_CATEGORIES.MAQUILLAGE]: 'Maquillage',
  [SERVICE_CATEGORIES.EPILATION]: 'Épilation',
  [SERVICE_CATEGORIES.SPA]: 'Spa',
  [SERVICE_CATEGORIES.AUTRE]: 'Autre',
};

// Catégories d'établissements
export const ESTABLISHMENT_CATEGORIES = {
  SALON: 'salon',
  SPA: 'spa',
  INSTITUT: 'institut',
  BARBERSHOP: 'barbershop',
  CENTRE_WELLNESS: 'centre_wellness',
};

export const ESTABLISHMENT_CATEGORY_LABELS = {
  [ESTABLISHMENT_CATEGORIES.SALON]: 'Salon de Beauté',
  [ESTABLISHMENT_CATEGORIES.SPA]: 'Spa',
  [ESTABLISHMENT_CATEGORIES.INSTITUT]: 'Institut de Beauté',
  [ESTABLISHMENT_CATEGORIES.BARBERSHOP]: 'Barbershop',
  [ESTABLISHMENT_CATEGORIES.CENTRE_WELLNESS]: 'Centre de Bien-être',
};

// Gammes de prix
export const PRICE_RANGES = {
  BUDGET: '€',
  MEDIUM: '€€',
  PREMIUM: '€€€',
};

export const PRICE_RANGE_LABELS = {
  [PRICE_RANGES.BUDGET]: 'Économique',
  [PRICE_RANGES.MEDIUM]: 'Moyen',
  [PRICE_RANGES.PREMIUM]: 'Premium',
};

// Statuts de réservation
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'En attente',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmée',
  [BOOKING_STATUS.COMPLETED]: 'Complétée',
  [BOOKING_STATUS.CANCELLED]: 'Annulée',
  [BOOKING_STATUS.NO_SHOW]: 'Absent',
};

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: 'warning',
  [BOOKING_STATUS.CONFIRMED]: 'info',
  [BOOKING_STATUS.COMPLETED]: 'success',
  [BOOKING_STATUS.CANCELLED]: 'error',
  [BOOKING_STATUS.NO_SHOW]: 'default',
};

// Rôles utilisateurs
export const USER_ROLES = {
  CLIENT: 'client',
  ESTABLISHMENT_ADMIN: 'establishment_admin',
  PRACTITIONER: 'practitioner',
  SUPER_ADMIN: 'super_admin',
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.CLIENT]: 'Cliente',
  [USER_ROLES.ESTABLISHMENT_ADMIN]: 'Établissement',
  [USER_ROLES.PRACTITIONER]: 'Praticienne',
  [USER_ROLES.SUPER_ADMIN]: 'Administrateur',
};

// Jours de la semaine
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche', short: 'Dim' },
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
];

// Villes de Tunisie
export const TUNISIAN_CITIES = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'La Marsa',
  'Carthage',
  'Sidi Bou Said',
  'Sfax',
  'Sousse',
  'Kairouan',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Monastir',
  'Nabeul',
  'Hammamet',
  'Mahdia',
  'Kasserine',
  'Medenine',
  'Tataouine',
  'Béja',
  'Jendouba',
  'Siliana',
  'Le Kef',
  'Tozeur',
  'Kebili',
  'Zaghouan',
  'Manouba',
  'Djerba',
];

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Réessayez plus tard.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Erreur de validation. Vérifiez vos données.',
};

// Configuration
export const APP_CONFIG = {
  APP_NAME: 'Lina Beauté',
  APP_DESCRIPTION: 'Plateforme de réservation beauté & spa en Tunisie',
  CONTACT_EMAIL: 'contact@linabeaute.tn',
  CONTACT_PHONE: '+216 XX XXX XXX',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ITEMS_PER_PAGE_OPTIONS: [5, 10, 20, 50],
};

// Formats de date
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
};