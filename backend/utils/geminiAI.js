const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fonction pour analyser une requête utilisateur
exports.analyzeSearchQuery = async (userQuery) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyse la requête suivante d'une cliente cherchant un service de beauté/spa et extrait les informations structurées.

Requête: "${userQuery}"

Retourne UNIQUEMENT un objet JSON avec ces champs (mets null si l'info n'est pas présente):
{
  "serviceType": "type de service (massage, manucure, soin visage, etc.)",
  "category": "catégorie (soins_visage, soins_corps, massage, manucure_pedicure, coiffure, maquillage, epilation, spa)",
  "location": "ville ou zone géographique",
  "date": "date souhaitée au format YYYY-MM-DD si mentionnée",
  "timeOfDay": "moment de la journée (matin, après-midi, soir)",
  "priceRange": "budget (€, €€, €€€)",
  "preferences": ["liste", "des", "préférences", "spécifiques"],
  "urgency": "niveau d'urgence (low, medium, high)"
}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parser le JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Format de réponse invalide');
  } catch (error) {
    console.error('Erreur Gemini:', error);
    throw error;
  }
};

// Fonction pour générer une réponse conversationnelle
exports.generateResponse = async (context, userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Tu es un assistant virtuel pour une plateforme de réservation de services de beauté et spa en Tunisie.

Contexte de la conversation:
${JSON.stringify(context, null, 2)}

Message de la cliente: "${userMessage}"

Réponds de manière amicale, professionnelle et utile. Si tu as trouvé des établissements ou services, présente-les. Si tu as besoin de plus d'informations, pose des questions clarificatrices.

Réponds en français de manière naturelle et conversationnelle.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erreur Gemini:', error);
    throw error;
  }
};

// Fonction pour des recommandations personnalisées
exports.getRecommendations = async (userProfile, establishments) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Basé sur le profil de cette cliente et les établissements disponibles, recommande les 3 meilleurs établissements.

Profil cliente:
${JSON.stringify(userProfile, null, 2)}

Établissements disponibles:
${JSON.stringify(establishments, null, 2)}

Retourne un JSON avec:
{
  "recommendations": [
    {
      "establishmentId": "id",
      "score": 0-100,
      "reason": "raison de la recommandation"
    }
  ]
}

Réponds UNIQUEMENT avec le JSON.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Format de réponse invalide');
  } catch (error) {
    console.error('Erreur Gemini:', error);
    throw error;
  }
};