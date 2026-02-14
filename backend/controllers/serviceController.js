const Service = require('../models/Service');
const Establishment = require('../models/Establishment');

// @desc    Créer un service
// @route   POST /api/services
// @access  Private (Establishment only)
exports.createService = async (req, res) => {
  try {
    const { name, description, category, duration, price, image, tags } = req.body;

    // Récupérer l'établissement de l'utilisateur
    const establishment = await Establishment.findOne({ owner: req.user.id });

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Vous devez d\'abord créer un établissement'
      });
    }

    const service = await Service.create({
      establishment: establishment._id,
      name,
      description,
      category,
      duration,
      price,
      image,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Service créé avec succès',
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir tous les services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const { establishment, category, minPrice, maxPrice } = req.query;

    const filter = { isActive: true };

    if (establishment) filter.establishment = establishment;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const services = await Service.find(filter)
      .populate('establishment', 'name address rating');

    res.status(200).json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un service par ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('establishment', 'name address contact rating');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un service
// @route   PUT /api/services/:id
// @access  Private (Owner only)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('establishment');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de l'établissement
    if (service.establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce service'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service mis à jour',
      data: updatedService
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un service
// @route   DELETE /api/services/:id
// @access  Private (Owner only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('establishment');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (service.establishment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce service'
      });
    }

    // Soft delete
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service supprimé'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les services de mon établissement
// @route   GET /api/services/my/services
// @access  Private (Establishment)
exports.getMyServices = async (req, res) => {
  try {
    const establishment = await Establishment.findOne({ owner: req.user.id });

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Aucun établissement trouvé'
      });
    }

    const services = await Service.find({ establishment: establishment._id });

    res.status(200).json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};