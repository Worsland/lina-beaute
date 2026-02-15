const Establishment = require('../models/Establishment');
const Service = require('../models/Service');
const { calculateDistance, getCityCoordinates } = require('../utils/geocoding');

// @desc    Créer un établissement
// @route   POST /api/establishments
// @access  Private (Establishment only)
// @desc    Recherche avancée avec géolocalisation
// @route   POST /api/establishments/search-nearby
// @access  Public
exports.advancedGeoSearch = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      city,
      maxDistance = 10000, // 10 km par défaut
      category,
      priceRange,
      minRating,
      services,
      openNow
    } = req.body;

    console.log('🗺️ Recherche géospatiale avancée');

    let searchLocation = { latitude, longitude };

    // Si pas de coordonnées mais une ville, essayer de la géocoder
    if (!latitude && !longitude && city) {
      const coords = getCityCoordinates(city);
      if (coords) {
        searchLocation = coords;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Ville non reconnue. Fournissez des coordonnées GPS.'
        });
      }
    }

    if (!searchLocation.latitude || !searchLocation.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées GPS ou ville requises'
      });
    }

    // Construction du filtre de base
    const baseFilter = {
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(searchLocation.longitude),
              parseFloat(searchLocation.latitude)
            ]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    };

    // Filtres additionnels
    if (category) baseFilter.category = category;
    if (priceRange) baseFilter.priceRange = priceRange;
    if (minRating) baseFilter['rating.average'] = { $gte: parseFloat(minRating) };

    // Recherche principale
    let query = Establishment.find(baseFilter)
      .populate('owner', 'firstName lastName email');

    // Filtre par services si spécifié
    if (services && services.length > 0) {
      const servicesFound = await Service.find({
        category: { $in: services },
        isActive: true
      }).select('establishment');

      const establishmentIds = [...new Set(servicesFound.map(s => s.establishment.toString()))];
      
      query = query.where('_id').in(establishmentIds);
    }

    // Filtre "ouvert maintenant"
    if (openNow) {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      query = query.where('openingHours').elemMatch({
        day: dayOfWeek,
        isClosed: false,
        open: { $lte: currentTime },
        close: { $gte: currentTime }
      });
    }

    const establishments = await query.limit(20);

    // Calculer la distance exacte pour chaque établissement
    const establishmentsWithDistance = establishments.map(est => {
      const distance = calculateDistance(
        searchLocation.latitude,
        searchLocation.longitude,
        est.location.coordinates[1], // latitude
        est.location.coordinates[0]  // longitude
      );

      return {
        ...est.toObject(),
        distance: `${distance} km`
      };
    });

    // Trier par distance
    establishmentsWithDistance.sort((a, b) => 
      parseFloat(a.distance) - parseFloat(b.distance)
    );

    res.status(200).json({
      success: true,
      searchCenter: {
        latitude: searchLocation.latitude,
        longitude: searchLocation.longitude,
        city: city || 'Coordonnées GPS'
      },
      data: establishmentsWithDistance,
      count: establishmentsWithDistance.length
    });

  } catch (error) {
    console.error('❌ Erreur recherche géospatiale:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// AJOUTER CETTE MÉTHODE AUSSI

// @desc    Obtenir établissements dans un rayon (cercle)
// @route   GET /api/establishments/within-radius
// @access  Public
exports.getEstablishmentsWithinRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude et longitude requises'
      });
    }

    const radiusInMeters = parseFloat(radius) * 1000;

    const establishments = await Establishment.find({
      isActive: true,
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            radiusInMeters / 6371000 // Rayon de la Terre en mètres
          ]
        }
      }
    }).populate('owner', 'firstName lastName');

    res.status(200).json({
      success: true,
      radius: `${radius} km`,
      center: { latitude, longitude },
      data: establishments,
      count: establishments.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// AJOUTER CETTE MÉTHODE AUSSI

// @desc    Obtenir établissements dans une zone (polygone)
// @route   POST /api/establishments/within-area
// @access  Public
exports.getEstablishmentsWithinArea = async (req, res) => {
  try {
    const { polygon } = req.body;

    if (!polygon || !Array.isArray(polygon) || polygon.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Polygone invalide (minimum 3 points)'
      });
    }

    // Fermer le polygone (premier point = dernier point)
    const closedPolygon = [...polygon];
    if (JSON.stringify(polygon[0]) !== JSON.stringify(polygon[polygon.length - 1])) {
      closedPolygon.push(polygon[0]);
    }

    const establishments = await Establishment.find({
      isActive: true,
      location: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [closedPolygon]
          }
        }
      }
    }).populate('owner', 'firstName lastName');

    res.status(200).json({
      success: true,
      area: 'Zone personnalisée',
      data: establishments,
      count: establishments.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.createEstablishment = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      address,
      location,
      contact,
      openingHours,
      amenities,
      priceRange
    } = req.body;

    // Vérifier si l'utilisateur a déjà un établissement
    const existingEstablishment = await Establishment.findOne({ owner: req.user.id });
    if (existingEstablishment) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà un établissement enregistré'
      });
    }

    const establishment = await Establishment.create({
      name,
      description,
      owner: req.user.id,
      category,
      address,
      location,
      contact,
      openingHours,
      amenities,
      priceRange
    });

    res.status(201).json({
      success: true,
      message: 'Établissement créé avec succès',
      data: establishment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir tous les établissements
// @route   GET /api/establishments
// @access  Public
exports.getEstablishments = async (req, res) => {
  try {
    const {
      category,
      city,
      priceRange,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Construire le filtre
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (priceRange) filter.priceRange = priceRange;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const establishments = await Establishment.find(filter)
      .populate('owner', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'rating.average': -1 });

    const total = await Establishment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: establishments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un établissement par ID
// @route   GET /api/establishments/:id
// @access  Public
exports.getEstablishmentById = async (req, res) => {
  try {
    const establishment = await Establishment.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone');

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }

    // Récupérer les services de cet établissement
    const services = await Service.find({ 
      establishment: req.params.id,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: {
        ...establishment.toObject(),
        services
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un établissement
// @route   PUT /api/establishments/:id
// @access  Private (Owner only)
exports.updateEstablishment = async (req, res) => {
  try {
    const establishment = await Establishment.findById(req.params.id);

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet établissement'
      });
    }

    const updatedEstablishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Établissement mis à jour',
      data: updatedEstablishment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un établissement
// @route   DELETE /api/establishments/:id
// @access  Private (Owner only)
exports.deleteEstablishment = async (req, res) => {
  try {
    const establishment = await Establishment.findById(req.params.id);

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet établissement'
      });
    }

    // Soft delete (désactivation)
    establishment.isActive = false;
    await establishment.save();

    res.status(200).json({
      success: true,
      message: 'Établissement supprimé'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Recherche par géolocalisation
// @route   GET /api/establishments/nearby
// @access  Public
exports.getNearbyEstablishments = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude et latitude requises'
      });
    }

    const establishments = await Establishment.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) // en mètres
        }
      }
    }).limit(20);

    res.status(200).json({
      success: true,
      data: establishments,
      count: establishments.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir mon établissement
// @route   GET /api/establishments/me
// @access  Private (Establishment)
exports.getMyEstablishment = async (req, res) => {
  try {
    const establishment = await Establishment.findOne({ owner: req.user.id });

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Aucun établissement trouvé'
      });
    }

    // Récupérer les services
    const services = await Service.find({ establishment: establishment._id });

    res.status(200).json({
      success: true,
      data: {
        ...establishment.toObject(),
        services
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};