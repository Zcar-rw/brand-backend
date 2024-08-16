import express from 'express';
import NotificationController from '../../controllers/NotificationController';
import { verifyToken } from '../../middlewares'
import asyncHandler from '../../middlewares/asyncHandler';

const router = express.Router();

router.get(
  '/:accountType',
  verifyToken,
  asyncHandler(NotificationController.getUserNotifications)
);
router.post(
  '/onesignal/player/register',
  verifyToken,
  asyncHandler(NotificationController.registerOneSignalPlayerId)
);

router.post(
  '/onesignal/player/message',
  verifyToken,
  asyncHandler(NotificationController.sendPushNotification)
);

export default router;
