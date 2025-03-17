import express from 'express';
import {
  createHazard,
  getHazards,
  getHazardById,
  updateHazardStatus,
  getNearbyHazards,
  getHazardStats
} from '../controllers/hazardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createHazard)
  .get(protect, getHazards);

router.get('/nearby', protect, getNearbyHazards);
router.get('/stats', protect, authorize('authority', 'admin'), getHazardStats);

router.route('/:id')
  .get(protect, getHazardById);

router.route('/:id/status')
  .put(protect, authorize('authority', 'admin'), updateHazardStatus);

export default router;