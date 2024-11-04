import express from 'express';
import BookingController from '../../controllers/BookingController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken } from '../../middlewares';
import bookingValidations from '../../helpers/validators/bookingValidate';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  bookingValidations.bookingCreation,
  asyncHandler(BookingController.createBooking),
);
router.post(
  '/create/multiple',
  verifyToken,
  bookingValidations.multipleBookingCreation,
  asyncHandler(BookingController.createMultipleBookings),
);
router.get('/', verifyToken, asyncHandler(BookingController.getBookings));
router.get('/:id', asyncHandler(BookingController.getBooking));
router.get(
  '/customer/:id',
  verifyToken,
  asyncHandler(BookingController.getBookingsByCustomer),
);
router.get(
  '/company/:id',
  verifyToken,
  asyncHandler(BookingController.getBookingByCompany),
);

export default router;
