import express from 'express';
import NotificationController from '../../controllers/NotificationController';
import { verifyToken } from '../../middlewares'
import asyncHandler from '../../middlewares/asyncHandler';

const router = express.Router();

router.get(
  '/:id',
  verifyToken,
  asyncHandler(NotificationController.getUserNotifications)
);

export default router;
