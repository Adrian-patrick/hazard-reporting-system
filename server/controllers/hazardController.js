import asyncHandler from 'express-async-handler';
import Hazard from '../models/hazardModel.js';

// @desc    Create a new hazard report
// @route   POST /api/hazards
// @access  Private
export const createHazard = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    severity,
    location,
    images
  } = req.body;

  const hazard = await Hazard.create({
    title,
    description,
    type,
    severity,
    location,
    images,
    reportedBy: req.user._id
  });

  res.status(201).json(hazard);
});

// @desc    Get all hazards
// @route   GET /api/hazards
// @access  Private
export const getHazards = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { 'location.address': { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
    : {};

  const filters = {
    ...(req.query.type && { type: req.query.type }),
    ...(req.query.severity && { severity: req.query.severity }),
    ...(req.query.status && { status: req.query.status }),
    ...keyword
  };

  const count = await Hazard.countDocuments(filters);
  const hazards = await Hazard.find(filters)
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    hazards,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get hazard by ID
// @route   GET /api/hazards/:id
// @access  Private
export const getHazardById = asyncHandler(async (req, res) => {
  const hazard = await Hazard.findById(req.params.id)
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name');

  if (hazard) {
    res.json(hazard);
  } else {
    res.status(404);
    throw new Error('Hazard not found');
  }
});

// @desc    Update hazard status
// @route   PUT /api/hazards/:id/status
// @access  Private (Authority/Admin only)
export const updateHazardStatus = asyncHandler(async (req, res) => {
  const { status, resolutionDetails } = req.body;

  const hazard = await Hazard.findById(req.params.id);

  if (hazard) {
    hazard.status = status;
    hazard.assignedTo = req.user._id;
    
    if (status === 'resolved') {
      hazard.resolutionDetails = resolutionDetails;
      hazard.resolutionDate = Date.now();
    }

    const updatedHazard = await hazard.save();
    res.json(updatedHazard);
  } else {
    res.status(404);
    throw new Error('Hazard not found');
  }
});

// @desc    Get hazards by location (within radius)
// @route   GET /api/hazards/nearby
// @access  Private
export const getNearbyHazards = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5 } = req.query; // radius in kilometers

  const hazards = await Hazard.find({
    'location.latitude': {
      $gte: Number(latitude) - (radius / 111.32),
      $lte: Number(latitude) + (radius / 111.32)
    },
    'location.longitude': {
      $gte: Number(longitude) - (radius / (111.32 * Math.cos(latitude * Math.PI / 180))),
      $lte: Number(longitude) + (radius / (111.32 * Math.cos(latitude * Math.PI / 180)))
    }
  }).populate('reportedBy', 'name');

  res.json(hazards);
});

// @desc    Get hazard statistics
// @route   GET /api/hazards/stats
// @access  Private (Authority/Admin only)
export const getHazardStats = asyncHandler(async (req, res) => {
  const stats = await Hazard.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        reported: {
          $sum: { $cond: [{ $eq: ['$status', 'reported'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        dismissed: {
          $sum: { $cond: [{ $eq: ['$status', 'dismissed'] }, 1, 0] }
        }
      }
    }
  ]);

  const typeStats = await Hazard.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  const severityStats = await Hazard.aggregate([
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    overview: stats[0],
    byType: typeStats,
    bySeverity: severityStats
  });
});