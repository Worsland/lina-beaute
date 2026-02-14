const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Beauty Booking Platform',
    status: 'running',
    version: '1.0.0'
  });
});

// Routes (à ajouter plus tard)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/establishments', require('./routes/establishments'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/ai', require('./routes/ai'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📝 Mode: ${process.env.NODE_ENV}`);
});
// Routes
app.use('/api/bookings', require('./routes/bookings'));  // ← AJOUTER
app.use('/api/services', require('./routes/services'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/establishments', require('./routes/establishments'));  // ← AJOUTER CETTE LIGNE