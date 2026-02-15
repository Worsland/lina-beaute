const { GoogleGenerativeAI } = require('@google/generative-ai');

// Vérifier que la clé API existe
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY manquante dans .env');
  process.exit(1);
}

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Analyser une requête utilisateur et extraire les informations structurées
 * @param {string} userQuery - La requête de l'utilisateur en langage naturel
 * @returns {Object} Informations extraites (type de service, localisation, date, etc.)
 */
exports.analyzeSearchQuery = async (userQuery) => {
  try {
    const prompt = `
Tu es un assistant expert pour une plateforme de réservation de services de beauté et spa en Tunisie.

Analyse la requête suivante et extrait TOUTES les informations pertinentes :

Requête : "${userQuery}"

Retourne UNIQUEMENT un objet JSON valide avec ces champs (utilise null si l'info n'est pas présente) :

{
  "serviceType": "nom exact du service recherché (massage, manucure, soin visage, coiffure, etc.)",
  "category": "catégorie exacte parmi : soins_visage, soins_corps, massage, manucure_pedicure, coiffure, maquillage, epilation, spa, autre",
  "location": "ville ou zone précise mentionnée (Tunis, La Marsa, Sousse, etc.)",
  "date": "date au format YYYY-MM-DD si mentionnée (aujourd'hui = ${new Date().toISOString().split('T')[0]})",
  "timeOfDay": "moment précis parmi : matin, apres-midi, soir, null",
  "priceRange": "budget parmi : €, €€, €€€, null",
  "preferences": ["liste", "des", "mots-clés", "importants"],
  "urgency": "niveau parmi : low, medium, high",
  "specificRequests": "demandes spécifiques mentionnées (peau sensible, bio, etc.)"
}

Règles strictes :
- Réponds UNIQUEMENT avec le JSON, sans texte avant ou après
- Pas de markdown, pas de \`\`\`json
- Tous les champs doivent être présents
- Si une info manque, mets null (pas de guillemets pour null)
- Les tableaux vides = []
- Date : si "demain" alors ajoute 1 jour à aujourd'hui, si "ce week-end" alors samedi prochain
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Nettoyer le texte (enlever les backticks markdown si présents)
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    // Parser le JSON
    const analysis = JSON.parse(cleanText);
    
    console.log('✅ Analyse Gemini réussie:', analysis);
    return analysis;
    
  } catch (error) {
    console.error('❌ Erreur analyse Gemini:', error.message);
    
    // Retour par défaut en cas d'erreur
    return {
      serviceType: null,
      category: null,
      location: null,
      date: null,
      timeOfDay: null,
      priceRange: null,
      preferences: [],
      urgency: 'medium',
      specificRequests: null,
      error: error.message
    };
  }
};

/**
 * Générer une réponse conversationnelle naturelle
 * @param {Object} context - Contexte de la conversation
 * @param {string} userMessage - Message de l'utilisateur
 * @param {Array} establishments - Établissements trouvés (optionnel)
 * @returns {string} Réponse générée
 */
exports.generateConversationalResponse = async (context, userMessage, establishments = []) => {
  try {
    const establishmentsInfo = establishments.length > 0 
      ? `\n\nÉtablissements trouvés :\n${establishments.map((est, i) => 
          `${i + 1}. ${est.name} - ${est.address?.city || 'Tunis'} - Note: ${est.rating?.average || 'N/A'}/5`
        ).join('\n')}`
      : '';

    const prompt = `
Tu es Bella, un assistant virtuel sympathique et professionnel pour une plateforme de réservation beauté & spa en Tunisie.

Historique de conversation :
${JSON.stringify(context.previousMessages || [], null, 2)}

Dernier message utilisateur : "${userMessage}"
${establishmentsInfo}

Instructions :
- Réponds en français de manière naturelle, amicale et professionnelle
- Si des établissements sont listés, présente-les de manière attractive
- Si aucun résultat, propose des alternatives ou demande plus de précisions
- Sois concis (max 3-4 phrases)
- Utilise des emojis avec parcimonie (1-2 max)
- Propose toujours une action claire (voir détails, réserver, affiner recherche)

Ta réponse :
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log('✅ Réponse conversationnelle générée');
    return text;
    
  } catch (error) {
    console.error('❌ Erreur génération réponse:', error.message);
    return "Je suis désolée, j'ai rencontré un problème. Pouvez-vous reformuler votre demande ? 😊";
  }
};

/**
 * Générer des recommandations personnalisées
 * @param {Object} userProfile - Profil de l'utilisateur
 * @param {Array} establishments - Établissements disponibles
 * @returns {Object} Recommandations avec scores
 */
exports.generateRecommendations = async (userProfile, establishments) => {
  try {
    const prompt = `
Tu es un expert en recommandation pour services de beauté.

Profil utilisateur :
${JSON.stringify(userProfile, null, 2)}

Établissements disponibles :
${JSON.stringify(establishments.map(e => ({
  id: e._id,
  name: e.name,
  category: e.category,
  city: e.address?.city,
  rating: e.rating?.average,
  priceRange: e.priceRange,
  description: e.description
})), null, 2)}

Analyse le profil et recommande les 3 meilleurs établissements.

Retourne UNIQUEMENT ce JSON :
{
  "recommendations": [
    {
      "establishmentId": "id_mongo",
      "score": 95,
      "reasons": ["raison 1", "raison 2", "raison 3"],
      "shortSummary": "Résumé en 1 phrase"
    }
  ]
}

Critères de notation :
- Correspondance avec préférences utilisateur : 40 points
- Note moyenne : 30 points
- Proximité géographique : 20 points
- Gamme de prix : 10 points

Réponds UNIQUEMENT avec le JSON, sans markdown.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const recommendations = JSON.parse(cleanText);
    
    console.log('✅ Recommandations générées:', recommendations.recommendations.length);
    return recommendations;
    
  } catch (error) {
    console.error('❌ Erreur génération recommandations:', error.message);
    return {
      recommendations: [],
      error: error.message
    };
  }
};

/**
 * Suggérer des créneaux de réservation optimaux
 * @param {Array} availableSlots - Créneaux disponibles
 * @param {Object} userPreferences - Préférences horaires de l'utilisateur
 * @returns {Array} Créneaux recommandés
 */
exports.suggestOptimalSlots = async (availableSlots, userPreferences) => {
  try {
    const prompt = `
Tu es un assistant de planification intelligent.

Créneaux disponibles :
${JSON.stringify(availableSlots, null, 2)}

Préférences utilisateur :
${JSON.stringify(userPreferences, null, 2)}

Recommande les 3 meilleurs créneaux en tenant compte de :
- Préférences horaires (matin/après-midi/soir)
- Historique des réservations précédentes
- Jours préférés si mentionnés

Retourne ce JSON :
{
  "recommendedSlots": [
    {
      "date": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "score": 95,
      "reason": "Correspond à vos préférences habituelles"
    }
  ]
}

Réponds UNIQUEMENT avec le JSON.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const suggestions = JSON.parse(cleanText);
    
    console.log('✅ Créneaux suggérés:', suggestions.recommendedSlots.length);
    return suggestions.recommendedSlots;
    
  } catch (error) {
    console.error('❌ Erreur suggestion créneaux:', error.message);
    return [];
  }
};

/**
 * Extraire les intentions de l'utilisateur (réserver, chercher, modifier, annuler)
 * @param {string} message - Message de l'utilisateur
 * @returns {Object} Intention et entités
 */
exports.extractIntent = async (message) => {
  try {
    const prompt = `
Analyse ce message et détermine l'intention principale :

Message : "${message}"

Retourne ce JSON :
{
  "intent": "search | book | modify | cancel | ask_info | other",
  "confidence": 0.95,
  "entities": {
    "action": "action précise demandée",
    "target": "cible de l'action"
  }
}

Intents possibles :
- search : chercher un service
- book : faire une réservation
- modify : modifier une réservation existante
- cancel : annuler une réservation
- ask_info : demander des informations
- other : autre demande

Réponds UNIQUEMENT avec le JSON.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const intent = JSON.parse(cleanText);
    
    console.log('✅ Intent extrait:', intent.intent);
    return intent;
    
  } catch (error) {
    console.error('❌ Erreur extraction intent:', error.message);
    return {
      intent: 'other',
      confidence: 0,
      entities: {}
    };
  }
};

/**
 * Générer une description optimisée pour un service
 * @param {Object} serviceData - Données du service
 * @returns {string} Description générée
 */
exports.generateServiceDescription = async (serviceData) => {
  try {
    const prompt = `
Génère une description attractive et professionnelle pour ce service de beauté :

Service : ${serviceData.name}
Catégorie : ${serviceData.category}
Durée : ${serviceData.duration} minutes
Prix : ${serviceData.price} DT

Description actuelle (si existe) : ${serviceData.description || 'Aucune'}

Crée une description de 2-3 phrases qui :
- Met en avant les bienfaits
- Utilise un ton professionnel mais chaleureux
- Inclut des détails techniques si pertinent
- Donne envie de réserver

Réponds UNIQUEMENT avec la description, sans guillemets ni formatage.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log('✅ Description générée pour:', serviceData.name);
    return text;
    
  } catch (error) {
    console.error('❌ Erreur génération description:', error.message);
    return serviceData.description || 'Service de qualité proposé par notre établissement.';
  }
};

/**
 * Analyser un avis client et générer une réponse suggérée
 * @param {Object} review - Avis client
 * @returns {string} Réponse suggérée
 */
exports.generateReviewResponse = async (review) => {
  try {
    const prompt = `
Un client a laissé cet avis :

Note : ${review.rating}/5
Commentaire : "${review.comment}"

Génère une réponse professionnelle, chaleureuse et appropriée qui :
- Remercie le client
- Répond aux points spécifiques mentionnés
- Reste positive même si l'avis est négatif
- Fait 2-3 phrases maximum
- Signe avec le nom de l'établissement

Réponds UNIQUEMENT avec la réponse suggérée, sans guillemets.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log('✅ Réponse avis générée');
    return text;
    
  } catch (error) {
    console.error('❌ Erreur génération réponse avis:', error.message);
    return 'Merci pour votre retour ! Nous sommes ravis de vous avoir accueillie.';
  }
};

// Tester la connexion Gemini au démarrage
const testGeminiConnection = async () => {
  try {
    const result = await model.generateContent('Hello');
    const response = await result.response;
    console.log('✅ Gemini AI connecté et fonctionnel');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Gemini:', error.message);
    return false;
  }
};

// Exécuter le test au chargement du module
testGeminiConnection();

module.exports = exports;