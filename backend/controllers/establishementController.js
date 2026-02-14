const Establishment = require('../models/Establishment');
const Service = require('../models/Service');

// @desc    Créer un établissement
// @route   POST /api/establishments
// @access  Private (Establishment only)
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