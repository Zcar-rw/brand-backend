import express from 'express';
import ScheduleController from '../../controllers/ScheduleController';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin, isDriver, verifyToken } from '../../middlewares';
import scheduleValidations from '../../helpers/validators/scheduleValidate.js';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  isAdmin,
  scheduleValidations.scheduleCreation,
  asyncHandler(ScheduleController.createSchedule),
);
router.get('/', verifyToken, asyncHandler(ScheduleController.getSchedules));
router.get('/:id', asyncHandler(ScheduleController.getSchedule));
router.get(
  '/customer/:id',
  verifyToken,
  asyncHandler(ScheduleController.getSchedulesByCustomer),
);
router.get(
  '/booking/:id',
  verifyToken,
  asyncHandler(ScheduleController.getScheduleByBookingid),
);
router.patch(
  '/update/:id',
  verifyToken,
  isDriver,
  asyncHandler(ScheduleController.updateSchedule),
);

export default router;
